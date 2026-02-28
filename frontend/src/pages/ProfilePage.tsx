import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import type { User } from '../types/auth'
import { fetchUserProfile } from '../api/users'
import { FollowButton } from '../components/FollowButton'
import { textClasses } from '../styles/classes'
import { useAuth } from '../hooks/useAuth'
import { ProfileTweets } from '../components/ProfileTweets'
import { EditProfileModal } from '../components/EditProfileModal'
import { Avatar } from '../components/Avatar'

type ProfileTab = 'tweets' | 'replies' | 'media' | 'likes'

export function ProfilePage() {
    const { username } = useParams<{ username: string }>()
    const navigate = useNavigate()
    const { user: currentUser, updateUser } = useAuth()

    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState<ProfileTab>('tweets')
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)

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

    const formatJoinDate = (dateString: string) => {
        try {
            const date = new Date(dateString)
            return `Joined ${date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`
        } catch {
            return ''
        }
    }

    if (isLoading) {
        return (
            <div className="flex justify-center p-8 min-h-screen text-white bg-black w-full">
                <div className="w-8 h-8 rounded-full border-4 border-[#1d9bf0] border-t-transparent animate-spin mt-4" />
            </div>
        )
    }

    if (error || !user) {
        return (
            <div className="flex flex-col w-full min-h-screen bg-black">
                <div className="p-8 text-center mt-20">
                    <h1 className="text-[31px] font-extrabold text-white mb-2 leading-tight">This account doesn't exist</h1>
                    <p className="text-[15px] text-[#71767b] mb-6">Try searching for another.</p>
                </div>
            </div>
        )
    }

    const isOwnProfile = currentUser && currentUser.id === user.id

    const handleSaveSuccess = (updatedUser: User) => {
        setUser(updatedUser)
        if (isOwnProfile) {
            updateUser(updatedUser)

            // If the username changed, update the URL without refreshing
            if (updatedUser.username !== username) {
                navigate(`/profile/${updatedUser.username}`, { replace: true })
            }
        }
    }

    return (
        <div className="flex flex-col w-full min-h-screen bg-black relative">
            {/* Sticky Header */}
            <header className="sticky top-0 z-20 bg-black/80 backdrop-blur-md flex items-center gap-6 px-4 py-1 h-[53px]">
                <button
                    onClick={() => navigate(-1)}
                    className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
                >
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5 fill-white">
                        <g><path d="M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z"></path></g>
                    </svg>
                </button>
                <div className="flex flex-col justify-center">
                    <h1 className="text-xl font-bold text-white leading-tight mt-0.5">{user.name || user.username}</h1>
                    <span className="text-[13px] text-[#71767b] leading-tight">{user.tweets_count} posts</span>
                </div>
            </header>

            {/* Banner Section */}
            <div className="h-[200px] bg-[#333639] w-full relative shrink-0">
                {user.banner_url && <img src={user.banner_url} alt="Banner" className="w-full h-full object-cover" />}
            </div>

            {/* Profile Info Section */}
            <div className="px-4 pb-0 relative">
                <div className="flex justify-between items-start mb-3 h-[68px]">
                    <div className="absolute -top-[68px] w-[134px] h-[134px] rounded-full border-4 border-black bg-[#333639] overflow-hidden flex items-center justify-center">
                        <Avatar url={user.avatar_url} name={user.name || user.username} />
                    </div>

                    <div className="ml-auto pt-3">
                        {isOwnProfile ? (
                            <button
                                onClick={() => setIsEditModalOpen(true)}
                                className="px-4 py-1.5 font-bold rounded-full border border-[#536471] text-white hover:bg-white/10 transition-colors text-[15px] min-w-[36px] min-h-[36px]"
                            >
                                Edit profile
                            </button>
                        ) : (
                            <FollowButton
                                userId={user.id}
                                initialIsFollowing={user.is_following ?? false}
                                onToggle={(newVal) => {
                                    setUser(prev => prev ? {
                                        ...prev,
                                        is_following: newVal,
                                        followers_count: Math.max(0, prev.followers_count + (newVal ? 1 : -1))
                                    } : null)
                                }}
                            />
                        )}
                    </div>
                </div>

                <div className="mb-3">
                    <h2 className="text-xl font-extrabold text-white leading-5">{user.name || user.username}</h2>
                    <p className={`${textClasses.muted} text-[15px]`}>@{user.handle || user.username}</p>
                </div>

                {user.bio && (
                    <div className="mb-3 text-[15px] text-white whitespace-pre-wrap leading-tight font-normal">
                        {user.bio}
                    </div>
                )}

                <div className="flex flex-wrap items-center gap-3 text-[#71767b] text-[15px] mb-3">
                    {/* Location, link etc could go here */}
                    <div className="flex items-center gap-1">
                        <svg viewBox="0 0 24 24" aria-hidden="true" className="w-[18.75px] h-[18.75px] fill-current">
                            <g><path d="M7 4V3h2v1h6V3h2v1h1.5C19.89 4 21 5.12 21 6.5v12c0 1.38-1.11 2.5-2.5 2.5h-13C4.12 21 3 19.88 3 18.5v-12C3 5.12 4.12 4 5.5 4H7zm0 2H5.5c-.27 0-.5.22-.5.5v12c0 .28.23.5.5.5h13c.28 0 .5-.22.5-.5v-12c0-.28-.22-.5-.5-.5H17v1h-2V6H9v1H7V6zm0 6h2v-2H7v2zm0 4h2v-2H7v2zm4-4h2v-2h-2v2zm0 4h2v-2h-2v2zm4-4h2v-2h-2v2z"></path></g>
                        </svg>
                        <span>{formatJoinDate(user.created_at)}</span>
                    </div>
                </div>

                <div className="flex gap-5 mb-4 text-[15px]">
                    <Link to={`/profile/${user.username}/following`} className="hover:underline flex gap-1 cursor-pointer">
                        <span className="text-white font-bold">{user.following_count}</span>
                        <span className="text-[#71767b]">Following</span>
                    </Link>
                    <Link to={`/profile/${user.username}/followers`} className="hover:underline flex gap-1 cursor-pointer">
                        <span className="text-white font-bold">{user.followers_count}</span>
                        <span className="text-[#71767b]">Followers</span>
                    </Link>
                </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="flex w-full border-b border-[#2f3336] overflow-x-auto scrollbar-hide">
                {[
                    { id: 'tweets', label: 'Posts' },
                    { id: 'replies', label: 'Replies' },
                    { id: 'media', label: 'Media' },
                    { id: 'likes', label: 'Likes' }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as ProfileTab)}
                        className="flex-1 min-w-[60px] hover:bg-white/10 transition-colors flex justify-center pt-4 px-4"
                    >
                        <div className="relative pb-4 flex flex-col items-center">
                            <span className={activeTab === tab.id ? 'font-bold text-white' : 'font-medium text-[#71767b]'}>
                                {tab.label}
                            </span>
                            {activeTab === tab.id && (
                                <div className="absolute bottom-0 w-full min-w-[56px] h-1 bg-[#1d9bf0] rounded-full" />
                            )}
                        </div>
                    </button>
                ))}
            </nav>

            {/* Tab Contents */}
            <div className="flex-1 w-full min-h-[400px]">
                {activeTab === 'tweets' && (
                    <ProfileTweets username={user.username} />
                )}

                {/* Placeholders for other tabs */}
                {activeTab !== 'tweets' && (
                    <div className="flex flex-col items-center justify-center p-8 mt-8">
                        {activeTab === 'replies' && (
                            <div className="w-[80%] max-w-[400px]">
                                <h1 className="text-[31px] font-extrabold text-white mb-2 leading-tight">No replies yet</h1>
                                <p className="text-[15px] text-[#71767b]">When they reply to a post, it will show up here.</p>
                            </div>
                        )}
                        {activeTab === 'media' && (
                            <div className="w-[80%] max-w-[400px]">
                                <h1 className="text-[31px] font-extrabold text-white mb-2 leading-tight">No media yet</h1>
                                <p className="text-[15px] text-[#71767b]">When they post media, it will show up here.</p>
                            </div>
                        )}
                        {activeTab === 'likes' && (
                            <ProfileTweets username={user.username} filter="likes" />
                        )}
                    </div>
                )}
            </div>

            {isEditModalOpen && user && (
                <EditProfileModal
                    user={user}
                    onClose={() => setIsEditModalOpen(false)}
                    onSaveSuccess={handleSaveSuccess}
                />
            )}
        </div>
    )
}
