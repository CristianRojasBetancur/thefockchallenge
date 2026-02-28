import { Timeline } from '../components/Timeline'
import { usePageTitle } from '../hooks/usePageTitle'

/**
 * Main authenticated landing page containing the Timeline.
 */
export function HomePage() {
    usePageTitle('Home')

    return (
        <div className="min-h-screen bg-black flex justify-center">
            <Timeline />
        </div>
    )
}
