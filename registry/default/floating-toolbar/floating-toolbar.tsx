'use client'

import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import './floating-toolbar.css'

export type FloatingToolbarItem = {
  id: string
  label: string
  icon: ReactNode
  shortcut?: string
  notification?: boolean
}

export type FloatingToolbarProps = {
  items: FloatingToolbarItem[]
  onSelect?: (id: string) => void
  className?: string
}

type Bounds = { left: number; top: number; width: number; height: number }

export function FloatingToolbar({ items, onSelect, className = '' }: FloatingToolbarProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const tooltipId = useId()
  const [selectedId, setSelectedId] = useState(items[0]?.id ?? '')
  const [focusedId, setFocusedId] = useState<string | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [dismissed, setDismissed] = useState(false)
  const [bounds, setBounds] = useState<{ active: Bounds | null; hover: Bounds | null }>({ active: null, hover: null })
  const activeId = items.some((item) => item.id === selectedId) ? selectedId : (items[0]?.id ?? '')
  const previewId = hoveredId ?? focusedId
  const previewItem = items.find((item) => item.id === previewId)
  const tabId = items.some((item) => item.id === focusedId) ? focusedId : activeId

  useEffect(() => {
    if (selectedId !== activeId) setSelectedId(activeId)
  }, [selectedId, activeId])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const buttons = Array.from(root.querySelectorAll<HTMLButtonElement>('.floating-toolbar__item'))
    const measure = (id: string | null): Bounds | null => {
      const button = buttons.find((element) => element.dataset.itemId === id)
      return button ? { left: button.offsetLeft, top: button.offsetTop, width: button.offsetWidth, height: button.offsetHeight } : null
    }
    const update = () => setBounds({ active: measure(activeId), hover: measure(previewId) })
    update()
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(update)
    observer?.observe(root)
    buttons.forEach((button) => observer?.observe(button))
    window.addEventListener('resize', update)
    return () => {
      observer?.disconnect()
      window.removeEventListener('resize', update)
    }
  }, [items, activeId, previewId])

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === 'Escape') {
      setDismissed(true)
      return
    }
    const rtl = rootRef.current && window.getComputedStyle(rootRef.current).direction === 'rtl'
    let next: number
    switch (event.key) {
      case 'ArrowRight': next = index + (rtl ? -1 : 1); break
      case 'ArrowLeft': next = index + (rtl ? 1 : -1); break
      case 'ArrowDown': next = index + 1; break
      case 'ArrowUp': next = index - 1; break
      case 'Home': next = 0; break
      case 'End': next = items.length - 1; break
      default: return
    }
    event.preventDefault()
    if (!items.length) return
    setHoveredId(null)
    const buttons = rootRef.current?.querySelectorAll<HTMLButtonElement>('.floating-toolbar__item')
    buttons?.[(next + items.length) % items.length]?.focus()
  }

  return (
    <div ref={rootRef} className={`floating-toolbar ${className}`.trim()} role="toolbar" aria-label="Floating toolbar" aria-orientation="horizontal"
      onPointerLeave={() => setHoveredId(null)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocusedId(null)
      }}
    >
      <span aria-hidden="true" className="floating-toolbar__highlight floating-toolbar__highlight--active" style={{ ...bounds.active, opacity: bounds.active && items.length ? 1 : 0 }} />
      <span aria-hidden="true" className="floating-toolbar__highlight floating-toolbar__highlight--hover" style={{ ...bounds.hover, opacity: bounds.hover && previewItem ? 1 : 0 }} />
      {items.map((item, index) => (
        <button key={item.id} type="button" data-item-id={item.id}
          className={`floating-toolbar__item${activeId === item.id ? ' is-selected' : ''}`}
          aria-label={item.label} aria-pressed={activeId === item.id}
          aria-describedby={previewItem?.id === item.id && !dismissed ? tooltipId : undefined}
          tabIndex={tabId === item.id ? 0 : -1}
          onPointerEnter={(event) => {
            if (event.pointerType !== 'touch') { setHoveredId(item.id); setDismissed(false) }
          }}
          onFocus={() => { setFocusedId(item.id); setDismissed(false) }}
          onKeyDown={(event) => handleKeyDown(event, index)}
          onClick={() => { setSelectedId(item.id); onSelect?.(item.id) }}
        >
          <span className="floating-toolbar__icon" aria-hidden="true">{item.icon}</span>
          {item.notification && <span className="floating-toolbar__dot" role="img" aria-label="Has notification" />}
        </button>
      ))}
      <span id={tooltipId} role="tooltip" className="floating-toolbar__tooltip"
        aria-hidden={!previewItem || dismissed}
        data-visible={Boolean(previewItem && bounds.hover && !dismissed)}
        style={{ left: bounds.hover ? bounds.hover.left + bounds.hover.width / 2 : 0 }}
      >
        <span>{previewItem?.label}</span>
        {previewItem?.shortcut && <kbd>{previewItem.shortcut}</kbd>}
      </span>
    </div>
  )
}
