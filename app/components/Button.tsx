import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'ghost' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white disabled:from-gray-300 disabled:to-gray-400',
  secondary: 'bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 disabled:bg-gray-100 disabled:text-gray-400',
  success: 'bg-green-500 hover:bg-green-600 text-white disabled:bg-gray-300',
  danger: 'bg-red-500 hover:bg-red-600 text-white disabled:bg-gray-300',
  ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 disabled:text-gray-400',
  outline: 'bg-transparent border-2 border-orange-500 hover:bg-orange-50 text-orange-600 disabled:border-gray-300 disabled:text-gray-400',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-6 text-base',
  lg: 'h-14 px-8 text-lg',
};

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  className = '',
  children,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 hover-pop-3d press-3d';

  // Get appropriate 3D shadow based on variant
  const get3DShadow = () => {
    if (variant === 'ghost') return '';
    if (variant === 'primary' || variant === 'success' || variant === 'danger') {
      return '[box-shadow:0_4px_8px_rgba(0,0,0,0.12),0_8px_16px_rgba(0,0,0,0.08)] hover:[box-shadow:0_8px_16px_rgba(0,0,0,0.15),0_16px_32px_rgba(0,0,0,0.1)]';
    }
    return '[box-shadow:0_2px_4px_rgba(0,0,0,0.1),0_4px_8px_rgba(0,0,0,0.05)] hover:[box-shadow:0_4px_8px_rgba(0,0,0,0.12),0_8px_16px_rgba(0,0,0,0.08)]';
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${get3DShadow()} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Loading...</span>
        </>
      ) : (
        <>
          {leftIcon && <span className="inline-flex">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="inline-flex">{rightIcon}</span>}
        </>
      )}
    </button>
  );
}
