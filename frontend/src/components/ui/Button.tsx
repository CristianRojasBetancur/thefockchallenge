import { type ButtonHTMLAttributes } from 'react'
import { buttonClasses } from '../../styles/classes'

type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'danger'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant
    isLoading?: boolean
}

export function Button({
    variant = 'primary',
    isLoading = false,
    disabled,
    children,
    className = '',
    ...props
}: ButtonProps) {
    return (
        <button
            {...props}
            disabled={disabled ?? isLoading}
            className={`${buttonClasses[variant]} ${className}`}
        >
            {isLoading ? (
                <span className="flex items-center gap-2">
                    <svg
                        className="animate-spin h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <circle
                            className="opacity-25"
                            cx="12" cy="12" r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8H4z"
                        />
                    </svg>
                    Loading…
                </span>
            ) : children}
        </button>
    )
}
