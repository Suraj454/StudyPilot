import type { ReactNode } from 'react';
import { Sparkles, Target, TrendingUp } from 'lucide-react';

export type PanelPoint = {
  icon: ReactNode;
  text: string;
};

type Props = {
  title: string;
  subtitle?: string;
  panelHeadline?: string;
  panelPoints?: PanelPoint[];
  children: ReactNode;
};

const defaultPoints: PanelPoint[] = [
  {
    icon: <Sparkles className="w-5 h-5 text-primary" />,
    text: 'Comprehensive structured modules tailored for engineers',
  },
  {
    icon: <Target className="w-5 h-5 text-primary" />,
    text: 'Diagnostic quizzes to target your exact knowledge gaps',
  },
  {
    icon: <TrendingUp className="w-5 h-5 text-primary" />,
    text: 'Real-time progress tracking to stay interview-ready',
  },
];

export function AuthLayout({
  title,
  subtitle,
  panelHeadline = 'Your AI-powered roadmap to engineering excellence',
  panelPoints = defaultPoints,
  children,
}: Props) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2 bg-page text-ink">
      {/* Left Panel: Fully filled uniform primary tint */}
      <aside className="hidden flex-col justify-center bg-primary/[0.06] p-12 lg:flex border-r border-line relative overflow-hidden">
        
        {/* Soft atmospheric ambient glow accents */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-md">
          <div className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-primary uppercase bg-surface border border-primary/20 rounded-full shadow-sm">
            Developer Learning Platform
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-ink">StudyPilot</h1>
          <p className="mt-3 text-lg text-muted leading-relaxed">{panelHeadline}</p>
          
          <ul className="mt-8 space-y-4">
            {panelPoints.map((point, index) => (
              <li 
                key={index}
                className="flex items-center gap-3.5 p-4 rounded-xl bg-surface border border-line shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
              >
                <div className="flex-shrink-0">{point.icon}</div>
                <span className="text-sm font-medium text-ink">{point.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Right Panel: Clean soft page background with elevated white card */}
      <main className="flex items-center justify-center p-6 bg-page">
        <div className="w-full max-w-md p-8 rounded-2xl bg-surface border border-line shadow-xl">
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-ink">{title}</h2>
            {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
          </div>
          <div>{children}</div>
        </div>
      </main>
    </div>
  );
}