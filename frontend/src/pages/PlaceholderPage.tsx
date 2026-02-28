import { textClasses } from '../styles/classes'
import { usePageTitle } from '../hooks/usePageTitle'

interface PlaceholderPageProps {
    title: string
    message: string
}

export function PlaceholderPage({ title, message }: PlaceholderPageProps) {
    usePageTitle(title)

    return (
        <div className="flex flex-col items-center justify-center h-full min-h-[500px] px-8 text-center">
            <h1 className={`${textClasses.heading} mb-2`}>{title}</h1>
            <p className={textClasses.muted}>{message}</p>
        </div>
    )
}
