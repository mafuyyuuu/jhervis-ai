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
    )

    narrated_sections = set()

    @ctx.room.on("data_received")
    def on_data_received(data: rtc.DataPacket):
        async def handle_data():
            try:
                payload = data.data.decode("utf-8")
                print(f"Received: {payload}")
                
                event = json.loads(payload)
                event_type = event.get("type")

                if event_type == "narration":
                    section = event.get("section")
                    if section in NARRATION_PROMPTS and section not in narrated_sections:
                        narrated_sections.add(section)
                        prompt = NARRATION_PROMPTS[section]
                        print(f"Narrating: {section}")
                        await session.generate_reply(instructions=prompt)
                        
                elif event_type == "user_query":
                    query = event.get("query")
                    if query:
                        print(f"Query: {query}")
                        await session.generate_reply(user_input=query)

            except Exception as e:
                print(f"Error: {e}")
        
        asyncio.create_task(handle_data())

    await session.start(
        room=ctx.room,
        agent=Assistant(),
        room_input_options=RoomInputOptions(),
    )

    # Welcome greeting
    await asyncio.sleep(2)
    print("Sending welcome greeting...")
    await session.generate_reply(instructions=SESSION_INSTRUCTIONS)
    
    # Keep session alive until disconnected
    await ctx.room.disconnected()


if __name__ == "__main__":
    agents.cli.run_app(agents.WorkerOptions(entrypoint_fnc=entrypoint))