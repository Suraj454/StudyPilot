import { Router, Request, Response } from 'express';
import { requireAuth } from '../../middleware/requireAuth';
import { CreateGoalSchema } from './goals.schema';
import { createLearningGoal, getLearningGoalsByUserId } from './goals.service';
import { error } from 'node:console';
import ca from 'zod/v4/locales/ca.js';

const router = Router();
// POST /api/goals
router.post('/', requireAuth, async (req: Request, res: Response) => {
    try {
        const userId = req.userId; // Provided by your requireAuth middleware
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // 1. Validate request body against Zod schema
        const validationResult = CreateGoalSchema.safeParse(req.body);
        if (!validationResult.success) {
            return res.status(400).json({
                error: 'Validation failed',
                details: validationResult.error.format(),
            });
        }

        // 2. Call service to create the goal
        const goal = await createLearningGoal(userId, validationResult.data);

        return res.status(201).json({
            message: 'Learning goal created successfully',
            goal,
        });
    } catch (error: any) {
        if (error.message === 'Subject not found' || error.message === 'You have already created an active goal for this subject.') {
            return res.status(404).json({ error: error.message });
        }
        console.error('Failed to create goal route:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/goals
router.get('/', requireAuth, async (req: Request, res: Response) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const goals = await getLearningGoalsByUserId(userId);

        return res.status(200).json({
            message: 'Learning goals retrieved successfully',
            goals,
        });
    } catch (error) {
        console.error('Failed to fetch goals route', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
})

export default router;