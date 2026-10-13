type IconProps = { size?: number }

const icon = (path: string, { size = 20 }: IconProps = {}) => (
  <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d={path} />
  </svg>
)

export const MenuIcon = (props?: IconProps) => icon('M4 6h16M4 12h16M4 18h16', props)
export const SearchIcon = (props?: IconProps) => icon('m21 21-4.35-4.35M10.75 18a7.25 7.25 0 1 1 0-14.5 7.25 7.25 0 0 1 0 14.5Z', props)
export const BellIcon = (props?: IconProps) => icon('M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4', props)
export const BookmarkIcon = (props?: IconProps) => icon('M6 4.5A2.5 2.5 0 0 1 8.5 2h7A2.5 2.5 0 0 1 18 4.5V21l-6-3.5L6 21V4.5Z', props)
export const SunIcon = (props?: IconProps) => icon('M12 3V1m0 22v-2M4.22 4.22 2.8 2.8m18.4 18.4-1.42-1.42M3 12H1m22 0h-2M4.22 19.78 2.8 21.2M21.2 2.8l-1.42 1.42M16.24 7.76a6 6 0 1 1-8.48 8.48 6 6 0 0 1 8.48-8.48Z', props)
export const MoonIcon = (props?: IconProps) => icon('M20.5 15.4A8.5 8.5 0 0 1 8.6 3.5 8.5 8.5 0 1 0 20.5 15.4Z', props)
export const CopyIcon = (props?: IconProps) => icon('M8 8h11v13H8zM5 16H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1', props)
export const CheckIcon = (props?: IconProps) => icon('m5 12 4 4L19 6', props)
export const ArrowLeftIcon = (props?: IconProps) => icon('M19 12H5m7 7-7-7 7-7', props)
export const ArrowRightIcon = (props?: IconProps) => icon('M5 12h14m-7-7 7 7-7 7', props)
