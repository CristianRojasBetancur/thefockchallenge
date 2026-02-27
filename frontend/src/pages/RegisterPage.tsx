import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthLayout } from '../components/layout/AuthLayout'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { useAuth } from '../hooks/useAuth'
import { ApiRequestError } from '../api/client'
import { textClasses, dividerClasses } from '../styles/classes'
import type { ApiError } from '../types/auth'

interface FieldErrors {
    email?: string
    username?: string
    password?: string
    password_confirmation?: string
}

export function RegisterPage() {
    const { register } = useAuth()
    const navigate = useNavigate()

    const [name, setName] = useState('')
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [dateOfBirth, setDateOfBirth] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirmation, setPasswordConfirmation] = useState('')

    const [isLoading, setIsLoading] = useState(false)
    const [globalError, setGlobalError] = useState<string | null>(null)
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

    async function handleSubmit(e: FormEvent) {
        e.preventDefault()
        setGlobalError(null)
        setFieldErrors({})

        if (password !== passwordConfirmation) {
            setFieldErrors({ password_confirmation: 'Passwords do not match' })
            return
        }

        setIsLoading(true)

        try {
            await register({
                name: name || undefined,
                username,
                email,
                password,
                password_confirmation: passwordConfirmation,
                date_of_birth: dateOfBirth || undefined,
            })
            navigate('/home', { replace: true })
        } catch (err) {
            if (err instanceof ApiRequestError) {
                const body = err.body as ApiError
                if (body.errors && body.errors.length > 0) {
                    const firstError = body.errors[0].message
                    const parsed: FieldErrors = {}

                    if (/email/i.test(firstError)) { parsed.email = firstError }
                    else if (/username/i.test(firstError)) { parsed.username = firstError }
                    else if (/password/i.test(firstError)) { parsed.password = firstError }
                    else { setGlobalError(firstError) }

                    setFieldErrors(parsed)
                } else {
                    setGlobalError(body.error ?? 'Registration failed. Please try again.')
                }
            } else {
                setGlobalError('A network error occurred. Please check your connection.')
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <AuthLayout>
            <h1 className={textClasses.heading}>Create your account</h1>
            <p className={`${textClasses.muted} mt-2 mb-8`}>
                Join X today — it's free.
            </p>

            {globalError && (
                <div
                    role="alert"
                    className="rounded-lg border border-[#f4212e]/40 bg-[#f4212e]/10 px-4 py-3 text-[#f4212e] text-[15px] mb-6"
                >
                    {globalError}
                </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
                <Input
                    label="Name"
                    type="text"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <Input
                    label="Username"
                    type="text"
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    error={fieldErrors.username}
                    required
                />
                <Input
                    label="Email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={fieldErrors.email}
                    required
                />
                <Input
                    label="Date of birth"
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                />

                <div className={dividerClasses.wrapper}>
                    <div className={dividerClasses.line} />
                    <span className={dividerClasses.text}>Password</span>
                    <div className={dividerClasses.line} />
                </div>

                <Input
                    label="Password"
                    type="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={fieldErrors.password}
                    required
                />
                <Input
                    label="Confirm password"
                    type="password"
                    autoComplete="new-password"
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    error={fieldErrors.password_confirmation}
                    required
                />

                <Button
                    type="submit"
                    variant="primary"
                    isLoading={isLoading}
                    className="mt-2"
                >
                    Create account
                </Button>
            </form>

            <p className={`${textClasses.muted} text-center mt-8`}>
                Already have an account?{' '}
                <Link to="/login" className={textClasses.link}>
                    Sign in
                </Link>
            </p>
        </AuthLayout>
    )
}
