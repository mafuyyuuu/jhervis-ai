from dotenv import load_dotenv
import asyncio

from livekit import agents, rtc
from livekit.agents import AgentSession, Agent, RoomInputOptions
from livekit.plugins import google
from prompts import AGENT_INSTRUCTIONS, SESSION_INSTRUCTIONS

load_dotenv()


class Assistant(Agent):
    def __init__(self) -> None:
        super().__init__(instructions=AGENT_INSTRUCTIONS)


async def entrypoint(ctx: agents.JobContext):
    await ctx.connect(auto_subscribe=agents.AutoSubscribe.AUDIO_ONLY)

    session = AgentSession(
        llm=google.beta.realtime.RealtimeModel(voice="Aoede"),
    )

    # Handle incoming text messages from the frontend
    @ctx.room.on("data_received")
    def on_data_received(data: rtc.DataPacket):
        try:
            text_message = data.data.decode("utf-8")
            if text_message.strip():
                asyncio.create_task(session.generate_reply(instructions=f"User said via text: {text_message}"))
        except Exception as e:
            print(f"Error processing data: {e}")

    await session.start(
        room=ctx.room,
        agent=Assistant(),
        room_input_options=RoomInputOptions(),
    )

    await session.generate_reply(
        instructions=SESSION_INSTRUCTIONS
    )


if __name__ == "__main__":
    agents.cli.run_app(agents.WorkerOptions(entrypoint_fnc=entrypoint))
