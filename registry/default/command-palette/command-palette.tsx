'use client'

import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import './command-palette.css'

export type CommandPaletteItem = { id: string; label: string; description?: string; shortcut?: string; disabled?: boolean; group?: string; icon?: ReactNode }
export type CommandPaletteProps = { open: boolean; items: CommandPaletteItem[]; onOpenChange: (open: boolean) => void; onSelect: (item: CommandPaletteItem) => void; placeholder?: string; title?: string; shortcutKey?: string }

export function CommandPalette({ open, items, onOpenChange, onSelect, placeholder = 'Search commands…', title = 'Command palette', shortcutKey }: CommandPaletteProps) {
  const titleId = useId()
  const listId = useId()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const groups = useMemo(() => {
    const result = new Map<string, CommandPaletteItem[]>()
    for (const item of items) {
      if (!`${item.label} ${item.description ?? ''} ${item.group ?? ''}`.toLowerCase().includes(query.trim().toLowerCase())) continue
      const name = item.group ?? 'Commands'
      result.set(name, [...(result.get(name) ?? []), item])
    }
    return [...result.entries()]
  }, [items, query])
  const available = groups.flatMap(([, entries]) => entries).filter((item) => !item.disabled)
  const selected = available[Math.min(active, Math.max(0, available.length - 1))]

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (!open) { if (dialog.open) dialog.close(); return }
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null
    dialog.showModal()
    inputRef.current?.focus()
    return () => { dialog.close(); if (previous?.isConnected) previous.focus() }
  }, [open])

  useEffect(() => {
    if (!shortcutKey) return
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      const target = event.target
      if (event.defaultPrevented || event.repeat || event.isComposing || (target instanceof HTMLElement && (target.closest('input, textarea, select, [role="textbox"]') || target.isContentEditable))) return
      if ((event.metaKey || event.ctrlKey) && !event.altKey && event.key.toLowerCase() === shortcutKey.toLowerCase()) { event.preventDefault(); onOpenChange(!open) }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onOpenChange, shortcutKey])

  useEffect(() => {
    if (open && selected) document.getElementById(`${listId}-${selected.id}`)?.scrollIntoView({ block: 'nearest' })
  }, [open, selected, listId])

  const close = () => { setQuery(''); setActive(0); onOpenChange(false) }
  const choose = (item: CommandPaletteItem | undefined) => { if (item && !item.disabled) { close(); onSelect(item) } }
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.nativeEvent.isComposing) return
    const index = selected ? available.indexOf(selected) : 0
    if (event.key === 'ArrowDown') { event.preventDefault(); setActive(available.length ? (index + 1) % available.length : 0) }
    else if (event.key === 'ArrowUp') { event.preventDefault(); setActive(available.length ? (index - 1 + available.length) % available.length : 0) }
    else if (event.key === 'Enter') { event.preventDefault(); choose(selected) }
  }

  return <dialog ref={dialogRef} className="command-palette" aria-labelledby={titleId} onCancel={(event) => { event.preventDefault(); close() }} onClick={(event) => {
    if (event.target !== event.currentTarget) return
    const rect = event.currentTarget.getBoundingClientRect()
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close()
  }}>
    <h2 id={titleId}>{title}</h2>
    <div className="command-palette__search"><span aria-hidden="true">⌕</span><input ref={inputRef} aria-label="Search commands" value={query} onChange={(event) => { setQuery(event.target.value); setActive(0) }} onKeyDown={handleKeyDown} placeholder={placeholder} role="combobox" aria-autocomplete="list" aria-controls={listId} aria-expanded={open} aria-activedescendant={selected ? `${listId}-${selected.id}` : undefined} /></div>
    <div id={listId} className="command-palette__list" role="listbox" aria-label="Commands">
      {groups.map(([name, entries], groupIndex) => <div key={name} role="group" aria-labelledby={`${listId}-group-${groupIndex}`}><p id={`${listId}-group-${groupIndex}`} className="command-palette__group">{name}</p>{entries.map((item) => <button key={item.id} type="button" tabIndex={-1} id={`${listId}-${item.id}`} role="option" aria-selected={item === selected} aria-disabled={item.disabled || undefined} disabled={item.disabled} className={item === selected ? 'is-active' : ''} onMouseDown={(event) => event.preventDefault()} onMouseEnter={() => { if (!item.disabled) setActive(available.indexOf(item)) }} onClick={() => choose(item)}>{item.icon && <span className="command-palette__command-icon" aria-hidden="true">{item.icon}</span>}<span className="command-palette__command-text"><strong>{item.label}</strong>{item.description && <small>{item.description}</small>}</span>{item.shortcut && <kbd>{item.shortcut}</kbd>}</button>)}</div>)}
    </div>
    {!groups.length && <p className="command-palette__empty" role="status">No commands found.</p>}
    <p className="command-palette__hint"><kbd>↑</kbd><kbd>↓</kbd> navigate <kbd>↵</kbd> select <kbd>Esc</kbd> close</p>
    <button type="button" className="command-palette__close" onClick={close}>Close</button>
  </dialog>
}
