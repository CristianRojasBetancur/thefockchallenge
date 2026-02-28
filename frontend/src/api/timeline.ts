import { apiRequest } from './client'
import type { Tweet } from '../types/tweet'

export const fetchTimeline = async (page: number = 1, limit: number = 20): Promise<Tweet[]> => {
    return apiRequest<Tweet[]>('GET', `/api/v1/timeline?page=${page}&limit=${limit}`)
}
