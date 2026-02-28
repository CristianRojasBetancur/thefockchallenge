import { Timeline } from '../components/Timeline'

/**
 * Main authenticated landing page containing the Timeline.
 */
export function HomePage() {
    return (
        <div className="min-h-screen bg-black flex justify-center">
            <Timeline />
        </div>
    )
}
