# ScamSieve API contract — mock-flow milestone

This document is the agreed contract for the first runnable mock flow. It is intentionally provider-neutral: no TinyFish endpoint, credential, or response field is defined here.

## Endpoint

`POST /api/investigate`

Request header: `Content-Type: application/json`

Request body:

```json
{
  "offerText": "Optional suspicious offer text",
  "url": "https://example.com/optional-offer-page"
}
```

At least one field must contain non-whitespace text.

- `offerText`: optional string, maximum 5,000 characters.
- `url`: optional string, maximum 2,048 characters; must be a full `http:` or `https:` URL with a hostname and no embedded credentials.
- The server does not fetch the supplied URL in this milestone. URL safety protections for remote fetching will be added before any direct fetching is introduced.

## Successful mock response

The following is an illustrative shape, not a real investigation result:

```json
{
  "requestId": "mock_123",
  "mode": "mock",
  "isDemo": true,
  "status": "completed",
  "generatedAt": "2026-10-23T10:00:00.000Z",
  "summary": {
    "label": "Needs verification",
    "explanation": "Demo mode accepted the input but did not perform public-source research."
  },
  "findings": [],
  "sources": [
    {
      "id": "submitted-offer",
      "title": "User-submitted offer text",
      "url": null,
      "sourceType": "user_input",
      "retrievedAt": "2026-10-23T10:00:00.000Z",
      "summary": "Text supplied by the user; it has not been independently verified."
    }
  ],
  "unknowns": [
    "Demo mode did not search public sources, so the offer could not be independently verified."
  ],
  "nextSteps": [
    "Do not send money, passwords, OTPs, or banking details until the offer is independently verified."
  ],
  "checks": {
    "search": "not_run",
    "fetch": "not_run",
    "evidenceExtraction": "not_run"
  },
  "disclaimer": "Demo data — not live research. ScamSieve is a preliminary check, not a guarantee or legal determination."
}
```

The server generates `requestId` and `generatedAt` for each response. `mode: "mock"` and `isDemo: true` are mandatory during this milestone so the UI can never present the response as live research.

When later milestones produce findings, each finding will contain `id`, `type` (`observed_fact`, `warning_sign`, `contradiction`, or `unknown`), `title`, `detail`, `confidence`, and `sourceIds`. Every `sourceId` must resolve to an item in `sources` or clearly identify user-submitted text.

## Errors

Errors use this shape:

```json
{
  "status": "failed",
  "error": {
    "code": "EMPTY_INPUT",
    "message": "Add offer text, a URL, or both."
  }
}
```

| HTTP status | Code | Meaning |
| --- | --- | --- |
| 400 | `EMPTY_INPUT` | Both fields are empty after trimming. |
| 400 | `INVALID_INPUT` | A supplied field is not a string. |
| 400 | `INVALID_URL` | The URL is malformed, lacks a hostname, or includes credentials. |
| 400 | `UNSUPPORTED_URL_PROTOCOL` | The URL is not HTTP or HTTPS. |
| 400 | `INPUT_TOO_LONG` | Text or URL exceeds its documented limit. |
| 400 | `INVALID_JSON` | The request body is not valid JSON. |
| 413 | `PAYLOAD_TOO_LARGE` | The JSON body exceeds 20 KB. |
| 500 | `INTERNAL_ERROR` | An unexpected error occurred; no internal details are exposed. |

No provider credentials, stack traces, or live-research claims are returned by this endpoint.
