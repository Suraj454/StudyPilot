import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import { useMutation } from '@tanstack/react-query';
import { apiFetch, ApiError } from '../lib/api';
import { setToken } from '../lib/token';
import { emailSchema, loginPasswordSchema, firstError } from '../lib/validation';
import { AuthLayout } from '../components/AuthLayout';
import { TextField } from '../components/TextField';
import { Button } from '../components/Button';

type LoginBody = { email: string; password: string };
type Field = 'email' | 'password';

type LoginResponse = {
  message: string;
  data: {
    token: string;
    user: { id: number; name: string | null; email: string; createdAt: string };
  };
};

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [touched, setTouched] = useState<Record<Field, boolean>>({
    email: false,
    password: false,
  });

  const login = useMutation({
    mutationFn: (body: LoginBody) =>
      apiFetch<LoginResponse>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    onSuccess: (res) => {
      setToken(res.data.token);
      navigate('/');
    },
  });

  const clientErrors: Record<Field, string | undefined> = {
    email: firstError(emailSchema, email),
    password: firstError(loginPasswordSchema, password),
  };

  const apiError = login.error instanceof ApiError ? login.error : null;
  const serverErrors: Record<string, string> = {};
  apiError?.details?.forEach((d) => {
    serverErrors[d.path] = d.message;
  });

  function touch(field: Field) {
    setTouched((t) => ({ ...t, [field]: true }));
  }

  function showError(field: Field) {
    return (touched[field] ? clientErrors[field] : undefined) ?? serverErrors[field];
  }

  function onChange(setter: (value: string) => void) {
    return (e: ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
      if (login.isError) login.reset();
    };
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (clientErrors.email || clientErrors.password) return;
    login.mutate({ email: email.trim(), password });
  }

  const formError =
    login.error && !apiError
      ? 'Cannot reach the server'
      : apiError && !apiError.details
        ? apiError.message
        : undefined;

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Pick up where you left off"
      panelHeadline="Pick up where you left off"
      panelPoints={[
        'Your study plan and target date',
        'Your quiz scores and weak topics',
        'Your next tasks, ready to go',
      ]}
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <TextField label="Email" name="email" type="email" autoComplete="email" value={email}
          onChange={onChange(setEmail)} onBlur={() => touch('email')} error={showError('email')} />
        <TextField label="Password" name="password" type="password" autoComplete="current-password" value={password}
          onChange={onChange(setPassword)} onBlur={() => touch('password')} error={showError('password')} />

        {formError && <p className="text-sm text-danger">{formError}</p>}

        <Button type="submit" loading={login.isPending}>Log in</Button>
      </form>

      <p className="mt-6 text-sm text-muted">
        New here?{' '}
        <Link to="/register" className="font-medium text-primary hover:underline">Create an account</Link>
      </p>
    </AuthLayout>
  );
}