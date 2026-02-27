import type { ReactNode } from 'react'
import { XLogo } from '../ui/XLogo'
import { authLayoutClasses } from '../../styles/classes'

interface AuthLayoutProps {
    children: ReactNode
}

/**
 * Split-screen layout matching X.com:
 * - Left panel: large X logo (desktop only)
 * - Right panel: form slot
 */
export function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className={authLayoutClasses.root}>
            {/* Left – logo panel (hidden on mobile) */}
            <div className={authLayoutClasses.leftPanel} aria-hidden="true">
                <XLogo className="h-72 w-72 fill-white" />
            </div>

            {/* Right – form panel */}
            <main className={authLayoutClasses.rightPanel}>
                <div className={authLayoutClasses.formWrapper}>
                    {/* Show logo on mobile (left panel is hidden) */}
                    <div className="flex lg:hidden mb-8">
                        <XLogo className="h-10 w-10 fill-white" />
                    </div>
                    {children}
                </div>
            </main>
        </div>
    )
}
