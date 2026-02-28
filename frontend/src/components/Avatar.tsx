interface AvatarProps {
    url: string | null
    name: string
    className?: string
}

export function Avatar({ url, name, className = "" }: AvatarProps) {
    // Use the default static avatar image as fallback
    const placeholderUrl = '/images/default_avatar.jpg'

    const imgSrc = url || placeholderUrl

    return (
        <img
            src={imgSrc}
            alt={name}
            className={`w-full h-full object-cover ${className}`}
        />
    )
}
