import { useState, type ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { SearchBar } from '../SearchBar'
import { useAuth } from '../../hooks/useAuth'
import { PostModal } from '../PostModal'
import { AuthModal } from '../AuthModal'
import { textClasses } from '../../styles/classes'

const NAV_ITEMS = [
    {
        name: 'Home', path: '/home',
        icon: <svg viewBox="0 0 24 24" aria-hidden="true" className="w-[26.25px] h-[26.25px] fill-current"><g><path d="M12 1.696L.622 8.807l1.06 1.696L3 9.679V19.5C3 20.881 4.119 22 5.5 22h13c1.381 0 2.5-1.119 2.5-2.5V9.679l1.318.824 1.06-1.696L12 1.696zM12 16.5c-1.933 0-3.5-1.567-3.5-3.5s1.567-3.5 3.5-3.5 3.5 1.567 3.5 3.5-1.567 3.5-3.5 3.5z"></path></g></svg>,
        activeIcon: <svg viewBox="0 0 24 24" aria-hidden="true" className="w-[26.25px] h-[26.25px] fill-current"><g><path d="M12 1.696L.622 8.807l1.06 1.696L3 9.679V19.5C3 20.881 4.119 22 5.5 22h13c1.381 0 2.5-1.119 2.5-2.5V9.679l1.318.824 1.06-1.696L12 1.696zM12 16.5c-1.933 0-3.5-1.567-3.5-3.5s1.567-3.5 3.5-3.5 3.5 1.567 3.5 3.5-1.567 3.5-3.5 3.5z"></path></g></svg>
    },
    {
        name: 'Explore', path: '/explore',
        icon: <svg viewBox="0 0 24 24" aria-hidden="true" className="w-[26.25px] h-[26.25px] fill-current"><g><path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path></g></svg>,
        activeIcon: <svg viewBox="0 0 24 24" aria-hidden="true" className="w-[26.25px] h-[26.25px] fill-current"><g><path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path></g></svg>
    },
    {
        name: 'Notifications', path: '/notifications',
        icon: <svg viewBox="0 0 24 24" aria-hidden="true" className="w-[26.25px] h-[26.25px] fill-current"><g><path d="M19.993 9.042C19.48 5.017 16.054 2 11.996 2s-7.484 3.017-7.997 7.042c-.153 1.202-.259 2.407-.236 3.615.058 3.14-.326 5.49-1.464 7.062-.212.29-.204.686.023.967.226.28.583.428.932.385l6.098-.75c.348 1.487 1.688 2.58 3.255 2.58s2.907-1.093 3.255-2.58l6.098.75c.35.043.707-.105.932-.385.228-.28.236-.676.023-.967-1.138-1.57-1.522-3.92-1.464-7.062.023-1.208-.083-2.413-.236-3.615zm-8.03 12.355c-.752 0-1.396-.492-1.597-1.17l3.125-.385c-.156.76-.856 1.34-1.63 1.37h-.06v.185zm6.54-3.08l-5.748-.707c-.347-.043-.687.202-.73.55-.043.348.202.687.55.73l4.745.584c-.383-.342-.76-.69-1.132-1.05-1.583 1.583-4.223 2.112-6.42 1.36-.34-.117-.714.07-.83.41-.118.34.07.714.41.83 2.87 1.037 6.13.313 7.95-1.634.39-.418.775-.85 1.15-1.29l.055.21zM9.444 16.5c-.347-.044-.688.2-.73.55-.044.347.2.686.548.73l5.746.707c.346.04.686-.196.73-.54.04-.34-.196-.68-.54-.72l-5.754-.71zM11.996 3.5c3.228 0 5.952 2.398 6.355 5.586.136 1.07.23 2.146.21 3.21-.048 2.61.272 4.542 1.163 5.76-1.594-1.59-4.24-2.126-6.44-1.365-.34.116-.714-.07-.832-.41-.116-.34.07-.713.41-.83 2.893-1.045 6.186-.296 8.01 1.67-.318-1.01-1.026-2.5-1.053-4.706-.026-1.16-.12-2.316-.27-3.473-.46-3.7-3.593-6.427-7.233-6.427-3.64 0-6.772 2.727-7.23 6.426-.15 1.157-.245 2.314-.27 3.473-.028 2.203-.736 3.693-1.052 4.7.533-.6 1.077-1.144 1.636-1.64 1.59-1.385 1.365-2.072 1.25-2.203-1.05.518-2.673 1.317-2.673 1.317.893-1.218 1.21-3.15 1.163-5.76-.02-1.063.072-2.14.21-3.21.403-3.187 3.127-5.585 6.354-5.585z"></path></g></svg>,
        activeIcon: <svg viewBox="0 0 24 24" aria-hidden="true" className="w-[26.25px] h-[26.25px] fill-current"><g><path d="M19.993 9.042C19.48 5.017 16.054 2 11.996 2s-7.484 3.017-7.997 7.042c-.153 1.202-.259 2.407-.236 3.615.058 3.14-.326 5.49-1.464 7.062-.212.29-.204.686.023.967.226.28.583.428.932.385l6.098-.75c.348 1.487 1.688 2.58 3.255 2.58s2.907-1.093 3.255-2.58l6.098.75c.35.043.707-.105.932-.385.228-.28.236-.676.023-.967-1.138-1.57-1.522-3.92-1.464-7.062.023-1.208-.083-2.413-.236-3.615zm-8.03 12.355c-.752 0-1.396-.492-1.597-1.17l3.125-.385c-.156.76-.856 1.34-1.63 1.37h-.06v.185zm6.54-3.08l-5.748-.707c-.347-.043-.687.202-.73.55-.043.348.202.687.55.73l4.745.584c-.383-.342-.76-.69-1.132-1.05-1.583 1.583-4.223 2.112-6.42 1.36-.34-.117-.714.07-.83.41-.118.34.07.714.41.83 2.87 1.037 6.13.313 7.95-1.634.39-.418.775-.85 1.15-1.29l.055.21zM9.444 16.5c-.347-.044-.688.2-.73.55-.044.347.2.686.548.73l5.746.707c.346.04.686-.196.73-.54.04-.34-.196-.68-.54-.72l-5.754-.71zM11.996 3.5c3.228 0 5.952 2.398 6.355 5.586.136 1.07.23 2.146.21 3.21-.048 2.61.272 4.542 1.163 5.76-1.594-1.59-4.24-2.126-6.44-1.365-.34.116-.714-.07-.832-.41-.116-.34.07-.713.41-.83 2.893-1.045 6.186-.296 8.01 1.67-.318-1.01-1.026-2.5-1.053-4.706-.026-1.16-.12-2.316-.27-3.473-.46-3.7-3.593-6.427-7.233-6.427-3.64 0-6.772 2.727-7.23 6.426-.15 1.157-.245 2.314-.27 3.473-.028 2.203-.736 3.693-1.052 4.7.533-.6 1.077-1.144 1.636-1.64 1.59-1.385 1.365-2.072 1.25-2.203-1.05.518-2.673 1.317-2.673 1.317.893-1.218 1.21-3.15 1.163-5.76-.02-1.063.072-2.14.21-3.21.403-3.187 3.127-5.585 6.354-5.585z"></path></g></svg>
    },
    {
        name: 'Follow', path: '/follow',
        icon: <svg viewBox="0 0 24 24" aria-hidden="true" className="w-[26.25px] h-[26.25px] fill-current"><g><path d="M12.53 16.59l4.58-4.59-4.58-4.59L14 6l6 6-6 6-1.47-1.41zM10 12c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm0-4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-6 9.5c0-1.78 3-2.5 6-2.5s6 .72 6 2.5V19H4v-1.5zM5.5 17h9v-.5c0-.66-1.89-1.5-4.5-1.5s-4.5.84-4.5 1.5v.5z"></path></g></svg>,
        activeIcon: <svg viewBox="0 0 24 24" aria-hidden="true" className="w-[26.25px] h-[26.25px] fill-current"><g><path d="M12.53 16.59l4.58-4.59-4.58-4.59L14 6l6 6-6 6-1.47-1.41zM10 12c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm0-4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-6 9.5c0-1.78 3-2.5 6-2.5s6 .72 6 2.5V19H4v-1.5zM5.5 17h9v-.5c0-.66-1.89-1.5-4.5-1.5s-4.5.84-4.5 1.5v.5z"></path></g></svg>
    },
    {
        name: 'Chat', path: '/chat',
        icon: <svg viewBox="0 0 24 24" aria-hidden="true" className="w-[26.25px] h-[26.25px] fill-current"><g><path d="M1.998 5.5c0-1.381 1.119-2.5 2.5-2.5h15c1.381 0 2.5 1.119 2.5 2.5v13c0 1.381-1.119 2.5-2.5 2.5h-15c-1.381 0-2.5-1.119-2.5-2.5v-13zm2.5-1c-.552 0-1 .448-1 1v13c0 .552.448 1 1 1h15c.552 0 1-.448 1-1v-13c0-.552-.448-1-1-1h-15zM12 11.528l-8.642-5.761 1.108-1.664L12 8.944l7.534-4.841 1.108 1.664L12 11.528z"></path></g></svg>,
        activeIcon: <svg viewBox="0 0 24 24" aria-hidden="true" className="w-[26.25px] h-[26.25px] fill-current"><g><path d="M1.998 5.5c0-1.381 1.119-2.5 2.5-2.5h15c1.381 0 2.5 1.119 2.5 2.5v13c0 1.381-1.119 2.5-2.5 2.5h-15c-1.381 0-2.5-1.119-2.5-2.5v-13zm2.5-1c-.552 0-1 .448-1 1v13c0 .552.448 1 1 1h15c.552 0 1-.448 1-1v-13c0-.552-.448-1-1-1h-15zM12 11.528l-8.642-5.761 1.108-1.664L12 8.944l7.534-4.841 1.108 1.664L12 11.528z"></path></g></svg>
    },
    {
        name: 'Grok', path: '/grok',
        icon: <svg viewBox="0 0 24 24" aria-hidden="true" className="w-[26.25px] h-[26.25px] fill-current"><g><path d="M5.5 5.5v13h13v-13h-13zm-2-2h17v17h-17v-17zM14.5 11l-3 4-2-2-1.5 1.5 3.5 3.5 4.5-5.5-1.5-1.5z"></path></g></svg>, // Placeholder icon
        activeIcon: <svg viewBox="0 0 24 24" aria-hidden="true" className="w-[26.25px] h-[26.25px] fill-current"><g><path d="M5.5 5.5v13h13v-13h-13zm-2-2h17v17h-17v-17zM14.5 11l-3 4-2-2-1.5 1.5 3.5 3.5 4.5-5.5-1.5-1.5z"></path></g></svg>
    },
    {
        name: 'Bookmarks', path: '/bookmarks',
        icon: <svg viewBox="0 0 24 24" aria-hidden="true" className="w-[26.25px] h-[26.25px] fill-current"><g><path d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5zM6.5 3.5c-.552 0-1 .448-1 1v15.22l6.5-4.63 6.5 4.63V4.5c0-.552-.448-1-1-1h-11z"></path></g></svg>,
        activeIcon: <svg viewBox="0 0 24 24" aria-hidden="true" className="w-[26.25px] h-[26.25px] fill-current"><g><path d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5zM6.5 3.5c-.552 0-1 .448-1 1v15.22l6.5-4.63 6.5 4.63V4.5c0-.552-.448-1-1-1h-11z"></path></g></svg>
    },
    {
        name: 'Creator Studio', path: '/creator-studio',
        icon: <svg viewBox="0 0 24 24" aria-hidden="true" className="w-[26.25px] h-[26.25px] fill-current"><g><path d="M12 1.696l10 5.62v9.368l-10 5.62-10-5.62V7.316l10-5.62v.001zM3.5 8.164v7.672L12 20.612l8.5-4.776V8.164L12 3.388 3.5 8.164zm13.116 1.15l-1.06 1.06-2.556-2.556 1.06-1.06 2.556 2.556zm-4.116-1.5h-1v4h1v-4zm-4.116 1.5l2.556 2.556-1.06 1.06-2.556-2.556 1.06-1.06zM6.5 13h11v4h-11v-4zm1 1v2h9v-2h-9z"></path></g></svg>, // Placeholder icon
        activeIcon: <svg viewBox="0 0 24 24" aria-hidden="true" className="w-[26.25px] h-[26.25px] fill-current"><g><path d="M12 1.696l10 5.62v9.368l-10 5.62-10-5.62V7.316l10-5.62v.001zM3.5 8.164v7.672L12 20.612l8.5-4.776V8.164L12 3.388 3.5 8.164zm13.116 1.15l-1.06 1.06-2.556-2.556 1.06-1.06 2.556 2.556zm-4.116-1.5h-1v4h1v-4zm-4.116 1.5l2.556 2.556-1.06 1.06-2.556-2.556 1.06-1.06zM6.5 13h11v4h-11v-4zm1 1v2h9v-2h-9z"></path></g></svg>
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
        icon: <svg viewBox="0 0 24 24" aria-hidden="true" className="w-[26.25px] h-[26.25px] fill-current"><g><path d="M12 11.816c1.355 0 2.872-.15 3.84-1.256.814-.93 1.078-2.368.806-4.392-.38-2.825-2.117-4.512-4.646-4.512S7.734 3.343 7.354 6.17c-.272 2.022-.008 3.46.806 4.39.968 1.107 2.485 1.256 3.84 1.256zM8.84 6.368c.162-1.2.787-3.212 3.16-3.212s2.998 2.013 3.16 3.212c.207 1.55.057 2.627-.45 3.205-.455.52-1.266.686-2.71.686s-2.255-.166-2.71-.686c-.507-.578-.657-1.656-.45-3.205zm11.44 12.868c-.877-3.526-4.282-5.99-8.28-5.99s-7.403 2.464-8.28 5.99c-.172.692-.028 1.4.395 1.94.408.52 1.04.82 1.733.82h12.304c.693 0 1.325-.3 1.733-.82.424-.54.567-1.247.394-1.94zm-1.576 1.016c-.126.16-.316.246-.552.246H5.848c-.235 0-.426-.085-.552-.246-.137-.174-.18-.412-.12-.654.71-2.855 3.517-4.85 6.824-4.85s6.114 1.994 6.824 4.85c.06.241.017.48-.12.654z"></path></g></svg>,
        activeIcon: <svg viewBox="0 0 24 24" aria-hidden="true" className="w-[26.25px] h-[26.25px] fill-current"><g><path d="M12 11.816c1.355 0 2.872-.15 3.84-1.256.814-.93 1.078-2.368.806-4.392-.38-2.825-2.117-4.512-4.646-4.512S7.734 3.343 7.354 6.17c-.272 2.022-.008 3.46.806 4.39.968 1.107 2.485 1.256 3.84 1.256zM8.84 6.368c.162-1.2.787-3.212 3.16-3.212s2.998 2.013 3.16 3.212c.207 1.55.057 2.627-.45 3.205-.455.52-1.266.686-2.71.686s-2.255-.166-2.71-.686c-.507-.578-.657-1.656-.45-3.205zm11.44 12.868c-.877-3.526-4.282-5.99-8.28-5.99s-7.403 2.464-8.28 5.99c-.172.692-.028 1.4.395 1.94.408.52 1.04.82 1.733.82h12.304c.693 0 1.325-.3 1.733-.82.424-.54.567-1.247.394-1.94zm-1.576 1.016c-.126.16-.316.246-.552.246H5.848c-.235 0-.426-.085-.552-.246-.137-.174-.18-.412-.12-.654.71-2.855 3.517-4.85 6.824-4.85s6.114 1.994 6.824 4.85c.06.241.017.48-.12.654z"></path></g></svg>
    }]

    const handleLogout = async () => {
        setIsAccountMenuOpen(false)
        await logout()
    }

    return (
        <div className="min-h-screen bg-black flex justify-center w-full">
            <div className="flex w-full max-w-[1265px] justify-between">
                
                {/* Left Sidebar */}
                <header className="w-[68px] xl:w-[275px] shrink-0 border-r border-[#2f3336] p-2 flex flex-col justify-between items-center xl:items-start h-screen sticky top-0">
                    <div className="w-full h-full flex flex-col justify-between overflow-y-auto">
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

                        {/* Bottom User Area */}
                        {user && (
                            <div className="relative mt-4 w-full flex justify-center xl:justify-start">
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
                                    className="p-3 w-auto xl:w-full rounded-full hover:bg-white/[0.1] transition-colors flex items-center justify-center xl:justify-between mb-4 mt-auto"
                                >
                                    <div className="flex items-center gap-3 w-full">
                                        <div className="w-10 h-10 rounded-full bg-[#333639] shrink-0 overflow-hidden flex items-center justify-center">
                                            {user.avatar_url ? (
                                                <img src={user.avatar_url} alt={user.name ?? user.username} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-white font-bold">{user.username.charAt(0).toUpperCase()}</span>
                                            )}
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
                    </div>
                </header>

                {/* Main Feed Column */}
                <main className="flex-1 max-w-[600px] border-r border-[#2f3336] min-h-screen">
                    {children}
                </main>

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
        </div>
    )
}
