# StudyPilot ERD

```mermaid
erDiagram
  USER ||--o{ LEARNING_GOAL : "creates"
  SUBJECT ||--o{ LEARNING_GOAL : "chosen for"
  SUBJECT ||--o{ TOPIC : "contains"
  TOPIC ||--o{ TOPIC_PREREQUISITE : "needs"
  TOPIC ||--o{ TOPIC_PREREQUISITE : "needed by"
  TOPIC ||--o| LESSON : "has"
  TOPIC ||--o{ QUESTION : "covers"
  LEARNING_GOAL ||--o{ ATTEMPT : "has"
  TOPIC |o--o{ ATTEMPT : "quiz on"
  ATTEMPT ||--o{ ATTEMPT_ANSWER : "contains"
  QUESTION ||--o{ ATTEMPT_ANSWER : "answered in"
  LEARNING_GOAL ||--o{ LEARNING_PLAN : "generates"
  LEARNING_PLAN ||--o{ PLAN_TASK : "contains"
  TOPIC ||--o{ PLAN_TASK : "assigned in"
  USER |o--o{ USAGE_EVENT : "triggers"

  USER {
    int id PK
    string name "optional"
    string email UK "stored lowercase"
    string password_hash
    datetime created_at
  }
  SUBJECT {
    int id PK
    string name UK
    string description
  }
  TOPIC {
    int id PK
    int subject_id FK
    string title
    int sequence_order
    int estimated_minutes
  }
  TOPIC_PREREQUISITE {
    int topic_id PK, FK
    int prerequisite_topic_id PK, FK
  }
  LESSON {
    int id PK
    int topic_id FK, UK
    string title
    text explanation
    text practical_example
    text code_example
  }
  QUESTION {
    int id PK
    int topic_id FK
    AssessmentType purpose
    text question_text
    json options
    string correct_answer
    text explanation
  }
  LEARNING_GOAL {
    int id PK
    int user_id FK
    int subject_id FK
    date target_date
    int daily_study_minutes
    GoalStatus status
    datetime created_at
    datetime completed_at "null until done"
  }
  ATTEMPT {
    int id PK
    int goal_id FK
    AssessmentType type
    int topic_id FK "only for QUIZ"
    AttemptStatus status
    int correct_count
    int total_questions
    KnowledgeLevel knowledge_level "only for DIAGNOSTIC"
    datetime started_at
    datetime completed_at
  }
  ATTEMPT_ANSWER {
    int id PK
    int attempt_id FK
    int question_id FK
    string selected_answer
    boolean is_correct
  }
  LEARNING_PLAN {
    int id PK
    int goal_id FK
    datetime generated_at
  }
  PLAN_TASK {
    int id PK
    int plan_id FK
    int topic_id FK
    TaskType task_type
    int position
    date scheduled_date
    int estimated_minutes
    TaskStatus status
    datetime completed_at
  }
  USAGE_EVENT {
    int id PK
    int user_id FK "null if user deleted"
    EventType event_type
    string provider "AI events only"
    int tokens_used
    json metadata
    datetime created_at
  }
```

## Enums

- AssessmentType: DIAGNOSTIC, QUIZ
- GoalStatus: ACTIVE, COMPLETED
- AttemptStatus: IN_PROGRESS, COMPLETED
- KnowledgeLevel: names and thresholds are defined in the Learning and AI Logic document
- TaskType: LEARN, QUIZ
- TaskStatus: PENDING, COMPLETED (a missed task is a PENDING task with a past date)
- EventType: SIGN_UP, GOAL_CREATED, TASK_COMPLETED, QUIZ_COMPLETED, AI_REQUEST, AI_FAILURE

## Rules

- One active goal per user: a partial unique index on learning goals (user_id) where status is ACTIVE. Prisma cannot express this, so it is added as raw SQL in a migration.
- Deleting a user deletes their goals, plans, tasks, attempts and answers. usage_events.user_id becomes null so anonymous metrics remain.
- Content tables (subject, topic, lesson, question) are never deleted by user actions. A topic cannot be deleted while tasks or attempts reference it.
- Unique constraints: users.email, subjects.name, lessons.topic_id, (subject_id, sequence_order) on topics, (plan_id, topic_id, task_type) on plan tasks, (attempt_id, question_id) on attempt answers.
- Indexes: usage_events (user_id, event_type, created_at) for the daily AI limit, attempts (goal_id, topic_id), plan_tasks (plan_id, scheduled_date).
- is_correct is saved when an answer is scored, so editing a question later never changes past results.
- A QUIZ attempt must have a topic_id. A DIAGNOSTIC attempt has no topic_id.
- Email is stored in lowercase.
- The plan is generated from the latest COMPLETED diagnostic attempt for the goal.
- At most one IN_PROGRESS attempt per goal, type and topic: a partial unique index added as raw SQL in a migration. Diagnostic attempts have no topic_id, so the index must treat that null explicitly.