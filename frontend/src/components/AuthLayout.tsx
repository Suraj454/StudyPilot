import type { ReactNode } from 'react';

type Props = {
  title: string;
  subtitle?: string;
  panelHeadline?: string;
  panelPoints?: string[];
  children: ReactNode;
};

const defaultPoints = [
  'Discover your strengths and knowledge gaps',
  'Get a personalized plan for your target date',
  'Practice with quizzes and track your progress',
];

export function AuthLayout({
  title,
  subtitle,
  panelHeadline = 'A personalized learning planner for IT developers',
  panelPoints = defaultPoints,
  children,
}: Props) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <aside className="hidden flex-col justify-center bg-primary p-12 text-white lg:flex">
        <h1 className="text-4xl font-bold">StudyPilot</h1>
        <p className="mt-2 text-lg opacity-90">{panelHeadline}</p>
        <ul className="mt-8 space-y-3">
          {panelPoints.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </aside>

      <main className="flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <h2 className="text-2xl font-bold">{title}</h2>
          {subtitle && <p className="mt-1 text-muted">{subtitle}</p>}
          <div className="mt-6">{children}</div>
        </div>
      </main>
    </div>
  );
}