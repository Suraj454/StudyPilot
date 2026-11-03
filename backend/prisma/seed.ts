import { PrismaClient , AssessmentType } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import yaml from 'yaml';
import { TopicSchema } from '../src/modules/content/content.schema';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log(' Starting database seeding...');

  const contentDir = path.join(__dirname, '../content/javascript-react');
  
  // 1. Seed Default Subject for V1
  const subject = await prisma.subject.upsert({
    where: { name: 'JavaScript and React Interview Prep' },
    update: { description: 'Comprehensive curriculum covering core JavaScript and React concepts for technical interviews.' },
    create: { 
      name: 'JavaScript and React Interview Prep', 
      description: 'Comprehensive curriculum covering core JavaScript and React concepts for technical interviews.' 
    },
  });

  console.log(`Subject seeded: ${subject.name}`);

  // 2. Read Topics Directory
  const topicsDir = path.join(contentDir, 'topics');
  if (!fs.existsSync(topicsDir)) {
    throw new Error(`Topics directory not found at ${topicsDir}`);
  }

  const topicFiles = fs.readdirSync(topicsDir).filter(file => file.endsWith('.yaml') || file.endsWith('.yml'));
  
  const topicIdMap = new Map<number, number>();

  for (const file of topicFiles) {
    const filePath = path.join(topicsDir, file);
    const rawContent = yaml.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Validate via Zod TopicSchema
    const parsedTopic = TopicSchema.parse(rawContent);

    // Upsert Topic
    const topic = await prisma.topic.upsert({
      where: {
        subjectId_sequenceOrder: {
          subjectId: subject.id,
          sequenceOrder: parsedTopic.id,
        },
      },
      update: {
        title: parsedTopic.title,
        estimatedMinutes: 60, // Default duration per topic
      },
      create: {
        subjectId: subject.id,
        title: parsedTopic.title,
        sequenceOrder: parsedTopic.id,
        estimatedMinutes: 60,
      },
    });

    topicIdMap.set(parsedTopic.id, topic.id);

    // Upsert Default Lesson for the topic
    await prisma.lesson.upsert({
      where: { topicId: topic.id },
      update: {
        title: parsedTopic.title,
        explanation: parsedTopic.description,
        practicalExample: 'Refer to subtopics and code examples in curriculum guidelines.',
        codeExample: '// Example code placeholder',
      },
      create: {
        topicId: topic.id,
        title: parsedTopic.title,
        explanation: parsedTopic.description,
        practicalExample: 'Refer to subtopics and code examples in curriculum guidelines.',
        codeExample: '// Example code placeholder',
      },
    });

    //  3. Seed Questions for the Topic (Diagnostic / Quiz)
    if (parsedTopic.questions && Array.isArray(parsedTopic.questions)) {
      await prisma.question.deleteMany({ where: { topicId: topic.id } });

      for (const q of parsedTopic.questions) {
        await prisma.question.create({
          data: {
            topicId: topic.id,
            questionText: q.questionText,
            options: q.options,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation || 'No explanation provided.',
            purpose: (q.type as AssessmentType) || AssessmentType.QUIZ, // Cast to AssessmentType enum
          },
        });
      }
    }

    console.log(` Seeded topic [${parsedTopic.id}] ${parsedTopic.title} with questions`);
  }

  // 4. Link Prerequisites
  for (const file of topicFiles) {
    const filePath = path.join(topicsDir, file);
    const rawContent = yaml.parse(fs.readFileSync(filePath, 'utf8'));
    const parsedTopic = TopicSchema.parse(rawContent);

    const currentTopicId = topicIdMap.get(parsedTopic.id);
    if (!currentTopicId) continue;

    await prisma.topicPrerequisite.deleteMany({ where: { topicId: currentTopicId } });

    for (const prereqId of parsedTopic.prerequisites) {
      const prereqTopicId = topicIdMap.get(prereqId);
      if (prereqTopicId) {
        await prisma.topicPrerequisite.create({
          data: {
            topicId: currentTopicId,
            prerequisiteTopicId: prereqTopicId,
          },
        });
      }
    }
  }

  console.log(' Prerequisites linked successfully!');
  console.log(' Database seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error(' Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });