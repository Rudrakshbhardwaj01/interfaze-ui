'use client'

import { useId, useState, type CSSProperties, type ReactNode } from 'react'
import './otp-input.css'

export type OtpInputProps = { value: string; onChange: (value: string) => void; length?: number; autoFocus?: boolean; label?: string; disabled?: boolean; mask?: boolean; invalid?: boolean; error?: ReactNode; name?: string }

export function OtpInput({ value, onChange, length = 6, autoFocus = false, label = 'One-time password', disabled = false, mask = false, invalid = false, error, name }: OtpInputProps) {
  const id = useId()
  const count = Number.isFinite(length) ? Math.max(1, Math.floor(length)) : 6
  const clean = (text: string) => text.replace(/\D/g, '').slice(0, count)
  const code = clean(value)
  const [caret, setCaret] = useState(0)
  const hasError = invalid || Boolean(error)
  return <div className={`otp-input${disabled ? ' is-disabled' : ''}`}>
    <label htmlFor={id}>{label}</label>
    <div className="otp-input__fields" style={{ '--otp-length': count } as CSSProperties}>
      <input id={id} className="otp-input__native" name={name} aria-invalid={hasError || undefined} aria-describedby={error ? `${id}-error` : undefined} type={mask ? 'password' : 'text'} inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]*" value={code} autoFocus={autoFocus} disabled={disabled} onSelect={(event) => setCaret(event.currentTarget.selectionStart ?? 0)} onChange={(event) => { onChange(clean(event.target.value)); setCaret(event.target.selectionStart ?? 0) }} onPaste={(event) => { event.preventDefault(); const pasted = clean(event.clipboardData.getData('text')); if (pasted) { onChange(pasted); setCaret(pasted.length) } }} />
      <div className="otp-input__slots" aria-hidden="true">{Array.from({ length: count }, (_, index) => <span key={index} className={`otp-input__slot${Math.min(caret, count - 1) === index ? ' is-active' : ''}`}>{code[index] ? mask ? '•' : code[index] : ''}</span>)}</div>
    </div>
    {error && <p className="otp-input__error" id={`${id}-error`}>{error}</p>}
  </div>
}
