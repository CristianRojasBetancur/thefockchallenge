export interface User {
    id: number
    email: string
    username: string
    handle: string
    name: string | null
    bio: string | null
    location: string | null
    website: string | null
    date_of_birth: string | null
    verified: boolean
    followers_count: number
    following_count: number
    tweets_count: number
    avatar_url: string | null
    banner_url: string | null
    created_at: string
}

export interface LoginCredentials {
    email: string
    password: string
}

export interface RegisterCredentials {
    email: string
    username: string
    handle?: string
    name?: string
    password: string
    password_confirmation: string
    date_of_birth?: string
}

export interface AuthResponse extends User { }

export interface BackendErrorDetail {
    message: string
    code: string
    index: number
}

export interface ApiError {
    error?: string
    errors?: BackendErrorDetail[]
}
