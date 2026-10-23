import { Router } from 'express';
import { investigate } from '../controllers/investigate.controller.js';

const router = Router();

router.post('/investigate', investigate);

export default router;
