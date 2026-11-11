// import { useQuery } from '@tanstack/react-query';
// import { apiFetch } from '../lib/api';
// import { useState } from 'react';
// import { useNavigate } from 'react-router';
// import { clearToken } from '../lib/token';
// import { 
//   LayoutDashboard, 
//   Target, 
//   LogOut, 
//   Flame, 
//   ArrowRight, 
//   CheckCircle2, 
//   BookOpen, 
//   TrendingUp, 
//   Sparkles,
//   BarChart3
// } from 'lucide-react';

// type LearningGoal = {
//   id: number;
//   targetDate: string;
//   dailyStudyMinutes: number;
//   status: string;
//   subject: {
//     id: number;
//     name: string;
//     description: string;
//   };
// };

// type GoalsResponse = {
//   message: string;
//   goals: LearningGoal[];
// };

// type DiagnosticResultResponse = {
//   result: {
//     id: number;
//     correctCount: number;
//     totalQuestions: number;
//     overallScore: number;
//     knowledgeLevel: string;
//     completedAt: string;
//   } | null;
// };

// export default function DashboardPage() {
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState('dashboard');

//   // Fetch the user's learning goals.
//   const { data, isLoading, isError } = useQuery({
//     queryKey: ['goals'],
//     queryFn: () => apiFetch<GoalsResponse>('/api/goals'),
//   });

//   // Get the active learning goal.
//   const userGoal = data?.goals.find((goal) => goal.status === 'ACTIVE');

//   // Fetch the latest diagnostic result for the active goal.
//   const { data: diagnosticData } = useQuery({
//     queryKey: ['diagnostic-result', userGoal?.id],
//     queryFn: () =>
//       apiFetch<DiagnosticResultResponse>(
//         `/api/diagnostic/result/${userGoal!.id}`
//       ),
//     enabled: !!userGoal,
//   });

//   // Get the completed diagnostic result.
//   const diagnosticResult = diagnosticData?.result;

//   const currentModule = {
//     title: 'Module 5: Advanced Custom Hooks & Performance Optimization',
//     description: 'Learn how to build reusable hooks, memoize values with useMemo, and prevent unnecessary re-renders.',
//     estimatedMinutes: 45,
//   };

//   function handleLogout() {
//     clearToken();
//     navigate('/login', { replace: true });
//   }

//   if (isLoading) return <div>Loading dashboard...</div>;
//   if (isError) return <div>Failed to load learning goals.</div>;

//   return (
//     <div className="min-h-screen bg-slate-100/70 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50/50 via-slate-100/50 to-slate-200/50 flex overflow-hidden">
      
//       {/* --- SIDEBAR NAVIGATION (Light Theme) --- */}
//       <aside className="w-68 bg-white border-r border-slate-200/80 hidden md:flex flex-col justify-between p-6 shadow-sm">
//         <div className="space-y-8">
//           {/* Brand Logo / Header */}
//           <div className="flex items-center space-x-3 px-2">
//             <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md shadow-indigo-200">
//               S
//             </div>
//             <div>
//               <span className="text-base font-bold tracking-tight text-slate-900 block">StudyPilot</span>
//               <span className="text-[10px] text-indigo-600 font-semibold tracking-wider uppercase">Command Center</span>
//             </div>
//           </div>

//           {/* Nav Links */}
//           <nav className="space-y-1.5">
//             <button
//               onClick={() => setActiveTab('dashboard')}
//               className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
//                 activeTab === 'dashboard' 
//                   ? 'bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-2xs' 
//                   : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
//               }`}
//             >
//               <LayoutDashboard className="w-4 h-4" />
//               <span>Dashboard</span>
//             </button>
//             <button
//               onClick={() => navigate('/goals/new')}
//               className="w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all cursor-pointer"
//             >
//               <Target className="w-4 h-4" />
//               <span>Goal Settings</span>
//             </button>
//           </nav>
//         </div>

//         {/* Sidebar Footer / Logout */}
//         <div className="pt-6 border-t border-slate-100">
//           <button
//             onClick={handleLogout}
//             className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-100 rounded-xl transition-all cursor-pointer"
//           >
//             <LogOut className="w-4 h-4" />
//             <span>Log out</span>
//           </button>
//         </div>
//       </aside>

//       {/* --- MAIN CONTENT AREA --- */}
//       <main className="flex-1 flex flex-col min-w-0 overflow-y-auto relative">
        
//         {/* Top Header */}
//         <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-8 py-5 flex justify-between items-center sticky top-0 z-20 shadow-2xs">
//           <div>
//             <h1 className="text-lg font-bold text-slate-900 tracking-tight">Overview & Activity</h1>
//             <p className="text-xs text-slate-500 mt-0.5">Track your milestones and active study sprints.</p>
//           </div>
//           <div className="flex items-center space-x-3">
//             <div className="flex items-center space-x-2 px-3.5 py-1.5 bg-amber-50 border border-amber-200 text-amber-700 rounded-full text-xs font-semibold shadow-2xs">
//               <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
//               <span>{userGoal.streakDays} Day Streak</span>
//             </div>
//           </div>
//         </header>

//         {/* Dashboard Body Grid */}
//         <div className="p-8 max-w-6xl w-full mx-auto space-y-8">
          
//           {/* Section A: Goal Progress Banner (Light Gradient Card) */}
//           <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 rounded-3xl p-8 text-white shadow-xl shadow-indigo-200/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
//             <div className="space-y-3 max-w-xl relative z-10">
//               <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-[11px] font-semibold tracking-wider uppercase border border-white/20">
//                 <Sparkles className="w-3 h-3 text-indigo-200" />
//                 <span>Active Track</span>
//               </div>
//               <h2 className="text-2xl md:text-3xl font-black tracking-tight">{userGoal.subject.name}</h2>
//               <p className="text-xs text-indigo-100 font-medium leading-relaxed">
//                 Pacing for <strong className="text-white font-bold">{userGoal.dailyStudyMinutes} mins/day</strong> targeting completion by {userGoal.targetDate}.
//               </p>
//             </div>
            
//             <div className="relative z-10 bg-white/15 backdrop-blur-xl px-6 py-4 rounded-2xl border border-white/25 text-center shrink-0 shadow-lg">
//               <span className="block text-3xl font-black">{userGoal.progressPercentage}%</span>
//               <span className="text-[11px] text-indigo-100 font-semibold uppercase tracking-wider">Completed</span>
//             </div>
//           </div>

//           {/* Diagnostic Assessment Card */}
//           <div className="bg-white p-6 rounded-3xl border border-indigo-100 shadow-md shadow-indigo-100/40 flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
//             <div className="flex items-start gap-4">
//               <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
//                 <Target className="w-6 h-6" />
//               </div>

//               <div>
//                 <h3 className="text-lg font-bold text-slate-900">
//                   Diagnostic Assessment
//                 </h3>
//                 <p className="text-sm text-slate-500 mt-1">
//                   Evaluate your current knowledge and get a personalized learning plan.
//                 </p>
//                 <p className="text-xs text-slate-400 mt-2">
//                   30 Questions · 15 Topics · 15–20 Minutes
//                 </p>
//               </div>
//             </div>

//             <button
//               onClick={() => navigate(`/diagnostic/${userGoal?.id}`)}
//               disabled={!userGoal}
//               className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition disabled:opacity-50"
//             >
//               Start Assessment
//               <ArrowRight className="w-4 h-4" />
//             </button>
//           </div>

//           {/* Section B: Quick Metric Cards Row */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md shadow-slate-200/40 space-y-2 hover:border-slate-300 transition">
//               <div className="flex items-center justify-between">
//                 <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Modules Finished</span>
//                 <div className="p-2 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600">
//                   <BookOpen className="w-4 h-4" />
//                 </div>
//               </div>
//               <p className="text-3xl font-black text-slate-900">{userGoal.completedModules} <span className="text-sm font-medium text-slate-400">/ {userGoal.totalModules}</span></p>
//             </div>

//             <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md shadow-slate-200/40 space-y-2 hover:border-slate-300 transition">
//               <div className="flex items-center justify-between">
//                 <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Daily Pace</span>
//                 <div className="p-2 rounded-xl bg-violet-50 border border-violet-100 text-violet-600">
//                   <TrendingUp className="w-4 h-4" />
//                 </div>
//               </div>
//               <p className="text-3xl font-black text-indigo-600">{userGoal.dailyMinutes} <span className="text-sm font-medium text-slate-400">mins / day</span></p>
//             </div>

//             <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md shadow-slate-200/40 space-y-2 hover:border-slate-300 transition">
//               <div className="flex items-center justify-between">
//                 <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Readiness Score</span>
//                 <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600">
//                   <CheckCircle2 className="w-4 h-4" />
//                 </div>
//               </div>
//               <p className="text-3xl font-black text-emerald-600">74% <span className="text-xs font-medium text-slate-400">(Good)</span></p>
//             </div>
//           </div>

//           {/* Section C: Resume Learning & Upcoming Analytics Slot */}
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
//             {/* Primary Focus Card (Takes up 2 columns) */}
//             <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-200/80 shadow-md shadow-slate-200/40 flex flex-col justify-between space-y-6">
//               <div className="space-y-4">
//                 <div className="flex justify-between items-center">
//                   <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
//                     Up Next Today
//                   </span>
//                   <span className="text-xs text-slate-400 font-medium">Est. {currentModule.estimatedMinutes} mins</span>
//                 </div>
//                 <div className="space-y-2">
//                   <h3 className="text-xl font-bold text-slate-900">{currentModule.title}</h3>
//                   <p className="text-xs text-slate-500 leading-relaxed max-w-xl">{currentModule.description}</p>
//                 </div>
//               </div>
              
//               <button
//                 onClick={() => alert('Launching study session...')}
//                 className="inline-flex items-center justify-center space-x-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-2xl shadow-md shadow-indigo-200 transition-all cursor-pointer w-fit"
//               >
//                 <span>Start Study Session</span>
//                 <ArrowRight className="w-4 h-4" />
//               </button>
//             </div>

//             {/* Placeholder Card for Future Charts / Analytics */}
//             <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-md shadow-slate-200/40 flex flex-col justify-between space-y-4">
//               <div className="flex items-center justify-between">
//                 <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Activity Analytics</span>
//                 <BarChart3 className="w-4 h-4 text-slate-400" />
//               </div>
//               <div className="flex flex-col items-center justify-center py-6 border border-dashed border-slate-200 rounded-2xl text-center space-y-2 bg-slate-50/50">
//                 <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 shadow-2xs">
//                   <BarChart3 className="w-5 h-5" />
//                 </div>
//                 <p className="text-xs text-slate-500 font-medium px-4">Interactive study charts & breakdown coming soon.</p>
//               </div>
//             </div>

//           </div>

//         </div>

//       </main>
//     </div>
//   );
// }


import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import {
  LayoutDashboard,
  Target,
  LogOut,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  Clock3,
  Sparkles,
  BarChart3,
  ClipboardCheck,
} from 'lucide-react';
import { apiFetch } from '../lib/api';
import { clearToken } from '../lib/token';

// Learning goal response type.
type LearningGoal = {
  id: number;
  targetDate: string;
  dailyStudyMinutes: number;
  status: string;
  subject: {
    id: number;
    name: string;
    description: string;
  };
};

// Goals API response type.
type GoalsResponse = {
  message: string;
  goals: LearningGoal[];
};

// Diagnostic result response type.
type DiagnosticResultResponse = {
  result: {
    id: number;
    correctCount: number;
    totalQuestions: number;
    overallScore: number;
    knowledgeLevel: string;
    completedAt: string;
  } | null;
};

export default function DashboardPage() {
  // Initialize navigation.
  const navigate = useNavigate();

  // Fetch the user's learning goals.
  const {
    data: goalsData,
    isLoading: goalsLoading,
    isError: goalsError,
  } = useQuery({
    queryKey: ['goals'],
    queryFn: () => apiFetch<GoalsResponse>('/api/goals'),
  });

  // Get the active learning goal.
  const userGoal = goalsData?.goals.find(
    (goal) => goal.status === 'ACTIVE'
  );

  // Fetch the latest diagnostic result for the active goal.
  const {
    data: diagnosticData,
    isLoading: diagnosticLoading,
    isError: diagnosticError,
  } = useQuery({
    queryKey: ['diagnostic-result', userGoal?.id],
    queryFn: () =>
      apiFetch<DiagnosticResultResponse>(
        `/api/diagnostic/result/${userGoal!.id}`
      ),
    enabled: !!userGoal,
  });

  // Get the completed diagnostic result.
  const diagnosticResult = diagnosticData?.result;

  // Handle user logout.
  function handleLogout() {
    clearToken();
    navigate('/login', { replace: true });
  }

  // Display the loading state.
  if (goalsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-sm font-medium text-slate-500">
          Loading dashboard...
        </p>
      </div>
    );
  }

  // Display the goals API error state.
  if (goalsError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-3">
          <p className="text-sm font-semibold text-rose-600">
            Failed to load your learning goals.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="text-sm font-semibold text-indigo-600"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100/70 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50/50 via-slate-100/50 to-slate-200/50 flex">

      {/* Sidebar navigation */}
      <aside className="w-68 bg-white border-r border-slate-200/80 hidden md:flex flex-col justify-between p-6 shadow-sm">

        <div className="space-y-8">

          {/* Brand */}
          <div className="flex items-center space-x-3 px-2">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md shadow-indigo-200">
              S
            </div>

            <div>
              <span className="text-base font-bold tracking-tight text-slate-900 block">
                StudyPilot
              </span>
              <span className="text-[10px] text-indigo-600 font-semibold tracking-wider uppercase">
                Command Center
              </span>
            </div>
          </div>

          {/* Navigation links */}
          <nav className="space-y-1.5">
            <button
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs font-semibold bg-indigo-50 text-indigo-600 border border-indigo-100"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => navigate('/goals/new')}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all"
            >
              <Target className="w-4 h-4" />
              <span>Goal Settings</span>
            </button>
          </nav>
        </div>

        {/* Sidebar footer */}
        <div className="pt-6 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-100 rounded-xl transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">

        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-8 py-5 flex justify-between items-center sticky top-0 z-20">

          <div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">
              Dashboard
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Your personal learning command center.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-xs font-semibold text-slate-500">
              StudyPilot
            </span>
          </div>
        </header>

        {/* Dashboard content */}
        <div className="p-5 md:p-8 max-w-6xl w-full mx-auto space-y-8">

          {/* No active goal state */}
          {!userGoal ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                <Target className="w-7 h-7" />
              </div>

              <h2 className="text-xl font-bold text-slate-900">
                Start Your Learning Journey
              </h2>

              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Create your first learning goal to get a personalized learning roadmap.
              </p>

              <button
                onClick={() => navigate('/goals/new')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition"
              >
                Create Learning Goal
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              {/* Active learning goal banner */}
              <section className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 rounded-3xl p-8 text-white shadow-xl shadow-indigo-200/50">

                <div className="relative z-10 space-y-4 max-w-2xl">

                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/15 rounded-full text-[11px] font-semibold tracking-wider uppercase border border-white/20">
                    <Sparkles className="w-3 h-3" />
                    Active Learning Goal
                  </div>

                  <h2 className="text-2xl md:text-3xl font-black tracking-tight">
                    {userGoal.subject.name}
                  </h2>

                  <p className="text-sm text-indigo-100 leading-relaxed">
                    {userGoal.subject.description}
                  </p>

                  <div className="flex flex-wrap gap-5 pt-2">

                    <div className="flex items-center gap-2 text-sm text-indigo-100">
                      <Clock3 className="w-4 h-4" />
                      {userGoal.dailyStudyMinutes} minutes/day
                    </div>

                    <div className="flex items-center gap-2 text-sm text-indigo-100">
                      <Target className="w-4 h-4" />
                      Target: {new Date(userGoal.targetDate).toLocaleDateString()}
                    </div>

                  </div>
                </div>
              </section>

              {/* Diagnostic assessment section */}
              <section className="space-y-4">

                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Diagnostic Assessment
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Understand your current knowledge level.
                  </p>
                </div>

                <div className="bg-white p-6 md:p-7 rounded-3xl border border-indigo-100 shadow-md shadow-indigo-100/40 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">

                  <div className="flex items-start gap-4">

                    <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
                      {diagnosticResult ? (
                        <CheckCircle2 className="w-6 h-6" />
                      ) : (
                        <ClipboardCheck className="w-6 h-6" />
                      )}
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        {diagnosticResult
                          ? 'Assessment Completed'
                          : 'Discover Your Knowledge Level'}
                      </h3>

                      <p className="text-sm text-slate-500 mt-1 max-w-lg">
                        {diagnosticResult
                          ? 'Your diagnostic assessment has been completed successfully.'
                          : 'Evaluate your current knowledge and prepare for a personalized learning plan.'}
                      </p>

                      <p className="text-xs text-slate-400 mt-3">
                        30 Questions · 15 Topics · Approximately 15–20 Minutes
                      </p>
                    </div>

                  </div>

                  {diagnosticLoading ? (
                    <span className="text-xs text-slate-500">
                      Loading result...
                    </span>
                  ) : diagnosticError ? (
                    <span className="text-xs text-rose-500">
                      Unable to load assessment result.
                    </span>
                  ) : diagnosticResult ? (
                    <div className="text-left md:text-right shrink-0">
                      <p className="text-3xl font-black text-emerald-600">
                        {diagnosticResult.overallScore}%
                      </p>
                      <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                        {diagnosticResult.knowledgeLevel}
                      </p>
                    </div>
                  ) : (
                    <button
                      onClick={() => navigate(`/diagnostic/${userGoal.id}`)}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition shrink-0"
                    >
                      Start Assessment
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}

                </div>
              </section>

              {/* Learning overview */}
              <section className="space-y-4">

                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Learning Overview
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    A quick look at your learning progress.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                  {/* Daily study target */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Daily Study Target
                      </span>

                      <div className="p-2 rounded-xl bg-violet-50 text-violet-600">
                        <Clock3 className="w-4 h-4" />
                      </div>
                    </div>

                    <p className="text-3xl font-black text-indigo-600">
                      {userGoal.dailyStudyMinutes}
                      <span className="text-sm font-medium text-slate-400 ml-2">
                        mins/day
                      </span>
                    </p>
                  </div>

                  {/* Diagnostic score */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Diagnostic Score
                      </span>

                      <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    </div>

                    <p className="text-3xl font-black text-emerald-600">
                      {diagnosticResult
                        ? `${diagnosticResult.overallScore}%`
                        : '--'}
                    </p>

                    <p className="text-xs text-slate-500">
                      {diagnosticResult
                        ? diagnosticResult.knowledgeLevel
                        : 'Assessment not completed'}
                    </p>
                  </div>

                </div>
              </section>

              {/* Learning plan section */}
              <section className="space-y-4">

                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Your Learning Plan
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Your personalized learning journey.
                  </p>
                </div>

                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-5">

                  <div className="w-14 h-14 shrink-0 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <BookOpen className="w-7 h-7" />
                  </div>

                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-base font-bold text-slate-900">
                      {diagnosticResult
                        ? 'Ready for your personalized roadmap?'
                        : 'Complete your diagnostic assessment first'}
                    </h3>

                    <p className="text-sm text-slate-500 mt-1">
                      {diagnosticResult
                        ? 'Your diagnostic results are ready. Your next step is generating a learning plan.'
                        : 'Your assessment results will help determine the right learning path for you.'}
                    </p>
                  </div>

                  <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-4 py-2 rounded-xl shrink-0">
                    Coming Next
                  </span>

                </div>
              </section>

              {/* Activity analytics placeholder */}
              <section className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm space-y-4">

                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      Activity Analytics
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Track your learning consistency and performance.
                    </p>
                  </div>

                  <BarChart3 className="w-5 h-5 text-slate-400" />
                </div>

                <div className="flex flex-col items-center justify-center py-8 border border-dashed border-slate-200 rounded-2xl text-center space-y-2 bg-slate-50/50">
                  <BarChart3 className="w-7 h-7 text-slate-400" />

                  <p className="text-sm font-medium text-slate-600">
                    Your activity analytics will appear here.
                  </p>

                  <p className="text-xs text-slate-400">
                    Complete learning tasks to start tracking your progress.
                  </p>
                </div>

              </section>
            </>
          )}

        </div>
      </main>
    </div>
  );
}
