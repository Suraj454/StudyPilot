import bcrypt from 'bcrypt';
import { Prisma } from '../../generated/prisma/client';
import { prisma } from '../../lib/prisma';
import type { RegisterInput } from './auth.schema';

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