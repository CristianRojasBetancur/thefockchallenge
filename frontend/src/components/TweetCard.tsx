import type { Tweet } from '../types/tweet'
import { textClasses } from '../styles/classes'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

interface TweetCardProps {
    tweet: Tweet
    onDelete?: (id: number) => void
    isDeleting?: boolean
}

export function TweetCard({ tweet, onDelete, isDeleting }: TweetCardProps) {
    const { user } = useAuth()
    const isOwnTweet = user?.id === tweet.user.id

    const timeAgo = (() => {
        try {
            const date = new Date(tweet.created_at)
            const now = new Date()
            const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
            
            if (diffInSeconds < 60) return `${diffInSeconds}s`
            if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`
            if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`
            
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        } catch {
            return ''
        }
    })()

    return (
        <article className="border-b border-[#2f3336] p-4 hover:bg-white/[0.03] transition-colors flex gap-3">
            {/* Avatar Placeholder */}
            <Link to={`/profile/${tweet.user.username}`} className="shrink-0">
                <div className="w-10 h-10 rounded-full bg-[#333639] flex items-center justify-center overflow-hidden">
                    {tweet.user.avatar_url ? (
                        <img src={tweet.user.avatar_url} alt={tweet.user.name ?? tweet.user.username} className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-white font-bold">{tweet.user.username.charAt(0).toUpperCase()}</span>
                    )}
                </div>
            </Link>

            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-1 min-w-0 text-[15px]">
                        <Link to={`/profile/${tweet.user.username}`} className="font-bold text-white hover:underline truncate">
                            {tweet.user.name || tweet.user.username}
                        </Link>
                        <span className={`${textClasses.muted} truncate`}>@{tweet.user.handle || tweet.user.username}</span>
                        <span className={textClasses.muted}>·</span>
                        <span className={`${textClasses.muted} hover:underline shrink-0`}>
                            {timeAgo}
                        </span>
                    </div>

                    {isOwnTweet && onDelete && (
                        <button
                            onClick={() => onDelete(tweet.id)}
                            disabled={isDeleting}
                            className="text-[#71767b] hover:text-[#f4212e] hover:bg-[#f4212e]/10 p-2 rounded-full transition-colors disabled:opacity-50 group"
                            title="Delete"
                        >
                            <svg viewBox="0 0 24 24" aria-hidden="true" className="w-[18px] h-[18px] fill-current">
                                <g><path d="M16 6V4.5C16 3.12 14.88 2 13.5 2h-3C9.11 2 8 3.12 8 4.5V6H3v2h1.06l.81 11.21C4.98 20.78 6.28 22 7.86 22h8.27c1.58 0 2.88-1.22 2.99-2.79L20 8h1V6h-5zm-6-1.5c0-.28.22-.5.5-.5h3c.27 0 .5.22.5.5V6h-4V4.5zm7.13 14.57c-.04.52-.47.93-1 .93H7.86c-.53 0-.96-.41-1-.93L6.07 8h11.85l-.79 11.07zM9 17v-6h2v6H9zm4 0v-6h2v6h-2z"></path></g>
                            </svg>
                        </button>
                    )}
                </div>

                <div className="text-[15px] text-white mt-1 whitespace-pre-wrap break-words">
                    {tweet.content}
                </div>
            </div>
        </article>
    )
}
