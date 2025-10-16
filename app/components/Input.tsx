import React from 'react';

export type InputSize = 'sm' | 'md' | 'lg';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
  inputSize?: InputSize;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const sizeStyles: Record<InputSize, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-4 text-base',
  lg: 'h-14 px-5 text-lg',
};

export function Input({
  label,
  error,
  helpText,
  inputSize = 'md',
  leftIcon,
  rightIcon,
  className = '',
  id,
  disabled,
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  const hasError = !!error;

  const baseStyles = 'w-full rounded-lg border bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed [box-shadow:0_2px_4px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] focus:[box-shadow:0_4px_8px_rgba(0,0,0,0.1),0_2px_4px_rgba(0,0,0,0.06)] transform-3d-child';

  const stateStyles = hasError
    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
    : 'border-gray-200 focus:border-orange-500 focus:ring-orange-500 hover:border-gray-300 hover:[transform:perspective(1000px)_translateZ(2px)]';

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {leftIcon}
          </div>
        )}

        <input
          id={inputId}
          disabled={disabled}
          className={`
            ${baseStyles}
            ${stateStyles}
            ${sizeStyles[inputSize]}
            ${leftIcon ? 'pl-10' : ''}
            ${rightIcon ? 'pr-10' : ''}
            ${className}
          `}
          aria-invalid={hasError}
          aria-describedby={
            error ? `${inputId}-error` : helpText ? `${inputId}-help` : undefined
          }
          {...props}
        />

        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {rightIcon}
          </div>
        )}
      </div>

      {error && (
        <p id={`${inputId}-error`} className="mt-2 text-sm text-red-600 flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}

      {helpText && !error && (
        <p id={`${inputId}-help`} className="mt-2 text-sm text-gray-500">
          {helpText}
        </p>
      )}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helpText?: string;
}

export function Textarea({
  label,
  error,
  helpText,
  className = '',
  id,
  disabled,
  ...props
}: TextareaProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  const hasError = !!error;

  const baseStyles = 'w-full rounded-lg border bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed px-4 py-3 [box-shadow:0_2px_4px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] focus:[box-shadow:0_4px_8px_rgba(0,0,0,0.1),0_2px_4px_rgba(0,0,0,0.06)] transform-3d-child';

  const stateStyles = hasError
    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
    : 'border-gray-200 focus:border-orange-500 focus:ring-orange-500 hover:border-gray-300 hover:[transform:perspective(1000px)_translateZ(2px)]';

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <textarea
        id={inputId}
        disabled={disabled}
        className={`${baseStyles} ${stateStyles} ${className}`}
        aria-invalid={hasError}
        aria-describedby={
          error ? `${inputId}-error` : helpText ? `${inputId}-help` : undefined
        }
        {...props}
      />

      {error && (
        <p id={`${inputId}-error`} className="mt-2 text-sm text-red-600 flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}

      {helpText && !error && (
        <p id={`${inputId}-help`} className="mt-2 text-sm text-gray-500">
          {helpText}
        </p>
      )}
    </div>
  );
}
