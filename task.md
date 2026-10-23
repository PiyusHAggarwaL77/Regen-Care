# ScamSieve — Build Tasks and 24-Hour Execution Plan

**Goal:** Deliver a reliable, explainable MVP during a 24-hour hackathon. **Rule:** A complete, tested end-to-end flow beats many unfinished features.

## 1. Definition of done

- User can submit offer text, a URL, or both.
- React frontend calls one backend endpoint: `POST /api/investigate`.
- Backend validates input and protects remote URL fetching.
- Live public evidence is used if provider docs/access permit.
- Findings distinguish warning signs, contradictions, supporting signals, and unknowns.
- Live factual findings link to source evidence.
- Report explains uncertainty and provides next steps.
- Loading, validation, and provider/network errors work.
- Mock/demo data is clearly labelled.
- Repeatable demo path and backup demo mode are prepared.

## 2. Priorities

### P0 — Must have
- React/Vite/Tailwind frontend and Node/Express backend.
- One shared API contract.
- Offer text/optional URL form.
- Validation and safe URL handling.
- Provider adapter based on verified official documentation.
- Evidence normalization, transparent rules, report, sources, unknowns, and next steps.
- Basic tests, security review, README, and demo script.

### P1 — Only after P0 is stable
- Better company/domain/email matching.
- Duplicate-source handling and improved evidence grouping.
- Simple report print/export if easy.
- Responsive/accessibility polish.

### P2 — Do not attempt during MVP unless everything else is finished
- Accounts, database, report history, admin dashboard, browser extension, mobile app, complex ML, or numerical fraud probability.

## 3. First hour

- [ ] Pick one laptop as the integration machine.
- [ ] Create one shared Git repository and commit the skeleton.
- [ ] Name one person as main code operator/integrator.
- [ ] Keep frontend/backend in separate folders.
- [ ] Agree on the API contract before parallel work.
- [ ] Put `architecture.md`, `rules.md`, `design.md`, and `task.md` in `docs/`.
- [ ] Create `.env.example` files, with no secrets.
- [ ] Verify frontend and backend both run locally.

AI coding-agent instruction: read all project docs, summarize relevant requirements, implement only the next milestone, run checks, explain changed files, and do not invent provider API details. Avoid having multiple agents edit the same files simultaneously.

## 4. Milestones

### M0 — Runnable skeleton (Hour 0–1)
- [ ] Initialize Git and folders.
- [ ] Create Vite + React frontend.
- [ ] Configure Tailwind using official setup docs for the installed version.
- [ ] Create Express backend and a health endpoint.
- [ ] Run both servers in separate terminals.
- [ ] Commit: `chore: create frontend and backend skeleton`.

**Exit:** frontend loads, backend responds, repository can be run by a teammate.

### M1 — Contract and mock end-to-end flow (Hour 1–4)
- [ ] Implement `POST /api/investigate`.
- [ ] Require at least one non-empty field: `offerText` or `url`.
- [ ] Define one report schema.
- [ ] Add mock report data with `isDemo: true`.
- [ ] Build form, loading, validation, error, and report states.
- [ ] Connect frontend with `fetch`.
- [ ] Add visible demo banner.
- [ ] Commit: `feat: complete mock investigation flow`.

**Exit:** a user submits the form and sees a backend-returned report. This is the critical fallback milestone.

### M2 — UI and report (Hour 3–6, after contract is stable)
- [ ] Implement landing/header and responsive form.
- [ ] Build assessment summary and grouped finding cards.
- [ ] Build source cards, links, next steps, and disclaimer.
- [ ] Check mobile width and keyboard focus.
- [ ] Commit: `feat: build responsive investigation report UI`.

**Exit:** polished, understandable UI works with mock data.

### M3 — Verify provider and integrate Search/Fetch (Hour 4–10)
- [ ] Read current official TinyFish Search/Fetch docs.
- [ ] Verify endpoint, auth, request/response fields, limits, and errors.
- [ ] Record verified details in a provider note.
- [ ] Implement one minimal Search adapter call.
- [ ] Test a harmless query and inspect actual response.
- [ ] Normalize provider results to the internal source schema.
- [ ] Add Fetch only if docs and time support it.
- [ ] Add timeouts and provider error handling.
- [ ] Keep keys on the backend.

**Exit:** at least one real provider result reaches the UI. If blocked, use labelled demo mode; never fake live evidence.

### M4 — Evidence rules and report builder (Hour 8–14)
- [ ] Implement a small clue extractor.
- [ ] Implement the rule catalogue in `rules.md`.
- [ ] Attach evidence IDs to findings.
- [ ] Implement cautious assessment labels and coverage.
- [ ] Generate practical next steps.
- [ ] Test sparse and contradictory evidence.
- [ ] Commit: `feat: add evidence-backed investigation rules`.

**Exit:** report is traceable, cautious, and understandable.

### M5 — Security and reliability (Hour 13–17)
- [ ] Test missing, malformed, oversized, and wrong-type fields.
- [ ] Validate URL protocols.
- [ ] Block loopback/private/link-local/reserved/metadata IP destinations.
- [ ] Re-check redirects and resolved IP addresses for SSRF.
- [ ] Add timeout and response-size limit.
- [ ] Treat remote content as untrusted text.
- [ ] Check CORS, environment variables, and logging.
- [ ] Run validation/rule tests.
- [ ] Commit: `test: harden validation and investigation flow`.

**Exit:** common bad inputs fail safely; provider failure does not crash the UI.

### M6 — Freeze and demo prep (Hour 17–21)
- [ ] Stop adding features.
- [ ] Test a live investigation if provider access works.
- [ ] Test sparse evidence, invalid URL, and provider outage.
- [ ] Verify source links and evidence IDs.
- [ ] Check mobile and desktop layouts.
- [ ] Prepare clearly labelled demo fixtures.
- [ ] Write and rehearse a 2–3 minute demo.
- [ ] Commit a known-good freeze point.

### M7 — Final verification (Hour 21–24)
- [ ] Fresh-start test using README commands.
- [ ] Verify environment variable instructions.
- [ ] Confirm no secrets are committed.
- [ ] Check browser console and server logs.
- [ ] Confirm every team member can explain the request flow and limitations.
- [ ] Avoid risky changes after freeze unless fixing a demo-blocking bug.

## 5. Suggested team roles

Adjust according to strengths. Do not have two people edit the same files simultaneously without coordination.

- **Member A — Integrator/backend:** repository, API contract, Express route, merges, end-to-end tests, secret handling.
- **Member B — Frontend:** form, loading/error states, report layout, responsive UI.
- **Member C — Provider/evidence:** verify TinyFish docs, Search/Fetch adapter, source traceability and normalization.
- **Member D — Rules/testing/demo:** rule tests, edge cases, cautious wording, README, demo script.

All members should understand the architecture and safety rules before presenting.

## 6. Testing checklist

### API and validation
- [ ] Empty body and both fields empty return clear client errors.
- [ ] Wrong field types and oversized input are rejected.
- [ ] Invalid URLs and unsupported schemes are rejected.
- [ ] Provider timeout returns a safe, understandable response.

### Evidence rules
- [ ] Payment and OTP/password rules trigger only when supported by input.
- [ ] Missing evidence yields unknown, not a fraud accusation.
- [ ] HTTPS alone is not proof of legitimacy.
- [ ] Official listing supports only the claims it confirms.
- [ ] Contradiction includes attributable evidence.
- [ ] Every evidence ID resolves.
- [ ] Mock data is never presented as live research.

### UI
- [ ] Submit disables during loading.
- [ ] Input remains after failed request.
- [ ] All finding categories display correctly.
- [ ] External links open safely.
- [ ] Mobile layout works; focus is visible.
- [ ] Demo mode is obvious.

## 7. Demo script (2–3 minutes)

1. **Problem (15–20 sec):** students receive offers and struggle to verify details.
2. **Input (20 sec):** paste a prepared fictional offer and optional URL.
3. **Investigation (20–30 sec):** explain validation, public-source research, normalization, and transparent rules.
4. **Report (45–60 sec):** show assessment, evidence-linked findings, unknowns, source links, and next steps.
5. **Safety (20 sec):** explain that missing evidence is not proof and the tool cannot guarantee legitimacy.
6. **Close (15 sec):** emphasize explainable, source-backed checks for students and job seekers.

Use only prepared examples whose claims can be demonstrated. If mock data is shown, explicitly say it is a demo fixture, not live research.

## 8. Release checklist

- [ ] Stable commit identified.
- [ ] README contains setup/run commands.
- [ ] `.env.example` has names only, no real secrets.
- [ ] Live/mock status is clear.
- [ ] No invented evidence or broken links.
- [ ] Error states work.
- [ ] Security checks completed to available time.
- [ ] Team can explain architecture, evidence rules, and limitations.
- [ ] No late feature work after freeze unless it fixes a demo-blocking bug.
