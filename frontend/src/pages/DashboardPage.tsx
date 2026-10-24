import { useNavigate } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import { clearToken } from '../lib/token';
import { useCurrentUser } from '../lib/useCurrentUser';

export default function DashboardPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: user } = useCurrentUser();

  function handleLogout() {
    clearToken();
    queryClient.clear();
    navigate('/login', { replace: true });
  }

  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto flex max-w-4xl items-center justify-between rounded-xl border border-line bg-surface p-6 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold">StudyPilot Dashboard</h1>
          <p className="mt-1 text-sm text-muted">Signed in as {user?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="rounded-lg px-4 py-2 text-sm font-medium text-danger transition hover:bg-danger/10"
        >
          Logout
        </button>
      </div>
    </div>
  );
}