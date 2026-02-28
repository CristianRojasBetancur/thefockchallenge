import { SearchBar } from '../components/SearchBar'
import { textClasses } from '../styles/classes'

export function ExplorePage() {
    return (
        <div className="flex flex-col h-full">
            <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-md border-b border-[#2f3336] p-3">
                <SearchBar />
            </div>
            
            <div className="p-4 mt-8 flex flex-col items-center">
                <h1 className={`${textClasses.heading} mb-2`}>Explore X</h1>
                <p className={textClasses.muted}>Search for users to see their profiles and follow them.</p>
            </div>
        </div>
    )
}
