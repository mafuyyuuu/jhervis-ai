from dotenv import load_dotenv
import json

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
        llm=google.beta.realtime.RealtimeModel(voice="Aoede"),
    )

    current_mood = "default"
    narrated_sections = set()  # Track which sections have been narrated

    # Handle incoming text messages from the frontend
    @ctx.room.on("data_received")
    def on_data_received(data: rtc.DataPacket):
        nonlocal current_mood
        try:
            payload = data.data.decode("utf-8")

            try:
                event = json.loads(payload)
                event_type = event.get("type")

                if event_type == "narration":
                    section = event.get("section")
                    if section in NARRATION_PROMPTS:
                        if section == "about":
                            current_mood = "professional"
                        elif section == "projects":
                            current_mood = "enthusiastic"
                        elif section == "skills":
                            current_mood = "professional"
                        elif section == "contact":
                            current_mood = "friendly"
                        else:
                            current_mood = "default"

                        # Only narrate if not already narrated
                        if section not in narrated_sections:
                            narrated_sections.add(section)
                            prompt = NARRATION_PROMPTS[section]
                            session.generate_reply(user_input=prompt)
                    return
                    
                elif event_type == "user_query":
                    query = event.get("query")
                    if query:
                        session.generate_reply(user_input=query)
                    return

            except json.JSONDecodeError:
                pass

        except Exception as e:
            print(f"Error processing data: {e}")

    await session.start(
        room=ctx.room,
        agent=Assistant(),
        room_input_options=RoomInputOptions(),
    )

    # Welcome - agent initiates
    session.generate_reply(instructions=SESSION_INSTRUCTIONS)


if __name__ == "__main__":
    agents.cli.run_app(agents.WorkerOptions(entrypoint_fnc=entrypoint))