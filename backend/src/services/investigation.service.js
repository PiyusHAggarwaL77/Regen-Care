import { randomUUID } from 'node:crypto';

export function createMockInvestigation({ offerText, url }) {
  const generatedAt = new Date().toISOString();
  const sources = [];

  if (offerText) {
    sources.push({
      id: 'submitted-offer',
      title: 'User-submitted offer text',
      url: null,
      sourceType: 'user_input',
      retrievedAt: generatedAt,
      summary: 'Text supplied by the user; it has not been independently verified.',
    });
  }

  if (url) {
    sources.push({
      id: 'submitted-url',
      title: 'User-submitted URL',
      url,
      sourceType: 'user_input',
      retrievedAt: generatedAt,
      summary: 'URL supplied by the user; demo mode did not open or research it.',
    });
  }

  return {
    requestId: `mock_${randomUUID()}`,
    mode: 'mock',
    isDemo: true,
    status: 'completed',
    generatedAt,
    summary: {
      label: 'Needs verification',
      explanation: 'Demo mode accepted the input but did not perform public-source research, so it cannot assess the offer.',
    },
    findings: [],
    sources,
    unknowns: [
      'Demo mode did not search public sources, so the employer, recruiter, role, and website could not be independently verified.',
    ],
    nextSteps: [
      'Do not send money, passwords, OTPs, or banking details until the offer is independently verified.',
      'Find the organization’s official website independently and use its published contact details to verify the exact role.',
    ],
    checks: {
      search: 'not_run',
      fetch: 'not_run',
      evidenceExtraction: 'not_run',
    },
    disclaimer: 'Demo data — not live research. ScamSieve is a preliminary check, not a guarantee or legal determination.',
  };
}
