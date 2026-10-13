'use client'

import { useEffect, useRef, useState, type ButtonHTMLAttributes, type CSSProperties, type PointerEvent } from 'react'
import './magnetic-button.css'

export type MagneticButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  strength?: number
  variant?: 'solid' | 'outline' | 'quiet'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export function MagneticButton({ children, className = '', strength = 0.22, variant = 'solid', size = 'md', loading = false, disabled, onPointerMove, onPointerLeave, ...props }: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const clampedStrength = Math.max(0, Math.min(strength, 0.8))
  const [magnetic, setMagnetic] = useState(false)
  useEffect(() => { const query = window.matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)'); const update = () => setMagnetic(query.matches); update(); query.addEventListener('change', update); return () => query.removeEventListener('change', update) }, [])

  const handlePointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    const bounds = buttonRef.current?.getBoundingClientRect()
    if (magnetic && bounds && event.pointerType === 'mouse') {
      setOffset({
        x: (event.clientX - (bounds.left + bounds.width / 2)) * clampedStrength,
        y: (event.clientY - (bounds.top + bounds.height / 2)) * clampedStrength,
      })
    }
    onPointerMove?.(event)
  }

  const handlePointerLeave = (event: PointerEvent<HTMLButtonElement>) => {
    setOffset({ x: 0, y: 0 })
    onPointerLeave?.(event)
  }

  return <button {...props} type={props.type ?? 'button'} ref={buttonRef} disabled={disabled || loading} aria-busy={loading || undefined} className={`magnetic-button magnetic-button--${variant} magnetic-button--${size} ${className}`.trim()} style={{ '--magnetic-x': `${offset.x}px`, '--magnetic-y': `${offset.y}px`, ...props.style } as CSSProperties} onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave}>{loading ? <><span className="magnetic-button__spinner" aria-hidden="true" /><span className="magnetic-button__loading-label">{children}</span></> : children}</button>
}
