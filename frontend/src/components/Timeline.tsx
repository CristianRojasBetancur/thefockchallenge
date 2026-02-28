import { useState, useEffect, useCallback, useRef } from 'react'
import type { Tweet } from '../types/tweet'
import { fetchTimeline } from '../api/timeline'
import { deleteTweet } from '../api/tweets'
import { TweetCard } from './TweetCard'
import { TweetForm } from './TweetForm'
import { useAuth } from '../hooks/useAuth'
import { useNavigate, Link } from 'react-router-dom'

export function Timeline() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [tweets, setTweets] = useState<Tweet[]>([])
    const [, setPage] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const [hasMore, setHasMore] = useState(true)
    const [isInitialLoading, setIsInitialLoading] = useState(true)
    const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set())
    const observer = useRef<IntersectionObserver | null>(null)

    const loadTweets = useCallback(async (pageNumber: number, currentHasMore: boolean) => {
        if (!currentHasMore && pageNumber !== 1) return
        
        setIsLoading(true)
        try {
            const data = await fetchTimeline(pageNumber)
            if (data.length === 0) {
                setHasMore(false)
            } else {
                setTweets(prev => pageNumber === 1 ? data : [...prev, ...data])
                setHasMore(data.length === 20) // Assuming limit is 20
            }
        } catch (error) {
            console.error('Failed to load timeline', error)
        } finally {
            setIsLoading(false)
            if (pageNumber === 1) setIsInitialLoading(false)
        }
    }, [])

    useEffect(() => {
        loadTweets(1, true)
    }, [loadTweets])

    const lastTweetElementRef = useCallback((node: HTMLDivElement | null) => {
        if (isLoading) return
        if (observer.current) observer.current.disconnect()
        
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => {
                    const nextPage = prevPage + 1
                    loadTweets(nextPage, hasMore)
                    return nextPage
                })
            }
        })
        
        if (node) observer.current.observe(node)
    }, [isLoading, hasMore, loadTweets])

    const handleTweetCreated = (newTweet: Tweet) => {
        setTweets(prev => [newTweet, ...prev])
    }

    const handleDelete = async (id: number) => {
        setDeletingIds(prev => new Set(prev).add(id))
        try {
            await deleteTweet(id)
            setTweets(prev => prev.filter(t => t.id !== id))
        } catch (error) {
            console.error('Failed to delete tweet', error)
            alert('Failed to delete tweet')
        } finally {
            setDeletingIds(prev => {
                const newSet = new Set(prev)
                newSet.delete(id)
                return newSet
            })
        }
    }
    
    async function handleLogout() {
        await logout()
        navigate('/login', { replace: true })
    }

    return (
        <div className="flex flex-col w-full min-h-screen">
            <header className="sticky top-0 z-10 bg-black/80 backdrop-blur-md border-b border-[#2f3336] p-4 flex justify-between items-center">
                <Link to={`/profile/${user?.username}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <div className="w-8 h-8 rounded-full bg-[#333639] flex items-center justify-center overflow-hidden">
                        {user?.avatar_url ? (
                            <img src={user.avatar_url} alt={user.name ?? user.username} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-white text-sm font-bold">{user?.username.charAt(0).toUpperCase()}</span>
                        )}
                    </div>
                    <h1 className="text-xl font-bold text-white hidden sm:block">Home</h1>
                </Link>
                <button 
                    onClick={handleLogout}
                    className="text-white text-[15px] font-bold px-4 py-1.5 border border-[#536471] rounded-full hover:bg-white/10 transition-colors"
                >
                    Log out
                </button>
            </header>

            <TweetForm onTweetCreated={handleTweetCreated} />

            <div className="flex-1">
                {isInitialLoading ? (
                    <div className="flex justify-center p-8">
                        <div className="w-8 h-8 rounded-full border-4 border-[#1d9bf0] border-t-transparent animate-spin" />
                    </div>
                ) : tweets.length === 0 ? (
                    <div className="p-8 text-center text-[#71767b]">
                        <h2 className="text-xl font-bold text-white mb-2">Welcome to your timeline!</h2>
                        <p>Follow users or post a tweet to right now.</p>
                    </div>
                ) : (
                    <>
                        {tweets.map((tweet, index) => {
                            const isLastItem = index === tweets.length - 1
                            return (
                                <div key={tweet.id} ref={isLastItem ? lastTweetElementRef : null}>
                                    <TweetCard 
                                        tweet={tweet} 
                                        onDelete={handleDelete}
                                        isDeleting={deletingIds.has(tweet.id)}
                                    />
                                </div>
                            )
                        })}
                        {isLoading && !isInitialLoading && (
                            <div className="p-4 flex justify-center">
                                <div className="w-6 h-6 rounded-full border-2 border-[#1d9bf0] border-t-transparent animate-spin" />
                            </div>
                        )}
                        {!hasMore && tweets.length > 0 && (
                            <div className="p-8 text-center text-[#71767b] text-[15px]">
                                No more tweets to load.
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
