import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { Button } from './ui/Button'
import { createTweet } from '../api/tweets'
import type { Tweet } from '../types/tweet'

interface TweetFormProps {
    onTweetCreated: (tweet: Tweet) => void
}

const MAX_CHARS = 280

export function TweetForm({ onTweetCreated }: TweetFormProps) {
    const { user } = useAuth()
    const [content, setContent] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const charsLeft = MAX_CHARS - content.length
    const isOverLimit = charsLeft < 0
    const isEmpty = content.trim().length === 0
    const isDisabled = isEmpty || isOverLimit || isLoading

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
        }
    }, [content])

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (isDisabled) return

        setIsLoading(true)
        setError(null)
        
        try {
            const newTweet = await createTweet(content.trim())
            setContent('')
            onTweetCreated(newTweet)
        } catch (err: unknown) {
            const errorObj = err as { body?: { errors?: { message?: string }[] } }
            setError(errorObj.body?.errors?.[0]?.message || 'Failed to post tweet')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="border-b border-[#2f3336] p-4 flex gap-4">
            <div className="shrink-0">
                <div className="w-10 h-10 rounded-full bg-[#333639] flex items-center justify-center overflow-hidden">
                    {user?.avatar_url ? (
                        <img src={user.avatar_url} alt={user.name ?? user.username} className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-white font-bold">{user?.username.charAt(0).toUpperCase()}</span>
                    )}
                </div>
            </div>

            <div className="flex-1">
                <form onSubmit={handleSubmit}>
                    <textarea
                        ref={textareaRef}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="What is happening?!"
                        className="w-full bg-transparent text-white text-[20px] placeholder-[#71767b] outline-none resize-none pt-2 min-h-[52px]"
                        rows={1}
                        maxLength={MAX_CHARS + 10} // Allow typing a bit over to show minus
                    />
                    
                    {error && <div className="text-[#f4212e] text-[13px] mt-2">{error}</div>}

                    <div className="border-t border-[#2f3336] mt-3 pt-3 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            {/* Adding a small visual indicator for chars left */}
                            {!isEmpty && (
                                <span className={`text-[13px] ${isOverLimit ? 'text-[#f4212e]' : charsLeft <= 20 ? 'text-[#ffd400]' : 'text-[#71767b]'}`}>
                                    {charsLeft}
                                </span>
                            )}
                        </div>
                        <Button 
                            type="submit" 
                            disabled={isDisabled} 
                            isLoading={isLoading}
                            className="!w-auto !px-4 !py-1.5 !text-[15px] font-bold"
                        >
                            Post
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
