import express from 'express';
export const router = express.Router();
import { router as scoreRouter } from './score';

router.use('/scores', scoreRouter);


