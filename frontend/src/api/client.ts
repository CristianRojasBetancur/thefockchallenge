const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'

export class ApiRequestError extends Error {
    readonly status: number
    readonly body: unknown

    constructor(status: number, body: unknown, message?: string) {
        super(message ?? `API error ${status}`)
        this.name = 'ApiRequestError'
        this.status = status
        this.body = body
    }
}

export async function apiRequest<T>(
    method: HttpMethod,
    path: string,
    body?: unknown,
): Promise<T> {
    const options: RequestInit = {
        method,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    }

    if (body !== undefined) {
        options.body = JSON.stringify(body)
    }

    const response = await fetch(`${BASE_URL}${path}`, options)

    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}))
        throw new ApiRequestError(response.status, errorBody)
    }

    if (response.status === 204) {
        return {} as T
    }

    return response.json() as Promise<T>
}
