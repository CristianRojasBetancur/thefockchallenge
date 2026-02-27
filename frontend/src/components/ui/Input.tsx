import { forwardRef, type InputHTMLAttributes } from 'react'
import { inputClasses, textClasses } from '../../styles/classes'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string
    error?: string
}

/**
 * Floating-label input matching X's design.
 * Uses the CSS `peer` trick so the label floats up when the input has content.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, id, className = '', ...props }, ref) => {
        const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-')

        return (
            <div className={inputClasses.wrapper}>
                <input
                    ref={ref}
                    id={inputId}
                    placeholder={label}
                    aria-label={label}
                    aria-describedby={error ? `${inputId}-error` : undefined}
                    aria-invalid={!!error}
                    className={`${inputClasses.field} ${error ? 'border-[#f4212e] focus:border-[#f4212e] focus:ring-[#f4212e]' : ''} ${className}`}
                    {...props}
                />
                <label htmlFor={inputId} className={inputClasses.label}>
                    {label}
                </label>
                {error && (
                    <p id={`${inputId}-error`} className={textClasses.error} role="alert">
                        {error}
                    </p>
                )}
            </div>
        )
    },
)

Input.displayName = 'Input'
