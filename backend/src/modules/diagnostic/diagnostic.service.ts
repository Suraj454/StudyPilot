import { prisma } from "../../lib/prisma";
import { SubmitDiagnosticInput } from "./diagnostic.schema";

// Start a new diagnostic assessment for the user's learning goal.
export async function startDiagnostic(userId: number, goalId: number) {

    // Find the learning goal and verify user ownership.
    const goal = await prisma.learningGoal.findFirst({
        where: {
            id: goalId,
            userId
        },
    });

    if (!goal) {
        throw new Error('Learning goal not found');
    }

    // Fetch all diagnostic questions with their topic details.
    const questions = await prisma.question.findMany({
        where: { purpose: 'DIAGNOSTIC' },
        include: {
            topic: {
                select: {
                    id: true,
                    title: true,
                },
            },
        },
        orderBy: [
            { topicId: 'asc' },
            { id: 'asc' }
        ],
    });

    if (questions.length !== 30) {
        throw new Error('Diagnostic questions are not properly configured');
    }

    // Create a new diagnostic assessment attempt.
    const attempt = await prisma.attempt.create({
        data: {
            goalId,
            type: 'DIAGNOSTIC',
            totalQuestions: questions.length,
            status: 'IN_PROGRESS',
        },
    });

    return {
        attemptId: attempt.id,
        totalQuestions: questions.length,
        questions: questions.map(({ correctOptionId, explanation, ...question }) => question),
    };

}

// Submit diagnostic answers and calculate the user's assessment results.
export async function submitDiagnostic(
    userId: number,
    attemptId: number,
    data: SubmitDiagnosticInput
) {
    // Find the diagnostic attempt belonging to the authenticated user.
    const attempt = await prisma.attempt.findFirst({
        where: {
            id: attemptId,
            type: 'DIAGNOSTIC',
            goal: {
                userId,
            },
        },
        include: {
            goal: {
                select: {
                    subjectId: true,
                },
            },
        },
    });

    // Ensure the attempt exists and is still in progress.
    if (!attempt || attempt.status !== 'IN_PROGRESS') {
        throw new Error('Invalid or completed diagnostic attempt');
    }

    // Fetch diagnostic questions belonging to the attempt's subject.
    const questions = await prisma.question.findMany({
        where: {
            purpose: 'DIAGNOSTIC',
            topic: {
                subjectId: attempt.goal.subjectId,
            },
        },
        include: {
            topic: {
                select: {
                    id: true,
                    title: true,
                },
            },
        },
    });

    // Ensure all diagnostic questions have been configured correctly.
    if (questions.length !== 30) {
        throw new Error('Diagnostic questions are not properly configured');
    }

    // Validate that the submitted answers match the assessment questions.
    const questionIds = new Set(questions.map(question => question.id));
    const submittedQuestionIds = data.answers.map(answer => answer.questionId);

    if (
        submittedQuestionIds.length !== questions.length ||
        new Set(submittedQuestionIds).size !== submittedQuestionIds.length ||
        submittedQuestionIds.some(id => !questionIds.has(id))
    ) {
        throw new Error('Invalid diagnostic answers');
    }

    // Evaluate submitted answers.
    const evaluatedAnswers = data.answers.map(answer => {
        const question = questions.find(q => q.id === answer.questionId)!;

        return {
            questionId: question.id,
            topicId: question.topic.id,
            selectedOptionId: answer.selectedOptionId,
            isCorrect: question.correctOptionId === answer.selectedOptionId,
        };
    });

    // Calculate overall assessment score.
    const correctCount = evaluatedAnswers.filter(answer => answer.isCorrect).length;
    const overallScore = Math.round((correctCount / questions.length) * 100);

    // Group evaluated answers by topic.
    const topicGroups = new Map<number, typeof evaluatedAnswers>();

    for (const answer of evaluatedAnswers) {
        const existingAnswers = topicGroups.get(answer.topicId) ?? [];
        existingAnswers.push(answer);
        topicGroups.set(answer.topicId, existingAnswers);
    }

    // Calculate topic-wise assessment results.
    const topicResults = Array.from(topicGroups.entries()).map(([topicId, answers]) => {
        const topicCorrectCount = answers.filter(answer => answer.isCorrect).length;
        const scorePercentage = Math.round(
            (topicCorrectCount / answers.length) * 100
        );

        const knowledgeLevel =
            scorePercentage < 50
                ? 'BEGINNER'
                : scorePercentage < 80
                    ? 'INTERMEDIATE'
                    : 'ADVANCED';

        return {
            topicId,
            correctCount: topicCorrectCount,
            totalQuestions: answers.length,
            scorePercentage,
            knowledgeLevel,
        } as const;
    });

    // Save answers, topic results, and overall attempt results atomically.
    return prisma.$transaction(async (tx) => {
        await tx.attemptAnswer.createMany({
            data: evaluatedAnswers.map(answer => ({
                attemptId,
                questionId: answer.questionId,
                selectedOptionId: answer.selectedOptionId,
                isCorrect: answer.isCorrect,
            })),
        });

        await tx.topicAssessmentResult.createMany({
            data: topicResults.map(result => ({
                ...result,
                attemptId,
            })),            // attemptId is added to every topic result below.
        });

        return tx.attempt.update({
            where: { id: attemptId },
            data: {
                correctCount,
                overallScore,
                knowledgeLevel:
                    overallScore < 50
                        ? 'BEGINNER'
                        : overallScore < 80
                            ? 'INTERMEDIATE'
                            : 'ADVANCED',
                status: 'COMPLETED',
                completedAt: new Date(),
            },
        });
    });
}

// Get the latest completed diagnostic result for a learning goal.
export async function getDiagnosticResult(userId: number, goalId: number) {
  // Verify that the learning goal belongs to the user.
  const goal = await prisma.learningGoal.findFirst({
    where: {
      id: goalId,
      userId,
    },
  });

  if (!goal) {
    throw new Error('Learning goal not found');
  }

  // Fetch the latest completed diagnostic attempt.
  return prisma.attempt.findFirst({
    where: {
      goalId,
      type: 'DIAGNOSTIC',
      status: 'COMPLETED',
    },
    orderBy: {
      completedAt: 'desc',
    },
    select: {
      id: true,
      correctCount: true,
      totalQuestions: true,
      overallScore: true,
      knowledgeLevel: true,
      completedAt: true,
    },
  });
}