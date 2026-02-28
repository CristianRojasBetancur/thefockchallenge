import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import type { User } from '../types/auth'
import { fetchUserProfile } from '../api/users'
import { FollowButton } from '../components/FollowButton'
import { FollowsList } from '../components/FollowsList'
import { textClasses } from '../styles/classes'

export function ProfilePage() {
    const { username } = useParams<{ username: string }>()
    const navigate = useNavigate()
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState<'followers' | 'following'>('followers')

    useEffect(() => {
        const loadUser = async () => {
            if (!username) return
            setIsLoading(true)
            setError(null)
            try {
                const data = await fetchUserProfile(username)
                setUser(data)
            } catch {
                setError('User not found')
            } finally {
                setIsLoading(false)
            }
        }
        loadUser()
    }, [username])

    if (isLoading) {
        return (
            <div className="flex justify-center p-8 min-h-screen text-white bg-black w-full">
                <div className="w-8 h-8 rounded-full border-4 border-[#1d9bf0] border-t-transparent animate-spin mt-4" />
            </div>
        )
    }

    if (error || !user) {
        return (
            <div className="p-8 text-center text-white bg-black min-h-screen w-full">
                <h1 className="text-2xl font-bold mb-2">This account doesn't exist</h1>
                <p className="text-[#71767b]">Try searching for another.</p>
                <button onClick={() => navigate(-1)} className="mt-4 bg-[#1d9bf0] text-white px-4 py-2 font-bold rounded-full">Go Back</button>
            </div>
        )
    }

    return (
        <div className="flex flex-col w-full min-h-screen bg-black">
            <header className="sticky top-0 z-10 bg-black/80 backdrop-blur-md flex items-center gap-6 px-4 py-2">
                <button 
                    onClick={() => navigate(-1)}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5 fill-white">
                        <g><path d="M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z"></path></g>
                    </svg>
                </button>
                <div>
                    <h1 className="text-xl font-bold text-white leading-tight">{user.name || user.username}</h1>
                    <span className="text-[13px] text-[#71767b]">{user.tweets_count} posts</span>
                </div>
            </header>

            {/* Banner Placeholder */}
            <div className="h-[200px] bg-[#333639] w-full">
                {user.banner_url && <img src={user.banner_url} alt="Banner" className="w-full h-full object-cover" />}
            </div>

            <div className="px-4 pb-4">
                <div className="flex justify-between items-start -mt-16 mb-4">
                    <div className="w-32 h-32 rounded-full border-4 border-black bg-[#333639] overflow-hidden flex items-center justify-center">
                        {user.avatar_url ? (
                            <img src={user.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-white text-4xl font-bold">{user.username.charAt(0).toUpperCase()}</span>
                        )}
                    </div>
                    
                    <div className="pt-4">
                        <FollowButton
                            userId={user.id}
                            initialIsFollowing={user.is_following ?? false}
                            onToggle={(newVal) => {
                                setUser(prev => prev ? { ...prev, is_following: newVal, followers_count: newVal ? prev.followers_count + 1 : prev.followers_count - 1 } : null)
                            }}
                        />
                    </div>
                </div>

                <div className="mb-3">
                    <h2 className="text-xl font-bold text-white">{user.name || user.username}</h2>
                    <p className={`${textClasses.muted}`}>@{user.handle || user.username}</p>
                </div>

                {user.bio && <p className="text-white text-[15px] mb-3 whitespace-pre-wrap">{user.bio}</p>}

                <div className="flex gap-4 mb-4">
                    <button 
                        onClick={() => setActiveTab('following')}
                        className="hover:underline"
                    >
                        <span className="text-white font-bold">{user.following_count}</span>{' '}
                        <span className="text-[#71767b]">Following</span>
                    </button>
                    <button 
                        onClick={() => setActiveTab('followers')}
                        className="hover:underline"
                    >
                        <span className="text-white font-bold">{user.followers_count}</span>{' '}
                        <span className="text-[#71767b]">Followers</span>
                    </button>
                </div>
            </div>

            <nav className="flex border-b border-[#2f3336]">
                <button 
                    onClick={() => setActiveTab('followers')}
                    className={`flex-1 hover:bg-white/10 transition-colors py-4 font-bold ${activeTab === 'followers' ? 'text-white' : 'text-[#71767b]'}`}
                >
                    <span className={`relative pb-4 ${activeTab === 'followers' ? 'border-b-4 border-[#1d9bf0] rounded-sm' : ''}`}>
                        Followers
                    </span>
                </button>
                <button 
                    onClick={() => setActiveTab('following')}
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
