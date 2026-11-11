-- Safely update attempt_answers columns.
-- Handle both the partially migrated database and a clean migration database.
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'attempt_answers'
          AND column_name = 'selected_answer'
    ) THEN
        ALTER TABLE "attempt_answers"
        DROP COLUMN "selected_answer";
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'attempt_answers'
          AND column_name = 'selected_option_id'
    ) THEN
        ALTER TABLE "attempt_answers"
        ADD COLUMN "selected_option_id" INTEGER NOT NULL;
    END IF;
END $$;

-- Add the new correct option column as nullable initially.
ALTER TABLE "questions"
ADD COLUMN IF NOT EXISTS "correct_option_id" INTEGER;

-- Convert existing correct answers into their corresponding option IDs.
UPDATE "questions" AS q
SET "correct_option_id" = (
    SELECT opt.ordinality::INTEGER
    FROM jsonb_array_elements_text(q."options")
         WITH ORDINALITY AS opt(value, ordinality)
    WHERE opt.value = q."correct_answer"
    LIMIT 1
)
WHERE q."correct_option_id" IS NULL;

-- Ensure every question has a valid correct option before enforcing NOT NULL.
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM "questions"
        WHERE "correct_option_id" IS NULL
    ) THEN
        RAISE EXCEPTION 'Some questions could not be mapped to correct option IDs';
    END IF;
END $$;

-- Make the new column required and remove the old text column.
ALTER TABLE "questions"
ALTER COLUMN "correct_option_id" SET NOT NULL;

ALTER TABLE "questions"
DROP COLUMN "correct_answer";