import {Router, Request, Response} from 'express';
import { requireAuth } from '../../middleware/requireAuth';
import { StartDiagnosticSchemma, SubmitDiagnosticSchema } from './diagnostic.schema';
import { startDiagnostic, submitDiagnostic, getDiagnosticResult } from './diagnostic.service';

const router = Router();
// POST /api/diagnostic/start
router.post('/start', requireAuth, async (req: Request, res: Response) => {
    try {
        // Get authenticated user ID.
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Validate request body.
        const validationResult = StartDiagnosticSchemma.safeParse(req.body);

        if (!validationResult.success) {
            return res.status(400).json({
                error: 'Validation failed',
                details: validationResult.error.format(),
            });
        }

        // Start diagnostic assessment.
        const result = await startDiagnostic(userId, validationResult.data.goalId);

        return res.status(201).json({
            message: 'Diagnostic assessment started successfully',
            ...result,
        });
    } catch (error: any) {
        if (error.message === 'Learning goal not found') {
            return res.status(404).json({ error: error.message });
        }

        console.error('Failed to start diagnostic assessment:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});


// POST /api/diagnostic/:attemptId/submit
router.post('/:attemptId/submit', requireAuth, async (req: Request, res: Response) => {
    try {
        // Get authenticated user ID.
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Validate attempt ID.
        const attemptId = Number(req.params.attemptId);

        if (!Number.isInteger(attemptId) || attemptId <= 0) {
            return res.status(400).json({ error: 'Invalid attempt ID' });
        }

        // Validate submitted answers.
        const validationResult = SubmitDiagnosticSchema.safeParse(req.body);

        if (!validationResult.success) {
            return res.status(400).json({
                error: 'Validation failed',
                details: validationResult.error.format(),
            });
        }

        // Submit diagnostic answers and calculate results.
        const result = await submitDiagnostic(userId, attemptId, validationResult.data);

        return res.status(200).json({
            message: 'Diagnostic assessment submitted successfully',
            result,
        });
    } catch (error: any) {
        if (
            error.message === 'Invalid or completed diagnostic attempt' ||
            error.message === 'Invalid diagnostic answers' ||
            error.message === 'Diagnostic questions are not properly configured'
        ) {
            return res.status(400).json({ error: error.message });
        }

        console.error('Failed to submit diagnostic assessment:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/diagnostic/result/:goalId
router.get('/result/:goalId', requireAuth, async (req: Request, res: Response) => {
  try {
    // Get authenticated user ID.
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Validate goal ID.
    const goalId = Number(req.params.goalId);

    if (!Number.isInteger(goalId) || goalId <= 0) {
      return res.status(400).json({ error: 'Invalid goal ID' });
    }

    // Fetch the latest diagnostic result.
    const result = await getDiagnosticResult(userId, goalId);

    return res.status(200).json({ result });
  } catch (error: any) {
    if (error.message === 'Learning goal not found') {
      return res.status(404).json({ error: error.message });
    }

    console.error('Failed to fetch diagnostic result:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

