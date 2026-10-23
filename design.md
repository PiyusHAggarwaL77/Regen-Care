# ScamSieve — UI/UX Design Specification

**Audience:** Indian students and job seekers checking suspicious job, internship, scholarship, and similar offers. **Goal:** A calm, clear interface that shows evidence, uncertainty, and practical next steps.

## 1. Design principles

- Evidence before verdict.
- Make unknowns and investigation coverage visible.
- Avoid fear-based or alarmist design.
- One obvious primary action.
- Mobile-first responsive layouts.
- Never use color alone to communicate risk.
- Keep source links attached to findings.
- Clearly label mock/demo content.

## 2. Visual direction and tokens

Use a clean, modern investigation dashboard with neutral surfaces, deep navy text, indigo actions, and restrained status colors.

| Token | Value | Usage |
|---|---|---|
| Primary | `#4F46E5` | Primary buttons and selected controls |
| Background | `#F8FAFC` | App canvas |
| Surface | `#FFFFFF` | Cards and form panels |
| Text | `#0F172A` | Main text |
| Muted | `#64748B` | Secondary text |
| Border | `#E2E8F0` | Borders/dividers |
| Warning | `#B45309` | Warning label/icon with readable contrast |
| High concern | `#B91C1C` | Reserved for high-concern status |
| Supporting signal | `#15803D` | Supporting evidence only, not a “safe” verdict |
| Card radius | `16px` | Cards |
| Control radius | `10px` | Inputs/buttons |

Check actual contrast during implementation. Do not use a large green “safe” banner.

## 3. Layout and navigation

### Desktop
- Header with ScamSieve wordmark and concise descriptor.
- Centered content container with a readable max width.
- Landing page has a clear headline and input panel.
- Report can use a two-column layout: summary/findings on the main column, coverage/source overview in a side column.

### Mobile
- Single-column layout with full-width controls.
- Assessment and summary appear near the top of the report.
- Stack source metadata; avoid dense tables and horizontal scrolling.

## 4. Screen requirements

### A. Landing / start investigation
- Brand: ScamSieve.
- Headline suggestion: **“Check the offer. Follow the evidence.”**
- Supporting text explaining public-evidence checks for suspicious offers.
- Offer-text textarea and optional URL input.
- Helper text: either field may be used; at least one is required.
- Primary CTA: **Investigate offer**.
- Privacy note explaining that submitted content may be sent to the configured research provider.
- Short trust note: source-backed findings, visible unknowns, no guarantee of legitimacy.
- Optional sample/demo button must clearly identify fictional demo content.

States: empty, valid, validation error, loading, success, provider/network error.

### B. Investigation progress
Use neutral loading feedback. Suggested stages: validating input, searching public sources, reviewing available evidence, preparing report. Only mark a stage complete if the backend actually confirms it. If the API returns only a final response, use a spinner and “Investigating available public evidence…” instead of fake real-time progress.

### C. Report summary
Show assessment label (`High concern`, `Needs verification`, or `No major warning signs found in this check`), plain-language summary, coverage where defined, and disclaimer: “This is a preliminary check, not a guarantee or legal determination.” Do not show numeric scam probability.

### D. Findings
Group cards into:
- Warning signs
- Contradictions
- Supporting signals
- Unknowns / not verified

Each card contains a category label, short title, plain-language explanation, evidence references, source link, and recommended action where appropriate. Supporting signals must not appear to cancel warning signs.

### E. Sources and coverage
Show actual source title, publisher/domain if available, URL, provider-supported excerpt if available, publication date only if returned, and retrieval timestamp if recorded by the app. If no useful source is found, say so and explain that this does not prove fraud or legitimacy.

### F. Next steps
Show a short, prioritized checklist tailored to findings: verify the exact role on an official careers page, contact the organization using independently obtained official details, and avoid sending money or authentication secrets to unverified contacts.

### G. Error/unavailable states
Use clear messages such as “We couldn’t complete the public-source check right now” or “We found too little evidence to make a useful assessment.” Preserve the form input and offer retry where useful. Never show an empty screen or fake report after an API failure.

## 5. Component inventory

- `AppHeader`
- `OfferForm`
- `TextAreaField`, `UrlField`
- `PrimaryButton`, `FormError`
- `LoadingPanel` and optional `ProgressSteps`
- `AssessmentSummary`, `CoverageBadge`
- `FindingGroup`, `FindingCard`, `EvidenceReference`
- `SourceCard`, `NextStepsList`, `Disclaimer`
- `ErrorState`, `DemoModeBanner`

Keep components reusable but avoid building a generic design-system framework during the hackathon.

## 6. Interaction requirements

- Disable duplicate submissions while a request is running.
- Preserve form input on failure.
- Show field-level validation in plain language.
- After success, make the report heading easy to find.
- Open external links safely, using `rel="noopener noreferrer"` when opening a new tab.
- Keep keyboard navigation and visible focus states.
- Include a “New investigation” action that resets report/form state.
- If using mock data, show a persistent `Demo data — not live research` banner.

## 7. Accessibility and responsive checks

- Use semantic headings in order and real labels for fields.
- Ensure readable contrast and visible focus.
- Use meaningful link text.
- Support keyboard-only navigation.
- Test around 360px mobile width, tablet, and desktop.
- Respect reduced-motion preferences if animation is added.
- Avoid decorative animation that delays the primary action.

## 8. Tailwind guidance

- Reuse a container pattern such as `mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8`.
- Use consistent spacing (`gap-4`, `gap-6`, `p-5`, `p-6`).
- Maintain a clear typography hierarchy.
- Use shared tokens/class patterns instead of slightly different hardcoded colors across components.
- Keep custom CSS limited to base styles and tokens.

## 9. Mock-data requirements

- Keep mock reports in a separate module such as `src/data/mockReport.js`.
- Include an explicit `isDemo: true` flag or equivalent.
- Use fictional example data; do not present a real organization as a confirmed scam.
- Never merge mock sources into live provider results.
- Never silently return mock data after a live request fails.

## 10. Design acceptance checklist

- [ ] Purpose is clear within seconds.
- [ ] Form accepts offer text, URL, or both.
- [ ] Validation/loading/success/error states exist.
- [ ] Assessment uses cautious labels, not numeric probability.
- [ ] Findings are grouped and evidence-linked.
- [ ] Source cards display only available metadata.
- [ ] Unknowns and limited coverage are visible.
- [ ] Next steps are practical and proportionate.
- [ ] Mobile layout has no horizontal scrolling.
- [ ] Labels and keyboard focus are present.
- [ ] Demo mode is unmistakable.
