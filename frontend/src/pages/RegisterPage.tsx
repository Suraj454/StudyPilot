import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Link } from 'react-router';
import { useMutation } from '@tanstack/react-query';
import { apiFetch, ApiError } from '../lib/api';
import { emailSchema, newPasswordSchema, nameSchema, firstError } from '../lib/validation';
import { AuthLayout } from '../components/AuthLayout';
import { TextField } from '../components/TextField';
import { Button } from '../components/Button';

type RegisterBody = { name?: string; email: string; password: string };
type Field = 'name' | 'email' | 'password';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [touched, setTouched] = useState<Record<Field, boolean>>({
        name: false,
        email: false,
        password: false,
    });

    const register = useMutation({
        mutationFn: (body: RegisterBody) =>
            apiFetch('/api/auth/register', {
                method: 'POST',
                body: JSON.stringify(body),
            }),

        onSuccess: () => {
            setName('');
            setEmail('');
            setPassword('');
            setTouched({
                name: false,
                email: false,
                password: false,
            });
        },
    });

    const clientErrors: Record<Field, string | undefined> = {
        name: firstError(nameSchema, name),
        email: firstError(emailSchema, email),
        password: firstError(newPasswordSchema, password),
    };

    const apiError = register.error instanceof ApiError ? register.error : null;
    const serverErrors: Record<string, string> = {};
    apiError?.details?.forEach((d) => {
        serverErrors[d.path] = d.message;
    });
    if (apiError?.status === 409) serverErrors.email = apiError.message;

    function touch(field: Field) {
        setTouched((t) => ({ ...t, [field]: true }));
    }

    function showError(field: Field) {
        return (touched[field] ? clientErrors[field] : undefined) ?? serverErrors[field];
    }

    function onChange(setter: (value: string) => void) {
        return (e: ChangeEvent<HTMLInputElement>) => {
            setter(e.target.value);
            if (register.isError) register.reset();
        };
    }

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setTouched({ name: true, email: true, password: true });
        if (clientErrors.name || clientErrors.email || clientErrors.password) return;
        register.mutate({ name: name.trim() || undefined, email: email.trim(), password });
    }

    const formError =
        register.error && !apiError
            ? 'Cannot reach the server'
            : apiError && !apiError.details && apiError.status !== 409
                ? apiError.message
                : undefined;

    return (
        <AuthLayout title="Create your account" subtitle="Start your personalized study plan">
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <TextField label="Name (optional)" name="name" value={name}
                    onChange={onChange(setName)} onBlur={() => touch('name')} error={showError('name')} />
                <TextField label="Email" name="email" type="email" autoComplete="email" value={email}
                    onChange={onChange(setEmail)} onBlur={() => touch('email')} error={showError('email')} />
                <TextField label="Password" name="password" type="password" autoComplete="new-password" value={password}
                    onChange={onChange(setPassword)} onBlur={() => touch('password')} error={showError('password')} />

                {formError && <p className="text-sm text-danger">{formError}</p>}

                <Button type="submit" loading={register.isPending}>Create account</Button>
            </form>

            {register.isSuccess && (
                <p className="mt-4 text-success">Account created. You can log in now.</p>
            )}

            <p className="mt-6 text-sm text-muted">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-primary hover:underline">Log in</Link>
            </p>
        </AuthLayout>
    );
}