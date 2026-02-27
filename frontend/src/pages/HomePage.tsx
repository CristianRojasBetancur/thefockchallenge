import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { XLogo } from '../components/ui/XLogo'
import { Button } from '../components/ui/Button'
import { textClasses } from '../styles/classes'

/**
 * Minimal authenticated landing page.
 * Acts as the post-login redirect target for the auth flow.
 */
export function HomePage() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    async function handleLogout() {
        await logout()
        navigate('/login', { replace: true })
    }

    return (
        <div className="min-h-screen bg-black flex flex-col">
            {/* Top nav */}
            <header className="border-b border-[#2f3336] px-4 py-3 flex items-center gap-4">
                <XLogo className="h-7 w-7 fill-white" />
                <span className={`${textClasses.muted} ml-auto`}>
                    @{user?.handle ?? user?.username}
                </span>
                <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="!w-auto !px-4 !py-2 !text-[15px]"
                >
                    Log out
                </Button>
            </header>

            {/* Body */}
            <main className="flex-1 flex items-center justify-center flex-col gap-4 text-center px-4">
                <XLogo className="h-16 w-16 fill-white" />
                <h1 className={textClasses.heading}>
                    Welcome, {user?.name ?? user?.username ?? 'there'} 👋
                </h1>
                <p className={textClasses.muted}>
                    Your feed is coming soon. You're all signed in.
                </p>
            </main>
        </div>
    )
}
