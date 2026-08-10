import { useEffect, useState } from 'react';
import { useRoomContext } from '@livekit/components-react';

/* The agent worker already publishes every turn of the conversation — its own
   speech and the visitor's, once transcribed — as LiveKit text streams on the
   `lk.transcription` topic (livekit-agents does this from
   voice/room_io/_output.py). So making JHERVIS visible needs no new protocol
   and no change to api/agent.py: we just have to listen to a topic that was
   already being broadcast into the room and ignored.

   Each stream carries a `lk.segment_id` attribute. One segment == one message
   bubble, and a segment is written more than once as it grows:

   - Agent speech is a *delta* stream: a single stream stays open and chunks
     arrive as the words are generated, then it closes carrying
     `lk.transcription_final: "true"`. Text accumulates within the stream.
   - Speech-to-text of the visitor is *not* a delta stream: each revision is a
     brand new stream carrying the full text so far, all tagged with the same
     segment id, followed by a final one.

   Accumulating chunks within a stream and letting the newest stream win per
   segment id handles both shapes correctly. */
const TRANSCRIPTION_TOPIC = 'lk.transcription';
const ATTR_SEGMENT_ID = 'lk.segment_id';
const ATTR_FINAL = 'lk.transcription_final';

export function useTranscript() {
    const room = useRoomContext();
    const [segments, setSegments] = useState([]);

    useEffect(() => {
        if (!room) return;

        let cancelled = false;

        /* `streamAt` orders competing writes to the same segment; `at` is
           stamped once, on first sight, so a bubble keeps its place in the
           conversation while its text is still growing. Both come from the
           browser clock rather than the stream header so that they stay
           comparable with locally-added messages even if the agent host's
           clock is skewed. */
        const upsert = ({ id, role, text, final, streamAt }) => {
            if (cancelled) return;
            setSegments((prev) => {
                const index = prev.findIndex((segment) => segment.id === id);
                if (index === -1) {
                    return [...prev, { id, role, text, final, streamAt, at: streamAt }];
                }

                const existing = prev[index];
                // A straggling interim write must never clobber final text.
                if (existing.final && !final) return prev;
                if (streamAt < existing.streamAt) return prev;

                const next = [...prev];
                next[index] = { ...existing, text, final, streamAt };
                return next;
            });
        };

        const handleStream = async (reader, participantInfo) => {
            const attributes = reader.info.attributes ?? {};
            const id = attributes[ATTR_SEGMENT_ID] || reader.info.id;
            // The worker publishes the visitor's transcript on the visitor's
            // behalf (`sender_identity`), so identity — not "who sent the
            // packet" — is what separates the two speakers.
            const role =
                participantInfo.identity === room.localParticipant?.identity
                    ? 'user'
                    : 'assistant';
            const final = attributes[ATTR_FINAL] === 'true';
            const streamAt = Date.now();

            let text = '';
            try {
                for await (const chunk of reader) {
                    text += chunk;
                    upsert({ id, role, text, final: false, streamAt });
                }
            } catch (err) {
                // A dropped stream shouldn't take the panel down; keep whatever
                // text arrived and let the next segment carry on.
                console.warn('Transcript stream interrupted:', err);
            }

            if (text) upsert({ id, role, text, final, streamAt });
        };

        try {
            room.registerTextStreamHandler(TRANSCRIPTION_TOPIC, handleStream);
        } catch (err) {
            // Throws if a handler for the topic is already registered — which
            // happens under StrictMode's double-invoked effects in dev. The
            // existing handler is still live, so this is safe to ignore.
            console.warn('Transcript handler already registered:', err);
        }

        return () => {
            cancelled = true;
            room.unregisterTextStreamHandler(TRANSCRIPTION_TOPIC);
        };
    }, [room]);

    return segments;
}
