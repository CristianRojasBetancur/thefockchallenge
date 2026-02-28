import { useState, type FormEvent } from 'react'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { useAuth } from '../hooks/useAuth'
import { ApiRequestError } from '../api/client'
import { textClasses } from '../styles/classes'
import type { ApiError } from '../types/auth'

export function AuthModal({ onClose }: { onClose: () => void }) {
    const { login, register } = useAuth()
    const [mode, setMode] = useState<'login' | 'register'>('login')

    // Form fields
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')
    const [name, setName] = useState('')
    const [dateOfBirth, setDateOfBirth] = useState('')
    const [passwordConfirmation, setPasswordConfirmation] = useState('')

    const [isLoading, setIsLoading] = useState(false)
    const [globalError, setGlobalError] = useState<string | null>(null)

    async function handleSubmit(e: FormEvent) {
        e.preventDefault()
        setGlobalError(null)
        setIsLoading(true)

        try {
            if (mode === 'login') {
                await login({ email, password })
            } else {
                if (password !== passwordConfirmation) {
                    setGlobalError('Passwords do not match')
                    setIsLoading(false)
                    return
                }
                await register({
                    email,
                    password,
                    username,
                    name: name || undefined,
                    password_confirmation: passwordConfirmation,
                    date_of_birth: dateOfBirth || undefined
                })
            }
            onClose() // the hook sets the user, App will re-render
            window.location.reload() // Or reload to force fresh state
        } catch (err) {
            if (err instanceof ApiRequestError) {
                const body = err.body as ApiError
                if (body.errors && body.errors.length > 0) {
                    setGlobalError(body.errors[0].message)
                } else {
                    setGlobalError(body.error ?? 'Something went wrong.')
                }
            } else {
                setGlobalError('A network error occurred.')
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#5b7083]/40" onClick={onClose}>
            <div
                className="bg-black w-full h-full sm:max-w-[600px] sm:h-auto sm:min-h-[400px] sm:rounded-2xl flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-y-auto"
                onClick={e => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 left-4 w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/[0.1] transition-colors"
                >
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5 fill-white">
                        <g><path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"></path></g>
                    </svg>
                </button>
                {/* Twitter Logo */}
                <svg viewBox="0 0 24 24" aria-hidden="true" className="w-10 h-10 fill-white mb-6">
                    <g><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.008 5.96H5.078z"></path></g>
                </svg>

                <div className="w-full max-w-sm">
                    <h1 className={`${textClasses.heading} mb-6`}>
                        {mode === 'login' ? 'Sign in to X' : 'Join X today'}
                    </h1>

                    {globalError && (
                        <div className="rounded-lg border border-[#f4212e]/40 bg-[#f4212e]/10 px-4 py-3 text-[#f4212e] text-[15px] mb-6">
                            {globalError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} noValidate>
                        {mode === 'register' && (
                            <>
                                <Input label="Name" value={name} onChange={e => setName(e.target.value)} required />
                                <Input label="Username" value={username} onChange={e => setUsername(e.target.value)} required />
                            </>
                        )}
                        <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />

                        {mode === 'register' && (
                            <Input label="Date of birth" type="date" value={dateOfBirth} onChange={e => setDateOfBirth(e.target.value)} />
                        )}

                        <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />

                        {mode === 'register' && (
                            <Input label="Confirm password" type="password" value={passwordConfirmation} onChange={e => setPasswordConfirmation(e.target.value)} required />
                        )}

                        <Button type="submit" variant="primary" isLoading={isLoading} className="mt-4">
                            {mode === 'login' ? 'Sign in' : 'Sign up'}
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-[15px] text-[#71767b]">
                        {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
                        <button
                            type="button"
                            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                            className="text-[#1d9bf0] hover:underline"
                        >
                            {mode === 'login' ? 'Sign up' : 'Sign in'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
