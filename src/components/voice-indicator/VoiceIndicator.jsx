import React from 'react';
import { useVoiceAssistant, useMultibandTrackVolume } from '@livekit/components-react';
import './VoiceIndicator.css';

/* Replaces the old arc-reactor "neural core".

   The reactor spun constantly and reacted to scroll position, cursor position
   and which section you were in — three signals that have nothing to do with
   the assistant — while the one signal that actually says "an AI is talking to
   you", the voice amplitude, was spent on background particles nobody could
   see. This does the opposite: it is dead still unless JHERVIS is producing
   sound, and when it moves, it is moving to his actual voice.

   `useMultibandTrackVolume` runs an analyser over the agent's published audio
   track and returns one normalized level per frequency band, so the bars are a
   real spectrum rather than a decorative loop. */

const BANDS = 7;
/* High enough that the resting state reads as a waveform at rest rather than a
   row of stray dots, low enough that the jump when speech starts is obvious. */
const REST_SCALE = 0.18;

const STATE_LABELS = {
    speaking: 'Speaking',
    listening: 'Listening',
    thinking: 'Thinking',
};

const VoiceIndicator = ({ size = 'lg', showLabel = false }) => {
    const { state, audioTrack } = useVoiceAssistant();
    const volumes = useMultibandTrackVolume(audioTrack, {
        bands: BANDS,
        updateInterval: 50,
    });

    const isSpeaking = state === 'speaking';
    const label = STATE_LABELS[state] ?? 'Ready';

    return (
        <div className={`voice-indicator size-${size} ${isSpeaking ? 'is-speaking' : ''}`}>
            <div className="voice-bars" aria-hidden="true">
                {Array.from({ length: BANDS }).map((_, index) => {
                    /* Only follow the analyser while there's speech to follow.
                       Between turns the levels still drift a little, which would
                       leave the bars twitching at rest and undo the point. */
                    const level = isSpeaking ? (volumes?.[index] ?? 0) : 0;
                    return (
                        <span
                            key={index}
                            className="voice-bar"
                            style={{ transform: `scaleY(${REST_SCALE + level * (1 - REST_SCALE)})` }}
                        />
                    );
                })}
            </div>
            {showLabel && (
                <span className="voice-label" role="status" aria-live="polite">
                    {label}
                </span>
            )}
        </div>
    );
};

export default VoiceIndicator;
