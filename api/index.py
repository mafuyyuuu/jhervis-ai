from flask import Flask
from flask_cors import CORS
from livekit import api
from dotenv import load_dotenv
import os
import uuid

load_dotenv()

app = Flask(__name__)
CORS(app)

@app.route("/api", methods=["GET", "POST"])
@app.route("/", methods=["GET", "POST"])
@app.route("/api/index", methods=["GET", "POST"])
def get_token():
    # Every visitor gets their own room. A single shared room ("my-room")
    # meant all visitors' agent sessions were coupled together: one visitor
    # disconnecting could tear down the agent session for everyone else
    # still in the room, leaving them with no agent to respond to.
    identity = f"user-{uuid.uuid4().hex[:8]}"
    room_name = f"jhervis-{uuid.uuid4().hex[:12]}"

    token = api.AccessToken(
        os.getenv("LIVEKIT_API_KEY"),
        os.getenv("LIVEKIT_API_SECRET"),
    )
    token.with_identity(identity)
    token.with_name("User")
    token.with_grants(api.VideoGrants(
        room_join=True,
        room=room_name,
        room_create=True,
        agent=True,
    ))
    return token.to_jwt()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("TOKEN_SERVER_PORT", "5005")))
