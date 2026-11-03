// import { useNavigate } from 'react-router';
// import { useQueryClient } from '@tanstack/react-query';
// import { clearToken } from '../lib/token';
// import { useCurrentUser } from '../lib/useCurrentUser';

// export default function DashboardPage() {
//   const navigate = useNavigate();
//   const queryClient = useQueryClient();
//   const { data: user } = useCurrentUser();

//   function handleLogout() {
//     clearToken();
//     queryClient.clear();
//     navigate('/login', { replace: true });
//   }

//   return (
//     <div className="min-h-screen p-8">
//       <div className="mx-auto flex max-w-4xl items-center justify-between rounded-xl border border-line bg-surface p-6 shadow-sm">
//         <div>
//           <h1 className="text-2xl font-bold">StudyPilot Dashboard</h1>
//           <p className="mt-1 text-sm text-muted">Signed in as {user?.email}</p>
//         </div>
//         <button
//           onClick={handleLogout}
//           className="rounded-lg px-4 py-2 text-sm font-medium text-danger transition hover:bg-danger/10"
//         >
//           Logout
//         </button>
//       </div>
//     </div>
//   );
// }

import { useState } from 'react';
import { useNavigate } from 'react-router';
import { clearToken } from '../lib/token';
import { 
  LayoutDashboard, 
  Target, 
  LogOut, 
  Flame, 
  ArrowRight, 
  CheckCircle2, 
  BookOpen, 
  TrendingUp, 
  Sparkles,
  BarChart3
} from 'lucide-react';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Mock data (will be replaced with real backend API data later)
  const userGoal = {
    subject: 'JavaScript & React Interview Prep',
    dailyMinutes: 45,
    targetDate: '2026-12-31',
    progressPercentage: 27,
    completedModules: 4,
    totalModules: 15,
    streakDays: 3,
  };

  const currentModule = {
    title: 'Module 5: Advanced Custom Hooks & Performance Optimization',
    description: 'Learn how to build reusable hooks, memoize values with useMemo, and prevent unnecessary re-renders.',
    estimatedMinutes: 45,
  };

  function handleLogout() {
    clearToken();
    navigate('/login', { replace: true });
  }

  return (
    <div className="min-h-screen bg-slate-100/70 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50/50 via-slate-100/50 to-slate-200/50 flex overflow-hidden">
      
      {/* --- SIDEBAR NAVIGATION (Light Theme) --- */}
      <aside className="w-68 bg-white border-r border-slate-200/80 hidden md:flex flex-col justify-between p-6 shadow-sm">
        <div className="space-y-8">
          {/* Brand Logo / Header */}
          <div className="flex items-center space-x-3 px-2">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md shadow-indigo-200">
              S
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-slate-900 block">StudyPilot</span>
              <span className="text-[10px] text-indigo-600 font-semibold tracking-wider uppercase">Command Center</span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="space-y-1.5">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'dashboard' 
                  ? 'bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-2xs' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => navigate('/goals/new')}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all cursor-pointer"
            >
              <Target className="w-4 h-4" />
              <span>Goal Settings</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer / Logout */}
        <div className="pt-6 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-100 rounded-xl transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto relative">
        
        {/* Top Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-8 py-5 flex justify-between items-center sticky top-0 z-20 shadow-2xs">
          <div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">Overview & Activity</h1>
            <p className="text-xs text-slate-500 mt-0.5">Track your milestones and active study sprints.</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 px-3.5 py-1.5 bg-amber-50 border border-amber-200 text-amber-700 rounded-full text-xs font-semibold shadow-2xs">
              <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{userGoal.streakDays} Day Streak</span>
            </div>
          </div>
        </header>

        {/* Dashboard Body Grid */}
        <div className="p-8 max-w-6xl w-full mx-auto space-y-8">
          
          {/* Section A: Goal Progress Banner (Light Gradient Card) */}
          <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 rounded-3xl p-8 text-white shadow-xl shadow-indigo-200/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-3 max-w-xl relative z-10">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-[11px] font-semibold tracking-wider uppercase border border-white/20">
                <Sparkles className="w-3 h-3 text-indigo-200" />
                <span>Active Track</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight">{userGoal.subject}</h2>
              <p className="text-xs text-indigo-100 font-medium leading-relaxed">
                Pacing for <strong className="text-white font-bold">{userGoal.dailyMinutes} mins/day</strong> targeting completion by {userGoal.targetDate}.
              </p>
            </div>
            
            <div className="relative z-10 bg-white/15 backdrop-blur-xl px-6 py-4 rounded-2xl border border-white/25 text-center shrink-0 shadow-lg">
              <span className="block text-3xl font-black">{userGoal.progressPercentage}%</span>
              <span className="text-[11px] text-indigo-100 font-semibold uppercase tracking-wider">Completed</span>
            </div>
          </div>

          {/* Section B: Quick Metric Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md shadow-slate-200/40 space-y-2 hover:border-slate-300 transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Modules Finished</span>
                <div className="p-2 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600">
                  <BookOpen className="w-4 h-4" />
                </div>
              </div>
              <p className="text-3xl font-black text-slate-900">{userGoal.completedModules} <span className="text-sm font-medium text-slate-400">/ {userGoal.totalModules}</span></p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md shadow-slate-200/40 space-y-2 hover:border-slate-300 transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Daily Pace</span>
                <div className="p-2 rounded-xl bg-violet-50 border border-violet-100 text-violet-600">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <p className="text-3xl font-black text-indigo-600">{userGoal.dailyMinutes} <span className="text-sm font-medium text-slate-400">mins / day</span></p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md shadow-slate-200/40 space-y-2 hover:border-slate-300 transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Readiness Score</span>
                <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <p className="text-3xl font-black text-emerald-600">74% <span className="text-xs font-medium text-slate-400">(Good)</span></p>
            </div>
          </div>

          {/* Section C: Resume Learning & Upcoming Analytics Slot */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Primary Focus Card (Takes up 2 columns) */}
            <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-200/80 shadow-md shadow-slate-200/40 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                    Up Next Today
                  </span>
                  <span className="text-xs text-slate-400 font-medium">Est. {currentModule.estimatedMinutes} mins</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-900">{currentModule.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-xl">{currentModule.description}</p>
                </div>
              </div>
              
              <button
                onClick={() => alert('Launching study session...')}
                className="inline-flex items-center justify-center space-x-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-2xl shadow-md shadow-indigo-200 transition-all cursor-pointer w-fit"
              >
                <span>Start Study Session</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Placeholder Card for Future Charts / Analytics */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-md shadow-slate-200/40 flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Activity Analytics</span>
                <BarChart3 className="w-4 h-4 text-slate-400" />
              </div>
              <div className="flex flex-col items-center justify-center py-6 border border-dashed border-slate-200 rounded-2xl text-center space-y-2 bg-slate-50/50">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 shadow-2xs">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <p className="text-xs text-slate-500 font-medium px-4">Interactive study charts & breakdown coming soon.</p>
              </div>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}
