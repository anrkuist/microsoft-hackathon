## Quick Orientation

This repository implements a Civic Chatbot with three primary components:
- **Backend:** `backend/` — FastAPI app (uvicorn) that handles auth, message persistence and calls an external Prompt Flow endpoint (`PF_ENDPOINT_URL`). Key file: `backend/main.py`.
- **Frontend:** `frontend/` — Next.js 16 app (React 19). Local env var validation uses `dotenv-safe` (`.env.example` → `.env.local`). Key file: `frontend/package.json`.
- **Multi-agent Routines:** `multi-agents/` — PromptFlow-based agents and orchestration (see `flow_orchestrator.py`). These run with `promptflow[azure]` and are separate from the FastAPI backend.

**Why this structure:** frontend is a containerized Next.js app deployed to Azure App Service; backend is a lightweight FastAPI service that persists chat history (Cosmos DB) and proxies AI calls to a Prompt Flow endpoint. Multi-agent code is designed to run in PromptFlow/tooling and in CI/deployment contexts (separate runtime and deps).

**Runtime highlights:**
- Backend exposes: `POST /signup`, `POST /signin`, `POST /chat`, `GET /history/{session_id}` (see `backend/main.py`).
- Backend uses Cosmos (see `backend/database.py`) and auth helpers in `backend/auth_utils.py`.
- Prompt Flow integration point is the `PF_ENDPOINT_URL` env var in `backend/main.py`.

**Local dev quick commands**
- Start backend (local):
```
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
- Build/run backend via Docker:
```
docker build -t civic-chatbot-backend:dev ./backend
docker run -p 8000:8000 --env-file ./backend/.env.local civic-chatbot-backend:dev
```
- Start frontend (local):
```
cd frontend
cp .env.example .env.local   # set envs
npm install
npm run dev
```

**Multi-agent / PromptFlow**
- Install deps from `multi-agents/requirements.txt` and run PromptFlow workflows using the PromptFlow CLI or SDK. Files reference `promptflow[azure]` and expect Azure credentials to be set in env.

Integration & deployment notes
- Infrastructure is in `infrastructure/` (Bicep templates). The repo uses ACR → App Service flows and GitHub Actions (see `infrastructure/README.md`).
- Frontend: build context is `./frontend` and container should expose the Next.js port (default 3000). Backend Dockerfile listens on 8000.

Conventions & patterns specific to this repo
- Persistence: use `db.save_message(session_id, role, text)` and `db.get_history(session_id)` (see `backend/database.py`). Do not bypass `db` helpers when adding chat storage.
- AI calls: backend proxies user queries to the Prompt Flow endpoint and stores both user and assistant messages. Keep error handling consistent with `main.py` pattern (store failures as assistant messages).
- Auth: token creation/verification use `auth_utils.py` and `python-jose`. Follow current JWT patterns for new endpoints.
- Secrets: development examples appear in `backend/settings.json` — DO NOT commit real secrets. Prefer `.env.local` for local dev and GitHub Secrets / Azure Key Vault for CI/CD and deployment.

Files to consult when implementing changes
- `backend/main.py`, `backend/database.py`, `backend/auth_utils.py`
- `frontend/package.json`, `frontend/.env.example`, `frontend/app/page.tsx`
- `multi-agents/*` for PromptFlow agents and orchestration
- `infrastructure/main.bicep` and `infrastructure/README.md` for deployment and CI setup

Debugging tips
- Backend: use `uvicorn --reload` and check logs for Prompt Flow HTTP calls (timeouts and non-200 responses are already captured in `main.py`).
- Deployments: use `az webapp log tail` and check `infrastructure/azure-outputs.json` for resource names.

If anything here is missing or you want examples added (e.g., local `.env.local` template, expected Cosmos container/index names, or typical PromptFlow payloads), tell me what to include and I'll extend this file.
