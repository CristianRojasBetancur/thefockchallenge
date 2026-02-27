import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthLayout } from '../components/layout/AuthLayout'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { useAuth } from '../hooks/useAuth'
import { ApiRequestError } from '../api/client'
import { textClasses } from '../styles/classes'
import type { ApiError } from '../types/auth'

export function LoginPage() {
    const { login } = useAuth()
    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [globalError, setGlobalError] = useState<string | null>(null)

    async function handleSubmit(e: FormEvent) {
        e.preventDefault()
        setGlobalError(null)
        setIsLoading(true)

        try {
            await login({ email, password })
            navigate('/home', { replace: true })
        } catch (err) {
            if (err instanceof ApiRequestError) {
                const body = err.body as ApiError
                if (body.errors && body.errors.length > 0) {
                    setGlobalError(body.errors[0].message)
                } else {
                    setGlobalError(body.error ?? 'Something went wrong. Please try again.')
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
            <h1 className={textClasses.heading}>Sign in to X</h1>
            <p className={`${textClasses.muted} mt-2 mb-8`}>
                Enter your email and password to continue.
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
                    label="Email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <Input
                    label="Password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <Button
                    type="submit"
                    variant="primary"
                    isLoading={isLoading}
                    className="mt-2"
                >
                    Sign in
                </Button>
            </form>

            <p className={`${textClasses.muted} text-center mt-8`}>
                Don't have an account?{' '}
                <Link to="/register" className={textClasses.link}>
                    Sign up
                </Link>
            </p>
        </AuthLayout>
    )
}
