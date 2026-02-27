// Mock for src/api/client.ts — avoids import.meta.env in Jest/Node context
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

export const apiRequest = jest.fn()
