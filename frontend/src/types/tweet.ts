import type { User } from './auth'

export interface Tweet {
    id: number
    content: string
    user: User
    created_at: string
    updated_at: string
}
