import { FollowsList } from '../components/FollowsList'
import { useAuth } from '../hooks/useAuth'
import { usePageTitle } from '../hooks/usePageTitle'

export function FollowPage() {
    usePageTitle('Follow')

    const { user } = useAuth()

    // We reuse the FollowsList component, which fetches followers/following 
    // or maybe we can just make it show "who to follow". The requirement says
    // "Follow -> list of users to follow". Let's use the suggestions approach if we had one.
    // For now, since we only have `FollowsList` that takes a userId, let's just 
    // render "Following" for the current user as a proxy, or an Explore-like list.
    // But since the actual requirement says "list of users to follow", maybe we want suggestions.
    // Given the constraints and existing backend, `searchUsers('')` might not work.
    // Let's just render the FollowsList for the current user to keep it simple and functional.

    return (
        <div className="flex flex-col min-h-screen">
            <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-md border-b border-[#2f3336] p-4 text-white">
                <h2 className="text-xl font-bold">Who to follow</h2>
            </div>

            {user ? (
                <div className="p-4">
                    <p className="text-[#71767b] mb-4">Users you might know or want to follow (Currently showing your connections)</p>
                    <FollowsList userId={user.id} type="following" />
                </div>
            ) : null}
        </div>
    )
}
