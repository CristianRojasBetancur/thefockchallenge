import { useState, useEffect } from 'react'
import { SearchBar } from '../components/SearchBar'
import { UserCard } from '../components/UserCard'
import { textClasses } from '../styles/classes'
import { getExploreUsers } from '../api/users'
import { followUser, unfollowUser } from '../api/follows'
import type { User } from '../types/auth'
import { useAuth } from '../hooks/useAuth'

export function ExplorePage() {
    const { user: currentUser } = useAuth()
    const [users, setUsers] = useState<User[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const data = await getExploreUsers()
                setUsers(data)
            } catch (error) {
                console.error('Failed to load explore users', error)
            } finally {
                setIsLoading(false)
            }
        }

        loadUsers()
    }, [])

    const handleFollowToggle = async (userId: number, isFollowing: boolean) => {
        // Optimistic UI update
        setUsers(prev => prev.map(user => {
            if (user.id !== userId) return user
            return {
                ...user,
                is_following: isFollowing,
                followers_count: Math.max(0, user.followers_count + (isFollowing ? 1 : -1))
            }
        }))

        try {
            if (isFollowing) {
                await followUser(userId)
            } else {
                await unfollowUser(userId)
            }
        } catch (error) {
            console.error('Failed to toggle follow status', error)
            
            // Revert optimistic update on failure
            setUsers(prev => prev.map(user => {
                if (user.id !== userId) return user
                return {
                    ...user,
                    is_following: !isFollowing,
                    followers_count: Math.max(0, user.followers_count + (!isFollowing ? 1 : -1))
                }
            }))
        }
    }

    // Filter out the current user, just in case the backend doesn't
    const exploreUsers = users.filter(u => u.id !== currentUser?.id)

    return (
        <div className="flex flex-col h-full min-h-screen">
            <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-md border-b border-[#2f3336] p-3">
                <SearchBar />
            </div>
            
            <div className="flex-1">
                <h1 className={`${textClasses.heading} p-4 border-b border-[#2f3336]`}>Who to follow</h1>
                
                {isLoading ? (
                    <div className="flex justify-center p-8">
                        <div className="w-8 h-8 rounded-full border-4 border-[#1d9bf0] border-t-transparent animate-spin" />
                    </div>
                ) : exploreUsers.length === 0 ? (
                    <div className="p-8 text-center text-[#71767b]">
                        <h2 className="text-xl font-bold text-white mb-2">No users to suggest right now</h2>
                        <p>Try searching for specific users above.</p>
                    </div>
                ) : (
                    <div className="flex flex-col pb-20">
                        {exploreUsers.map((user) => (
                            <UserCard 
                                key={user.id} 
                                user={user} 
                                onFollowToggle={handleFollowToggle}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
