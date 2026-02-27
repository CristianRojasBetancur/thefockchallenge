import { apiRequest, ApiRequestError } from './client'
import { login, register, logout, getProfile } from './auth'

// client.ts is auto-mocked via jest moduleNameMapper — apiRequest is already jest.fn()
const mockedRequest = apiRequest as jest.MockedFunction<typeof apiRequest>

const mockUser = {
    id: 1,
    email: 'test@example.com',
    username: 'testuser',
    handle: 'testuser',
    name: null,
    bio: null,
    location: null,
    website: null,
    date_of_birth: null,
    verified: false,
    followers_count: 0,
    following_count: 0,
    tweets_count: 0,
    avatar_url: null,
    banner_url: null,
    created_at: '2026-01-01T00:00:00Z',
}

describe('auth API', () => {
    beforeEach(() => jest.clearAllMocks())

    describe('login', () => {
        it('calls POST /auth/login with session wrapper', async () => {
            mockedRequest.mockResolvedValueOnce(mockUser)
            const result = await login({ email: 'test@example.com', password: 'password123' })

            expect(mockedRequest).toHaveBeenCalledWith(
                'POST',
                '/auth/login',
                { session: { email: 'test@example.com', password: 'password123' } },
            )
            expect(result).toEqual(mockUser)
        })

        it('propagates ApiRequestError on 401', async () => {
            mockedRequest.mockRejectedValueOnce(new ApiRequestError(401, { error: 'Invalid credentials' }))
            await expect(login({ email: 'bad@x.com', password: 'wrong' }))
                .rejects.toBeInstanceOf(ApiRequestError)
        })
    })

    describe('register', () => {
        it('calls POST /auth/register with user wrapper', async () => {
            mockedRequest.mockResolvedValueOnce(mockUser)
            const creds = {
                email: 'new@example.com',
                username: 'newuser',
                password: 'password123',
                password_confirmation: 'password123',
            }
            await register(creds)
            expect(mockedRequest).toHaveBeenCalledWith('POST', '/auth/register', { user: creds })
        })
    })

    describe('logout', () => {
        it('calls DELETE /auth/logout', async () => {
            mockedRequest.mockResolvedValueOnce(undefined)
            await logout()
            expect(mockedRequest).toHaveBeenCalledWith('DELETE', '/auth/logout')
        })
    })

    describe('getProfile', () => {
        it('calls GET /api/v1/profile', async () => {
            mockedRequest.mockResolvedValueOnce(mockUser)
            const result = await getProfile()
            expect(mockedRequest).toHaveBeenCalledWith('GET', '/api/v1/profile')
            expect(result).toEqual(mockUser)
        })
    })
})
