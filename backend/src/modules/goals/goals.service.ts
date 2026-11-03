import { prisma } from '../../lib/prisma';
import { CreateGoalInput } from './goals.schema';

export async function createLearningGoal(userId: number, data: CreateGoalInput) {
    // 1. Verify that the subject exists
    const subject = await prisma.subject.findUnique({
        where: { id: data.subjectId },
    });

    if (!subject) {
        throw new Error('Subject Not Found')
    }

    // 2. Check if the user already has an active goal for this specific subject
    const existingGoal = await prisma.learningGoal.findFirst({
        where: {
            userId,
            subjectId: data.subjectId,
            status: 'ACTIVE',
        },
    });

    if (existingGoal) {
        throw new Error('You have already created an active goal for this subject.');
    }

    // 3. Create the learning goal
    return prisma.learningGoal.create({
        data: {
            userId,
            subjectId: data.subjectId,
            targetDate: new Date(data.targetDate),
            dailyStudyMinutes: data.dailyStudyMinutes,
            status: 'ACTIVE',
        },
    });
}

export async function getLearningGoalsByUserId(userId: number) {
    return prisma.learningGoal.findMany({
        where: { userId },
        include: {
            subject: true,
        },
        orderBy: { createdAt: 'desc' },
    });

}