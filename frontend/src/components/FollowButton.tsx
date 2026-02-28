import { useState } from 'react'
import { Button } from './ui/Button'
import { followUser, unfollowUser } from '../api/follows'
import { useAuth } from '../hooks/useAuth'

interface FollowButtonProps {
    userId: number
    initialIsFollowing: boolean
    onToggle?: (isFollowing: boolean) => void
}

export function FollowButton({ userId, initialIsFollowing, onToggle }: FollowButtonProps) {
    const { user: currentUser } = useAuth()
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing)
    const [isLoading, setIsLoading] = useState(false)
    const [isHovering, setIsHovering] = useState(false)

    if (currentUser?.id === userId) return null

    const handleToggle = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (isLoading) return

        setIsLoading(true)
        const previousState = isFollowing
        setIsFollowing(!previousState) // Optimistic update
        onToggle?.(!previousState)

        try {
            if (previousState) {
                await unfollowUser(userId)
            } else {
                await followUser(userId)
            }
        } catch (error) {
            console.error('Failed to toggle follow status', error)
            setIsFollowing(previousState) // Revert on failure
            onToggle?.(previousState)
        } finally {
            setIsLoading(false)
        }
    }

    if (isFollowing) {
        return (
            <Button
                variant="outline"
                className={`!px-4 !py-1.5 !w-[105px] !text-[15px] font-bold ${
                    isHovering 
                        ? 'bg-[#f4212e]/10 text-[#f4212e] border-[#f4212e]' 
                        : 'border-[#536471] text-white hover:bg-white/10'
                }`}
                onClick={handleToggle}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                disabled={isLoading}
            >
                {isLoading ? '...' : isHovering ? 'Unfollow' : 'Following'}
            </Button>
        )
    }

    return (
        <Button
            variant="primary"
            className="!bg-white !text-black hover:!bg-[#e7e9ea] !px-4 !py-1.5 !w-auto !min-w-[78px] !text-[15px] font-bold"
            onClick={handleToggle}
            disabled={isLoading}
        >
            {isLoading ? '...' : 'Follow'}
        </Button>
    )
}
