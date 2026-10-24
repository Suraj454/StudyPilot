import type { InputHTMLAttributes } from 'react';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export function TextField({ label, error, id, ...rest }: Props) {
  const inputId = id ?? rest.name ?? label;
  return (
    <div>
      <label htmlFor={inputId} className="mb-1 block text-sm font-medium">
        {label}
      </label>
      <input
        id={inputId}
        aria-invalid={!!error}
        className={`w-full rounded-lg border bg-surface px-3 py-2 outline-none focus:ring-2 focus:ring-primary ${
          error ? 'border-danger' : 'border-line'
        }`}
        {...rest}
      />
      {error && <p className="mt-1 text-sm text-danger">{error}</p>}
    </div>
  );
}