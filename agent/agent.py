from dotenv import load_dotenv

from livekit import agents
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