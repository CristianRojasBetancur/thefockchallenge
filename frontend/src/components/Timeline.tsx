import { useState, useEffect, useCallback, useRef } from 'react'
import type { Tweet } from '../types/tweet'
import { fetchTimeline } from '../api/timeline'
import { deleteTweet } from '../api/tweets'
import { TweetCard } from './TweetCard'
import { TweetForm } from './TweetForm'

export function Timeline() {
    const [tweets, setTweets] = useState<Tweet[]>([])
    const [activeTab, setActiveTab] = useState<'for-you' | 'following'>('for-you')
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
        setTweets([])
        setHasMore(true)
        setIsInitialLoading(true)
        loadTweets(1, true)
    }, [activeTab, loadTweets])

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
    


    return (
        <div className="flex flex-col w-full min-h-screen">
            <header className="sticky top-0 z-10 bg-black/80 backdrop-blur-md border-b border-[#2f3336]">
                <div className="flex w-full">
                    <button 
                        onClick={() => setActiveTab('for-you')}
                        className="flex-1 hover:bg-white/10 transition-colors flex justify-center pt-4"
                    >
                        <div className="relative pb-4 flex flex-col items-center">
                            <span className={activeTab === 'for-you' ? 'font-bold text-white' : 'font-medium text-[#71767b]'}>
                                For you
                            </span>
                            {activeTab === 'for-you' && (
                                <div className="absolute bottom-0 w-14 h-1 bg-[#1d9bf0] rounded-full" />
                            )}
                        </div>
                    </button>
                    <button 
                        onClick={() => setActiveTab('following')}
                        className="flex-1 hover:bg-white/10 transition-colors flex justify-center pt-4"
                    >
                        <div className="relative pb-4 flex flex-col items-center">
                            <span className={activeTab === 'following' ? 'font-bold text-white' : 'font-medium text-[#71767b]'}>
                                Following
                            </span>
                            {activeTab === 'following' && (
                                <div className="absolute bottom-0 w-16 h-1 bg-[#1d9bf0] rounded-full" />
                            )}
                        </div>
                    </button>
                </div>
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
