import type { User } from './auth'

export interface Tweet {
    id: number
    content: string
    user: User
    likes_count: number
    liked_by_user: boolean
    created_at: string
    updated_at: string
}
