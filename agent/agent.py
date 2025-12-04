from dotenv import load_dotenv
import asyncio
import json

from livekit import agents, rtc
from livekit.agents import AgentSession, Agent, RoomInputOptions
from livekit.plugins import google
from prompts import AGENT_INSTRUCTIONS, SESSION_INSTRUCTIONS, NARRATION_PROMPTS, MOOD_PROMPTS

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

    async def generate_and_publish(topic: str, instructions: str = None):
        if instructions:
            reply = await session.generate_reply(instructions=instructions)
        else:
            reply = await session.generate_reply()

        response_event = {
            "type": "chat_response",
            "message": reply
        }
        data = json.dumps(response_event).encode("utf-8")
        await ctx.room.local_participant.publish_data(data, topic=topic)

    # Handle incoming text messages from the frontend
    @ctx.room.on("data_received")
    def on_data_received(data: rtc.DataPacket):
        try:
            nonlocal current_mood
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
                            
                        prompt = NARRATION_PROMPTS[section]
                        session.agent.chat_ctx.add_message(role="system", content=MOOD_PROMPTS[current_mood])
                        session.agent.chat_ctx.add_message(role="system", content=prompt)
                        asyncio.create_task(generate_and_publish("narration"))
                    return
                elif event_type == "user_query":
                    query = event.get("query")
                    session.agent.chat_ctx.add_message(role="system", content=MOOD_PROMPTS[current_mood])
                    session.agent.chat_ctx.add_message(role="user", content=query)
                    asyncio.create_task(generate_and_publish("chat"))
                    return
                elif event_type == "welcome":
                    message = event.get("message")
                    session.agent.chat_ctx.add_message(role="system", content=MOOD_PROMPTS[current_mood])
                    session.agent.chat_ctx.add_message(role="system", content=message)
                    asyncio.create_task(generate_and_publish("welcome"))
                    return

            except json.JSONDecodeError:
                # Not a JSON event, treat as a plain text message
                pass

            # Fallback to user message handling
            if payload.strip():
                session.agent.chat_ctx.add_message(role="system", content=MOOD_PROMPTS[current_mood])
                session.agent.chat_ctx.add_message(role="user", content=payload)
                asyncio.create_task(generate_and_publish("chat"))

        except Exception as e:
            print(f"Error processing data: {e}")

    await session.start(
        room=ctx.room,
        agent=Assistant(),
        room_input_options=RoomInputOptions(),
    )

    await generate_and_publish("welcome", instructions=SESSION_INSTRUCTIONS)



if __name__ == "__main__":
    agents.cli.run_app(agents.WorkerOptions(entrypoint_fnc=entrypoint))
