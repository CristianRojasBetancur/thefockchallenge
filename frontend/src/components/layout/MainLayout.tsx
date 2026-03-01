import { useState, type ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { SearchBar } from '../SearchBar'
import { useAuth } from '../../hooks/useAuth'
import { PostModal } from '../PostModal'
import { AuthModal } from '../AuthModal'
import { textClasses } from '../../styles/classes'
import { Avatar } from '../Avatar'

const NAV_ITEMS = [
    {
        name: 'Home', path: '/home',
        icon: <svg viewBox="0 0 24 24" aria-hidden="true" className="w-[26.25px] h-[26.25px] fill-current"><g><path d="M12 1.696L.622 8.807l1.06 1.696L3 9.679V19.5C3 20.881 4.119 22 5.5 22h13c1.381 0 2.5-1.119 2.5-2.5V9.679l1.318.824 1.06-1.696L12 1.696zM12 4.41l7.5 4.686V19.5c0 .276-.224.5-.5.5h-14c-.276 0-.5-.224-.5-.5V9.096L12 4.41z"></path></g></svg>,
        activeIcon: <svg viewBox="0 0 24 24" aria-hidden="true" className="w-[26.25px] h-[26.25px] fill-current"><g><path d="M12 1.696L.622 8.807l1.06 1.696L3 9.679V19.5C3 20.881 4.119 22 5.5 22h13c1.381 0 2.5-1.119 2.5-2.5V9.679l1.318.824 1.06-1.696L12 1.696z" fill="currentColor"></path></g></svg>
    },
    {
        name: 'Explore', path: '/explore',
        icon: <svg viewBox="0 0 24 24" aria-hidden="true" className="w-[26.25px] h-[26.25px] fill-current"><g><path d="M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.419-.726 4.596-1.904 1.178-1.177 1.904-2.801 1.904-4.596 0-3.59-2.91-6.5-6.5-6.5zm-8.5 6.5c0-4.694 3.806-8.5 8.5-8.5s8.5 3.806 8.5 8.5c0 1.986-.682 3.815-1.824 5.262l4.781 4.781-1.414 1.414-4.781-4.781c-1.447 1.142-3.276 1.824-5.262 1.824-4.694 0-8.5-3.806-8.5-8.5z"></path></g></svg>,
        activeIcon: <svg viewBox="0 0 24 24" aria-hidden="true" className="w-[26.25px] h-[26.25px] fill-current"><g><path d="M10.25 18.25c4.411 0 8-3.589 8-8s-3.589-8-8-8-8 3.589-8 8 3.589 8 8 8zm9.528 2.379l-4.78-4.78c1.373-1.433 2.252-3.376 2.252-5.599 0-4.411-3.589-8-8-8s-8 3.589-8 8 3.589 8 8 8c2.223 0 4.166-.879 5.599-2.252l4.78 4.78 1.415-1.414z" fill="currentColor"></path></g></svg>
    },
    {
        name: 'Notifications', path: '/notifications',
        icon: <svg viewBox="0 0 24 24" aria-hidden="true" className="w-[26.25px] h-[26.25px] stroke-current fill-none" strokeWidth="1.5"><g><path d="M18.7491 9.70957V9.00497C18.7491 5.13623 15.7274 2 12 2C8.27256 2 5.25087 5.13623 5.25087 9.00497V9.70957C5.25087 10.5552 5.00972 11.3818 4.5578 12.0854L3.45036 13.8095C2.43882 15.3843 3.21105 17.5249 4.97036 18.0229C9.57274 19.3257 14.4273 19.3257 19.0296 18.0229C20.789 17.5249 21.5612 15.3843 20.5496 13.8095L19.4422 12.0854C18.9903 11.3818 18.7491 10.5552 18.7491 9.70957Z" /><path d="M7.5 19C8.15503 20.7478 9.92246 22 12 22C14.0775 22 15.845 20.7478 16.5 19" strokeLinecap="round" /></g></svg>,
        activeIcon: <svg viewBox="0 0 24 24" aria-hidden="true" className="w-[26.25px] h-[26.25px] fill-current"><g><path d="M18.7491 9.70957V9.00497C18.7491 5.13623 15.7274 2 12 2C8.27256 2 5.25087 5.13623 5.25087 9.00497V9.70957C5.25087 10.5552 5.00972 11.3818 4.5578 12.0854L3.45036 13.8095C2.43882 15.3843 3.21105 17.5249 4.97036 18.0229C9.57274 19.3257 14.4273 19.3257 19.0296 18.0229C20.789 17.5249 21.5612 15.3843 20.5496 13.8095L19.4422 12.0854C18.9903 11.3818 18.7491 10.5552 18.7491 9.70957Z" /><path d="M7.5 19C8.15503 20.7478 9.92246 22 12 22C14.0775 22 15.845 20.7478 16.5 19" /></g></svg>
    },
    {
        name: 'Follow', path: '/follow',
        icon: <svg viewBox="0 0 24 24" aria-hidden="true" className="w-[26.25px] h-[26.25px] stroke-current fill-none stroke-[1.5]"><g strokeLinecap="round" strokeLinejoin="round"><path d="M17 10H20M23 10H20M20 10V7M20 10V13" /><path d="M1 20V19C1 15.134 4.13401 12 8 12V12C11.866 12 15 15.134 15 19V20" /><path d="M8 12C10.2091 12 12 10.2091 12 8C12 5.79086 10.2091 4 8 4C5.79086 4 4 5.79086 4 8C4 10.2091 5.79086 12 8 12Z" /></g></svg>,
        activeIcon: <svg viewBox="0 0 24 24" aria-hidden="true" className="w-[26.25px] h-[26.25px] stroke-current fill-current stroke-[1]"><g strokeLinecap="round" strokeLinejoin="round"><path d="M17 10H20M23 10H20M20 10V7M20 10V13" /><path d="M1 20V19C1 15.134 4.13401 12 8 12V12C11.866 12 15 15.134 15 19V20" /><path d="M8 12C10.2091 12 12 10.2091 12 8C12 5.79086 10.2091 4 8 4C5.79086 4 4 5.79086 4 8C4 10.2091 5.79086 12 8 12Z" /></g></svg>
    },
    {
        name: 'Chat', path: '/chat',
        icon: <svg viewBox="0 0 24 24" aria-hidden="true" className="w-[26.25px] h-[26.25px] fill-current"><g><path fillRule="evenodd" clipRule="evenodd" d="M3.75 5.25L3 6V18L3.75 18.75H20.25L21 18V6L20.25 5.25H3.75ZM4.5 7.6955V17.25H19.5V7.69525L11.9999 14.5136L4.5 7.6955ZM18.3099 6.75H5.68986L11.9999 12.4864L18.3099 6.75Z"></path></g></svg>,
        activeIcon: <svg viewBox="0 0 24 24" aria-hidden="true" className="w-[26.25px] h-[26.25px]"><g><rect x="1.5" y="3.75" width="21" height="16.5" rx="3" fill="currentColor" /><path fillRule="evenodd" clipRule="evenodd" fill="black" d="M3.75 5.25L3 6V18L3.75 18.75H20.25L21 18V6L20.25 5.25H3.75ZM4.5 7.6955V17.25H19.5V7.69525L11.9999 14.5136L4.5 7.6955ZM18.3099 6.75H5.68986L11.9999 12.4864L18.3099 6.75Z"></path></g></svg>
    },
    {
        name: 'Grok', path: '/grok',
        icon: <svg viewBox="0 0 48 48" aria-hidden="true" className="w-[26.25px] h-[26.25px] fill-current"><g><path d="M18.542 30.532l15.956-11.776c.783-.576 1.902-.354 2.274.545 1.962 4.728 1.084 10.411-2.819 14.315-3.903 3.901-9.333 4.756-14.299 2.808l-5.423 2.511c7.778 5.315 17.224 4 23.125-1.903 4.682-4.679 6.131-11.058 4.775-16.812l.011.011c-1.966-8.452.482-11.829 5.501-18.735C47.759 1.332 47.88 1.166 48 1l-6.602 6.599V7.577l-22.86 22.958M15.248 33.392c-5.582-5.329-4.619-13.579.142-18.339 3.521-3.522 9.294-4.958 14.331-2.847l5.412-2.497c-.974-.704-2.224-1.46-3.659-1.994-6.478-2.666-14.238-1.34-19.505 3.922C6.904 16.701 5.31 24.488 8.045 31.133c2.044 4.965-1.307 8.48-4.682 12.023C2.164 44.411.967 45.67 0 47l15.241-13.608" /></g></svg>,
        activeIcon: <svg viewBox="0 0 48 48" aria-hidden="true" className="w-[26.25px] h-[26.25px]"><rect width="48" height="48" rx="8" fill="currentColor" /><g><path fill="black" d="M18.542 30.532l15.956-11.776c.783-.576 1.902-.354 2.274.545 1.962 4.728 1.084 10.411-2.819 14.315-3.903 3.901-9.333 4.756-14.299 2.808l-5.423 2.511c7.778 5.315 17.224 4 23.125-1.903 4.682-4.679 6.131-11.058 4.775-16.812l.011.011c-1.966-8.452.482-11.829 5.501-18.735C47.759 1.332 47.88 1.166 48 1l-6.602 6.599V7.577l-22.86 22.958M15.248 33.392c-5.582-5.329-4.619-13.579.142-18.339 3.521-3.522 9.294-4.958 14.331-2.847l5.412-2.497c-.974-.704-2.224-1.46-3.659-1.994-6.478-2.666-14.238-1.34-19.505 3.922C6.904 16.701 5.31 24.488 8.045 31.133c2.044 4.965-1.307 8.48-4.682 12.023C2.164 44.411.967 45.67 0 47l15.241-13.608" /></g></svg>
    },
    {
        name: 'Bookmarks', path: '/bookmarks',
        icon: <svg viewBox="0 0 24 24" aria-hidden="true" className="w-[26.25px] h-[26.25px] fill-current"><g><path d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5zM6.5 3.5c-.552 0-1 .448-1 1v15.22l6.5-4.63 6.5 4.63V4.5c0-.552-.448-1-1-1h-11z"></path></g></svg>,
        activeIcon: <svg viewBox="0 0 24 24" aria-hidden="true" className="w-[26.25px] h-[26.25px] fill-current"><g><path d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5z"></path></g></svg>
    },
    {
        name: 'Creator Studio', path: '/creator-studio',
        icon: <svg viewBox="0 0 45.64 45.64" aria-hidden="true" className="w-[26.25px] h-[26.25px]"><g><path fill="none" stroke="currentColor" strokeWidth="2.5" d="M43.183,37.582L31.209,15.429V2.232C31.209,0.99,30.17,0,28.929,0H16.707c-1.242,0-2.264,0.99-2.264,2.232v13.197L2.459,37.582c-0.914,1.689-0.868,3.74,0.115,5.391c0.983,1.649,2.766,2.668,4.686,2.668h31.115c1.92,0,3.707-1.019,4.69-2.668C44.047,41.322,44.097,39.271,43.183,37.582z" /></g></svg>,
        activeIcon: <svg viewBox="0 0 45.64 45.64" aria-hidden="true" className="w-[26.25px] h-[26.25px] fill-current"><g><path d="M43.183,37.582L31.209,15.429V2.232C31.209,0.99,30.17,0,28.929,0H16.707c-1.242,0-2.264,0.99-2.264,2.232v13.197L2.459,37.582c-0.914,1.689-0.868,3.74,0.115,5.391c0.983,1.649,2.766,2.668,4.686,2.668h31.115c1.92,0,3.707-1.019,4.69-2.668C44.047,41.322,44.097,39.271,43.183,37.582z" /></g></svg>
    },
    {
        name: 'Premium', path: '/premium',
        icon: <svg viewBox="0 0 24 24" aria-hidden="true" className="w-[26.25px] h-[26.25px] fill-current"><g><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.008 5.96H5.078z"></path></g></svg>,
        activeIcon: <svg viewBox="0 0 24 24" aria-hidden="true" className="w-[26.25px] h-[26.25px] fill-current"><g><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.008 5.96H5.078z"></path></g></svg>
    },
]

export function MainLayout({ children }: { children: ReactNode }) {
    const { user, logout } = useAuth()
    const location = useLocation()

    const [isPostModalOpen, setIsPostModalOpen] = useState(false)
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
    const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false)

    // Append profile dynamically based on logged in user
    const finalNavItems = [...NAV_ITEMS, {
        name: 'Profile',
        path: `/profile/${user?.username}`,
        icon: <svg viewBox="0 0 512 512" aria-hidden="true" className="w-[26.25px] h-[26.25px]"><g transform="translate(85.333333, 42.666667)"><path d="M170.666667,170.666667 C217.794965,170.666667 256,132.461632 256,85.3333333 C256,38.2050347 217.794965,7.10542736e-15 170.666667,7.10542736e-15 C123.538368,7.10542736e-15 85.3333333,38.2050347 85.3333333,85.3333333 C85.3333333,132.461632 123.538368,170.666667 170.666667,170.666667 Z M213.333333,213.333333 L128,213.333333 C57.307552,213.333333 1.42108547e-14,270.640885 1.42108547e-14,341.333333 L1.42108547e-14,426.666667 L341.333333,426.666667 L341.333333,341.333333 C341.333333,270.640885 284.025781,213.333333 213.333333,213.333333 Z" fill="none" stroke="currentColor" strokeWidth="30" /></g></svg>,
        activeIcon: <svg viewBox="0 0 512 512" aria-hidden="true" className="w-[26.25px] h-[26.25px] fill-current"><g transform="translate(85.333333, 42.666667)"><path d="M170.666667,170.666667 C217.794965,170.666667 256,132.461632 256,85.3333333 C256,38.2050347 217.794965,7.10542736e-15 170.666667,7.10542736e-15 C123.538368,7.10542736e-15 85.3333333,38.2050347 85.3333333,85.3333333 C85.3333333,132.461632 123.538368,170.666667 170.666667,170.666667 Z M213.333333,213.333333 L128,213.333333 C57.307552,213.333333 1.42108547e-14,270.640885 1.42108547e-14,341.333333 L1.42108547e-14,426.666667 L341.333333,426.666667 L341.333333,341.333333 C341.333333,270.640885 284.025781,213.333333 213.333333,213.333333 Z" fill="currentColor" /></g></svg>
    }]

    const handleLogout = async () => {
        setIsAccountMenuOpen(false)
        await logout()
    }

    return (
        <div className="min-h-screen bg-black flex justify-center w-full" >
            <div className="flex w-full max-w-[1265px] justify-center">

                {/* Left Sidebar (Desktop/Tablet) */}
                <header className="hidden sm:flex w-[68px] xl:w-[275px] shrink-0 border-r border-[#2f3336] p-2 flex-col items-center xl:items-start h-screen sticky top-0 bg-black z-10">
                    <div className="w-full flex-1 flex flex-col overflow-y-auto overflow-x-hidden pb-4">
                        <div className="flex flex-col items-center xl:items-start xl:w-full">
                            {/* X Logo */}
                            <Link to="/home" className="w-[50px] h-[50px] rounded-full hover:bg-white/[0.1] transition-colors flex items-center justify-center mb-2 xl:ml-2">
                                <svg viewBox="0 0 24 24" aria-hidden="true" className="w-[28px] h-[28px] fill-white"><g><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.008 5.96H5.078z"></path></g></svg>
                            </Link>

                            {/* Navigation Items */}
                            <nav className="flex flex-col w-full items-center xl:items-start">
                                {finalNavItems.map(item => {
                                    const isActive = location.pathname.startsWith(item.path)
                                    return (
                                        <Link
                                            key={item.name}
                                            to={item.path}
                                            className="group flex w-auto max-w-full mb-1"
                                        >
                                            <div className="p-3 w-auto xl:pr-6 rounded-full hover:bg-white/[0.1] transition-colors flex items-center gap-5 text-xl">
                                                <div className="relative">
                                                    {isActive ? item.activeIcon : item.icon}
                                                </div>
                                                <span className={`hidden xl:inline text-white ${isActive ? 'font-bold' : 'font-normal'}`}>
                                                    {item.name}
                                                </span>
                                            </div>
                                        </Link>
                                    )
                                })}
                            </nav>

                            {/* Post Button */}
                            <div className="w-full xl:w-[90%] mt-4 flex justify-center xl:justify-start">
                                <button
                                    onClick={() => setIsPostModalOpen(true)}
                                    className="w-[50px] h-[50px] xl:w-full xl:h-[50px] bg-white hover:bg-[#d7dbdc] text-black rounded-full font-bold text-[17px] transition-colors shadow-sm flex items-center justify-center p-0"
                                >
                                    <span className="hidden xl:inline">Post</span>
                                    <svg viewBox="0 0 24 24" aria-hidden="true" className="w-[24px] h-[24px] fill-black xl:hidden"><g><path d="M23 3c-6.62-.1-10.38 2.421-13.05 6.03C7.29 12.61 6 17.331 6 22h2c0-1.007.07-2.012.19-3H12c4.1 0 7.48-3.082 7.94-7.054C22.79 10.147 23.17 6.359 23 3zm-7 8h-1.5v2H16c.63-.016 1.2-.08 1.72-.188C16.95 15.24 14.68 17 12 17H8.55c.57-2.512 1.57-4.851 3-6.78 2.16-2.912 5.29-4.911 9.45-5.187C20.95 8.079 19.9 11 16 11zM4 9V6H1V4h3V1h2v3h3v2H6v3H4z"></path></g></svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Bottom User Area */}
                    {user && (
                        <div className="relative mt-auto pt-2 shrink-0 w-full flex justify-center xl:justify-start bg-black z-20">
                            {/* Popover */}
                            {isAccountMenuOpen && (
                                <>
                                    {/* Invisible backdrop to close on click outside */}
                                    <div className="fixed inset-0 z-40" onClick={() => setIsAccountMenuOpen(false)}></div>
                                    <div className="absolute bottom-full left-0 mb-4 w-[300px] bg-black border border-[#2f3336] rounded-xl shadow-[0_0_15px_rgba(255,255,255,0.2)] py-3 z-50 flex flex-col font-bold text-[15px]">
                                        <button
                                            onClick={() => {
                                                setIsAccountMenuOpen(false)
                                                setIsAuthModalOpen(true)
                                            }}
                                            className="px-4 py-3 text-left text-white hover:bg-white/[0.03] transition-colors"
                                        >
                                            Add an existing account
                                        </button>
                                        <button
                                            onClick={handleLogout}
                                            className="px-4 py-3 text-left text-white hover:bg-white/[0.03] transition-colors"
                                        >
                                            Log out @{user.handle || user.username}
                                        </button>
                                    </div>
                                </>
                            )}

                            <button
                                onClick={() => setIsAccountMenuOpen(true)}
                                className="p-2 xl:p-3 w-[50px] xl:w-full rounded-full hover:bg-white/[0.1] transition-colors flex items-center justify-center xl:justify-between mb-4 mt-auto focus:outline-none"
                            >
                                <div className="flex items-center gap-3 w-full">
                                    <div className="w-10 h-10 rounded-full bg-[#333639] shrink-0 overflow-hidden flex items-center justify-center">
                                        <Avatar url={user.avatar_url} name={user.name || user.username} />
                                    </div>
                                    <div className="hidden xl:flex flex-col items-start min-w-0 flex-1">
                                        <span className="font-bold text-white truncate w-full text-left">{user.name || user.username}</span>
                                        <span className={`${textClasses.muted} truncate -mt-1 w-full text-left`}>@{user.handle || user.username}</span>
                                    </div>
                                    <div className="hidden xl:block shrink-0">
                                        <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5 fill-white"><g><path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"></path></g></svg>
                                    </div>
                                </div>
                            </button>
                        </div>
                    )}
                </header>

                {/* Main Feed Column */}
                <main className="flex-1 w-full max-w-[600px] sm:border-r border-[#2f3336] min-h-screen pb-[60px] sm:pb-0 relative">
                    {/* Mobile Top Header */}
                    <div className="sm:hidden sticky top-0 z-30 bg-black/80 backdrop-blur-md border-b border-[#2f3336] px-4 py-3 flex items-center justify-between">
                        {user && (
                            <button onClick={() => setIsAccountMenuOpen(true)}>
                                <div className="w-8 h-8 rounded-full bg-[#333639] shrink-0 overflow-hidden flex items-center justify-center">
                                    <Avatar url={user.avatar_url} name={user.name || user.username} />
                                </div>
                            </button>
                        )}
                        <Link to="/home" className="flex items-center justify-center absolute left-1/2 -translate-x-1/2">
                            <svg viewBox="0 0 24 24" aria-hidden="true" className="w-6 h-6 fill-white"><g><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.008 5.96H5.078z"></path></g></svg>
                        </Link>
                        <div className="w-8" /> {/* Spacer for centering */}
                    </div>

                    {children}

                    {/* Mobile Floating Action Button */}
                    <button
                        onClick={() => setIsPostModalOpen(true)}
                        className="sm:hidden fixed bottom-[76px] right-4 w-[56px] h-[56px] bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white rounded-full flex items-center justify-center shadow-lg transition-colors z-20"
                    >
                        <svg viewBox="0 0 24 24" aria-hidden="true" className="w-6 h-6 fill-current"><g><path d="M23 3c-6.62-.1-10.38 2.421-13.05 6.03C7.29 12.61 6 17.331 6 22h2c0-1.007.07-2.012.19-3H12c4.1 0 7.48-3.082 7.94-7.054C22.79 10.147 23.17 6.359 23 3zm-7 8h-1.5v2H16c.63-.016 1.2-.08 1.72-.188C16.95 15.24 14.68 17 12 17H8.55c.57-2.512 1.57-4.851 3-6.78 2.16-2.912 5.29-4.911 9.45-5.187C20.95 8.079 19.9 11 16 11zM4 9V6H1V4h3V1h2v3h3v2H6v3H4z"></path></g></svg>
                    </button>
                </main>

                {/* Mobile Bottom Navigation */}
                <nav className="sm:hidden fixed bottom-0 left-0 w-full bg-black border-t border-[#2f3336] flex justify-around items-center h-[60px] z-30">
                    {NAV_ITEMS.filter(item => ['Home', 'Explore', 'Notifications', 'Chat'].includes(item.name)).map(item => {
                        const isActive = location.pathname.startsWith(item.path)
                        return (
                            <Link key={item.name} to={item.path} className="flex-1 flex justify-center py-2 h-full flex flex-col items-center justify-center">
                                <div className="relative">
                                    {isActive ? item.activeIcon : item.icon}
                                </div>
                            </Link>
                        )
                    })}
                </nav>

                {/* Right Sidebar (Search & Trends) */}
                <div className="hidden lg:block w-[350px] shrink-0 pl-8 pr-4 py-2">
                    <div className="sticky top-2 z-20">
                        <SearchBar />
                    </div>
                </div>
            </div>

            {/* Modals */}
            {isPostModalOpen && <PostModal onClose={() => setIsPostModalOpen(false)} />}
            {isAuthModalOpen && <AuthModal onClose={() => setIsAuthModalOpen(false)} />}
        </div >
    )
}
