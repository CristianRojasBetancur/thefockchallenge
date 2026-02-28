import { useState, useEffect, useCallback, useRef } from 'react'
import type { Tweet } from '../types/tweet'
import { fetchUserTweets, deleteTweet, likeTweet, unlikeTweet } from '../api/tweets'
import { TweetCard } from './TweetCard'

interface ProfileTweetsProps {
    username: string
    filter?: string
}

export function ProfileTweets({ username, filter }: ProfileTweetsProps) {
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
            const data = await fetchUserTweets(username, pageNumber, filter)
            if (data.length === 0) {
                setHasMore(false)
            } else {
                setTweets(prev => pageNumber === 1 ? data : [...prev, ...data])
                setHasMore(data.length === 20) // Limit is 20 per page
            }
        } catch (error) {
            console.error('Failed to load user tweets', error)
        } finally {
            setIsLoading(false)
            if (pageNumber === 1) setIsInitialLoading(false)
        }
    }, [username])

    useEffect(() => {
        setTweets([])
        setHasMore(true)
        setIsInitialLoading(true)
        loadTweets(1, true)
    }, [username, loadTweets])

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

    const [likingIds, setLikingIds] = useState<Set<number>>(new Set())

    const handleLikeToggle = async (id: number, currentIsLiked: boolean) => {
        if (likingIds.has(id)) return // prevent rapid double clicks

        // Optimistic UI update
        setTweets(prev => prev.map(tweet => {
            if (tweet.id !== id) return tweet

            return {
                ...tweet,
                liked_by_user: !currentIsLiked,
                likes_count: Math.max(0, (tweet.likes_count ?? 0) + (currentIsLiked ? -1 : 1))
            }
        }))

        setLikingIds(prev => new Set(prev).add(id))

        try {
            if (currentIsLiked) {
                await unlikeTweet(id)
            } else {
                await likeTweet(id)
            }
        } catch (error) {
            console.error('Failed to toggle like', error)

            // Revert optimistic update on failure
            setTweets(prev => prev.map(tweet => {
                if (tweet.id !== id) return tweet

                return {
                    ...tweet,
                    liked_by_user: currentIsLiked,
                    likes_count: Math.max(0, (tweet.likes_count ?? 0) + (currentIsLiked ? 1 : -1))
                }
            }))
        } finally {
            setLikingIds(prev => {
                const newSet = new Set(prev)
                newSet.delete(id)
                return newSet
            })
        }
    }


    if (isInitialLoading) {
        return (
            <div className="flex justify-center p-8">
                <div className="w-8 h-8 rounded-full border-4 border-[#1d9bf0] border-t-transparent animate-spin" />
            </div>
        )
    }

    if (tweets.length === 0) {
        return (
            <div className="p-8 text-center text-[#71767b]">
                <h2 className="text-[31px] font-extrabold text-white mb-2 leading-tight">
                    {filter === 'likes' ? 'No likes yet' : 'Here\'s a starting point'}
                </h2>
                <p className="text-[15px] max-w-[400px] mx-auto mb-6 leading-normal">
                    {filter === 'likes' ? 'When they receive likes on their posts, they will show up here.' : 'When they post Tweets, they will show up here.'}
                </p>
            </div>
        )
    }

    return (
        <div className="flex flex-col w-full">
            {tweets.map((tweet, index) => {
                const isLastItem = index === tweets.length - 1
                return (
                    <div key={tweet.id} ref={isLastItem ? lastTweetElementRef : null}>
                        <TweetCard
                            tweet={tweet}
                            onDelete={handleDelete}
                            isDeleting={deletingIds.has(tweet.id)}
                            onLikeToggle={handleLikeToggle}
                        />
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
