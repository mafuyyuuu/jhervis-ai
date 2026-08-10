import sys

if sys.version_info < (3, 10):
    raise RuntimeError(
        "JHERVIS api requires Python 3.10+ (recommended 3.11+). "
        "Create the venv with a newer Python binary and reinstall requirements."
    )

from dotenv import load_dotenv
import json
import asyncio

from livekit import agents, rtc
from livekit.agents import AgentSession, Agent, RoomInputOptions
from livekit.plugins import google
from prompts import AGENT_INSTRUCTIONS, SESSION_INSTRUCTIONS, NARRATION_PROMPTS

load_dotenv()


class Assistant(Agent):
    def __init__(self) -> None:
        super().__init__(instructions=AGENT_INSTRUCTIONS)


async def entrypoint(ctx: agents.JobContext):
    await ctx.connect(auto_subscribe=agents.AutoSubscribe.AUDIO_ONLY)

    session = AgentSession(
        llm=google.beta.realtime.RealtimeModel(
            model="gemini-2.5-flash-native-audio-preview-09-2025",
            voice="Aoede"
        ),
        min_endpointing_delay=0.2,
        max_endpointing_delay=1.2,
        preemptive_generation=True,
    )

    greeted_identities = set()
    narrated_sections_by_identity = {}
    room_disconnected = asyncio.Event()

    async def speak_reply(**kwargs):
        try:
            await session.generate_reply(input_modality="audio", **kwargs)
        except Exception as e:
            # Most likely cause here is the Gemini Live API free-tier quota/rate
            # limit being hit (this model's limits are separate from, and often
            # tighter than, the general Gemini free tier). Log clearly so
            # `lk agent logs` shows the real cause instead of a silent no-op.
            print(f"generate_reply failed (possible Gemini quota/rate limit): {e}")

    async def send_welcome(identity: str):
        if identity in greeted_identities:
            return
        greeted_identities.add(identity)
        # The greeting already does everything the "hero" narration would do —
        # say hello, introduce JHERVIS, invite the visitor to look around. The
        # scroll-spy reports "hero" as the active section on load, so without
        # this the visitor got introduced to JHERVIS twice in a row. Mark hero
        # as already narrated for this visitor.
        narrated_sections_by_identity.setdefault(identity, set()).add("hero")
        print(f"Sending welcome greeting to: {identity}")
        await speak_reply(instructions=SESSION_INSTRUCTIONS)

    @ctx.room.on("participant_connected")
    def on_participant_connected(participant: rtc.RemoteParticipant):
        identity = participant.identity or "unknown"
        asyncio.create_task(send_welcome(identity))

    @ctx.room.on("participant_disconnected")
    def on_participant_disconnected(participant: rtc.RemoteParticipant):
        identity = participant.identity or "unknown"
        narrated_sections_by_identity.pop(identity, None)
        greeted_identities.discard(identity)

    @ctx.room.on("disconnected")
    def on_room_disconnected():
        room_disconnected.set()

    @ctx.room.on("data_received")
    def on_data_received(data: rtc.DataPacket):
        async def handle_data():
            try:
                payload = data.data.decode("utf-8")
                print(f"Received: {payload}")
                
                event = json.loads(payload)
                event_type = event.get("type")
                sender = getattr(data, "participant", None)
                sender_identity = sender.identity if sender and sender.identity else "unknown"

                if event_type == "narration":
                    section = event.get("section")
                    sections = narrated_sections_by_identity.setdefault(sender_identity, set())
                    if section in NARRATION_PROMPTS and section not in sections:
                        sections.add(section)
                        prompt = NARRATION_PROMPTS[section]
                        print(f"Narrating for {sender_identity}: {section}")
                        await speak_reply(instructions=prompt)

                elif event_type == "welcome_request":
                    # Routed through send_welcome so it shares the
                    # greeted_identities guard. Calling generate_reply directly
                    # here meant a visitor whose participant_connected had
                    # already fired got greeted a second time.
                    print(f"Welcome requested by {sender_identity}")
                    await send_welcome(sender_identity)
                         
                elif event_type == "user_query":
                    query = event.get("query")
                    if query:
                        print(f"Query from {sender_identity}: {query}")
                        await session.interrupt(force=True)
                        await speak_reply(user_input=query)

            except Exception as e:
                print(f"Error: {e}")
        
        asyncio.create_task(handle_data())

    try:
        await session.start(
            room=ctx.room,
            agent=Assistant(),
            room_input_options=RoomInputOptions(audio_frame_size_ms=20),
        )
    except Exception as e:
        print(f"session.start failed (possible Gemini quota/rate limit or bad credentials): {e}")
        raise

    existing_participants = getattr(ctx.room, "remote_participants", {})
    for participant in existing_participants.values():
        identity = participant.identity or "unknown"
        asyncio.create_task(send_welcome(identity))
    
    # Keep session alive for this job until the room disconnects.
    await room_disconnected.wait()


if __name__ == "__main__":
    agents.cli.run_app(agents.WorkerOptions(entrypoint_fnc=entrypoint))
