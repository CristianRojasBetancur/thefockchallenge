import { useEffect } from 'react'
// textClasses was unused
export function usePageTitle(title: string) {
    useEffect(() => {
        // Document title always defaults to X format, avoiding double "/ X"
        document.title = title.endsWith(' / X') ? title : `${title} / X`

        // This brings the title back on unmount optionally, but standard SPA router will just over-mount the new one
    }, [title])
}
