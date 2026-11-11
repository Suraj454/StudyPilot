-- AlterTable
ALTER TABLE "attempts" ADD COLUMN     "overall_score" INTEGER;

-- CreateTable
CREATE TABLE "topic_assessment_results" (
    "id" SERIAL NOT NULL,
    "attempt_id" INTEGER NOT NULL,
    "topic_id" INTEGER NOT NULL,
    "correct_count" INTEGER NOT NULL,
    "total_questions" INTEGER NOT NULL,
    "score_percentage" INTEGER NOT NULL,
    "knowledge_level" "KnowledgeLevel" NOT NULL,

    CONSTRAINT "topic_assessment_results_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "topic_assessment_results_attempt_id_topic_id_key" ON "topic_assessment_results"("attempt_id", "topic_id");

-- AddForeignKey
ALTER TABLE "topic_assessment_results" ADD CONSTRAINT "topic_assessment_results_attempt_id_fkey" FOREIGN KEY ("attempt_id") REFERENCES "attempts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "topic_assessment_results" ADD CONSTRAINT "topic_assessment_results_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "topics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
