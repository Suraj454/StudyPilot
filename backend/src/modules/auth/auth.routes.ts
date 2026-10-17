import { Router, Request, Response } from 'express';
import { registerSchema, loginSchema } from './auth.schema';
import { registerUser, loginUser, EmailAlreadyUsedError, InvalidCredentialsError } from './auth.service';
import { ZodError } from 'zod';

const router = Router();

router.post('/register', async (req: Request, res: Response) => {
  try {
    // 1. Validate request body against Zod schema
    const validatedData = registerSchema.parse(req.body);

    // 2. Register the user via service
    const user = await registerUser(validatedData);

    // 3. Return success response
    return res.status(201).json({
      message: 'User registered successfully',
      data: user,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.issues.map((e) => ({
          path: e.path.join('.'),
          message: e.message,
        })),
      });
    }

    if (error instanceof EmailAlreadyUsedError) {
      return res.status(409).json({
        error: 'Email already registered',
      });
    }

    console.error('Registration error:', error);
    return res.status(500).json({
      error: 'Internal server error',
    });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const result = await loginUser(validatedData);

    return res.status(200).json({
      message: 'Login successful',
      data: result,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.issues.map((e) => ({
          path: e.path.join('.'),
          message: e.message,
        })),
      });
    }

    if (error instanceof InvalidCredentialsError) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;