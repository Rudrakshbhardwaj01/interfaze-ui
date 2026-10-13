'use client'

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import './toast-notification.css'

export type ToastNotificationProps = { open: boolean; title: string; message?: ReactNode; onClose: () => void; duration?: number; action?: ReactNode; tone?: 'info' | 'success' | 'warning' | 'error' }

export function ToastNotification({ open, title, message, onClose, duration = 5000, action, tone = 'info' }: ToastNotificationProps) {
  const [paused, setPaused] = useState(false); const remaining = useRef(duration); const started = useRef(0)
  useEffect(() => { remaining.current = duration }, [open, duration])
  useEffect(() => { if (!open || duration <= 0 || paused) return; started.current = Date.now(); const timer = window.setTimeout(onClose, remaining.current); return () => { window.clearTimeout(timer); remaining.current = Math.max(0, remaining.current - (Date.now() - started.current)) } }, [open, duration, paused, onClose])
  if (!open) return null
  return <aside className={`toast-notification toast-notification--${tone}`} role={tone === 'error' ? 'alert' : 'status'} aria-live={tone === 'error' ? 'assertive' : 'polite'} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}><span className="toast-notification__icon" aria-hidden="true">{tone === 'success' ? '✓' : tone === 'error' ? '!' : tone === 'warning' ? '!' : 'i'}</span><div className="toast-notification__body"><strong>{title}</strong>{message && <div>{message}</div>}{action && <div className="toast-notification__action">{action}</div>}</div><button type="button" className="toast-notification__close" onClick={onClose} aria-label="Dismiss notification">×</button></aside>
}

export type ToastOptions = Omit<ToastNotificationProps, 'open' | 'onClose'>
type ToastEntry = ToastOptions & { id: string }
type ToastContextValue = { toast: (options: ToastOptions) => string; dismiss: (id: string) => void }
const ToastContext = createContext<ToastContextValue | null>(null)
export function ToastProvider({ children, position = 'bottom-right' }: { children: ReactNode; position?: string }) {
  const [toasts, setToasts] = useState<ToastEntry[]>([])
  const dismiss = useCallback((id: string) => setToasts((current) => current.filter((toast) => toast.id !== id)), [])
  const toast = useCallback((options: ToastOptions) => { const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`; setToasts((current) => [...current, { ...options, id }]); return id }, [])
  return <ToastContext.Provider value={{ toast, dismiss }}><>{children}<div className={`toast-provider toast-provider--${position}`} aria-label="Notifications">{toasts.map(({ id, ...options }) => <ToastNotification key={id} {...options} open onClose={() => dismiss(id)} />)}</div></></ToastContext.Provider>
}
export function useToast() { const context = useContext(ToastContext); if (!context) throw new Error('useToast must be used within ToastProvider'); return context }
