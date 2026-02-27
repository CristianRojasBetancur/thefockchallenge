import { apiRequest } from './client'
import type { AuthResponse, LoginCredentials, RegisterCredentials } from '../types/auth'

/** POST /auth/login — Rails writes the JWT cookie on success */
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
    return apiRequest<AuthResponse>('POST', '/auth/login', { session: credentials })
}

/** POST /auth/register — Creates user and immediately sets the JWT cookie */
export async function register(credentials: RegisterCredentials): Promise<AuthResponse> {
    return apiRequest<AuthResponse>('POST', '/auth/register', { user: credentials })
}

/** DELETE /auth/logout — Rails deletes the JWT cookie */
export async function logout(): Promise<void> {
    await apiRequest<void>('DELETE', '/auth/logout')
}

/** GET /api/v1/profile — Returns the current user from the active cookie */
export async function getProfile(): Promise<AuthResponse> {
    return apiRequest<AuthResponse>('GET', '/api/v1/profile')
}
