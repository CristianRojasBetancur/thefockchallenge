import { TweetForm } from './TweetForm'


export function PostModal({ onClose }: { onClose: () => void }) {
    const handleTweetCreated = () => {
        onClose()
        // Here we could technically dispatch an event or refresh timeline if needed.
        // For simplicity, a page reload or context update could work, but 
        // Twitter sometimes just prepends. The timeline might reload on focus.
        // Given existing constraints, we'll try simply refreshing window or similar.
        window.location.reload()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-0 sm:pt-[5%] bg-[#5b7083]/40" onClick={onClose}>
            <div
                className="bg-black w-full h-full sm:h-auto sm:max-w-[600px] sm:rounded-2xl min-h-[250px] shadow-[0_0_15px_rgba(255,255,255,0.2)] p-2 sm:p-4 relative flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between pb-2">
                    <button
                        onClick={onClose}
                        className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/[0.1] transition-colors"
                    >
                        <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5 fill-white">
                            <g><path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"></path></g>
                        </svg>
                    </button>
                    <div className="flex-1 px-4 font-bold text-white text-lg">Drafts</div>
                </div>
                {/* Reusing existing TweetForm */}
                <div className="pt-2 px-2 -mx-4 border-t border-transparent">
                    <TweetForm onTweetCreated={handleTweetCreated} />
                </div>
            </div>
        </div>
    )
}
