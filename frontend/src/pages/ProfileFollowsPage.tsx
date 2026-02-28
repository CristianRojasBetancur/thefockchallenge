import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import type { User } from '../types/auth'
import { fetchUserProfile } from '../api/users'
import { usePageTitle } from '../hooks/usePageTitle'
import { FollowsList } from '../components/FollowsList'

export function ProfileFollowsPage() {
    const { username } = useParams<{ username: string }>()
    const navigate = useNavigate()
    const location = useLocation()
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    usePageTitle(user ? `People followed by ${user.name || user.username} (@${user.handle || user.username})` : 'Profile')

    // Sync tab with URL
    const activeTab = location.pathname.endsWith('/following') ? 'following' : 'followers'

    useEffect(() => {
        const loadUser = async () => {
            if (!username) return
            setIsLoading(true)
            try {
                const data = await fetchUserProfile(username)
                setUser(data)
            } catch {
                // If error, redirect back to profile where it's handled better, or go home
                navigate(`/profile/${username}`)
            } finally {
                setIsLoading(false)
            }
        }
        loadUser()
    }, [username, navigate])

    if (isLoading || !user) {
        return (
            <div className="flex justify-center p-8 min-h-screen text-white bg-black w-full">
                <div className="w-8 h-8 rounded-full border-4 border-[#1d9bf0] border-t-transparent animate-spin mt-4" />
            </div>
        )
    }

    return (
        <div className="flex flex-col w-full min-h-screen bg-black">
            <header className="sticky top-0 z-10 bg-black/80 backdrop-blur-md flex items-center gap-6 px-4 py-2 border-b border-[#2f3336]">
                <button
                    onClick={() => navigate(`/profile/${user.username}`)}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5 fill-white">
                        <g><path d="M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z"></path></g>
                    </svg>
                </button>
                <div>
                    <h1 className="text-xl font-bold text-white leading-tight">{user.name || user.username}</h1>
                    <span className="text-[13px] text-[#71767b]">@{user.handle || user.username}</span>
                </div>
            </header>

            <nav className="flex border-b border-[#2f3336]">
                <button
                    onClick={() => navigate(`/profile/${user.username}/followers`, { replace: true })}
                    className={`flex-1 hover:bg-white/10 transition-colors py-4 font-bold ${activeTab === 'followers' ? 'text-white' : 'text-[#71767b]'}`}
                >
                    <span className={`relative pb-4 ${activeTab === 'followers' ? 'border-b-4 border-[#1d9bf0] rounded-sm' : ''}`}>
                        Followers
                    </span>
                </button>
                <button
                    onClick={() => navigate(`/profile/${user.username}/following`, { replace: true })}
                    className={`flex-1 hover:bg-white/10 transition-colors py-4 font-bold ${activeTab === 'following' ? 'text-white' : 'text-[#71767b]'}`}
                >
                    <span className={`relative pb-4 ${activeTab === 'following' ? 'border-b-4 border-[#1d9bf0] rounded-sm' : ''}`}>
                        Following
                    </span>
                </button>
            </nav>

            <div className="flex-1 min-h-[300px]">
                <FollowsList key={`${user.id}-${activeTab}`} userId={user.id} type={activeTab} />
            </div>
        </div>
    )
}
