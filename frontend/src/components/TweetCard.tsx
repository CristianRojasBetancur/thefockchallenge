import type { Tweet } from '../types/tweet'
import { textClasses } from '../styles/classes'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

interface TweetCardProps {
    tweet: Tweet
    onDelete?: (id: number) => void
    isDeleting?: boolean
    onLikeToggle?: (id: number, isLiked: boolean) => void
}

export function TweetCard({ tweet, onDelete, isDeleting, onLikeToggle }: TweetCardProps) {
    const { user } = useAuth()
    const isOwnTweet = user?.id === tweet.user.id
    
    // Fallbacks just in case backend data is missing
    const likesCount = tweet.likes_count ?? 0;
    const isLiked = tweet.liked_by_user ?? false;

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

                {/* Actions */}
                <div className="flex justify-between items-center text-[#71767b] mt-3 max-w-[425px]">
                    <button className="flex items-center hover:text-[#1d9bf0] transition-colors group">
                        <div className="relative p-2 rounded-full group-hover:bg-[#1d9bf0]/10 transition-colors">
                            <svg viewBox="0 0 24 24" aria-hidden="true" className="w-[18.75px] h-[18.75px] fill-current"><g><path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"></path></g></svg>
                            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-[#495057] text-white text-[11px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 delay-300">
                                Reply
                            </div>
                        </div>
                    </button>
                    <button className="flex items-center hover:text-[#00ba7c] transition-colors group">
                        <div className="relative p-2 rounded-full group-hover:bg-[#00ba7c]/10 transition-colors">
                            <svg viewBox="0 0 24 24" aria-hidden="true" className="w-[18.75px] h-[18.75px] fill-current"><g><path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"></path></g></svg>
                            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-[#495057] text-white text-[11px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 delay-300">
                                Repost
                            </div>
                        </div>
                    </button>
                    <button 
                        onClick={() => onLikeToggle?.(tweet.id, isLiked)}
                        className={`flex items-center transition-colors group ${isLiked ? 'text-[#f91880]' : 'hover:text-[#f91880]'}`}
                    >
                        <div className={`relative p-2 rounded-full transition-colors ${isLiked ? '' : 'group-hover:bg-[#f91880]/10'}`}>
                            {isLiked ? (
                                <svg viewBox="0 0 24 24" aria-hidden="true" className="w-[18.75px] h-[18.75px] fill-current"><g><path d="M20.884 13.19c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"></path></g></svg>
                            ) : (
                                <svg viewBox="0 0 24 24" aria-hidden="true" className="w-[18.75px] h-[18.75px] fill-current"><g><path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"></path></g></svg>
                            )}
                            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-[#495057] text-white text-[11px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 delay-300">
                                {isLiked ? 'Unlike' : 'Like'}
                            </div>
                        </div>
                        {likesCount > 0 && (
                            <span className="text-[13px] pr-1">{likesCount}</span>
                        )}
                    </button>
                    <button className="flex items-center hover:text-[#1d9bf0] transition-colors group">
                        <div className="relative p-2 rounded-full group-hover:bg-[#1d9bf0]/10 transition-colors">
                            <svg viewBox="0 0 24 24" aria-hidden="true" className="w-[18.75px] h-[18.75px] fill-current"><g><path d="M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21l.004-10h2L6 21H4zm9.248 0v-7h2v7h-2z"></path></g></svg>
                            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-[#495057] text-white text-[11px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 delay-300">
                                View
                            </div>
                        </div>
                    </button>
                    <div className="flex items-center gap-1">
                        <button className="group">
                            <div className="relative p-2 rounded-full hover:bg-[#1d9bf0]/10 group-hover:text-[#1d9bf0] transition-colors">
                                <svg viewBox="0 0 24 24" aria-hidden="true" className="w-[18.75px] h-[18.75px] fill-current"><g><path d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5zM6.5 4c-.276 0-.5.22-.5.5v14.56l6-4.29 6 4.29V4.5c0-.28-.224-.5-.5-.5h-11z"></path></g></svg>
                                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-[#495057] text-white text-[11px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 delay-300">
                                    Bookmark
                                </div>
                            </div>
                        </button>
                        <button className="group">
                            <div className="relative p-2 rounded-full hover:bg-[#1d9bf0]/10 group-hover:text-[#1d9bf0] transition-colors">
                                <svg viewBox="0 0 24 24" aria-hidden="true" className="w-[18.75px] h-[18.75px] fill-current"><g><path d="M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.3 3.3-1.41-1.42L12 2.59zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z"></path></g></svg>
                                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-[#495057] text-white text-[11px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 delay-300">
                                    Share
                                </div>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </article>
    )
}
