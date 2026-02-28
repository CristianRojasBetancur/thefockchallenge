import { useState, useEffect, useCallback, useRef } from 'react'
import type { User } from '../types/auth'
import { fetchFollowers, fetchFollowing } from '../api/follows'
import { UserCard } from '../components/UserCard'

interface FollowsListProps {
    userId: number
    type: 'followers' | 'following'
}

export function FollowsList({ userId, type }: FollowsListProps) {
    const [users, setUsers] = useState<User[]>([])
    const [, setPage] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const [hasMore, setHasMore] = useState(true)
    const [isInitialLoading, setIsInitialLoading] = useState(true)
    const observer = useRef<IntersectionObserver | null>(null)

    const loadUsers = useCallback(async (pageNumber: number, currentHasMore: boolean) => {
        if (!currentHasMore && pageNumber !== 1) return
        
        setIsLoading(true)
        try {
            const data = type === 'followers' 
                ? await fetchFollowers(userId, pageNumber)
                : await fetchFollowing(userId, pageNumber)
                
            if (data.length === 0) {
                setHasMore(false)
            } else {
                setUsers(prev => pageNumber === 1 ? data : [...prev, ...data])
                setHasMore(data.length === 20) // Assuming limit is 20
            }
        } catch (error) {
            console.error(`Failed to load ${type}`, error)
        } finally {
            setIsLoading(false)
            if (pageNumber === 1) setIsInitialLoading(false)
        }
    }, [userId, type])

    useEffect(() => {
        setUsers([])
        setPage(1)
        setHasMore(true)
        setIsInitialLoading(true)
        loadUsers(1, true)
    }, [userId, type, loadUsers])

    const lastUserElementRef = useCallback((node: HTMLDivElement | null) => {
        if (isLoading) return
        if (observer.current) observer.current.disconnect()
        
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => {
                    const nextPage = prevPage + 1
                    loadUsers(nextPage, hasMore)
                    return nextPage
                })
            }
        })
        
        if (node) observer.current.observe(node)
    }, [isLoading, hasMore, loadUsers])

    const handleFollowToggle = (toggledUserId: number, isFollowing: boolean) => {
        setUsers(prev => prev.map(u => 
            u.id === toggledUserId ? { ...u, is_following: isFollowing } : u
        ))
    }

    if (isInitialLoading) {
        return (
            <div className="flex justify-center p-8">
                <div className="w-8 h-8 rounded-full border-4 border-[#1d9bf0] border-t-transparent animate-spin" />
            </div>
        )
    }

    if (users.length === 0) {
        return (
            <div className="p-8 text-center text-[#71767b]">
                <h2 className="text-xl font-bold text-white mb-2">
                    {type === 'followers' ? 'No followers yet' : 'Not following anyone'}
                </h2>
                <p>
                    {type === 'followers' 
                        ? 'When someone follows them, they\'ll show up here.'
                        : 'When they follow someone, they\'ll show up here.'}
                </p>
            </div>
        )
    }

    return (
        <div>
            {users.map((user, index) => {
                const isLastItem = index === users.length - 1
                return (
                    <div key={user.id} ref={isLastItem ? lastUserElementRef : null}>
                        <UserCard user={user} onFollowToggle={handleFollowToggle} />
                    </div>
                )
            })}
            {isLoading && !isInitialLoading && (
                <div className="p-4 flex justify-center">
                    <div className="w-6 h-6 rounded-full border-2 border-[#1d9bf0] border-t-transparent animate-spin" />
                </div>
            )}
        </div>
    )
}
