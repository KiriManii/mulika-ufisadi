import React, { forwardRef } from 'react';

export interface InputProps {
  label?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'date' | 'tel';
  placeholder?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  icon?: React.ReactNode;
  className?: string;
  name?: string;
  id?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      type = 'text',
      placeholder,
      value,
      onChange,
      error,
      disabled = false,
      required = false,
      icon,
      className = '',
      name,
      id,
    },
    ref
  ) => {
    const inputId = id || name || `input-${Math.random().toString(36).substr(2, 9)}`;

    const baseClasses =
      'w-full rounded-lg px-4 py-2 font-primary text-base transition-all duration-200 focus:outline-none';

    const stateClasses = error
      ? 'border-2 border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
      : 'border border-neutral-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-100';

    const disabledClasses = disabled
      ? 'bg-neutral-100 cursor-not-allowed text-neutral-500'
      : 'bg-white text-neutral-900';

    const iconPadding = icon ? 'pl-11' : '';

    const combinedClasses = `${baseClasses} ${stateClasses} ${disabledClasses} ${iconPadding} ${className}`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block mb-2 text-sm font-medium text-neutral-700 font-primary"
          >
            {label}
            {required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
          </label>
        )}

        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none">
              {icon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            className={combinedClasses}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${inputId}-error` : undefined}
          />
        </div>

        {error && (
          <p
            id={`${inputId}-error`}
            className="mt-1.5 text-sm text-red-500 font-primary"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
