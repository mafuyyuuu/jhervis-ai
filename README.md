# JHERVIS AI Portfolio

This project has 3 parts that run together:

1. React frontend (Vite)
2. Flask token server (creates LiveKit access tokens)
3. LiveKit agent worker (voice AI with Gemini)

## Prerequisites

- Node.js 18+ and npm
- Python 3.10+ (recommended 3.11+)
- A LiveKit project (Cloud or self-hosted) with API key/secret
- A Google API key for Gemini realtime model access

## 1) Install frontend dependencies

```bash
cd /Users/jhervin/WebstormProjects/jhervis-ai
npm install
```

## 2) Set up Python environment

```bash
cd /Users/jhervin/WebstormProjects/jhervis-ai/api
python3.11 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

If `python3.11` is not installed on macOS:

```bash
brew install python@3.11
```

## 3) Configure environment variables

Create `agent/.env` based on `agent/.env.example`:

```bash
cd /Users/jhervin/WebstormProjects/jhervis-ai/api
cp .env.example .env
```

```env
LIVEKIT_URL=wss://your-livekit-host
LIVEKIT_API_KEY=your_livekit_api_key
LIVEKIT_API_SECRET=your_livekit_api_secret
GOOGLE_API_KEY=your_google_api_key
# optional
# TOKEN_SERVER_PORT=5000
```

Optional frontend variables (`.env` in project root):

```env
VITE_LIVEKIT_URL=wss://your-livekit-host
VITE_TOKEN_SERVER_URL=http://localhost:5005/getToken
```

If `VITE_LIVEKIT_URL` is not set, the app falls back to:
`wss://jhervis-iiqthr75.livekit.cloud`

If `VITE_TOKEN_SERVER_URL` is not set, the app falls back to:
`http://localhost:5005/getToken`

## 4) Run the app (3 terminals)

Terminal A (frontend):

```bash
cd /Users/jhervin/WebstormProjects/jhervis-ai
npm run dev
```

Terminal B (token server):

```bash
cd /Users/jhervin/WebstormProjects/jhervis-ai/api
source .venv/bin/activate
python getToken.py
```

Terminal C (agent worker):

```bash
cd /Users/jhervin/WebstormProjects/jhervis-ai/api
source .venv/bin/activate
python api.py dev
```

If `python agent.py dev` is not available in your installed `livekit-agents` version, try:

```bash
python api.py start
```

## Useful scripts

- `npm run dev` - run frontend in development
- `npm run build` - production build
- `npm run lint` - ESLint checks
- `npm run preview` - preview built frontend
