# ScamSieve — Beginner-Friendly Build Blueprint
## HackIIITD 24-Hour Hackathon Project Guide

**Project:** ScamSieve (also written Scam Sieve)  
**Team:** Out Liars  
**Primary users:** Indian college students and early-career job seekers  
**Core use case:** Investigate a suspicious job, internship, scholarship, or recruitment offer and show evidence that helps a person decide what to verify next.  
**Important:** This is a build plan, not a claim that any offer is definitely a scam. ScamSieve should explain evidence and uncertainty rather than pretend it can guarantee safety.

---

## 0. Read this first

This guide is intentionally written for a team with little coding experience. Build one small, working end-to-end flow before adding advanced features.

### The MVP we are building

A user pastes:
1. the suspicious offer text, and/or
2. a website URL.

ScamSieve then:
1. sends the input to our backend;
2. uses TinyFish Search to discover relevant public pages;
3. uses TinyFish Fetch to retrieve readable page content where supported;
4. extracts and organizes evidence;
5. checks simple warning signs and inconsistencies;
6. returns an evidence-based report with sources, unknowns, and suggested verification steps;
7. displays the report in a clean frontend.

### The most important product rule

**Do not display a definitive “safe” result just because no warning signs were found.** Use labels such as:
- **High concern:** multiple strong warning signs or credible contradictions found.
- **Needs verification:** limited, mixed, or inconclusive evidence.
- **No major warning signs found in this check:** this is not proof of legitimacy.

Every finding should be one of:
- **Observed fact:** directly present in a source or in the submitted text.
- **Warning sign:** a pattern that deserves caution but is not proof by itself.
- **Contradiction:** two sources make materially inconsistent claims.
- **Unknown:** the available evidence does not answer the question.

Do not invent source URLs, company facts, registration details, reviews, dates, or quotations. If a check fails, report that it could not be completed.

---

# 1. Product scope and feature priority

## 1.1 P0 — must work in the demo

- Offer-text input and optional URL input.
- Basic validation and friendly error messages.
- Backend API endpoint for investigation.
- TinyFish Search integration.
- TinyFish Fetch integration if the current API supports the needed page.
- Evidence/source list with title, URL, and short factual summary.
- Rule-based warning-sign checks.
- Result summary, unknowns, and next steps.
- Loading state and error state.
- One complete test case with traceable real sources.
- Deployable frontend and backend, or a clear local demo if event rules/network restrictions prevent deployment.

## 1.2 P1 — add only after P0 works

- Extract company name, recruiter name, email, phone, requested payment, salary, and job title.
- Compare claims in the offer with evidence found online.
- Highlight payment requests and urgency language.
- Copy or print a report.
- Add a timestamp and show which checks succeeded or failed.

## 1.3 P2 — not required for the first hackathon demo

- User accounts and login.
- Database-backed history.
- Community submissions and voting.
- Browser extension.
- Multilingual analysis.
- Admin dashboard.
- Notifications and continuous monitoring.

**Scope rule:** Do not start P1/P2 until a user can submit an input and receive a real report end-to-end.

---

# 2. Recommended technology stack

Choose one stack and keep it stable for the event.

| Layer | Recommended choice | Purpose |
|---|---|---|
| Frontend | React + Vite | Builds the user interface |
| Styling | CSS or Tailwind CSS | Layout, colours, responsive design |
| Backend | Node.js + Express | Receives requests and runs the investigation |
| External research | TinyFish Search + Fetch | Finds public pages and retrieves content |
| Evidence logic | Plain JavaScript modules | Turns retrieved information into structured findings |
| Storage | No database for MVP | Keep reports in memory during a demo; persistence is optional |
| Version control | Git + GitHub | Shared code and rollback |
| Deployment | Any platform allowed by event rules | Host frontend and backend separately if needed |

Why this stack: it keeps frontend and backend in JavaScript, reducing the number of languages beginners need to learn. If your team is more comfortable with Python, FastAPI is a reasonable alternative, but **do not mix alternatives mid-build**.

### Important TinyFish note

TinyFish product endpoints, authentication, request bodies, response formats, quotas, and available features can change. Before writing integration code, open the current official TinyFish documentation and copy the exact current API details into your team's notes. Do not copy endpoint examples from old slides or assume a URL is correct.

Use the official resource pages as starting points:
- TinyFish Search/Fetch: https://www.tinyfish.ai/free-search-fetch
- TinyFish Fetch: https://www.tinyfish.ai/fetch

If TinyFish provides an official API reference or dashboard for your account, that is the source of truth for exact endpoints and payloads.

---

# 3. How the system fits together

## 3.1 High-level architecture

```text
User
  |
  v
React Frontend
  |  POST /api/investigate
  v
Node.js + Express Backend
  |
  +--> Validate input
  |
  +--> Investigation Orchestrator
          |
          +--> Extract clues from submitted offer
          |
          +--> TinyFish Search service
          |       |
          |       +--> Search public pages
          |
          +--> TinyFish Fetch service
          |       |
          |       +--> Retrieve readable page content
          |
          +--> Normalize source records
          |
          +--> Evidence extraction
          |
          +--> Rule-based checks
          |
          +--> Report builder
  |
  v
Structured JSON report
  |
  v
React Results Dashboard
```

### What each part means

- **Frontend:** everything the user sees and clicks.
- **Backend:** private server code that receives the input and coordinates checks.
- **Service:** a reusable module that performs one type of work, such as calling TinyFish.
- **Orchestrator:** calls the services in the right order.
- **Normalizer:** converts different API responses into one format our app understands.
- **Evidence engine:** labels findings and applies transparent rules.
- **Report builder:** creates the final response object for the frontend.

## 3.2 One full request, step by step

1. User enters offer text and/or URL.
2. Frontend checks that at least one field is non-empty.
3. Frontend sends JSON to our backend.
4. Backend validates the request again. Frontend validation alone is not security.
5. Backend extracts clues such as company name, recruiter email, payment amount, and role title where possible.
6. Backend creates a small list of search queries.
7. TinyFish Search is called server-side.
8. Backend normalizes search results into source records.
9. For a small, limited number of relevant URLs, TinyFish Fetch retrieves page content where supported.
10. Backend extracts relevant facts and keeps source URLs attached to them.
11. Rule checks identify caution signals, contradictions, and unanswered questions.
12. Report builder creates a JSON report.
13. Frontend displays the summary, findings, sources, uncertainty, and next steps.
14. The team tests the same flow with normal input, missing input, API failure, and no-result cases.

---

# 4. Repository and folder structure

Create one GitHub repository, for example `scamsieve`.

```text
scamsieve/
├── README.md
├── .gitignore
├── .env.example
├── frontend/
│   ├── package.json
│   ├── index.html
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── api/
│       │   └── investigate.js
│       ├── components/
│       │   ├── Header.jsx
│       │   ├── OfferForm.jsx
│       │   ├── LoadingState.jsx
│       │   ├── ErrorMessage.jsx
│       │   ├── RiskSummary.jsx
│       │   ├── FindingsList.jsx
│       │   ├── SourcesList.jsx
│       │   └── NextSteps.jsx
│       ├── pages/
│       │   └── HomePage.jsx
│       └── styles/
│           └── global.css
├── backend/
│   ├── package.json
│   ├── src/
│   │   ├── server.js
│   │   ├── app.js
│   │   ├── routes/
│   │   │   └── investigate.routes.js
│   │   ├── controllers/
│   │   │   └── investigate.controller.js
│   │   ├── services/
│   │   │   ├── tinyfishSearch.service.js
│   │   │   ├── tinyfishFetch.service.js
│   │   │   └── investigation.service.js
│   │   ├── evidence/
│   │   │   ├── extractClues.js
│   │   │   ├── normalizeSources.js
│   │   │   ├── extractEvidence.js
│   │   │   ├── applyRules.js
│   │   │   └── buildReport.js
│   │   ├── utils/
│   │   │   ├── validateInput.js
│   │   │   └── safeUrl.js
│   │   └── config/
│   │       └── env.js
│   └── tests/
│       └── investigation.test.js
└── docs/
    ├── API_CONTRACT.md
    ├── TINYFISH_NOTES.md
    └── DEMO_SCRIPT.md
```

### Folder responsibilities

#### Frontend
- `main.jsx`: starts the React application.
- `App.jsx`: sets up the main application shell.
- `pages/HomePage.jsx`: puts the input and report sections together.
- `components/OfferForm.jsx`: text box, URL field, submit button, validation.
- `components/LoadingState.jsx`: tells the user the investigation is running.
- `components/ErrorMessage.jsx`: shows useful errors.
- `components/RiskSummary.jsx`: shows the cautious overall outcome.
- `components/FindingsList.jsx`: displays facts, warnings, contradictions, unknowns.
- `components/SourcesList.jsx`: displays the sources that support findings.
- `components/NextSteps.jsx`: displays practical verification steps.
- `api/investigate.js`: makes the frontend's HTTP request to our backend.
- `styles/global.css`: shared styling and responsive layout.

#### Backend
- `server.js`: starts the server and listens on a port.
- `app.js`: configures Express, JSON parsing, CORS, routes, and error handling.
- `routes/investigate.routes.js`: defines the API path.
- `controllers/investigate.controller.js`: reads request data, calls the service, sends the response.
- `services/tinyfishSearch.service.js`: calls TinyFish Search.
- `services/tinyfishFetch.service.js`: calls TinyFish Fetch.
- `services/investigation.service.js`: coordinates the complete investigation.
- `evidence/extractClues.js`: extracts possible names, emails, amounts, and terms from user text.
- `evidence/normalizeSources.js`: maps results into one consistent source structure.
- `evidence/extractEvidence.js`: identifies relevant statements from fetched content.
- `evidence/applyRules.js`: applies transparent warning rules.
- `evidence/buildReport.js`: returns the final JSON shape.
- `utils/validateInput.js`: checks request fields and length.
- `utils/safeUrl.js`: validates URLs and blocks unsafe URL targets where applicable.
- `config/env.js`: reads environment variables without exposing secrets.

**Beginner simplification:** It is okay to start with fewer files. Create modules as they become useful. The folder tree is the intended organization, not a requirement to create every file before the app runs.

---

# 5. Define the API contract before coding

Create `docs/API_CONTRACT.md` and agree on this shape before teammates work separately. This prevents frontend and backend from inventing different field names.

## 5.1 Endpoint

`POST /api/investigate`

Request JSON:

```json
{
  "offerText": "Paste the suspicious job or internship offer here",
  "url": "https://example.com"
}
```

Rules:
- At least one of `offerText` or `url` must be provided.
- `offerText` should have a maximum length, for example 10,000 characters.
- `url` must be a valid HTTP or HTTPS URL.
- Do not send the TinyFish API key from the browser.
- The example URL above is only a placeholder.

## 5.2 Example response

This is a **shape example with illustrative data only**, not a real investigation result:

```json
{
  "requestId": "demo-request-id",
  "status": "completed",
  "summary": {
    "label": "Needs verification",
    "explanation": "The available evidence is limited; this result is not a guarantee of safety."
  },
  "findings": [
    {
      "id": "finding-1",
      "type": "warning",
      "title": "Payment requested",
      "detail": "The submitted offer text asks for an upfront payment.",
      "confidence": "high",
      "sourceIds": ["submitted-offer"]
    }
  ],
  "sources": [
    {
      "id": "submitted-offer",
      "title": "User-submitted offer",
      "url": null,
      "sourceType": "user_input",
      "retrievedAt": "2026-10-24T10:00:00.000Z",
      "summary": "Text supplied by the user; not independently verified."
    }
  ],
  "unknowns": [
    "Could not independently verify the recruiter’s relationship to the company."
  ],
  "nextSteps": [
    "Contact the company using contact details from its independently located official website.",
    "Do not pay a recruiter until the request is independently verified."
  ],
  "checks": {
    "search": "completed",
    "fetch": "partial",
    "evidenceExtraction": "completed"
  }
}
```

Do not hardcode the illustrative result as if it were the real output. In the final app, `retrievedAt` must be the actual timestamp; the sample date above is just an example.

## 5.3 Status and error format

Use consistent status values:
- `completed`
- `partial`
- `failed`

Example error response:

```json
{
  "status": "failed",
  "error": {
    "code": "INVALID_INPUT",
    "message": "Enter offer text, a URL, or both."
  }
}
```

Never send raw stack traces, API keys, internal server details, or provider credentials to the frontend.

---

# 6. Build the frontend, step by step

## Step 1 — Create the React project

Install a current supported Node.js LTS version from the official Node.js website. In a terminal:

```bash
npm create vite@latest frontend -- --template react
cd frontend
npm install
npm run dev
```

If the commands or setup prompts change in your installed Vite version, follow the current official Vite instructions. Open the local address shown by the terminal.

## Step 2 — Make the static layout first

Do not connect APIs yet. Build a page with:
1. Header/logo: ScamSieve.
2. Short explanation: “Investigate suspicious job and internship offers with source-backed evidence.”
3. A large offer-text field.
4. An optional website URL field.
5. An “Investigate offer” button.
6. A short privacy note.
7. An empty results area.

Make the page usable on both laptop and mobile widths. Use labels, not just placeholder text, so users know what each field means.

## Step 3 — Create small UI components

Build one component at a time:
1. `Header`
2. `OfferForm`
3. `LoadingState`
4. `ErrorMessage`
5. `RiskSummary`
6. `FindingsList`
7. `SourcesList`
8. `NextSteps`

Keep each component focused. For example, `SourcesList` should render sources; it should not call TinyFish.

## Step 4 — Use mock data first

Create a clearly labelled local mock response matching the API contract. Make sure the report UI can display:
- one warning;
- one observed fact;
- one unknown;
- two sources;
- a partial result;
- an error state.

The mock must be labelled as a demo/mock in the UI or developer notes. Never present invented evidence as real evidence.

## Step 5 — Add form behaviour

On submit:
1. Stop the browser's default form submission.
2. Trim the input.
3. Check that text or URL exists.
4. Show a validation message if both are empty.
5. Set loading state to true.
6. Clear any previous error.
7. Call the backend.
8. Store the response in React state.
9. Stop loading in a `finally` block.
10. Display the result or error.

## Step 6 — Add the backend request helper

`frontend/src/api/investigate.js` should contain one reusable function that:
- sends a `POST` request to `/api/investigate`;
- sets `Content-Type: application/json`;
- serializes `{ offerText, url }`;
- parses the JSON response;
- throws a helpful error if the HTTP response is unsuccessful.

For local development, the frontend needs to know the backend base URL. Use a frontend environment variable such as `VITE_API_BASE_URL`. This value is not a secret. Never put a TinyFish key in a `VITE_` variable because frontend environment variables are bundled into browser code.

## Step 7 — Build results and loading/error states

A user should always know what is happening:
- Loading: “Searching public sources…”
- Partial: “Some checks could not be completed.”
- No evidence: “No useful evidence was found in this check.”
- Error: “The investigation could not be completed. Try again.”
- Completed: show report.

Avoid scary red “SCAM” labels without supporting evidence. Use clear labels and concise explanations.

## Frontend completion checklist

- [ ] Form accepts text only.
- [ ] Form accepts URL only.
- [ ] Form accepts both.
- [ ] Empty input is rejected.
- [ ] Submit button disables while loading.
- [ ] Results render from mock JSON.
- [ ] Errors are readable.
- [ ] Mobile layout works.
- [ ] Source links open safely in a new tab with `rel="noopener noreferrer"`.
- [ ] No API secret appears in browser code, page source, or network requests.

---

# 7. Build the backend, step by step

## Step 1 — Create the Express server

From the project root:

```bash
cd backend
npm init -y
npm install express cors dotenv
npm install --save-dev nodemon
```

Configure the `package.json` scripts for development and start-up, for example `dev` using `nodemon` and `start` using `node`. Use a currently supported Node.js version.

Create:
- `src/server.js` to start listening;
- `src/app.js` to configure Express.

The app should:
- parse JSON request bodies;
- configure CORS to allow only your frontend origin(s);
- expose `GET /api/health`;
- mount `POST /api/investigate`;
- return JSON errors consistently.

The health endpoint should respond with something like:

```json
{ "status": "ok", "service": "scamsieve-api" }
```

Do not put a real TinyFish call into the first server test. First verify that the backend starts and health checks work.

## Step 2 — Add the investigation route

The route file defines `POST /api/investigate` and forwards the request to a controller. The controller:
1. reads `offerText` and `url`;
2. calls `validateInput`;
3. calls `investigation.service.js`;
4. returns the report JSON;
5. catches known errors and passes them to central error handling.

Keep the route thin. Do not put all investigation logic directly into the route.

## Step 3 — Validate input

Backend validation should:
- require at least one field;
- trim whitespace;
- enforce a text length limit;
- validate URL syntax;
- accept only `http:` and `https:` schemes;
- reject malformed input;
- avoid logging the entire offer text because it may contain personal information.

A URL being syntactically valid does not make it safe to fetch. If the backend fetches user-supplied URLs, protect against server-side request forgery (SSRF): block localhost, private/internal IP ranges, link-local addresses, cloud metadata endpoints, and unsafe redirect destinations. Prefer a provider fetch API or an allowlisted approach if appropriate. Never blindly fetch arbitrary URLs from your server.

## Step 4 — Add a mock investigation service

Before connecting TinyFish, make `investigation.service.js` return a valid report object matching the contract. This allows the frontend and backend to integrate without waiting for the provider.

Clearly mark the mock mode as development-only. The UI must not imply the mock report came from live research.

## Step 5 — Test the API directly

Use curl, Postman, or an API client. Example request:

```bash
curl -X POST http://localhost:3000/api/investigate \
  -H "Content-Type: application/json" \
  -d "{\"offerText\":\"Example offer text\",\"url\":\"\"}"
```

The expected response during the mock stage is a JSON report with the agreed fields. Also test:
- missing both fields;
- invalid URL;
- oversized text;
- malformed JSON;
- unexpected server error.

---

# 8. TinyFish API integration — do this carefully

This section describes the integration pattern. **It intentionally does not invent exact TinyFish endpoint paths, header names, or payload fields.** Use the current official docs for those values.

## 8.1 Before writing code

One teammate should:
1. Open the current TinyFish documentation and account/dashboard.
2. Confirm that the account has access to Search and Fetch.
3. Find the exact base URL and endpoint for Search.
4. Find the exact base URL and endpoint for Fetch.
5. Confirm authentication format (for example, whether an API key is sent in a header).
6. Confirm required request fields and optional parameters.
7. Confirm the exact response shape.
8. Check rate limits, timeouts, quotas, and usage restrictions.
9. Run one minimal request from a server-side script or API client.
10. Save a redacted request/response example in `docs/TINYFISH_NOTES.md`.

Never commit API keys or paste them into a public AI chat, GitHub issue, frontend code, screenshot, or pitch deck. If a key is exposed, revoke/rotate it.

## 8.2 Store the key safely

Create `backend/.env` locally:

```env
PORT=3000
FRONTEND_ORIGIN=http://localhost:5173
TINYFISH_API_KEY=put_your_real_key_here
TINYFISH_SEARCH_ENDPOINT=put_the_verified_search_endpoint_here
TINYFISH_FETCH_ENDPOINT=put_the_verified_fetch_endpoint_here
```

These endpoint environment variables are placeholders until verified in current docs. If the provider uses a different authentication or configuration pattern, follow its docs.

Add `.env` to `.gitignore`. Commit only `.env.example` with placeholder values. Do not expose `TINYFISH_API_KEY` to the frontend.

## 8.3 Build the Search service

`tinyfishSearch.service.js` should:
1. receive a search query string;
2. build the request using the verified TinyFish docs;
3. call TinyFish from the backend;
4. set a reasonable timeout;
5. check the HTTP status;
6. parse the provider response;
7. convert the response into our normalized source structure;
8. handle rate limits and provider errors;
9. return a clear service-level error if the request fails.

Do not assume all returned pages are reliable. A search result is a lead, not proof.

## 8.4 Build the Fetch service

`tinyfishFetch.service.js` should:
1. accept a URL from a search result that is relevant to the investigation;
2. apply a strict fetch limit, for example the top 3–5 URLs for the first demo;
3. call the verified TinyFish Fetch endpoint with the exact documented fields;
4. handle unsupported pages, access denial, timeouts, and empty content;
5. extract readable text and metadata where available;
6. preserve the final URL, source title, and retrieval timestamp;
7. return a partial status when only some pages were fetched.

Avoid fetching every result. Limit API use and reduce latency.

## 8.5 Use small, targeted search queries

Build queries from the clues found in the offer. Examples of query patterns:
- exact company name + official website;
- company name + careers or internships;
- company name + recruiter email domain;
- exact phrase from the offer;
- company name + payment or recruitment fee;
- domain name + company name.

These are query templates, not claims about a specific company. Keep the number of queries low at first, such as 2–4. Avoid broad or irrelevant queries.

Do not assume that a search engine result, social media post, or anonymous complaint is definitive. Prefer first-party official sources for company contact and careers information, then compare other credible sources.

## 8.6 Normalize provider responses

The raw TinyFish response may differ by endpoint. Convert it into one internal format, for example:

```json
{
  "id": "source-1",
  "title": "Page title if available",
  "url": "https://source.example/path",
  "sourceType": "web_page",
  "retrievedAt": "actual ISO timestamp",
  "snippet": "Short snippet if supplied",
  "content": "Readable fetched text if available",
  "fetchStatus": "completed"
}
```

This is our internal data format, not necessarily the provider's response format.

## 8.7 Use source evidence carefully

For each fact:
- preserve the source URL;
- record the exact statement or a faithful short excerpt;
- record whether it came from user input, a search snippet, or fetched page content;
- distinguish what a source says from what ScamSieve infers;
- do not fabricate citations or quotations;
- if pages conflict, show both sources and describe the conflict neutrally;
- if no official source is found, say it was not found in this check, not that it does not exist.

## 8.8 Timeouts and partial failure

The whole investigation should not necessarily fail because one page could not be fetched. For example:
- Search succeeds, Fetch fails → return partial report with search sources and a fetch warning.
- Search fails → return a clear failed or limited report; do not pretend live research happened.
- No results → say no useful public evidence was found.
- One of five fetches fails → keep successful sources and disclose the failed check.

Use reasonable request timeouts and avoid endless retries. During a 24-hour hackathon, one retry or no retry is often enough.

---

# 9. Evidence extraction and decision logic

## 9.1 Extract clues from the offer

`extractClues.js` may identify:
- employer/company name;
- job or internship title;
- recruiter name;
- email address and email domain;
- phone number;
- website/domain;
- salary or stipend claims;
- upfront payment or registration fee;
- urgency or pressure language;
- requests for identity documents or bank information.

These are clues, not proof. A simple regular expression can help identify an email or money amount, but it cannot verify whether the claim is true.

## 9.2 Evidence record shape

Use a consistent shape internally:

```json
{
  "id": "evidence-1",
  "claim": "The offer requests an upfront fee",
  "classification": "observed_fact",
  "explanation": "This wording appears in the submitted offer text.",
  "sourceIds": ["submitted-offer"],
  "confidence": "high"
}
```

Allowed classifications:
- `observed_fact`
- `warning_sign`
- `contradiction`
- `unknown`

Confidence describes how directly the available source supports the finding; it is **not** a probability that the entire offer is fraudulent.

## 9.3 Transparent rule examples

Start with simple rules, each with a reason:
- If submitted text explicitly asks for payment to secure a job/interview, create a warning finding and quote the relevant short text.
- If the offer's claimed official domain differs from the domain of the recruiter email, flag it for verification—not as automatic proof of fraud.
- If the official company careers page clearly contradicts a role or recruiter claim, show the two sources and explain the mismatch.
- If company identity cannot be independently corroborated, add an unknown.
- If research produces no warnings, do not call the offer safe.

Do not create a single “risk score” unless the team can explain exactly how it is calculated and validated. A transparent label plus evidence is safer and easier to defend to judges.

## 9.4 Report builder

`buildReport.js` should return:
- `requestId`
- `status`
- `summary`
- `findings`
- `sources`
- `unknowns`
- `nextSteps`
- `checks`

The summary should be derived from findings and check status. It must never say “verified safe” based only on a lack of search results.

---

# 10. Frontend and backend integration

## Step 1 — Agree on the contract

Both teams use the exact field names in `docs/API_CONTRACT.md`. Do not rename `findings` to `risks` on one side without coordinating.

## Step 2 — Run both servers locally

Typical setup:
- Backend on `http://localhost:3000`
- Vite frontend on `http://localhost:5173`

The actual ports may differ. Use the addresses printed in your terminals.

## Step 3 — Configure the frontend API base URL

In `frontend/.env.local`, set the backend base URL, for example:

```env
VITE_API_BASE_URL=http://localhost:3000
```

This is a public URL, not a secret. Restart the frontend dev server after changing environment variables.

## Step 4 — Test the complete flow

1. Open the frontend.
2. Enter a test offer.
3. Click Investigate.
4. Confirm the browser sends a request to `/api/investigate`.
5. Confirm the backend receives it.
6. Confirm the service runs.
7. Confirm the backend returns JSON.
8. Confirm the frontend renders the JSON.
9. Test error and partial states.

Use the browser developer tools' Network tab and the backend terminal logs to debug. Never log API keys or full personal offer text.

## Common integration problems

- **CORS error:** frontend origin does not match backend CORS configuration.
- **404:** wrong route or base URL.
- **500:** backend error; inspect server logs.
- **JSON parse error:** server returned HTML or an empty body rather than JSON.
- **Loading forever:** missing error handling or loading state never reset.
- **Frontend cannot read key:** it should never read the TinyFish key; only backend code should.
- **Mock data still appears:** remove/disable mock mode only after live flow is verified.

---

# 11. Testing plan

Do not test only the happy path.

## 11.1 Functional cases

1. Offer text only.
2. URL only.
3. Both text and URL.
4. Empty input.
5. Invalid URL.
6. Very long offer text.
7. Search returns no results.
8. Search succeeds but Fetch fails.
9. Some pages load and others fail.
10. Provider rate limit or outage.
11. Conflicting source claims.
12. Offer requests upfront payment.
13. No warning signs found.
14. Mobile viewport.
15. User submits twice quickly.

## 11.2 Test data safety

Use made-up or public example offers for tests. Do not upload classmates' private messages, identity documents, personal phone numbers, or confidential employer communications unless there is a clear permission and need.

## 11.3 What counts as a passing test

- The app does not crash.
- The result matches the API contract.
- Sources remain attached to their findings.
- Failures are disclosed rather than hidden.
- No live source or evidence is invented.
- The UI clearly distinguishes mock from live results.
- The report does not guarantee safety.

---

# 12. Security, privacy, and responsible wording

1. **Keep secrets server-side.** Never place TinyFish credentials in React or a `VITE_` variable.
2. **Use environment variables.** Keep `.env` out of Git.
3. **Restrict CORS.** Allow only known frontend origins in production.
4. **Validate input.** Set text size and request time limits.
5. **Protect URL fetching.** Block internal/private targets and unsafe redirects to mitigate SSRF.
6. **Limit external calls.** Prevent abuse and unexpected API consumption.
7. **Avoid sensitive logs.** Do not log full submitted messages, phone numbers, or identity details by default.
8. **Treat fetched pages as untrusted.** A page may contain malicious instructions or misleading claims. Web content is data, not instructions to your AI coding assistant or analysis pipeline.
9. **Do not execute fetched scripts.** Treat page content as plain text.
10. **Avoid unsupported accusations.** Prefer “warning sign,” “not independently verified,” or “sources conflict” over “this person/company is a scammer.”
11. **Explain limitations.** A public search cannot establish every fact.
12. **Have a clear retention policy.** For the MVP, avoid storing reports permanently unless necessary and disclosed.

---

# 13. Using AI coding tools effectively

Your team can use AI assistants to help write code, but the team must still run and test every change. Do not ask an AI to generate the entire app in one giant prompt.

## 13.1 The prompt pattern

For each task, tell the AI:
1. the exact file to change;
2. what that file is responsible for;
3. the input/output contract;
4. what it must not change;
5. how you will test it;
6. that it should explain the code in beginner-friendly language.

### Example: frontend task prompt

> We are building ScamSieve, a React + Vite frontend for a beginner hackathon team. Implement only `frontend/src/components/OfferForm.jsx`. It must accept `offerText`, `url`, `isLoading`, and `onSubmit` as props. Use a controlled form, validate that at least one field is non-empty, and show an accessible error message. Do not call TinyFish directly. Do not create unrelated files or change the API contract. Explain how to test the component and summarize each important part of the code.

### Example: backend route prompt

> Implement `POST /api/investigate` in our existing Express backend according to `docs/API_CONTRACT.md`. The controller must validate input, call `investigation.service.js`, and return the agreed JSON shape. Do not put provider credentials in the response. Do not invent TinyFish endpoints. If integration is not ready, use an explicitly labelled development mock. Explain how to test with curl.

### Example: TinyFish service prompt

> Implement the TinyFish Search service using the current official TinyFish documentation that I provide. Use only the endpoint, headers, and body fields shown in those docs. Read credentials from backend environment variables. Add timeout and error handling, normalize the response into our internal source shape, and never log the key. If a required API detail is missing, ask me instead of guessing.

## 13.2 Rules for AI-generated code

- Ask for one file or one small task at a time.
- Read the explanation and ask questions about unfamiliar code.
- Run the app after each small change.
- Copy error messages into the AI assistant, but remove keys and private data.
- Ask the AI to explain the root cause, not just rewrite everything.
- Review `git diff` before committing.
- Do not accept a large rewrite that changes working code without a reason.
- Do not let two teammates edit the same file at the same time.
- Keep a known-working commit before risky changes.
- Verify any security-sensitive or provider-specific code against official docs.

## 13.3 Git workflow for beginners

Each teammate should work on a separate branch or a clearly assigned set of files. A simple workflow:
1. Pull the latest code.
2. Create a branch such as `feature/frontend-form`.
3. Make one small change.
4. Run the app or tests.
5. Commit with a clear message.
6. Push the branch.
7. Open a pull request or have one integrator review it.
8. Merge only after the app still runs.

For a 24-hour event, avoid complicated Git workflows. One integration owner should protect the main branch and merge small, tested changes.

---

# 14. Suggested team roles

For four teammates, assign clear ownership:

## Member A — Frontend owner
- Static layout and responsive styling.
- Offer form and validation.
- Loading/error states.
- Report cards and source links.
- Mock report display before backend integration.

## Member B — Backend/integration owner
- Express app and route.
- API contract enforcement.
- Validation and error handling.
- Connect frontend to backend.
- Deployment coordination.

## Member C — TinyFish owner
- Verify current TinyFish docs.
- Get Search working in a minimal script.
- Get Fetch working in a minimal script.
- Normalize responses and report failures.
- Keep API key private.

## Member D — Evidence/testing owner
- Clue extraction.
- Rule-based warning signs.
- Source-to-finding mapping.
- Test cases and demo scenario.
- Help with integration and pitch preparation.

Everyone should understand the full demo flow, even if each person owns a module.

---

# 15. A realistic 24-hour execution schedule

| Time | Goal | Deliverable |
|---|---|---|
| Hour 0–1 | Kickoff | Scope frozen, repository, API contract, team roles |
| Hour 1–3 | Skeletons | Frontend and backend both start |
| Hour 3–5 | Parallel work | Form, health route, TinyFish test, evidence rules |
| Hour 5–8 | First integration | Frontend displays a mock backend response |
| Hour 8–12 | Real API flow | Search works; Fetch works where supported; sources normalized |
| Hour 12–15 | Evidence/report | Findings and unknowns are source-linked |
| Hour 15–17 | Testing | Happy path, errors, partial results, mobile |
| Hour 17–19 | Deployment | Hosted version or stable local demo |
| Hour 19–21 | Polish | Clear labels, loading states, source links, visual consistency |
| Hour 21–23 | Pitch practice | Demo script, architecture explanation, judge Q&A |
| Hour 23–24 | Freeze | No risky features; backup video/screenshots; final smoke test |

**Critical checkpoints**
- By hour 5: both frontend and backend start.
- By hour 8: frontend calls backend successfully, even if mock.
- By hour 12: at least one genuine TinyFish Search request works.
- By hour 16: complete evidence-backed report works.
- Final 3 hours: stabilize, rehearse, and avoid unnecessary new features.

---

# 16. Deployment procedure

Exact deployment steps depend on the hosting provider and event rules. The general procedure is:

## Step 1 — Prepare production configuration
- Set backend `PORT` according to the hosting platform.
- Set TinyFish key and verified endpoint configuration in the backend hosting dashboard.
- Set allowed frontend origin.
- Set frontend `VITE_API_BASE_URL` to the deployed backend URL.
- Never commit production secrets.

## Step 2 — Deploy backend
1. Deploy the `backend` folder or configure the service root directory.
2. Add environment variables in the hosting dashboard.
3. Start the server using the configured start command.
4. Visit `/api/health`.
5. Check server logs for startup errors.
6. Test `POST /api/investigate` before deploying the frontend.

## Step 3 — Deploy frontend
1. Configure the frontend build command, commonly `npm run build`.
2. Configure the output directory, commonly `dist` for Vite.
3. Set `VITE_API_BASE_URL` to the deployed backend base URL.
4. Deploy.
5. Open the public site and run a complete investigation.

## Step 4 — Final deployment checks
- CORS allows the deployed frontend domain.
- The backend is reachable from the browser.
- API keys are stored only on the server.
- The health endpoint works.
- Live results are not accidentally replaced by mock data.
- Provider errors are shown clearly.
- The team has a backup local run path.

If the event prohibits external services or requires specific deployment rules, follow the event rules over this general guide.

---

# 17. Final demo procedure

Choose a scenario you have tested. Do not rely on a random offer that may return unpredictable results.

1. Start with the problem: job and internship seekers may be pressured by suspicious offers.
2. Paste a test offer into ScamSieve.
3. Show that the app searches public sources.
4. Open one real source to demonstrate traceability.
5. Show one finding and the source supporting it.
6. Show an unknown or limitation so judges see that the app is not overclaiming.
7. Show practical next steps.
8. Explain how TinyFish Search and Fetch support the research flow.
9. Explain that ScamSieve does not guarantee that an offer is safe or fraudulent.
10. Finish with the intended users and next improvements.

Have a backup recording and screenshots, if event rules permit. Clearly label any offline/mock demo. Never claim a mock result is live research.

---

# 18. Judge questions to prepare for

**What makes ScamSieve different from a URL scanner?**  
The goal is to investigate the claims in an offer, connect findings to sources, identify mismatches and unknowns, and suggest verification steps. A URL scanner may be useful for technical site threats, but it does not necessarily answer whether a specific recruiter or offer claim is corroborated.

**Can ScamSieve guarantee an offer is legitimate?**  
No. It provides evidence and verification guidance. A lack of warning signs is not proof of legitimacy.

**Why use TinyFish?**  
The project needs to discover public sources and retrieve page content for comparison. TinyFish is the planned search/fetch layer; the exact capabilities and limits must be verified against current docs and the account.

**What happens if a page cannot be fetched?**  
The report says the check failed or was partial and does not pretend the page was reviewed.

**Why no database?**  
A database is not needed to demonstrate the core investigation flow. It can be added later if report history or accounts become necessary.

**How do you reduce false accusations?**  
Use cautious labels, source-linked findings, explicit unknowns, and neutral language. Never label a person or company a scammer based only on one weak signal.

**How do you keep the API key safe?**  
Store it in backend environment variables, never in frontend code or public GitHub.

**What is the biggest technical risk?**  
External API integration and inconsistent or unavailable page content. Reduce the risk by testing Search and Fetch early and building the frontend against a stable mock contract.

---

# 19. Troubleshooting checklist

- **Frontend does not start:** check Node.js version, run `npm install`, read the first terminal error.
- **Backend does not start:** check dependencies, syntax, environment variables, and port conflicts.
- **TinyFish returns unauthorized:** check key, account access, authentication header, and current docs.
- **TinyFish returns too many/no results:** narrow the query and limit the number of searches.
- **Fetch fails:** show partial status, try another relevant source, do not fabricate content.
- **CORS blocks the request:** verify exact frontend origin in backend config.
- **Wrong report fields:** compare actual JSON against `docs/API_CONTRACT.md`.
- **Unexpected output from AI-generated code:** inspect changed files and `git diff`; revert to last known working commit if necessary.
- **Deployment works locally but not online:** check deployed environment variables, CORS, base URL, logs, and whether the backend is sleeping or unavailable.
- **The team is behind schedule:** remove P1/P2 features and finish the P0 flow.

---

# 20. Final launch checklist

## Product
- [ ] One complete investigation works from the browser to the backend and back.
- [ ] At least one live source is shown and can be opened.
- [ ] Every finding has a source or is explicitly based on user-submitted text.
- [ ] Unknowns and failed checks are shown.
- [ ] No unsupported guarantee or definitive accusation appears.

## Engineering
- [ ] Frontend and backend run reliably.
- [ ] `.env` is ignored by Git.
- [ ] No secrets appear in browser bundles, commits, logs, or screenshots.
- [ ] API errors and timeouts are handled.
- [ ] CORS and URL-fetching protections are configured.
- [ ] The API contract matches on both sides.
- [ ] A known-working Git commit exists.

## Demo
- [ ] The demo input was tested recently.
- [ ] The demo source links work.
- [ ] Team members can explain their own modules.
- [ ] The team can explain the architecture without reading code.
- [ ] Backup screenshots/video are ready if allowed.
- [ ] No new feature is being added at the last minute.

---

# 21. Recommended build order — do these in order

1. Read the scope and freeze the P0 feature list.
2. Create the repository and folder skeleton.
3. Write `docs/API_CONTRACT.md`.
4. Start the React page with a form and empty result section.
5. Start the Express server and health endpoint.
6. Make `POST /api/investigate` return a mock report.
7. Connect the frontend to that mock backend response.
8. Verify the complete local flow.
9. Verify TinyFish Search from a minimal backend script using current official docs.
10. Verify TinyFish Fetch separately.
11. Integrate Search into the investigation service.
12. Integrate Fetch with a strict URL/page limit.
13. Normalize sources.
14. Add evidence extraction and transparent rules.
15. Build the report from the evidence.
16. Display findings, sources, unknowns, and next steps.
17. Test failures and partial results.
18. Deploy and test from the public URL.
19. Freeze features, rehearse the demo, and prepare backup material.

**If you remember only one thing:** Build the smallest honest version that works end-to-end. A simple report with real, traceable evidence and clear uncertainty is stronger than a flashy dashboard filled with unverified claims.
