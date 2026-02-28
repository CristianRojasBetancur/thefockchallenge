import { useState, useRef, type ChangeEvent, type FormEvent } from 'react'
import type { User } from '../types/auth'
import { Button } from './ui/Button'
import { updateProfile } from '../api/users'
import { ApiRequestError } from '../api/client'
import { Avatar } from './Avatar'

interface EditProfileModalProps {
    user: User
    onClose: () => void
    onSaveSuccess: (updatedUser: User) => void
}

const MAX_NAME = 50
const MAX_BIO = 160
const MAX_LOCATION = 30
const MAX_WEBSITE = 100

export function EditProfileModal({ user, onClose, onSaveSuccess }: EditProfileModalProps) {
    const [name, setName] = useState(user.name || '')
    const [bio, setBio] = useState(user.bio || '')
    const [location, setLocation] = useState(user.location || '')
    const [website, setWebsite] = useState(user.website || '')

    const [avatarFile, setAvatarFile] = useState<File | null>(null)
    const [avatarPreview, setAvatarPreview] = useState<string | null>(user.avatar_url || null)

    const [bannerFile, setBannerFile] = useState<File | null>(null)
    const [bannerPreview, setBannerPreview] = useState<string | null>(user.banner_url || null)

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const avatarInputRef = useRef<HTMLInputElement>(null)
    const bannerInputRef = useRef<HTMLInputElement>(null)

    // Validation checks
    const hasChanges =
        name !== (user.name || '') ||
        bio !== (user.bio || '') ||
        location !== (user.location || '') ||
        website !== (user.website || '') ||
        avatarFile !== null ||
        bannerFile !== null

    const isValid =
        name.trim().length > 0 &&
        name.length <= MAX_NAME &&
        bio.length <= MAX_BIO &&
        location.length <= MAX_LOCATION &&
        website.length <= MAX_WEBSITE

    const isDisabled = !hasChanges || !isValid || isLoading

    const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setAvatarFile(file)
            setAvatarPreview(URL.createObjectURL(file))
        }
    }

    const handleBannerChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setBannerFile(file)
            setBannerPreview(URL.createObjectURL(file))
        }
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        if (isDisabled) return

        setIsLoading(true)
        setError(null)

        try {
            const formData = new FormData()
            formData.append('user[name]', name)
            formData.append('user[bio]', bio)
            formData.append('user[location]', location)
            formData.append('user[website]', website)

            if (avatarFile) {
                formData.append('user[avatar]', avatarFile)
            }
            if (bannerFile) {
                formData.append('user[banner]', bannerFile)
            }

            const updatedUser = await updateProfile(formData)
            onSaveSuccess(updatedUser)
            onClose()
        } catch (err) {
            if (err instanceof ApiRequestError) {
                const body = err.body as { errors?: string[] }
                setError(body.errors?.[0] || 'Failed to update profile')
            } else {
                setError('A network error occurred.')
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#5b7083]/40" onClick={onClose}>
            <div
                className="bg-black w-full max-w-[600px] h-full sm:h-auto sm:min-h-[400px] sm:max-h-[90vh] rounded-2xl flex flex-col relative overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 z-20 bg-black/80 backdrop-blur-md flex items-center justify-between px-4 py-2 h-[53px]">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={onClose}
                            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
                        >
                            <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5 fill-white">
                                <g><path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"></path></g>
                            </svg>
                        </button>
                        <h2 className="text-xl font-bold text-white">Edit profile</h2>
                    </div>
                    <Button
                        onClick={handleSubmit}
                        disabled={isDisabled}
                        isLoading={isLoading}
                        className="!w-auto !px-4 !py-1.5 !text-[15px] font-bold bg-white text-black hover:bg-[#d7dbdc] disabled:bg-white/50"
                    >
                        Save
                    </Button>
                </div>

                <div className="overflow-y-auto flex-1 pb-8">
                    {/* Banner Editor */}
                    <div className="h-[200px] bg-[#333639] w-full relative group flex items-center justify-center">
                        {bannerPreview && <img src={bannerPreview} alt="Banner" className="w-full h-full object-cover" />}
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center gap-4">
                            <button
                                type="button"
                                onClick={() => bannerInputRef.current?.click()}
                                className="w-11 h-11 bg-black/60 hover:bg-black/50 transition-colors rounded-full flex items-center justify-center cursor-pointer backdrop-blur-sm"
                            >
                                <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5 fill-white"><g><path d="M9.697 3H11v2h-.697l-3 2H5c-.276 0-.5.224-.5.5v11c0 .276.224.5.5.5h14c.276 0 .5-.224.5-.5V10h2v8.5c0 1.381-1.119 2.5-2.5 2.5H5c-1.381 0-2.5-1.119-2.5-2.5v-11C2.5 6.119 3.619 5 5 5h1.697l3-2zM12 10.5c-1.105 0-2 .895-2 2s.895 2 2 2 2-.895 2-2-.895-2-2-2zm-4 2c0-2.209 1.791-4 4-4s4 1.791 4 4-1.791 4-4 4-4-1.791-4-4zM17 2c0 1.657-1.343 3-3 3v1c1.657 0 3 1.343 3 3h1c0-1.657 1.343-3 3-3V2h-1c0 1.657-1.343 3-3 3h-1c-1.657 0-3-1.343-3-3v1z"></path></g></svg>
                            </button>
                            {bannerPreview && (
                                <button
                                    type="button"
                                    onClick={() => { setBannerFile(null); setBannerPreview(null); }}
                                    className="w-11 h-11 bg-black/60 hover:bg-black/50 transition-colors rounded-full flex items-center justify-center cursor-pointer backdrop-blur-sm"
                                >
                                    <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5 fill-white"><g><path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"></path></g></svg>
                                </button>
                            )}
                        </div>
                        <input type="file" ref={bannerInputRef} onChange={handleBannerChange} className="hidden" accept="image/*" />
                    </div>

                    {/* Avatar Editor */}
                    <div className="px-4 relative mb-4">
                        <div className="absolute -top-[56px] w-[112px] h-[112px] rounded-full border-4 border-black bg-[#333639] overflow-hidden flex items-center justify-center group">
                            <Avatar url={avatarPreview} name={user.name || user.username} />
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-100 transition-opacity">
                                <button
                                    type="button"
                                    onClick={() => avatarInputRef.current?.click()}
                                    className="w-11 h-11 bg-black/60 hover:bg-black/50 transition-colors rounded-full flex items-center justify-center cursor-pointer backdrop-blur-sm"
                                >
                                    <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5 fill-white"><g><path d="M9.697 3H11v2h-.697l-3 2H5c-.276 0-.5.224-.5.5v11c0 .276.224.5.5.5h14c.276 0 .5-.224.5-.5V10h2v8.5c0 1.381-1.119 2.5-2.5 2.5H5c-1.381 0-2.5-1.119-2.5-2.5v-11C2.5 6.119 3.619 5 5 5h1.697l3-2zM12 10.5c-1.105 0-2 .895-2 2s.895 2 2 2 2-.895 2-2-.895-2-2-2zm-4 2c0-2.209 1.791-4 4-4s4 1.791 4 4-1.791 4-4 4-4-1.791-4-4zM17 2c0 1.657-1.343 3-3 3v1c1.657 0 3 1.343 3 3h1c0-1.657 1.343-3 3-3V2h-1c0 1.657-1.343 3-3 3h-1c-1.657 0-3-1.343-3-3v1z"></path></g></svg>
                                </button>
                            </div>
                        </div>
                        <input type="file" ref={avatarInputRef} onChange={handleAvatarChange} className="hidden" accept="image/*" />
                    </div>

                    {/* Form Fields */}
                    <div className="px-4 mt-[72px] flex flex-col gap-6">
                        {error && (
                            <div className="rounded-md bg-[#f4212e]/20 p-3 text-[#f4212e] text-[15px]">
                                {error}
                            </div>
                        )}

                        <div className="relative group rounded focus-within:ring-2 focus-within:ring-[#1d9bf0] border border-[#333639] focus-within:border-transparent transition-all">
                            <label className="absolute top-2 left-2 text-[13px] text-[#71767b] group-focus-within:text-[#1d9bf0]">Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                maxLength={MAX_NAME}
                                className="w-full bg-transparent text-white pt-6 pb-2 px-2 outline-none text-[17px]"
                            />
                            <span className="absolute top-2 right-2 text-[13px] text-[#71767b] hidden group-focus-within:block">
                                {name.length} / {MAX_NAME}
                            </span>
                        </div>

                        <div className="relative group rounded focus-within:ring-2 focus-within:ring-[#1d9bf0] border border-[#333639] focus-within:border-transparent transition-all">
                            <label className="absolute top-2 left-2 text-[13px] text-[#71767b] group-focus-within:text-[#1d9bf0]">Bio</label>
                            <textarea
                                value={bio}
                                onChange={e => setBio(e.target.value)}
                                maxLength={MAX_BIO}
                                rows={3}
                                className="w-full bg-transparent text-white pt-6 pb-2 px-2 outline-none text-[17px] resize-none"
                            />
                            <span className="absolute top-2 right-2 text-[13px] text-[#71767b] hidden group-focus-within:block">
                                {bio.length} / {MAX_BIO}
                            </span>
                        </div>

                        <div className="relative group rounded focus-within:ring-2 focus-within:ring-[#1d9bf0] border border-[#333639] focus-within:border-transparent transition-all">
                            <label className="absolute top-2 left-2 text-[13px] text-[#71767b] group-focus-within:text-[#1d9bf0]">Location</label>
                            <input
                                type="text"
                                value={location}
                                onChange={e => setLocation(e.target.value)}
                                maxLength={MAX_LOCATION}
                                className="w-full bg-transparent text-white pt-6 pb-2 px-2 outline-none text-[17px]"
                            />
                            <span className="absolute top-2 right-2 text-[13px] text-[#71767b] hidden group-focus-within:block">
                                {location.length} / {MAX_LOCATION}
                            </span>
                        </div>

                        <div className="relative group rounded focus-within:ring-2 focus-within:ring-[#1d9bf0] border border-[#333639] focus-within:border-transparent transition-all mb-4">
                            <label className="absolute top-2 left-2 text-[13px] text-[#71767b] group-focus-within:text-[#1d9bf0]">Website</label>
                            <input
                                type="text"
                                value={website}
                                onChange={e => setWebsite(e.target.value)}
                                maxLength={MAX_WEBSITE}
                                className="w-full bg-transparent text-white pt-6 pb-2 px-2 outline-none text-[17px]"
                            />
                            <span className="absolute top-2 right-2 text-[13px] text-[#71767b] hidden group-focus-within:block">
                                {website.length} / {MAX_WEBSITE}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
