import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useMutation } from '@tanstack/react-query';

interface GoalInput {
  subjectId: number;
  targetDate: string;
  dailyStudyMinutes: number;
}

export default function GoalSetupPage() {
  const [step, setStep] = useState(1);
  const [subjectId, setSubjectId] = useState(1);
  const [targetDate, setTargetDate] = useState('');
  const [dailyStudyMinutes, setDailyStudyMinutes] = useState(45);
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async (newGoal: GoalInput) => {
      const token = localStorage.getItem('studypilot_token');
      const response = await fetch('http://localhost:4000/api/goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newGoal),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create goal');
      }
      return data;
    },
    onSuccess: () => {
      navigate('/');
    },
  });

  const handleNext = () => setStep((prev) => Math.min(prev + 1, 3));
  const handlePrev = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = () => {
    mutation.mutate({
      subjectId: Number(subjectId),
      targetDate,
      dailyStudyMinutes: Number(dailyStudyMinutes),
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10 relative">
      
      {/* Floating Error Dialog / Notification Popup */}
      {mutation.isError && (
        <div className="absolute top-6 z-50 max-w-md w-full bg-rose-600 text-white px-5 py-3.5 rounded-2xl shadow-lg flex items-center justify-between animate-bounce">
          <div className="flex items-center space-x-2 text-sm font-medium">
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{(mutation.error as Error).message}</span>
          </div>
          <button 
            onClick={() => mutation.reset()} 
            className="text-white/80 hover:text-white font-bold text-sm ml-4"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-6xl w-full rounded-3xl p-8 md:p-8 bg-white border flex flex-col justify-between min-h-[540px]">
        
        <div className="space-y-8">
          {/* --- ADD THIS HEADING & DESCRIPTION HEADER ABOVE THE STEPPER --- */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-ink">
              Create Your Learning Goal
            </h1>
          </div>

          {/* Custom Stepper with Pen Icon Indicators & Names Below */}
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex items-center justify-between relative">
              <div className="absolute left-10 right-10 top-5 h-0.5 bg-slate-200 -z-0" />

              {/* Step 1 */}
              <div className="relative z-10 flex flex-col items-center">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  step >= 1 ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200' : 'bg-slate-100 text-slate-400'
                }`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </div>
                <span className={`text-xs font-semibold mt-2 ${step >= 1 ? 'text-indigo-600' : 'text-slate-400'}`}>
                  Subject
                </span>
              </div>

              {/* Step 2 */}
              <div className="relative z-10 flex flex-col items-center">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  step >= 2 ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200' : 'bg-slate-100 text-slate-400'
                }`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className={`text-xs font-semibold mt-2 ${step >= 2 ? 'text-indigo-600' : 'text-slate-400'}`}>
                  Schedule & Target
                </span>
              </div>

              {/* Step 3 */}
              <div className="relative z-10 flex flex-col items-center">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  step >= 3 ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200' : 'bg-slate-100 text-slate-400'
                }`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className={`text-xs font-semibold mt-2 ${step >= 3 ? 'text-indigo-600' : 'text-slate-400'}`}>
                  Review Goal
                </span>
              </div>
            </div>
          </div>

          {/* Step 1 Content */}
          {step === 1 && (
            <div className="space-y-4 max-w-2xl mx-auto pt-2 animate-fadeIn">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Step 1 of 3</span>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">What is your core focus?</h2>
                <p className="text-sm text-slate-500 mt-1">
                  Choose your curriculum track. StudyPilot will build your lessons and roadmap based on this selection.
                </p>
              </div>

              <div 
                onClick={() => setSubjectId(1)}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                  subjectId === 1 ? 'border-indigo-600 bg-indigo-50/30 ring-1 ring-indigo-600/20' : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-900 pt-1">JavaScript & React Interview Prep</h3>
                  <p className="text-xs text-slate-500 max-w-lg">
                    Covers closures, event loops, custom hooks, state management, and 15 core modules.
                  </p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${subjectId === 1 ? 'border-indigo-600 bg-indigo-600 text-white text-[10px]' : 'border-slate-300'}`}>
                  {subjectId === 1 && '✓'}
                </div>
              </div>
            </div>
          )}

          {/* Step 2 Content */}
          {step === 2 && (
            <div className="space-y-4 max-w-2xl mx-auto pt-2 animate-fadeIn">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Step 2 of 3</span>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">Set your schedule and deadline</h2>
                <p className="text-sm text-slate-500 mt-1">
                  Define your daily study availability and your target completion date.
                </p>
              </div>

              <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-200/80 space-y-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">Daily Study Minutes</label>
                  <input
                    type="number"
                    min={30}
                    step={15}
                    value={dailyStudyMinutes}
                    onChange={(e) => setDailyStudyMinutes(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 text-sm font-semibold"
                  />
                  <div className="flex gap-2 mt-2">
                    {[30, 45, 60, 90].map((mins) => (
                      <button
                        key={mins}
                        type="button"
                        onClick={() => setDailyStudyMinutes(mins)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition ${
                          dailyStudyMinutes === mins ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {mins} mins
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">Target Completion Date</label>
                  <input
                    type="date"
                    value={targetDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setTargetDate(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 text-sm font-semibold"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3 Content */}
          {step === 3 && (
            <div className="space-y-4 max-w-2xl mx-auto pt-2 animate-fadeIn">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Step 3 of 3</span>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">Review your goal setup</h2>
                <p className="text-sm text-slate-500 mt-1">
                  Verify your selections before launching your personalized learning plan.
                </p>
              </div>

              <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-200/80 space-y-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3 shadow-2xs">
                  <div className="flex justify-between text-xs text-slate-600 border-b border-slate-100 pb-2.5">
                    <span className="font-medium text-slate-500">Selected Subject:</span>
                    <span className="font-bold text-slate-900">JavaScript & React Interview Prep</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-600 border-b border-slate-100 pb-2.5">
                    <span className="font-medium text-slate-500">Daily Pace:</span>
                    <span className="font-bold text-indigo-600">{dailyStudyMinutes} minutes / day</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-600 pb-1">
                    <span className="font-medium text-slate-500">Target Deadline:</span>
                    <span className="font-bold text-indigo-600">{targetDate || 'Not selected'}</span>
                  </div>
                </div>
                {!targetDate && (
                  <p className="text-xs text-rose-600 font-medium"> Please go back to Step 2 and select a target deadline to continue.</p>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Locked Footer Navigation Bar */}
        <div className="max-w-2xl w-full mx-auto flex justify-between items-center pt-6 mt-6 border-t border-slate-100">
          {step > 1 ? (
            <button
              type="button"
              onClick={handlePrev}
              className="px-5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-sm transition cursor-pointer"
            >
              Continue
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={mutation.isPending || !targetDate}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-sm transition disabled:opacity-50 cursor-pointer"
            >
              {mutation.isPending ? 'Saving Goal...' : 'Complete & Launch Goal'}
            </button>
          )}
        </div>

      </div>
    </div>
  );
  
}