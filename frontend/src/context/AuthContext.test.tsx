import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthProvider } from './AuthContext'
import { useAuth } from '../hooks/useAuth'
import { apiRequest, ApiRequestError } from '../api/client'
import * as authApi from '../api/auth'

// apiRequest is auto-mocked via jest moduleNameMapper
const mockedRequest = apiRequest as jest.MockedFunction<typeof apiRequest>

// We also need to control the auth API functions — mock the entire module
jest.mock('../api/auth')
const mockedLogin = authApi.login as jest.MockedFunction<typeof authApi.login>
const mockedLogout = authApi.logout as jest.MockedFunction<typeof authApi.logout>
const mockedGetProfile = authApi.getProfile as jest.MockedFunction<typeof authApi.getProfile>

// Suppress unused-variable lint for mockedRequest (it's used via auth.ts internally)
void mockedRequest

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

function TestConsumer() {
    const { user, isLoading, login, logout } = useAuth()
    if (isLoading) return <p>Loading</p>
    if (!user) return <button onClick={() => login({ email: 'x', password: 'p' })}>Sign in</button>
    return (
        <>
            <p data-testid="username">{user.username}</p>
            <button onClick={() => logout()}>Log out</button>
        </>
    )
}

function renderWithProvider() {
    return render(
        <AuthProvider>
            <TestConsumer />
        </AuthProvider>,
    )
}

describe('AuthContext', () => {
    beforeEach(() => jest.clearAllMocks())

    it('shows loading then unauthenticated state when no session exists', async () => {
        mockedGetProfile.mockRejectedValueOnce(new ApiRequestError(401, {}))

        renderWithProvider()
        expect(screen.getByText('Loading')).toBeInTheDocument()

        await waitFor(() =>
            expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument(),
        )
    })

    it('rehydrates user from cookie on mount', async () => {
        mockedGetProfile.mockResolvedValueOnce(mockUser)

        renderWithProvider()

        await waitFor(() =>
            expect(screen.getByTestId('username')).toHaveTextContent('testuser'),
        )
    })

    it('sets user after successful login', async () => {
        mockedGetProfile.mockRejectedValueOnce(new ApiRequestError(401, {}))
        mockedLogin.mockResolvedValueOnce(mockUser)

        renderWithProvider()

        const btn = await screen.findByRole('button', { name: /sign in/i })
        await act(async () => { await userEvent.click(btn) })

        expect(screen.getByTestId('username')).toHaveTextContent('testuser')
    })

    it('clears user after logout', async () => {
        mockedGetProfile.mockResolvedValueOnce(mockUser)
        mockedLogout.mockResolvedValueOnce(undefined)

        renderWithProvider()
        await screen.findByTestId('username')

        const btn = screen.getByRole('button', { name: /log out/i })
        await act(async () => { await userEvent.click(btn) })

        expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
    })
})
