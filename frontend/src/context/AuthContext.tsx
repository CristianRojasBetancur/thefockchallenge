import {
    createContext,
    useCallback,
    useEffect,
    useState,
    type ReactNode,
} from 'react'
import { login as apiLogin, logout as apiLogout, register as apiRegister, getProfile } from '../api/auth'
import { ApiRequestError } from '../api/client'
import type { AuthResponse, LoginCredentials, RegisterCredentials, User } from '../types/auth'

interface AuthContextValue {
    user: User | null
    isLoading: boolean
    login: (credentials: LoginCredentials) => Promise<AuthResponse>
    register: (credentials: RegisterCredentials) => Promise<AuthResponse>
    logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        let cancelled = false

        getProfile()
            .then((profile) => {
                if (!cancelled) setUser(profile)
            })
            .catch((err) => {
                if (err instanceof ApiRequestError && err.status === 401) return
                console.error('[AuthContext] Unexpected error rehydrating session:', err)
            })
            .finally(() => {
                if (!cancelled) setIsLoading(false)
            })

        return () => { cancelled = true }
    }, [])

    const login = useCallback(async (credentials: LoginCredentials): Promise<AuthResponse> => {
        const profile = await apiLogin(credentials)
        setUser(profile)
        return profile
    }, [])

    const register = useCallback(async (credentials: RegisterCredentials): Promise<AuthResponse> => {
        const profile = await apiRegister(credentials)
        setUser(profile)
        return profile
    }, [])

    const logout = useCallback(async (): Promise<void> => {
        await apiLogout()
        setUser(null)
    }, [])

    const value: AuthContextValue = { user, isLoading, login, register, logout }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export { AuthContext }
