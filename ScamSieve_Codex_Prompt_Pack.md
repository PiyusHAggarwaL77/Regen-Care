# ScamSieve — Codex Prompt Pack
## Step-by-step prompts for building every MVP module

**Project:** ScamSieve  
**Stack:** React + Vite, Node.js + Express, TinyFish Search/Fetch  
**Audience:** Beginner team using Codex  
**Build rule:** One prompt at a time. Run and test after each step. Do not allow Codex to invent provider-specific API details.

---

# How to use this pack

1. Open the root `scamsieve/` folder in VS Code.
2. Open Codex in that folder.
3. Keep `ScamSieve_Build_Blueprint.md` in the root folder if possible.
4. Paste Prompt 0 first.
5. Paste each next prompt only after the previous prompt's acceptance criteria pass.
6. Ask Codex to explain unfamiliar code. You are responsible for running and checking the project.
7. Commit working milestones to Git.

## Rules to keep in mind

- Never paste a real API key into a prompt, source file, or GitHub.
- Do not put the TinyFish key in frontend code or any `VITE_` variable.
- TinyFish endpoint URLs, auth headers, request payloads, response fields, rate limits, and SDK details must come from the current official TinyFish documentation or a real response you provide. If missing, Codex must ask instead of guessing.
- Keep mock data clearly labelled as mock. Never present it as live research.
- Every finding must be tied to user-submitted text or a source. Never invent sources or evidence.
- Do not claim that an offer is definitely safe just because no warnings were found.
- If Codex wants to rewrite unrelated files, tell it to stop and make the smallest necessary change.

---

# Prompt 0 — Inspect the project and create a plan

Paste this first, before asking Codex to write code.

```text
We are building ScamSieve, a beginner-friendly hackathon MVP. Read `ScamSieve_Build_Blueprint.md` if it exists. First inspect the current repository and explain what already exists. Do not overwrite or delete files.

Our stack is React + Vite for the frontend, Node.js + Express for the backend, TinyFish Search/Fetch for public web research, and plain JavaScript for evidence rules. We do not need a database for the first MVP.

The user enters suspicious job/internship offer text and/or a URL. The app returns a cautious, source-backed report containing a summary, findings, sources, unknowns, next steps, and check statuses.

Create a short implementation plan in `docs/BUILD_PLAN.md` and confirm:
1. the current folder structure;
2. the commands needed to run the existing project;
3. any missing prerequisites;
4. the first small milestone to implement.

Do not implement the entire app in this task. Explain unfamiliar terms simply. Preserve any working code.
```

**Acceptance check:** Codex explains the repository and produces a plan without damaging existing work.

---

# Prompt 1 — Create the repository skeleton and project instructions

```text
Implement only the initial project skeleton for ScamSieve, following `ScamSieve_Build_Blueprint.md` and `docs/BUILD_PLAN.md`.

Create the minimum folders and starter files needed for:
- `frontend/` — React + Vite;
- `backend/` — Node.js + Express;
- `docs/API_CONTRACT.md`;
- `docs/TINYFISH_NOTES.md`;
- `docs/DEMO_SCRIPT.md`;
- root `README.md`;
- root `.gitignore`;
- `.env.example` files where appropriate.

Do not create lots of empty files that are not yet needed. Do not add a database, login, or unrelated features. Use JavaScript rather than TypeScript for this MVP.

Make sure `.gitignore` excludes `.env`, `.env.local`, `node_modules`, build outputs, and other generated files. Do not create or invent real credentials.

At the end, list every file created and give exact commands to install and run each app. Run any available setup checks and explain their results.
```

**Acceptance check:** The repository has a clear structure and no secrets are committed.

---

# Prompt 2 — Define the API contract

```text
Implement `docs/API_CONTRACT.md` for ScamSieve. Do not build frontend or backend functionality yet.

Document the endpoint:
`POST /api/investigate`

Request JSON:
{
  "offerText": "string, optional",
  "url": "string, optional"
}

At least one of `offerText` or `url` must be provided. Document sensible maximum input lengths, HTTP/HTTPS URL validation, response status values (`completed`, `partial`, `failed`), and a consistent error format.

Define the success response with:
- `requestId`;
- `status`;
- `summary` containing `label` and `explanation`;
- `findings` containing `id`, `type`, `title`, `detail`, `confidence`, and `sourceIds`;
- `sources` containing `id`, `title`, `url`, `sourceType`, `retrievedAt`, and `summary`;
- `unknowns`;
- `nextSteps`;
- `checks` describing search, fetch, and evidence extraction status.

Use cautious classifications: observed fact, warning sign, contradiction, and unknown. Include example JSON, but label examples as illustrative and never imply the data is a real investigation.

Explain every field in beginner-friendly language. Make this contract the single source of truth for both frontend and backend.
```

**Acceptance check:** Both frontend and backend can implement the same JSON structure without guessing field names.

---

# Prompt 3 — Build the frontend skeleton

```text
Implement the minimum React + Vite frontend for ScamSieve under `frontend/`. Inspect existing files first and preserve working code.

Build a responsive, accessible single-page interface with:
- ScamSieve header and a short product explanation;
- offer text textarea;
- optional website URL input;
- an “Investigate offer” button;
- a short notice explaining that results are evidence-based and not a guarantee;
- an empty results section.

Use reusable components where useful, but keep the code beginner-friendly. Use normal CSS unless Tailwind is already correctly installed. Do not install extra libraries without explaining why they are necessary.

Do not connect to the backend or TinyFish yet. Do not add authentication, database, or advanced features.

Run the frontend build or other available checks. Tell me the exact command to run it and which files implement each part.
```

**Acceptance check:** Frontend starts and looks reasonable on desktop and mobile.

---

# Prompt 4 — Build the OfferForm component

```text
Implement or improve only the ScamSieve offer form and its immediate parent wiring.

Requirements:
- Controlled React fields for `offerText` and `url`;
- at least one field must be non-empty after trimming;
- clear inline validation messages;
- accessible labels and keyboard-friendly controls;
- disable the submit button while loading;
- do not erase the user's input if an API request fails;
- do not call TinyFish directly from the browser;
- submit through a callback supplied by the parent component.

Keep the component simple and explain props and React state in beginner-friendly language. Do not redesign unrelated parts of the app. Add or update tests if a test setup already exists; otherwise give a manual test checklist.
```

**Acceptance check:** Empty input is rejected, and text-only, URL-only, and combined inputs are accepted.

---

# Prompt 5 — Add loading, error, and report UI components

```text
Implement the ScamSieve result presentation components according to `docs/API_CONTRACT.md`.

Create or update small components for:
- loading state;
- API error state;
- overall risk/concern summary;
- findings list;
- sources list;
- unknowns;
- next steps;
- check status (search/fetch/evidence extraction).

Requirements:
- render from props; components should not call APIs themselves;
- handle missing optional fields without crashing;
- distinguish observed facts, warning signs, contradictions, and unknowns;
- show source links only when a valid HTTP/HTTPS URL exists;
- open external links safely using `target="_blank"` and `rel="noopener noreferrer"`;
- do not use “safe” or “verified legitimate” merely because no warning was found;
- visually disclose partial or failed checks;
- support narrow mobile screens.

Use accessible headings and readable contrast. Keep the styling consistent and avoid adding unnecessary libraries. Explain how each component maps to the API contract.
```

**Acceptance check:** Components can render a full report, a partial report, an empty result, and an error.

---

# Prompt 6 — Add clearly labelled mock data

```text
Add a development-only mock report for ScamSieve so the frontend can be developed before the real investigation service is ready.

The mock should include:
- a cautious summary;
- one illustrative warning based only on submitted sample text;
- one unknown;
- at least one illustrative source record;
- next steps;
- check statuses.

Every mock result must be clearly labelled “DEMO / MOCK DATA” in development. Never make up a real company allegation or fake a live source. Do not imply TinyFish was called.

Create a simple way for the frontend to display the mock report without making it the default production behaviour. Explain how to turn mock mode on and off. Do not connect TinyFish yet.
```

**Acceptance check:** The report UI can be tested without external APIs, and mock results cannot be mistaken for live findings.

---

# Prompt 7 — Set up the Express backend

```text
Implement the basic ScamSieve backend under `backend/` using Node.js and Express. Inspect existing files first.

Requirements:
- `src/server.js` starts the server;
- `src/app.js` configures Express;
- parse JSON request bodies with a sensible size limit;
- configure CORS using an environment variable for the allowed frontend origin;
- add `GET /api/health` returning JSON such as `{ "status": "ok", "service": "scamsieve-api" }`;
- add a central JSON error handler;
- read `PORT` from the environment with a local development fallback;
- do not expose secrets or stack traces to clients.

Do not add TinyFish integration in this task. Add package scripts for development and production start. If dependencies are missing, add only what is necessary and explain the install commands. Run the server or relevant checks and tell me how to verify `/api/health`.
```

**Acceptance check:** Backend starts and `/api/health` returns JSON.

---

# Prompt 8 — Implement input validation and safe URL checks

```text
Implement backend input validation for `POST /api/investigate` in focused helper modules, following `docs/API_CONTRACT.md`.

Validate:
- request body is an object;
- `offerText` and `url` are strings when provided;
- at least one is non-empty after trimming;
- enforce a maximum offer-text length;
- URL parses correctly and uses only HTTP or HTTPS;
- reject malformed or unsupported input with a consistent JSON error response.

Important security requirement: if our backend fetches user-provided URLs directly, guard against SSRF. Do not blindly fetch arbitrary URLs. Block localhost, private/internal IP ranges, link-local addresses, cloud metadata endpoints, and unsafe redirect destinations, using a well-maintained validation approach where practical. If the current TinyFish provider fetches URLs externally, still validate input and follow the provider's URL rules. Do not claim SSRF protection is complete unless it has been implemented and tested.

Do not add TinyFish calls. Add tests for valid input, missing input, invalid URL, unsupported protocol, and oversized text. Explain what each validation protects against.
```

**Acceptance check:** Invalid requests fail safely and consistently; valid text-only or URL-only requests pass.

---

# Prompt 9 — Add a mock backend investigation endpoint

```text
Implement `POST /api/investigate` using the agreed API contract. Keep route, controller, and service responsibilities separate where reasonable:
- route registers the endpoint;
- controller reads input, validates it, calls the service, and returns JSON;
- investigation service returns a clearly labelled development mock report for now.

The mock must match `docs/API_CONTRACT.md`. Do not claim live research was performed. Return useful validation errors and handle unexpected errors centrally. Keep the endpoint structure ready for the real investigation service to replace the mock later.

Add tests or provide repeatable curl commands for:
1. valid offer text;
2. URL-only input;
3. empty input;
4. invalid URL;
5. unexpected error if practical.

Do not implement TinyFish in this task. Explain how to verify the response manually.
```

**Acceptance check:** `POST /api/investigate` returns the agreed JSON shape for valid input.

---

# Prompt 10 — Connect frontend to backend

```text
Connect the ScamSieve React frontend to `POST /api/investigate`.

Requirements:
- create `frontend/src/api/investigate.js` as the only normal place for the frontend HTTP call;
- use `VITE_API_BASE_URL` for the backend base URL;
- send JSON `{ offerText, url }`;
- parse JSON and handle non-2xx responses;
- set loading state before the request and reset it in `finally`;
- display backend validation messages and network errors;
- render the returned report using the existing report components;
- prevent duplicate submissions while loading.

Security: never put the TinyFish API key in the frontend or any `VITE_` variable. The frontend must communicate only with our backend, not directly with TinyFish.

Add a `frontend/.env.example` if useful, and document local run commands. Do not change the API contract. Test the end-to-end flow against the mock backend and report any failures.
```

**Acceptance check:** A user can submit the form and see a mock report returned by the backend.

---

# Prompt 11 — Verify TinyFish documentation and create an integration note

```text
We are ready to integrate TinyFish, but provider details must not be guessed.

Inspect the current official TinyFish documentation that I provide or that is accessible in this environment. Update `docs/TINYFISH_NOTES.md` with:
- official documentation URLs used;
- verified Search endpoint and required HTTP method;
- verified Fetch endpoint and required HTTP method;
- exact authentication method, described without revealing the key;
- required request fields;
- relevant response fields;
- rate limits, quotas, timeout guidance, and restrictions if documented;
- one redacted example request and response, if we have actually tested them;
- date the information was checked.

If you cannot access official docs or I have not provided the necessary details, do not invent anything. Instead list the exact missing details and ask me to provide the documentation or a redacted API example. Do not make live code changes in this task.
```

**Acceptance check:** Provider-specific integration facts are documented from a real source, not guessed.

---

# Prompt 12 — Implement TinyFish Search service

Run this prompt only after the exact current TinyFish Search docs are available to Codex.

```text
Implement `backend/src/services/tinyfishSearch.service.js` using only the verified API details in `docs/TINYFISH_NOTES.md` and the official documentation referenced there.

Requirements:
- API key and other secrets are read only from backend environment variables;
- exact endpoint, headers, and body must match the verified docs;
- use a reasonable timeout;
- check HTTP status and handle invalid JSON;
- handle authentication errors, rate limits, provider outages, and empty results;
- normalize successful results into our internal source shape;
- never log credentials;
- do not invent results or turn an error into a successful empty result;
- keep provider-specific code inside this service.

Add a small test or a safe integration script. If a real key is not configured, tests must use a mock/stub and clearly say that no live request was made. Update `.env.example` with placeholder variable names only, never a real key. Explain how to test it.
```

**Acceptance check:** Search works with verified credentials, or reports a clear configuration/test status without pretending a live call occurred.

---

# Prompt 13 — Implement TinyFish Fetch service

Run this only after the current TinyFish Fetch docs are verified.

```text
Implement `backend/src/services/tinyfishFetch.service.js` using the verified current API details in `docs/TINYFISH_NOTES.md`.

Requirements:
- call only the documented endpoint and request shape;
- keep credentials server-side;
- use a timeout;
- limit the number of URLs fetched per investigation to a configurable small number, default around 3–5;
- handle unsupported pages, access denial, empty content, timeouts, rate limits, and malformed responses;
- return normalized title, final URL where available, readable content, actual retrieval timestamp, and fetch status;
- never fabricate page content;
- preserve partial success if some pages fail;
- never log API keys or full sensitive offer text.

Write tests using mocked provider responses for success, timeout, failure, and partial results. Clearly separate mock tests from live API tests. Explain how to run both.
```

**Acceptance check:** Fetch results are normalized and failures are disclosed.

---

# Prompt 14 — Extract clues from the offer text

```text
Implement `backend/src/evidence/extractClues.js` for ScamSieve.

Extract possible clues from submitted offer text, such as:
- company/employer name where reasonably identifiable;
- job/internship title;
- email addresses and email domains;
- phone numbers;
- URLs/domains;
- salary or stipend amounts;
- upfront payment/registration fee wording;
- urgency or pressure language;
- requests for sensitive personal or financial information.

Use simple, understandable JavaScript and regular expressions where appropriate. Do not claim that extracted values are verified. Return each clue with its value, source set to `user_input`, and an explanation or excerpt where practical.

Avoid collecting or logging more personal data than needed. Add tests for ordinary text, an email address, a payment request, urgency language, missing fields, and misleading edge cases. Explain limitations clearly.
```

**Acceptance check:** The module extracts clues without treating them as verified facts.

---

# Prompt 15 — Normalize sources and extract evidence

```text
Implement these focused evidence modules:
- `backend/src/evidence/normalizeSources.js`
- `backend/src/evidence/extractEvidence.js`

Use the API contract and current normalized Search/Fetch service outputs. Do not change the contract without explaining why and updating all affected code.

Each source should retain a stable ID, title, URL where available, source type, actual retrieval timestamp, and concise summary. Evidence records must retain source IDs.

Use classifications:
- `observed_fact`;
- `warning_sign`;
- `contradiction`;
- `unknown`.

Distinguish direct statements from interpretations. A search snippet is weaker than reviewing the page content. Never invent quotes, URLs, facts, or timestamps. If evidence cannot be linked to a source, identify it as user-submitted text or leave it as an unknown. Do not use AI-generated claims as evidence unless they are grounded in supplied source text.

Add tests for duplicate sources, missing titles, invalid URLs, empty page content, and source-to-evidence linkage. Explain the data flow.
```

**Acceptance check:** Every finding can be traced to a submitted text excerpt or a source record.

---

# Prompt 16 — Implement transparent warning rules

```text
Implement `backend/src/evidence/applyRules.js` with small, transparent rules for ScamSieve.

Initial rules may flag:
- explicit requests for upfront payment to secure an interview/job/internship;
- urgency or pressure language;
- a recruiter email domain that differs from the claimed official company domain;
- a material mismatch between the offer and a reliable official source;
- missing corroboration as an `unknown`, not proof of fraud.

Requirements:
- every rule returns a finding with a clear explanation;
- findings cite source IDs or clearly identify user-submitted text;
- a single weak signal must not label an employer or person a scammer;
- absence of warning signs must never imply “safe”;
- distinguish `warning_sign` from `contradiction`;
- avoid unsupported numeric risk scores;
- do not hardcode accusations against real companies.

Add tests for each rule, no-rule cases, conflicting evidence, and missing evidence. Explain false-positive risks and the intended cautious wording.
```

**Acceptance check:** Rules produce explainable findings and never claim certainty without evidence.

---

# Prompt 17 — Build the report and investigation orchestrator

```text
Implement:
- `backend/src/evidence/buildReport.js`;
- `backend/src/services/investigation.service.js`.

The investigation service should coordinate this flow:
1. validate/receive input already checked by the controller;
2. extract clues;
3. create a small set of targeted search queries;
4. call TinyFish Search;
5. select a limited number of relevant results;
6. call TinyFish Fetch where supported;
7. normalize sources;
8. extract evidence;
9. apply transparent rules;
10. build the final report.

Requirements:
- use the exact API contract;
- preserve successful results if some external calls fail;
- mark `completed`, `partial`, or `failed` truthfully;
- expose check statuses for Search, Fetch, and evidence extraction;
- include unknowns and next steps;
- use actual timestamps;
- never return a false successful result when the provider call failed;
- do not call more pages or queries than necessary;
- do not claim an offer is safe.

Keep the orchestrator readable and move work into existing modules. Add tests for all-success, Search failure, Fetch partial failure, no results, and conflicting sources. If TinyFish is not configured, use an explicitly labelled test mock only in tests/development—not silently in production.
```

**Acceptance check:** A complete investigation produces a contract-compliant report, including honest partial-failure states.

---

# Prompt 18 — Improve the frontend for real reports

```text
Now that the backend returns the real report shape, update the frontend to display it accurately.

Requirements:
- show summary label and explanation;
- group findings by observed fact, warning sign, contradiction, and unknown;
- show source links and source summaries;
- make it clear which statements came from submitted text and which came from web pages;
- show the status of Search, Fetch, and evidence extraction;
- display partial-result warnings;
- show actionable next steps;
- handle empty findings and empty source lists;
- show an error without erasing the user's input;
- remove or clearly disable mock mode in production;
- do not add a fake risk meter or guarantee badge.

Use accessible responsive layout. Do not rewrite backend logic or alter the API contract. Run build/tests and provide manual checks.
```

**Acceptance check:** The live report is understandable, cautious, and traceable.

---

# Prompt 19 — Add automated tests and a test plan

```text
Review the ScamSieve repository and add the most valuable tests possible without introducing unnecessary dependencies.

Prioritize:
- backend input validation;
- API response contract;
- Search and Fetch service error handling with mocked provider responses;
- clue extraction;
- evidence source mapping;
- warning rules;
- report builder;
- frontend form validation and report rendering if a frontend test framework already exists.

Do not make tests depend on a live TinyFish key or internet access. Keep any live integration test separate and opt-in. Never include credentials in test fixtures.

Add `docs/TEST_PLAN.md` describing test purpose, how to run tests, and what is not covered. Run available tests and report the actual results; do not claim tests passed unless they were executed.
```

**Acceptance check:** Core logic can be tested without API credentials or network access.

---

# Prompt 20 — Security and privacy review

```text
Perform a focused security/privacy review of ScamSieve. Inspect the code and report concrete findings before making broad changes.

Check:
- secrets and environment variables;
- `.gitignore`;
- frontend bundle for exposed credentials;
- CORS configuration;
- input size and type validation;
- SSRF risks if URLs are fetched;
- redirects and private/internal IP handling;
- timeout and external API call limits;
- sensitive logging;
- error messages and stack traces;
- handling of untrusted fetched page content;
- unsafe rendering of HTML from fetched pages;
- retention of submitted offers and reports.

Fix clear, scoped problems and add tests where practical. Do not claim the app is fully secure merely because a checklist was followed. Summarize remaining limitations and any manual configuration needed.
```

**Acceptance check:** Known high-risk issues are addressed or documented honestly.

---

# Prompt 21 — Deployment readiness

```text
Prepare ScamSieve for deployment without choosing a provider unless the repository or team has already chosen one.

Inspect both frontend and backend and create `docs/DEPLOYMENT.md` with:
- required environment variables;
- frontend build command and output folder;
- backend start command;
- CORS origin configuration;
- health-check URL;
- where to configure secrets in the hosting dashboard;
- how to test the deployed API;
- common deployment errors;
- how to switch off mock mode;
- how to avoid committing `.env`.

Make only necessary deployment-related code changes. The backend must use the hosting platform's `PORT` when supplied. The frontend must use the deployed backend base URL. Do not place provider credentials in frontend variables.

Run production builds or checks that are available. Do not claim a deployment succeeded unless you actually deployed and tested it.
```

**Acceptance check:** The team has clear deployment instructions and no secrets in the frontend.

---

# Prompt 22 — Final demo mode and presentation support

```text
Prepare ScamSieve for a reliable hackathon demo.

Create or update `docs/DEMO_SCRIPT.md` with:
- a 2–3 minute demo sequence;
- a tested input scenario;
- what the presenter should point out;
- how to explain one source-linked finding;
- how to explain unknowns and partial failures;
- how TinyFish Search and Fetch fit into the architecture;
- limitations and responsible wording;
- backup steps if the external API fails.

Do not invent live research results or guarantee a demo input will produce specific external search results. If mock mode is used as backup, label it clearly as a mock. Keep the demo focused on the complete end-to-end flow. Do not add new product features in this task.
```

**Acceptance check:** The team can explain and demonstrate the app honestly, even if a provider request fails.

---

# Prompt 23 — Final code review and freeze

```text
Perform a final MVP readiness review of ScamSieve. Do not add features.

Check:
1. Can the frontend start?
2. Can the backend start?
3. Does `/api/health` work?
4. Does `POST /api/investigate` match `docs/API_CONTRACT.md`?
5. Does the frontend display a backend response?
6. Are TinyFish endpoints and payloads based on verified docs?
7. Are API keys kept server-side?
8. Are source IDs connected to findings?
9. Are failed and partial checks disclosed?
10. Are there any false “safe” or unsupported scam claims?
11. Are mock results clearly labelled?
12. Do tests/builds pass, based on actual execution?
13. Are README, run commands, and deployment instructions accurate?

Return a concise checklist with PASS, FAIL, or NOT VERIFIED for every item, with evidence from the repository or command output. Fix only small, high-confidence blockers. Do not perform a broad refactor. If something is not verified, tell us the exact manual steps needed.
```

**Acceptance check:** The team has a truthful go/no-go checklist before the demo.

---

# Optional Prompt 24 — Ask Codex to teach the code to the team

```text
Act as a patient programming mentor. Walk us through the current ScamSieve codebase as beginners.

Explain:
1. what happens after the user clicks Investigate;
2. how the frontend sends a request;
3. how Express routes it;
4. how TinyFish Search and Fetch are called;
5. how evidence is linked to sources;
6. how warning rules work;
7. how the report returns to the UI;
8. how environment variables and API keys are protected;
9. how to debug the most common failures.

Use the actual file names and functions in our repository. Do not invent files or pretend features exist. Explain one stage at a time, with a simple analogy, then point to the relevant code. Finish with five short questions to check our understanding.
```

---

# Recommended execution order

Follow this exact order unless the existing repository requires a small adjustment:

1. Prompt 0 — Inspect and plan
2. Prompt 1 — Repository skeleton
3. Prompt 2 — API contract
4. Prompt 3 — Frontend skeleton
5. Prompt 4 — Offer form
6. Prompt 5 — Result UI components
7. Prompt 6 — Mock data
8. Prompt 7 — Express backend
9. Prompt 8 — Validation and safe URL checks
10. Prompt 9 — Mock backend endpoint
11. Prompt 10 — Frontend/backend integration
12. Prompt 11 — Verify TinyFish documentation
13. Prompt 12 — TinyFish Search
14. Prompt 13 — TinyFish Fetch
15. Prompt 14 — Clue extraction
16. Prompt 15 — Source normalization and evidence extraction
17. Prompt 16 — Warning rules
18. Prompt 17 — Orchestrator and report builder
19. Prompt 18 — Real report UI
20. Prompt 19 — Tests
21. Prompt 20 — Security review
22. Prompt 21 — Deployment readiness
23. Prompt 22 — Demo script
24. Prompt 23 — Final review
25. Prompt 24 — Teach-back session

## When time is running out

Prioritize:
- frontend form;
- backend endpoint;
- working Search;
- Fetch for a few sources;
- one source-linked finding;
- unknowns and next steps;
- honest error/partial status;
- a stable demo.

Skip accounts, database, browser extension, community reports, multilingual features, and complex scoring.

**Golden rule:** Do not let Codex silently guess, invent evidence, expose secrets, or rewrite the whole repository. Small changes, real tests, traceable sources, and clear explanations are the winning workflow.
