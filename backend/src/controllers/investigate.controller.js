import { createMockInvestigation } from '../services/investigation.service.js';
import { validateInvestigationInput } from '../utils/validateInvestigationInput.js';

export function investigate(req, res, next) {
  try {
    const input = validateInvestigationInput(req.body);
    const report = createMockInvestigation(input);

    res.status(200).json(report);
  } catch (error) {
    next(error);
  }
}
