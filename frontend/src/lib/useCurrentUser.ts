import { useQuery } from '@tanstack/react-query';
import { apiFetch, ApiError } from './api';
import { getToken, clearToken } from './token';

type User = { id: number; name: string | null; email: string; createdAt: string };

export function useCurrentUser() {
  return useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      try {
        const res = await apiFetch<{ data: User }>('/api/auth/me');
        return res.data;
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) clearToken();
        throw error;
      }
    },
    enabled: !!getToken(),
    retry: false,
  });
}