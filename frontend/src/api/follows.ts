import { apiRequest } from './client'
import type { User } from '../types/auth'

export const followUser = async (userId: string | number): Promise<void> => {
    return apiRequest<void>('POST', `/api/v1/users/${userId}/follow`)
}

export const unfollowUser = async (userId: string | number): Promise<void> => {
    return apiRequest<void>('DELETE', `/api/v1/users/${userId}/follow`)
}

export const fetchFollowers = async (userId: string | number, page: number = 1, limit: number = 20): Promise<User[]> => {
    return apiRequest<User[]>('GET', `/api/v1/users/${userId}/followers?page=${page}&limit=${limit}`)
}

export const fetchFollowing = async (userId: string | number, page: number = 1, limit: number = 20): Promise<User[]> => {
    return apiRequest<User[]>('GET', `/api/v1/users/${userId}/following?page=${page}&limit=${limit}`)
}
