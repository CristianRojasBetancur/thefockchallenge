interface AvatarProps {
    url: string | null
    name: string
    className?: string
}

export function Avatar({ url, name, className = "" }: AvatarProps) {
    // Use a generic placeholder if there is no avatar URL
    // We use avatar.iran.liara.run to generate an avatar based on the name
    // Encoding the name prevents issues with spaces or special characters
    const placeholderUrl = `https://avatar.iran.liara.run/username?username=${encodeURIComponent(name)}`

    const imgSrc = url || placeholderUrl

    return (
        <img
            src={imgSrc}
            alt={name}
            className={`w-full h-full object-cover ${className}`}
        />
    )
}
