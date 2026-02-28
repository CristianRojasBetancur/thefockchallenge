import { apiRequest } from './client'
import type { Tweet } from '../types/tweet'

export const createTweet = async (content: string): Promise<Tweet> => {
    return apiRequest<Tweet>('POST', '/api/v1/tweets', { tweet: { content } })
}

export const deleteTweet = async (id: number): Promise<void> => {
    return apiRequest<void>('DELETE', `/api/v1/tweets/${id}`)
}

export const likeTweet = async (id: number): Promise<void> => {
    return apiRequest<void>('POST', `/api/v1/tweets/${id}/like`)
}

export const unlikeTweet = async (id: number): Promise<void> => {
    return apiRequest<void>('DELETE', `/api/v1/tweets/${id}/like`)
}
