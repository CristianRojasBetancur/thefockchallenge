import { usePageTitle } from '../hooks/usePageTitle'
import { textClasses } from '../styles/classes'

export function NotificationsPage() {
    usePageTitle('Notifications')

    return (
        <div className="flex flex-col h-full">
            <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-md border-b border-[#2f3336] p-4 font-bold text-xl text-white">
                Notifications
            </div>

            <div className="flex flex-col items-center justify-center p-8 mt-16 text-center">
                <h1 className={`${textClasses.heading} mb-2`}>Notifications will be available soon</h1>
                <p className={textClasses.muted}>Nothing to see here—yet. From likes to reposts, all your notifications will live here.</p>
            </div>
        </div>
    )
}
