import type { ReactNode } from 'react'
import { SearchBar } from '../SearchBar'

export function MainLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-black flex justify-center w-full">
            <div className="flex w-full max-w-[1050px] justify-between">
                
                {/* Left Sidebar (Navigation placeholders, Auth logic, etc. usually go here) */}
                <div className="w-[68px] xl:w-[275px] shrink-0 border-r border-[#2f3336] p-2 flex flex-col justify-between">
                    {/* Placeholder for left navigation */}
                    <div className="p-3 text-white font-bold opacity-30">X</div>
                </div>

                {/* Main Feed Column */}
                <main className="w-full max-w-[600px] border-r border-[#2f3336]">
                    {children}
                </main>

                {/* Right Sidebar (Search & Trends) */}
                <div className="hidden lg:block w-[350px] shrink-0 pl-8 pr-4 py-2">
                    <div className="sticky top-2 z-20">
                        <SearchBar />
                    </div>
                </div>
            </div>
        </div>
    )
}
