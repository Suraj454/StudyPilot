
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useMutation } from '@tanstack/react-query';
import { apiFetch } from '../lib/api';

// Define diagnostic option structure.
type DiagnosticOption = {
  id: number;
  text: string;
};

// Define diagnostic question structure.
type DiagnosticQuestion = {
  id: number;
  topicId: number;
  questionText: string;
  options: DiagnosticOption[];
  topic?: {
    title: string;
  };
};

// Define diagnostic attempt response.
type StartDiagnosticResponse = {
  attemptId: number;
  totalQuestions: number;
  questions: DiagnosticQuestion[];
};

// Define diagnostic submission result.
type DiagnosticResult = {
  correctCount: number;
  totalQuestions: number;
  overallScore: number;
  knowledgeLevel: string;
};

// Define submission API response.
type SubmitDiagnosticResponse = {
  message: string;
  result: DiagnosticResult;
};

export default function DiagnosticPage() {
  // Get goal ID from the route.
  const { goalId: goalIdParam } = useParams();

  // Initialize navigation.
  const navigate = useNavigate();

  // Store the current diagnostic attempt.
  const [attempt, setAttempt] = useState<StartDiagnosticResponse | null>(null);

  // Track the current question index.
  const [currentIndex, setCurrentIndex] = useState(0);

  // Store selected option IDs by question ID.
  const [answers, setAnswers] = useState<Record<number, number>>({});

  // Store the final assessment result.
  const [result, setResult] = useState<DiagnosticResult | null>(null);

  // Convert the route goal ID into a number.
  const goalId = Number(goalIdParam);

  // Start a new diagnostic attempt.
  const startMutation = useMutation({
    mutationFn: () =>
      apiFetch<StartDiagnosticResponse>('/api/diagnostic/start', {
        method: 'POST',
        body: JSON.stringify({ goalId }),
      }),
    onSuccess: (data) => {
      setAttempt(data);
      setCurrentIndex(0);
      setAnswers({});
    },
  });

  // Submit all diagnostic answers.
  const submitMutation = useMutation({
    mutationFn: () => {
      if (!attempt) {
        throw new Error('No active diagnostic attempt');
      }

      return apiFetch<SubmitDiagnosticResponse>(
        `/api/diagnostic/${attempt.attemptId}/submit`,
        {
          method: 'POST',
          body: JSON.stringify({
            answers: attempt.questions.map((question) => ({
              questionId: question.id,
              selectedOptionId: answers[question.id],
            })),
          }),
        }
      );
    },
    onSuccess: (data) => {
      setResult(data.result);
    },
  });

  // Get the current question.
  const currentQuestion = attempt?.questions[currentIndex];

  // Calculate answered question count.
  const answeredCount = Object.keys(answers).length;

  // Check whether every question has been answered.
  const allAnswered =
    !!attempt &&
    attempt.questions.every((question) => answers[question.id] !== undefined);

  // Calculate assessment progress.
  const progress = attempt
    ? ((currentIndex + 1) / attempt.totalQuestions) * 100
    : 0;

  // Handle option selection.
  function handleSelectOption(optionId: number) {
    if (!currentQuestion) return;

    setAnswers((previous) => ({
      ...previous,
      [currentQuestion.id]: optionId,
    }));
  }

  // Navigate to the next question.
  function handleNext() {
    if (attempt && currentIndex < attempt.questions.length - 1) {
      setCurrentIndex((previous) => previous + 1);
    }
  }

  // Navigate to the previous question.
  function handlePrevious() {
    if (currentIndex > 0) {
      setCurrentIndex((previous) => previous - 1);
    }
  }

  // Validate the goal ID.
  if (!goalIdParam || !Number.isInteger(goalId) || goalId <= 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-rose-600 font-semibold">Invalid goal ID.</p>
      </div>
    );
  }

  // Display the final assessment result.
  if (result) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-10 max-w-lg w-full text-center space-y-6">
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto text-indigo-600 text-2xl font-bold">
            ✓
          </div>

          <h1 className="text-2xl font-bold text-slate-900">
            Assessment Completed!
          </h1>

          <p className="text-sm text-slate-500">
            Your current knowledge level has been evaluated.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-2xl p-5">
              <p className="text-3xl font-bold text-indigo-600">
                {result.overallScore}%
              </p>
              <p className="text-xs text-slate-500 mt-2">Overall Score</p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-5">
              <p className="text-2xl font-bold text-slate-900">
                {result.knowledgeLevel}
              </p>
              <p className="text-xs text-slate-500 mt-2">Knowledge Level</p>
            </div>
          </div>

          <p className="text-sm text-slate-600">
            Correct answers: {result.correctCount} / {result.totalQuestions}
          </p>

          <button
            onClick={() => navigate('/dashboard')}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold text-sm"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Display assessment introduction before starting.
  if (!attempt) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-lg w-full bg-white rounded-3xl border border-slate-200 shadow-lg p-8 space-y-6">
          <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 text-2xl">
            ✦
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Diagnostic Assessment
            </h1>
            <p className="text-sm text-slate-500 mt-2">
              Let's understand your current knowledge and create a personalized
              learning roadmap.
            </p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-5 space-y-3 text-sm text-slate-600">
            <p>• 30 questions across 15 topics</p>
            <p>• Select one answer for each question</p>
            <p>• You can navigate between questions</p>
            <p>• Your results will help personalize your learning plan</p>
          </div>

          {startMutation.isError && (
            <p className="text-sm text-rose-600">
              {startMutation.error.message}
            </p>
          )}

          <button
            onClick={() => startMutation.mutate()}
            disabled={startMutation.isPending}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white py-3 rounded-xl font-semibold text-sm"
          >
            {startMutation.isPending ? 'Starting...' : 'Start Assessment'}
          </button>

          <button
            onClick={() => navigate('/dashboard')}
            className="w-full text-slate-500 text-sm font-medium"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Handle a missing question response.
  if (!currentQuestion) return null;

  // Display the diagnostic question screen.
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-5">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-lg font-bold text-slate-900">StudyPilot</h1>
          <span className="text-sm font-semibold text-slate-500">
            Diagnostic Assessment
          </span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-5 py-10 space-y-8">
        <div className="flex justify-between text-sm">
          <span className="font-semibold text-slate-700">
            Question {currentIndex + 1} of {attempt.totalQuestions}
          </span>
          <span className="text-indigo-600 font-semibold">
            {answeredCount} answered
          </span>
        </div>

        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-600 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-7 md:p-9 space-y-7">
          <div>
            <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
              {currentQuestion.topic?.title ?? `Topic ${currentQuestion.topicId}`}
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-slate-900 mt-4 leading-relaxed">
              {currentQuestion.questionText}
            </h2>
          </div>

          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              // Check whether this option is selected.
              const isSelected =
                answers[currentQuestion.id] === option.id;

              return (
                <button
                  key={option.id}
                  onClick={() => handleSelectOption(option.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                      : 'border-slate-200 hover:border-indigo-300 text-slate-700'
                  }`}
                >
                  <span
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${
                      isSelected
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {String.fromCharCode(65 + index)}
                  </span>

                  <span className="text-sm font-medium">{option.text}</span>
                </button>
              );
            })}
          </div>
        </section>

        <div className="flex justify-between items-center gap-4">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="px-6 py-3 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold disabled:opacity-40"
          >
            Previous
          </button>

          {currentIndex < attempt.totalQuestions - 1 ? (
            <button
              onClick={handleNext}
              className="px-7 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold"
            >
              Next Question
            </button>
          ) : (
            <button
              onClick={() => submitMutation.mutate()}
              disabled={!allAnswered || submitMutation.isPending}
              className="px-7 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold disabled:opacity-50"
            >
              {submitMutation.isPending ? 'Submitting...' : 'Submit Assessment'}
            </button>
          )}
        </div>

        {submitMutation.isError && (
          <p className="text-sm text-rose-600 text-right">
            {submitMutation.error.message}
          </p>
        )}

        {!allAnswered && currentIndex === attempt.totalQuestions - 1 && (
          <p className="text-xs text-amber-600 text-right">
            Answer all questions before submitting.
          </p>
        )}
      </main>
    </div>
  );
}
