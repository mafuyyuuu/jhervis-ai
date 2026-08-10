# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

JHERVIS is Jervin Jimenez's interactive portfolio site: a voice-driven AI "digital companion" (JERVIS) layered over a scrolling React portfolio. It has 3 parts that run together:

1. **React frontend** (Vite, `src/`) — the portfolio UI and LiveKit client.
2. **Flask token server** (`api/index.py`) — issues LiveKit access tokens; deployed as a Vercel serverless function.
3. **LiveKit agent worker** (`api/agent.py`) — a separate long-running process that runs the voice AI (Google Gemini realtime model) and talks to the frontend over the LiveKit room's data channel.

The frontend and the agent worker are decoupled: they only communicate via LiveKit room events (data channel JSON messages), not direct API calls.

## Commands

Frontend (run from repo root):
```bash
npm run dev       # Vite dev server
npm run build     # production build
npm run lint      # ESLint
npm run preview   # preview production build
```

Backend (run from `api/`, with `.venv` activated):
```bash
python index.py        # Flask token server (default port 5005, override with TOKEN_SERVER_PORT)
python agent.py dev     # LiveKit agent worker in dev mode
python agent.py start   # fallback if `dev` isn't supported by the installed livekit-agents version
```

There is no test suite configured in this repo.

Full local setup requires 3 terminals running concurrently: frontend (`npm run dev`), token server, and agent worker. See `README.md` for env var setup (`LIVEKIT_URL`, `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`, `GOOGLE_API_KEY` in `api/.env`; optional `VITE_LIVEKIT_URL`, `VITE_TOKEN_SERVER_URL` in root `.env`).

## Architecture

### Voice agent ↔ frontend protocol

`App.jsx` wraps the whole app in `<LiveKitRoom>` and fetches a token from `VITE_TOKEN_SERVER_URL` (falls back to `/api`, which Vercel rewrites to the Flask function per `vercel.json`). Once connected, the frontend and `api/agent.py` exchange JSON events over the LiveKit room's reliable data channel via `room.localParticipant.publishData` (frontend → agent) and `@ctx.room.on("data_received")` (agent) / `useDataChannel` (frontend, in `VoiceAssistant.jsx`, for TTS fallback messages).

Event types sent from the frontend (`publishEvent` in `App.jsx`):
- `narration` — `{ section }`, fired once per section when scroll-spy (`useScrollSpy`) detects a new active section post-entry. The agent looks up canned narration copy in `api/prompts.py`'s `NARRATION_PROMPTS` keyed by section id (`hero`, `about`, `projects`, `skills`, `contact`) and has Gemini speak it — each section is only narrated once per identity (`narrated_sections_by_identity` in `agent.py`).
- `welcome_request` — sent once the user unlocks audio, triggers `SESSION_INSTRUCTIONS` greeting.
- `user_query` — `{ query }` from the chat input; the agent interrupts any current speech (`session.interrupt(force=True)`) and responds via Gemini with that text as `user_input`.

Persona/knowledge for the agent lives entirely in `api/prompts.py` (`AGENT_INSTRUCTIONS`, `SESSION_INSTRUCTIONS`, `NARRATION_PROMPTS`) — this is the single source of truth for what JERVIS knows and says about Jervin. Update this file (not code) when the "facts" JERVIS should present change.

### Frontend structure

- `App.jsx` is the top-level orchestrator: owns LiveKit connection/token fetch, scroll tracking, idle detection, sound effects, and the "experience gate" (audio must be unlocked by a user gesture before autoplay works, handled via `useAudioPlayback`/`startAudio`).
- Section components (`src/sections/*Section.jsx`) are lazy-loaded (`React.lazy` + `Suspense`) and rendered in a fixed scroll order: Hero → About → Projects → Skills → Contact.
- `useScrollSpy` (IntersectionObserver-based) drives `activeSection` state, which both updates the UI (`ProgressIndicator`, `QuickActions`) and triggers the `narration` LiveKit event described above.
- `ScrollContext` (`src/contexts/ScrollContext.jsx`) broadcasts `activeSection` plus a shared `hoveredProjectId` down the tree without prop drilling.
- `InteractiveCorner` / `ChatDisplay` / `QuickActions` form the persistent chat-like UI overlay that lets users type queries as an alternative to speaking.
- `soundEffects.js` (`src/utils/`) centralizes UI/agent-state sound cues (speaking start/end, listening start, section change, click).
- Visual/ambient components (`NeuralCore`, `ParticleBackground`, `ScanEffect`, `ShinyText`) are presentational and independent of the LiveKit/voice logic.

### Deployment

`vercel.json` rewrites `/api/*` to the Flask function at `api/index.py` (Vercel's Python runtime) and everything else to `index.html` (SPA fallback). The agent worker (`api/agent.py`) is a separate always-on process — it is **not** deployed via Vercel and must be hosted/run independently (e.g. as a LiveKit agent worker process).

## Notable conventions

- ESLint disables `react-hooks/set-state-in-effect` project-wide to allow `setState` inside effects that synchronize with external systems (LiveKit, Web Audio/SpeechSynthesis) — this is intentional, not an oversight to fix.
- `dist/` is a committed build output directory; don't hand-edit it.
