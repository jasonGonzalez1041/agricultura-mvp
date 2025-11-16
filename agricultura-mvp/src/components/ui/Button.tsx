import React from 'react';
import { clsx } from 'clsx';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-95",
  {
    variants: {
      variant: {
        primary: "bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500",
        secondary: "bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 focus:ring-primary-500",
        success: "bg-success-600 hover:bg-success-700 text-white focus:ring-success-500",
        warning: "bg-warning-500 hover:bg-warning-600 text-white focus:ring-warning-500",
        error: "bg-error-500 hover:bg-error-600 text-white focus:ring-error-500",
        ghost: "hover:bg-gray-100 text-gray-700 focus:ring-primary-500",
        link: "text-primary-600 hover:text-primary-700 underline-offset-4 hover:underline focus:ring-primary-500"
      },
      size: {
        sm: "text-sm px-3 py-2 rounded-md",
        md: "text-base px-4 py-3 rounded-lg",
        lg: "text-lg px-6 py-4 rounded-lg",
        xl: "text-xl px-8 py-5 rounded-xl"
      },
      fullWidth: {
        true: "w-full",
        false: ""
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      fullWidth: false
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    fullWidth, 
    children, 
    loading = false,
    leftIcon,
    rightIcon,
    disabled,
    ...props 
  }, ref) => {
    return (
      <button
        className={clsx(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
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
        )}
        {!loading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {!loading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";