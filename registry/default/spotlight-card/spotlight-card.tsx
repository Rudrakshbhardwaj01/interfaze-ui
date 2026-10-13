'use client'

import { useState, type CSSProperties, type HTMLAttributes, type PointerEvent, type ReactNode } from 'react'
import './spotlight-card.css'

export type SpotlightCardProps = HTMLAttributes<HTMLElement> & { title: string; description?: string; icon?: ReactNode; footer?: ReactNode; accent?: string; children?: ReactNode }

export function SpotlightCard({ title, description, icon, footer, accent = '#b6c0ff', children, className = '', onPointerMove, onPointerLeave, ...props }: SpotlightCardProps) {
  const [position, setPosition] = useState({ x: 50, y: 50 })
  const handleMove = (event: PointerEvent<HTMLElement>) => { if (event.pointerType !== 'mouse') return; const bounds = event.currentTarget.getBoundingClientRect(); setPosition({ x: ((event.clientX - bounds.left) / bounds.width) * 100, y: ((event.clientY - bounds.top) / bounds.height) * 100 }); onPointerMove?.(event) }
  const handleLeave = (event: PointerEvent<HTMLElement>) => { setPosition({ x: 50, y: 50 }); onPointerLeave?.(event) }
  return <article {...props} className={`spotlight-card ${className}`.trim()} style={{ '--spotlight-x': `${position.x}%`, '--spotlight-y': `${position.y}%`, '--spotlight-accent': accent, ...props.style } as CSSProperties} onPointerMove={handleMove} onPointerLeave={handleLeave}><div className="spotlight-card__content">{icon && <div className="spotlight-card__icon" aria-hidden="true">{icon}</div>}<h2>{title}</h2>{description && <p>{description}</p>}{children}{footer && <footer className="spotlight-card__footer">{footer}</footer>}</div></article>
}
