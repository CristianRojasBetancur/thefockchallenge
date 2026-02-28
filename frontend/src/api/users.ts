import { apiRequest } from './client'
import type { User } from '../types/auth'

export const fetchUserProfile = async (usernameOrId: string | number): Promise<User> => {
    return apiRequest<User>('GET', `/api/v1/users/${usernameOrId}`)
}

export const searchUsers = async (query: string): Promise<User[]> => {
    return apiRequest<User[]>('GET', `/api/v1/users?query=${encodeURIComponent(query)}`)
}

export const getExploreUsers = async (): Promise<User[]> => {
    return apiRequest<User[]>('GET', '/api/v1/users/explore')
}

export const updateProfile = async (formData: FormData): Promise<User> => {
    return apiRequest<User>('PATCH', '/api/v1/profile', formData)
}
