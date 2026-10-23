import { AppError } from '../errors/AppError.js';

const MAX_OFFER_TEXT_LENGTH = 5_000;
const MAX_URL_LENGTH = 2_048;

function hasOwn(object, property) {
  return Object.prototype.hasOwnProperty.call(object, property);
}

export function validateInvestigationInput(body) {
  if (!body || Array.isArray(body) || typeof body !== 'object') {
    throw new AppError(400, 'INVALID_INPUT', 'Send a JSON object with offerText and/or url.');
  }

  const hasOfferText = hasOwn(body, 'offerText');
  const hasUrl = hasOwn(body, 'url');

  if (hasOfferText && typeof body.offerText !== 'string') {
    throw new AppError(400, 'INVALID_INPUT', 'Offer text must be plain text.');
  }

  if (hasUrl && typeof body.url !== 'string') {
    throw new AppError(400, 'INVALID_INPUT', 'URL must be plain text.');
  }

  const offerText = (body.offerText ?? '').trim();
  const url = (body.url ?? '').trim();

  if (!offerText && !url) {
    throw new AppError(400, 'EMPTY_INPUT', 'Add offer text, a URL, or both.');
  }

  if (offerText.length > MAX_OFFER_TEXT_LENGTH) {
    throw new AppError(400, 'INPUT_TOO_LONG', `Offer text must be ${MAX_OFFER_TEXT_LENGTH.toLocaleString()} characters or fewer.`);
  }

  if (url.length > MAX_URL_LENGTH) {
    throw new AppError(400, 'INPUT_TOO_LONG', `URL must be ${MAX_URL_LENGTH.toLocaleString()} characters or fewer.`);
  }

  let normalizedUrl = '';
  if (url) {
    let parsedUrl;

    try {
      parsedUrl = new URL(url);
    } catch {
      throw new AppError(400, 'INVALID_URL', 'Enter a valid full web address, such as https://example.com.');
    }

    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      throw new AppError(400, 'UNSUPPORTED_URL_PROTOCOL', 'Only http and https links are supported.');
    }

    if (!parsedUrl.hostname || parsedUrl.username || parsedUrl.password) {
      throw new AppError(400, 'INVALID_URL', 'Enter a web address without embedded credentials.');
    }

    normalizedUrl = parsedUrl.toString();
  }

  return { offerText, url: normalizedUrl };
}

export const inputLimits = {
  maxOfferTextLength: MAX_OFFER_TEXT_LENGTH,
  maxUrlLength: MAX_URL_LENGTH,
};
