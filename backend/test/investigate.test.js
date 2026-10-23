import assert from 'node:assert/strict';
import test, { after, before } from 'node:test';
import app from '../src/app.js';

let server;
let baseUrl;

before(async () => {
  server = app.listen(0, '127.0.0.1');
  await new Promise((resolve) => server.once('listening', resolve));
  const { port } = server.address();
  baseUrl = `http://127.0.0.1:${port}`;
});

after(async () => {
  await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
});

async function investigate(payload) {
  const response = await fetch(`${baseUrl}/api/investigate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  return { response, body: await response.json() };
}

test('accepts offer text and returns an explicitly labelled mock report', async () => {
  const { response, body } = await investigate({ offerText: 'Please send the internship details.' });

  assert.equal(response.status, 200);
  assert.equal(body.mode, 'mock');
  assert.equal(body.isDemo, true);
  assert.equal(body.status, 'completed');
  assert.equal(body.summary.label, 'Needs verification');
  assert.equal(body.sources[0].id, 'submitted-offer');
  assert.equal(body.checks.search, 'not_run');
});

test('accepts a URL-only request without fetching it', async () => {
  const { response, body } = await investigate({ url: 'https://example.com/opportunity' });

  assert.equal(response.status, 200);
  assert.equal(body.sources[0].id, 'submitted-url');
  assert.equal(body.sources[0].url, 'https://example.com/opportunity');
  assert.match(body.sources[0].summary, /did not open or research/i);
});

test('rejects an empty submission', async () => {
  const { response, body } = await investigate({ offerText: '   ', url: '' });

  assert.equal(response.status, 400);
  assert.equal(body.error.code, 'EMPTY_INPUT');
});

test('rejects a non-web URL', async () => {
  const { response, body } = await investigate({ url: 'ftp://example.com/file' });

  assert.equal(response.status, 400);
  assert.equal(body.error.code, 'UNSUPPORTED_URL_PROTOCOL');
});
