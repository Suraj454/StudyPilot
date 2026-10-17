import { requireEnv } from '../../lib/env';
import bcrypt from 'bcrypt';
import { Prisma } from '../../generated/prisma/client';
import { prisma } from '../../lib/prisma';
import type { RegisterInput, LoginInput } from './auth.schema';
import jwt from 'jsonwebtoken';

const SALT_ROUNDS = 12;

export class EmailAlreadyUsedError extends Error {}

export async function registerUser({ name, email, password }: RegisterInput) {
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  try {
    return await prisma.user.create({
      data: { name, email, passwordHash },
      select: { id: true, name: true, email: true, createdAt: true },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new EmailAlreadyUsedError();
    }
    throw error;
  }
}

const JWT_SECRET = requireEnv('JWT_SECRET');

const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', SALT_ROUNDS);

export class InvalidCredentialsError extends Error {}

export async function loginUser({ email, password }: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email } });

  const passwordMatches = await bcrypt.compare(
    password,
    user?.passwordHash ?? DUMMY_HASH,
  );

  if (!user || !passwordMatches) {
    throw new InvalidCredentialsError();
  }

  const token = jwt.sign({ sub: String(user.id) }, JWT_SECRET, {
    expiresIn: (process.env.JWT_EXPIRES_IN ?? '1d') as jwt.SignOptions['expiresIn'],
  });

  return {
    token,
    user: { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt },
  };
}