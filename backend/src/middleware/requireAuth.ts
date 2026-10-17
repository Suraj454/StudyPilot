import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { requireEnv } from '../lib/env';

declare global {
  namespace Express {
    interface Request {
      userId?: number;
    }
  }
}

const JWT_SECRET = requireEnv('JWT_SECRET');

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const token = header.slice('Bearer '.length);

  try {
    const payload = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });

    if (typeof payload === 'string' || !payload.sub) {
      throw new Error('Invalid token payload');
    }

    req.userId = Number(payload.sub);
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}