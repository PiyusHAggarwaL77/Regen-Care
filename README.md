# ScamSieve

## Current milestone: runnable mock flow

The app accepts offer text and/or a URL in a React + Vite + Tailwind frontend, sends it to the Express backend, validates it, and displays a backend response. The backend is deliberately in **mock mode**:

- It does not call TinyFish or any other research provider.
- It does not open submitted URLs.
- Every report has a persistent `DEMO DATA — NOT LIVE RESEARCH` label.
- It only records the submitted inputs and states what it could not verify.

## Run locally

Use two PowerShell terminals from the repository root. On systems where PowerShell blocks `npm.ps1`, use `npm.cmd` as below.

```powershell
cd backend
Copy-Item .env.example .env
npm.cmd install
npm.cmd run dev
```

```powershell
cd frontend
Copy-Item .env.example .env.local
npm.cmd install
npm.cmd run dev
```

Open the Vite URL shown in the frontend terminal (normally `http://localhost:5173`). The frontend calls `http://localhost:3000` by default; change `VITE_API_BASE_URL` in `frontend/.env.local` only if the backend uses another URL.

## Test

```powershell
cd backend
npm.cmd test
```

The tests run against an in-process Express server and do not use the internet or credentials. To test the API manually after starting the backend:

```powershell
Invoke-RestMethod -Method Post -Uri http://localhost:3000/api/investigate -ContentType 'application/json' -Body '{"offerText":"Please send the internship details.","url":""}'
```

## API

The sole application endpoint is `POST /api/investigate`. Its request, response, and error contract are in [docs/API_CONTRACT.md](docs/API_CONTRACT.md).

TinyFish integration is intentionally deferred. Before provider code is added, verify its current official documentation and record only confirmed details. Never put a provider key in frontend code or a `VITE_` variable.

## Project-document index

These four documents are designed to be used together:

- `architecture.md` — application structure, data flow, API contract, security boundaries.
- `rules.md` — evidence categories, conservative assessment logic, source quality, testable rules.
- `design.md` — visual direction, screens, components, interactions, accessibility.
- `task.md` — priorities, milestones, team roles, testing, and demo checklist.

Keep the API contract consistent: `POST /api/investigate` with `{ "offerText": "...", "url": "..." }`; at least one field must be non-empty. Verify TinyFish integration details using current official documentation before writing provider-specific code. Never present mock data as live research.
