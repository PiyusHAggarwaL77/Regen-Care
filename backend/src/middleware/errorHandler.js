import { AppError } from '../errors/AppError.js';

export function notFoundHandler(req, res) {
  res.status(404).json({
    status: 'failed',
    error: {
      code: 'NOT_FOUND',
      message: 'That API route does not exist.',
    },
  });
}

export function errorHandler(error, req, res, next) { // eslint-disable-line no-unused-vars
  if (error instanceof SyntaxError && 'body' in error) {
    return res.status(400).json({
      status: 'failed',
      error: {
        code: 'INVALID_JSON',
        message: 'Send a valid JSON request body.',
      },
    });
  }

  if (error?.type === 'entity.too.large') {
    return res.status(413).json({
      status: 'failed',
      error: {
        code: 'PAYLOAD_TOO_LARGE',
        message: 'The request is too large. Keep the JSON body under 20 KB.',
      },
    });
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      status: 'failed',
      error: {
        code: error.code,
        message: error.message,
      },
    });
  }

  // Do not expose implementation details or submitted offer text to the client.
  console.error('Unexpected ScamSieve API error', { name: error?.name, message: error?.message });
  return res.status(500).json({
    status: 'failed',
    error: {
      code: 'INTERNAL_ERROR',
      message: 'The investigation could not be completed. Please try again.',
    },
  });
}
