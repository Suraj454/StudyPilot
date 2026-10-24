# Learning and AI Logic (StudyPilot V1)

## 1. Curriculum

### 1.1 Subject
JavaScript and React technical interview preparation, for intermediate IT developers.

### 1.2 Topics
V1 has 12 topics. Each topic has one LEARN task (its study time) and one QUIZ task (10 minutes). No LEARN task is longer than 60 minutes.

| # | Topic                                                 | What it covers                                            | Needs first |
|---|---                                                    |---|---|
| 1 | Scope, hoisting and closures                          | var/let/const, scope chain, hoisting, closure use cases   | none |
| 2 | this, call, apply and bind                            | How this is decided, arrow functions, explicit binding    | 1 |
| 3 | Prototypes and classes                                | Prototype chain, inheritance, ES6 classes                 | 2 |
| 4 | Array methods, immutability, spread and destructuring | map, filter, reduce, copying objects and arrays           | 1 |
| 5 | Call stack and event loop                             | Call stack, task and microtask queues, execution order    | 1 |
| 6 | Promises and async/await                              | Promise states, chaining, error handling, parallel calls  | 5 |
| 7 | Debounce, throttle and function patterns              | Debounce, throttle, currying, higher-order functions      | 1, 5 |
| 8 | DOM events and event delegation                       | Bubbling, capturing, delegation, preventDefault           | none |
| 9 | Storage, cookies, HTTP basics and CORS                | localStorage vs cookies, status codes, what CORS is       | 8 |
| 10 | Components, props and JSX                            | Function components, props, composition, conditional rendering | 4 |
| 11 | State and re-rendering                               | useState, when React re-renders, state updates                | 10 |
| 12 | useEffect and side effects                           | Dependency array, cleanup, common mistakes                    | 6, 11 |
| 13 | Lists, keys and reconciliation                       | Why keys matter, virtual DOM idea, diffing basics             | 11 |
| 14 | Memoization                                          | useMemo, useCallback, React.memo and when not to use them     | 12, 13 |
| 15 | Custom hooks and context                             | Reusable hooks, Context API, prop drilling                    | 12 |

Durations are starting values and can be adjusted. The list is stored as data, so topics can change without code changes.

### 1.3 Curriculum structure
Each topic has a title, description, learning objectives, prerequisites, estimated study time, a lesson (explanations, examples, code), and quiz questions. Curriculum content is kept in seed files, validated with Zod and loaded into the database. It is never duplicated in frontend and backend code. Prerequisites are explicit data, and the plan generator must respect them.

## 2. Diagnostic Assessment

### 2.1 Purpose
The diagnostic measures what the user already knows before a plan is generated. It produces an overall knowledge level and a score per topic.

### 2.2 Question rules
- Multiple choice, one correct answer, each question linked to one topic.
- 2 questions per topic, so 24 questions in total. Every user gets the same set in the same order.
- Questions come from a prepared, reviewed bank. Each answer key is checked by the developer. AI-generated questions are not used.
- The correct answer and explanation are never sent to the frontend while the attempt is in progress.

### 2.3 Scoring
scorePercentage = (correctAnswers / totalValidQuestions) x 100

The backend calculates all scores. The frontend is never trusted to send a score or level. If there are no valid questions, scoring fails safely and never divides by zero.

### 2.4 Knowledge level thresholds
| Score             | Level         |
| ---               | ---           |
| Below 50%         | BEGINNER      |
| 50% to below 80%  | INTERMEDIATE  |
| 80% to 100%       | ADVANCED      |

Boundaries are inclusive as shown: 50% is INTERMEDIATE and 80% is ADVANCED.

### 2.5 Topic-level results
Each topic gets its own score from its questions. A topic with no valid questions is recorded as unknown, never assumed to be known. Topic scores are derived from the saved answers, and the overall level is stored separately on the attempt.

### 2.6 Attempt lifecycle
- A goal has at most one IN_PROGRESS diagnostic attempt (enforced by a database index).
- Each answer is saved when the user selects it. The backend computes is_correct but does not return it until the attempt is complete.
- Resume: the user continues the same attempt with their saved answers.
- Restart: the unfinished attempt is deleted and a new one starts.
- Submit: the backend checks that the attempt belongs to the user and is IN_PROGRESS, that every question id belongs to the diagnostic, then calculates the scores and level and marks the attempt COMPLETED in one transaction.
- A repeated submit of the same attempt returns 409 and never scores twice.
- In V1 a goal has one completed diagnostic. A new goal means a new diagnostic.

## 3. Learning Plan Generation

### 3.1 Purpose
The generator builds a dated plan from the target date, daily availability, diagnostic results and curriculum. It is deterministic: the same inputs and the same curriculum always give the same plan.

### 3.2 Inputs and validation
- Target date: a calendar date on or after the plan start date.
- Daily availability: an integer between 60 and 240 minutes (60 is the minimum because the longest task is 60 minutes).
- Overall knowledge level, topic-level results, and the curriculum with prerequisites and durations.
- The backend validates everything before generating.

### 3.3 Tasks and ordering
- Each topic produces a LEARN task and then a QUIZ task of 10 minutes.
- LEARN duration = topic study time x factor, rounded up to the next 5 minutes. Factor is 0.5 if the topic diagnostic score is 80% or more, otherwise 1.0 (including unknown).
- Order: a topic becomes eligible after all its prerequisites' QUIZ tasks are scheduled. Among eligible topics, the lowest diagnostic score goes first (unknown counts as 0%). Ties are broken by curriculum order.
- No topic is ever removed. A strong result only shortens the LEARN task.

### 3.4 Scheduling
- The plan starts on the day after it is generated (calendar dates, no time of day), which avoids timezone edge cases.
- Every calendar day counts, including weekends.
- Tasks are placed in order. A task goes on the current day if it fits in the remaining minutes, otherwise on the next day.
- The scheduled minutes of a day never exceed the daily availability.

### 3.5 Deadline feasibility
The generator runs the full scheduling first. If any task would land after the target date:
- No plan is saved.
- The response is a clear validation error (HTTP 422) with the earliest feasible date.
- The user is told to raise daily availability or choose a later date.

### 3.6 Fixed plan (V1)
Once saved, a plan never changes automatically. Missed tasks stay PENDING with a past date. A poor quiz score or an early completion changes nothing. There is no regenerate action in V1. A new plan means a new goal.

### 3.7 Persistence
The plan and its tasks are saved in one transaction. A goal has one plan in V1, so a second generation request for the same goal returns 409.

### 3.8 Implementation and tests
The scheduler is a pure TypeScript module with no Express, database or AI code. Tests cover: each knowledge level and topic results, prerequisite ordering, tie-breaking, daily limits, feasibility, invalid input, identical inputs giving identical plans, and date boundaries.

## 4. Quizzes

### 4.1 Structure
One quiz per topic: about 5 multiple-choice questions, all quiz questions of that topic, in a fixed order.

### 4.2 Attempts and scoring
Same mechanics as the diagnostic. Answers are saved as the user goes, scoring happens on the backend at submit, and the score, correct answers and explanations are shown only after the attempt is complete.

### 4.3 Task completion
- A QUIZ task is completed when its quiz attempt is COMPLETED, whatever the score. The score does not block progress.
- A LEARN task is completed when the user marks it done.

### 4.4 Weak topics
A topic is weak when its latest completed quiz attempt scores below 70%. Topics without a completed quiz are not weak. The dashboard uses the latest attempt for each topic.

### 4.5 Retries
Retries are unlimited, and every attempt is saved. Retries never change the plan.

### 4.6 Resume and restart
The same rules as the diagnostic: one IN_PROGRESS attempt per goal and topic, resume continues it, restart deletes it.

### 4.7 Goal completion
When every plan task is COMPLETED, the goal becomes COMPLETED and completed_at is set.

## 5. AI Tutor Isolation and Fallback

### 5.1 Purpose
The AI tutor explains concepts in simpler language, gives analogies and examples, and answers questions about the active lesson. It is optional, and the app works fully without it.

### 5.2 Provider
Gemini only in V1, behind a configurable provider setting, with a friendly fallback message on failure or limits. Provider failover (Groq) is a later version and needs its own retry and cost rules first.

### 5.3 Isolation
- All AI requests come from the backend. API keys live in environment variables and never in frontend code or Git.
- The AI is separate from authentication, scoring, knowledge level, plan generation, task completion and progress. It never determines a score or schedule.
- Quiz answer keys are never sent to the tutor, and it never reveals answers to an in-progress assessment.

### 5.4 Input and output
- Tutor requests are validated with Zod, with a maximum input length.
- Only the context for the active lesson is sent.
- AI output is untrusted data: validate expected structure, handle empty or malformed output, and never run generated code.
- Answers are labelled as AI-generated.

### 5.5 Failure handling
Timeouts, rate limits, configuration errors, outages and malformed responses return a controlled error and this message: "Your AI explanation is temporarily unavailable. You can continue studying the lesson and try again later." AI failures never block login, lessons, quizzes, task completion, progress or plan generation.

### 5.6 Usage limits
A per-user daily request limit (default 20, configurable), a maximum input length, and response caching. AI requests and failures are recorded as usage events. Secrets and unnecessary personal data are never logged. Free-tier limits depend on the provider's current terms.

## 6. Principles and Scope

### 6.1 Principles
- TypeScript on frontend and backend.
- Validate all untrusted input on the backend.
- Scoring and scheduling are deterministic and independently testable.
- AI stays isolated from core logic.
- Authoritative results and plan tasks are persisted in the database.
- Handle invalid input and service failures explicitly.
- Update this document whenever a decision changes.

### 6.2 V1 scope
Included: the 12-topic curriculum, diagnostic with backend scoring, overall and topic-level results, deterministic plan generation, dated tasks and progress tracking, quizzes with weak topics, a Gemini tutor with controlled failures, and tests for scoring and planning.

Deferred: automatic plan adaptation and rescheduling, plan changes from quiz scores, regenerating plans, AI provider failover, and more advanced diagnostic personalization.