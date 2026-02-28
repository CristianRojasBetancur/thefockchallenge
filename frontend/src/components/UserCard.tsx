import type { User } from '../types/auth'
import { FollowButton } from './FollowButton'
import { Link } from 'react-router-dom'
import { textClasses } from '../styles/classes'
import { Avatar } from './Avatar'

interface UserCardProps {
    user: User
    onFollowToggle?: (userId: number, isFollowing: boolean) => void
    hideFollowButton?: boolean
}

export function UserCard({ user, onFollowToggle, hideFollowButton }: UserCardProps) {
    return (
        <article className="border-b border-[#2f3336] p-4 hover:bg-white/[0.03] transition-colors flex gap-3 items-center">
            {/* Avatar */}
            <Link to={`/profile/${user.username}`} className="shrink-0 flex items-start self-start">
                <div className="w-10 h-10 rounded-full bg-[#333639] flex items-center justify-center overflow-hidden">
                    <Avatar url={user.avatar_url} name={user.name || user.username} />
                </div>
            </Link>

            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col min-w-0">
                        <Link to={`/profile/${user.username}`} className="font-bold text-white hover:underline truncate text-[15px]">
                            {user.name || user.username}
                        </Link>
                        <span className={`${textClasses.muted} truncate -mt-1`}>
                            @{user.handle || user.username}
                        </span>
                    </div>

                    {!hideFollowButton && (
                        <div className="pl-2 shrink-0">
                            <FollowButton
                                userId={user.id}
                                initialIsFollowing={user.is_following ?? false}
                                onToggle={(isFollowing) => onFollowToggle?.(user.id, isFollowing)}
                            />
                        </div>
                    )}
                </div>

                {user.bio && (
                    <div className="text-[15px] text-white mt-1">
                        {user.bio}
                    </div>
                )}
            </div>
        </article>
    )
}
