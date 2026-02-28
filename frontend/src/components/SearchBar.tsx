import { useState, useEffect, useRef } from 'react'
import { searchUsers } from '../api/users'
import { useDebounce } from '../hooks/useDebounce'
import type { User } from '../types/auth'
import { UserCard } from './UserCard'

export function SearchBar() {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<User[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    
    const debouncedQuery = useDebounce(query, 300)
    const wrapperRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const fetchResults = async () => {
            if (debouncedQuery.trim().length < 2) {
                setResults([])
                setIsOpen(false)
                return
            }
            
            setIsLoading(true)
            setIsOpen(true)
            
            try {
                const data = await searchUsers(debouncedQuery)
                setResults(data)
            } catch (error) {
                console.error('Search failed', error)
                // We keep previously loaded results on error, or empty if none
            } finally {
                setIsLoading(false)
            }
        }

        fetchResults()
    }, [debouncedQuery])

    // Handle clicking outside to close the dropdown
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    const handleClear = () => {
        setQuery('')
        setResults([])
        setIsOpen(false)
    }
    
    // We navigate manually and close the menu since we use UserCard which has Link
    // but the Link click naturally triggers blur events.
    const handleResultClick = () => {
        setIsOpen(false)
    }

    return (
        <div ref={wrapperRef} className="relative w-full max-w-sm group">
            {/* Search Input Container */}
            <div className={`flex items-center bg-black rounded-full px-4 border focus-within:border-[#1d9bf0] ${isOpen ? 'border-[#1d9bf0]' : 'border-[#2f3336]'}`}>
                {/* Search Icon */}
                <span className="text-[#71767b] group-focus-within:text-[#1d9bf0] mr-3">
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5 fill-current">
                        <g><path d="M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.419-.726 4.596-1.904 1.178-1.177 1.904-2.801 1.904-4.596 0-3.59-2.91-6.5-6.5-6.5zm-8.5 6.5c0-4.694 3.806-8.5 8.5-8.5s8.5 3.806 8.5 8.5c0 1.986-.682 3.815-1.824 5.262l4.781 4.781-1.414 1.414-4.781-4.781c-1.447 1.142-3.276 1.824-5.262 1.824-4.694 0-8.5-3.806-8.5-8.5z"></path></g>
                    </svg>
                </span>
                
                <input
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value)
                        if (e.target.value.length > 0) setIsOpen(true)
                    }}
                    onFocus={() => {
                        if (query.trim().length >= 2) setIsOpen(true)
                    }}
                    placeholder="Search"
                    className="bg-transparent border-none text-white py-2 w-full outline-none placeholder-[#71767b] text-[15px]"
                />
                
                {/* Clear Icon */}
                {query.length > 0 && (
                    <button 
                        onClick={handleClear}
                        className="w-5 h-5 rounded-full bg-[#1d9bf0] flex items-center justify-center ml-2 hover:bg-[#1a8cd8]"
                    >
                         <svg viewBox="0 0 24 24" aria-hidden="true" className="w-3 h-3 fill-white">
                            <g><path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"></path></g>
                        </svg>
                    </button>
                )}
            </div>

            {/* Dropdown Results */}
            {isOpen && (debouncedQuery.trim().length >= 2) && (
                <div className="absolute top-full mt-1 w-full bg-black rounded-lg shadow-[0_0_15px_rgba(255,255,255,0.2)] border border-[#2f3336] overflow-hidden z-50">
                    {isLoading ? (
                        <div className="flex justify-center p-4">
                            <div className="w-6 h-6 rounded-full border-2 border-[#1d9bf0] border-t-transparent animate-spin" />
                        </div>
                    ) : results.length > 0 ? (
                        <div className="max-h-[400px] overflow-y-auto" onClick={handleResultClick}>
                            {results.map(user => (
                                <UserCard 
                                    key={user.id} 
                                    user={user} 
                                    // Let UserCard manage optimistic follow internally
                                    onFollowToggle={() => {}} 
                                    hideFollowButton={true}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="p-4 text-center text-[#71767b]">
                            No results for "{debouncedQuery}"
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
