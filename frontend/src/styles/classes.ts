/**
 * Centralised Tailwind class strings for the X/Twitter clone UI.
 * Import these constants in components instead of repeating class strings.
 */

// ── Layout ──────────────────────────────────────────────────────────────────
export const authLayoutClasses = {
    root: 'min-h-screen bg-black flex',
    leftPanel: 'hidden lg:flex lg:flex-1 items-center justify-center bg-black',
    rightPanel: 'flex flex-1 flex-col justify-center px-8 sm:px-12 lg:px-16 py-12',
    formWrapper: 'w-full max-w-sm mx-auto',
}

// ── Typography ───────────────────────────────────────────────────────────────
export const textClasses = {
    heading: 'text-[31px] font-extrabold text-white tracking-tight',
    subheading: 'text-[23px] font-bold text-white mb-6',
    label: 'block text-[15px] font-medium text-[#e7e9ea] mb-1',
    helper: 'text-[13px] text-[#71767b] mt-1',
    error: 'text-[13px] text-[#f4212e] mt-1',
    link: 'text-[#1d9bf0] hover:underline font-medium',
    muted: 'text-[#71767b] text-[15px]',
}

// ── Buttons ──────────────────────────────────────────────────────────────────
const btnBase = 'inline-flex items-center justify-center font-bold rounded-full transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'

export const buttonClasses = {
    primary: `${btnBase} bg-white text-black hover:bg-[#e7e9ea] focus-visible:ring-white px-5 py-3 text-[17px] w-full`,
    outline: `${btnBase} border border-[#536471] text-white hover:bg-white/10 focus-visible:ring-[#536471] px-5 py-3 text-[17px] w-full`,
    ghost: `${btnBase} text-[#1d9bf0] hover:bg-[#1d9bf0]/10 focus-visible:ring-[#1d9bf0] px-4 py-2 text-[15px]`,
    danger: `${btnBase} bg-[#f4212e] text-white hover:bg-[#cc1a27] focus-visible:ring-[#f4212e] px-5 py-3 text-[17px] w-full`,
}

// ── Inputs ───────────────────────────────────────────────────────────────────
export const inputClasses = {
    wrapper: 'relative mb-4',
    field: [
        'block w-full rounded bg-transparent border border-[#333639]',
        'px-3 pt-6 pb-2 text-white text-[17px]',
        'placeholder-transparent',
        'focus:outline-none focus:border-[#1d9bf0] focus:ring-1 focus:ring-[#1d9bf0]',
        'transition-colors',
        'peer',
    ].join(' '),
    label: [
        'absolute left-3 top-1 text-[11px] text-[#71767b]',
        'transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-[17px]',
        'peer-focus:top-1 peer-focus:text-[11px] peer-focus:text-[#1d9bf0]',
    ].join(' '),
    error: 'text-[13px] text-[#f4212e] mt-1',
}

// ── Divider ──────────────────────────────────────────────────────────────────
export const dividerClasses = {
    wrapper: 'flex items-center my-5 gap-3',
    line: 'flex-1 h-px bg-[#2f3336]',
    text: 'text-[#71767b] text-[15px] shrink-0',
}

// ── Card ─────────────────────────────────────────────────────────────────────
export const cardClasses = 'border border-[#2f3336] rounded-2xl p-6'
