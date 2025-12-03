from flask import Flask
from flask_cors import CORS
from livekit import api
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

@app.route("/getToken")
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
    app.run(host="0.0.0.0", port=5000)
