from flask import Flask
from flask_cors import CORS
from livekit import api
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

@app.route("/api", methods=["GET", "POST"])
@app.route("/", methods=["GET", "POST"])
@app.route("/api/index", methods=["GET", "POST"])
def get_token():
    token = api.AccessToken(
        os.getenv("LIVEKIT_API_KEY"),
        os.getenv("LIVEKIT_API_SECRET"),
    )
    token.with_identity("user")
    token.with_name("User")
    token.with_grants(api.VideoGrants(
        room_join=True,
        room="my-room",
        room_create=True,
        agent=True,
    ))
    return token.to_jwt()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("TOKEN_SERVER_PORT", "5005")))
