import express from 'express';
import { postScore, groupScoresByLevel } from '../database/scores';

export const router = express.Router();

router.get('/all', async (req, res) => {
    const { level } = req.query;
    const scores = await groupScoresByLevel();
    res.json(scores);
});

router.post('/new', (req, res) => {
    const { name, score, level } = req.body;
    const userScore = postScore(name, score, level);
    res.json(userScore);
});


