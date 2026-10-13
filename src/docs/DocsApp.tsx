import { useEffect, useMemo, useRef, useState } from 'react'
import { FloatingToolbar, type FloatingToolbarItem } from '../../registry/default/floating-toolbar/floating-toolbar'
import { MagneticButton } from '../../registry/default/magnetic-button/magnetic-button'
import { CommandPalette, type CommandPaletteItem } from '../../registry/default/command-palette/command-palette'
import { OtpInput } from '../../registry/default/otp-input/otp-input'
import { ToastNotification } from '../../registry/default/toast-notification/toast-notification'
import { SpotlightCard } from '../../registry/default/spotlight-card/spotlight-card'
import { buildRegistryCommand, type PackageManager } from './registry'
import { CodePanel, highlightCode } from './CodePanel'
import floatingSource from '../../registry/default/floating-toolbar/floating-toolbar.tsx?raw'
import floatingCss from '../../registry/default/floating-toolbar/floating-toolbar.css?raw'
import magneticSource from '../../registry/default/magnetic-button/magnetic-button.tsx?raw'
import magneticCss from '../../registry/default/magnetic-button/magnetic-button.css?raw'
import commandSource from '../../registry/default/command-palette/command-palette.tsx?raw'
import commandCss from '../../registry/default/command-palette/command-palette.css?raw'
import otpSource from '../../registry/default/otp-input/otp-input.tsx?raw'
import otpCss from '../../registry/default/otp-input/otp-input.css?raw'
import toastSource from '../../registry/default/toast-notification/toast-notification.tsx?raw'
import toastCss from '../../registry/default/toast-notification/toast-notification.css?raw'
import spotlightSource from '../../registry/default/spotlight-card/spotlight-card.tsx?raw'
import spotlightCss from '../../registry/default/spotlight-card/spotlight-card.css?raw'

type Theme = 'light' | 'dark'
type Tab = 'preview' | 'code'
type InstallMode = 'cli' | 'manual'
export type Category = 'All Components' | 'Buttons & Actions' | 'Forms & Inputs' | 'Navigation' | 'Overlays & Popovers' | 'Feedback & Status' | 'Data Display' | 'Layout & Surfaces' | 'Motion & Text Effects'
type ComponentName = 'floating-toolbar' | 'magnetic-button' | 'command-palette' | 'otp-input' | 'toast-notification' | 'spotlight-card'
type ApiRow = readonly [string, string, string]
type Doc = { name: ComponentName; title: string; category: Exclude<Category, 'All Components'>; description: string; source: string; css: string; api: readonly ApiRow[] }

const categories: Category[] = ['All Components', 'Buttons & Actions', 'Forms & Inputs', 'Navigation', 'Overlays & Popovers', 'Feedback & Status', 'Data Display', 'Layout & Surfaces', 'Motion & Text Effects']
const Icon = ({ children }: { children: string }) => <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8"><path d={children} /></svg>
const toolbarItems: FloatingToolbarItem[] = [
  { id: 'menu', label: 'Menu', icon: <Icon> M4 6h16M4 12h16M4 18h16 </Icon> },
  { id: 'search', label: 'Search', icon: <Icon>m11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14m5 12 4 4</Icon>, shortcut: '⌘ K' },
  { id: 'notifications', label: 'Notifications', icon: <Icon> M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4</Icon>, notification: true },
  { id: 'bookmarks', label: 'Bookmarks', icon: <Icon> M6 4h12v17l-6-4-6 4z </Icon> },
]
const docs: Doc[] = [
  { name: 'floating-toolbar', title: 'Floating Toolbar', category: 'Navigation', description: 'A keyboard-friendly toolbar with fluid active states and tooltips.', source: floatingSource, css: floatingCss, api: [['items', 'FloatingToolbarItem[]', 'Required toolbar actions'], ['onSelect', '(id: string) => void', 'Called after selection'], ['className', 'string', 'Additional class name']] },
  { name: 'magnetic-button', title: 'Magnetic Button', category: 'Buttons & Actions', description: 'A pointer-aware button that gently follows the cursor.', source: magneticSource, css: magneticCss, api: [['strength', 'number', '0.22; clamped to 0–0.8'], ['variant', "'solid' | 'outline' | 'quiet'", 'solid'], ['size', "'sm' | 'md' | 'lg'", 'md'], ['loading', 'boolean', 'false']] },
  { name: 'command-palette', title: 'Command Palette', category: 'Navigation', description: 'An accessible searchable command dialog with keyboard navigation.', source: commandSource, css: commandCss, api: [['open', 'boolean', 'Controls visibility'], ['items', 'CommandPaletteItem[]', 'Commands to search'], ['onOpenChange', '(open: boolean) => void', 'Visibility callback'], ['onSelect', '(item) => void', 'Selected command callback'], ['shortcutKey', 'string', "''; optional global shortcut"]] },
  { name: 'otp-input', title: 'OTP Input', category: 'Forms & Inputs', description: 'A controlled, segmented one-time password input.', source: otpSource, css: otpCss, api: [['value', 'string', 'Controlled numeric value'], ['onChange', '(value: string) => void', 'Value callback'], ['length', 'number', '6'], ['label', 'string', 'One-time password'], ['disabled', 'boolean', 'false'], ['mask', 'boolean', 'false'], ['autoFocus', 'boolean', 'false']] },
  { name: 'toast-notification', title: 'Toast Notification', category: 'Feedback & Status', description: 'A dismissible live notification with status tones and actions.', source: toastSource, css: toastCss, api: [['open', 'boolean', 'Controls visibility'], ['title', 'string', 'Required heading'], ['message', 'ReactNode', 'Optional body'], ['onClose', '() => void', 'Dismiss callback'], ['duration', 'number', '5000ms; 0 disables timeout'], ['tone', "'info' | 'success' | 'warning' | 'error'", 'info']] },
  { name: 'spotlight-card', title: 'Spotlight Card', category: 'Layout & Surfaces', description: 'A content card with a pointer-following spotlight treatment.', source: spotlightSource, css: spotlightCss, api: [['title', 'string', 'Required heading'], ['description', 'string', 'Optional body'], ['icon', 'ReactNode', 'Optional decorative icon'], ['footer', 'ReactNode', 'Optional footer'], ['accent', 'string', "'#b6c0ff'"]] },
]

function CopyButton({ value }: { value: string }) {
  const [state, setState] = useState('Copy')
  const timer = useRef<number | undefined>(undefined)
  useEffect(() => () => { if (timer.current) window.clearTimeout(timer.current) }, [])
  async function copy() { try { await navigator.clipboard.writeText(value); setState('Copied'); timer.current = window.setTimeout(() => setState('Copy'), 1400) } catch { setState('Copy failed'); timer.current = window.setTimeout(() => setState('Copy'), 1800) } }
  return <button className="docs-copy" type="button" onClick={copy} aria-live="polite">{state}</button>
}

function Preview({ doc }: { doc: Doc }) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')
  if (doc.name === 'floating-toolbar') return <FloatingToolbar items={toolbarItems} />
  if (doc.name === 'magnetic-button') return <MagneticButton>Continue →</MagneticButton>
  if (doc.name === 'command-palette') { const items: CommandPaletteItem[] = [{ id: 'new', label: 'Create new project', description: 'Start with a clean workspace', shortcut: '⌘ N' }, { id: 'settings', label: 'Open settings', description: 'Manage preferences' }]; return <><button className="preview-trigger" type="button" onClick={() => setOpen(true)}>Open command palette</button><CommandPalette open={open} items={items} onOpenChange={setOpen} onSelect={() => setOpen(false)} /></> }
  if (doc.name === 'otp-input') return <OtpInput value={value} onChange={setValue} label="Verification code" />
  if (doc.name === 'toast-notification') return <><button className="preview-trigger" type="button" onClick={() => setOpen(true)}>Show notification</button><ToastNotification open={open} title="Changes saved" message="Your workspace is up to date." tone="success" onClose={() => setOpen(false)} duration={0} /></>
  return <SpotlightCard title="Explore the details" description="Move your pointer across this card."><span className="muted-small">Interactive spotlight surface</span></SpotlightCard>
}

function DocsNav({ theme, setTheme }: { theme: Theme; setTheme: (theme: Theme) => void }) { return <header className="docs-nav"><a href="/" className="docs-brand" aria-label="InterfaZe home">InterfaZe</a><nav className="docs-nav-links" aria-label="Documentation navigation"><a href="/">Home</a><a className="is-current" href="/components" aria-current="page">Components</a></nav><button className="theme-toggle" type="button" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}>{theme === 'light' ? '◐' : '☼'}</button></header> }

function ComponentsIndex() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<Category>('All Components')
  const filtered = useMemo(() => docs.filter((doc) => (category === 'All Components' || doc.category === category) && `${doc.title} ${doc.description} ${doc.category}`.toLowerCase().includes(query.toLowerCase())), [query, category])
  const clear = () => { setQuery(''); setCategory('All Components') }
  return <main className="docs-catalog"><div className="catalog-hero"><div><p className="eyebrow">COMPONENT LIBRARY / {docs.length.toString().padStart(2, '0')} PRIMITIVES</p><h1>Build with intention.</h1><p>Thoughtful components for interfaces that feel unmistakably yours.</p></div><div className="catalog-stat"><strong>{filtered.length.toString().padStart(2, '0')}</strong><span>shown</span></div></div><div className="catalog-layout"><aside className="catalog-sidebar"><p className="sidebar-label">Categories</p>{categories.map((item) => <button key={item} className={category === item ? 'is-active' : ''} onClick={() => setCategory(item)} type="button"><span>{item}</span><b>{item === 'All Components' ? docs.length : docs.filter((doc) => doc.category === item).length}</b></button>)}</aside><section className="catalog-results"><label className="search-field"><span aria-hidden="true">⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search components" aria-label="Search components" />{(query || category !== 'All Components') && <button type="button" onClick={clear} aria-label="Clear search and filters">×</button>}</label>{filtered.length ? <div className="component-grid">{filtered.map((doc) => <article className="component-card" key={doc.name}><div className="component-preview"><Preview doc={doc} /></div><div className="component-card-body"><p className="component-category">{doc.category}</p><h2>{doc.title}</h2><p>{doc.description}</p><a className="text-link" href={`/components/${doc.name}`}>View documentation →</a></div></article>)}</div> : <div className="catalog-empty"><strong>No components found.</strong><span>Try a different search or clear the active category.</span><button type="button" onClick={clear}>Clear filters</button></div>}</section></div></main>
}

function Installation({ doc }: { doc: Doc }) {
  const [mode, setMode] = useState<InstallMode>('cli')
  const [manager, setManager] = useState<PackageManager>('npm')
  const command = buildRegistryCommand(doc.name, manager)
  const copy = (value: string) => <CopyButton value={value} />
  return <section className="docs-section"><div className="section-heading"><span className="eyebrow">02</span><div><h2>Installation</h2><p>Add {doc.name} to your project.</p></div></div><div className="mode-tabs" role="tablist"><button role="tab" aria-selected={mode === 'cli'} className={mode === 'cli' ? 'is-active' : ''} onClick={() => setMode('cli')} type="button">CLI</button><button role="tab" aria-selected={mode === 'manual'} className={mode === 'manual' ? 'is-active' : ''} onClick={() => setMode('manual')} type="button">Manual</button></div>{mode === 'cli' ? <div className="install-card"><p>Install this component with your preferred package manager.</p><div className="manager-row">{(['npm', 'pnpm', 'yarn', 'bun'] as PackageManager[]).map((item) => <button className={manager === item ? 'is-active' : ''} onClick={() => setManager(item)} type="button" key={item}>{item}</button>)}</div><div className="command-row"><code dangerouslySetInnerHTML={{ __html: highlightCode(command, 'bash') }} /><CopyButton value={command} /></div></div> : <><CodePanel filename={`${doc.name}.tsx`} code={doc.source} copy={copy} /><CodePanel filename={`${doc.name}.css`} code={doc.css} language="css" copy={copy} /></>}</section>
}

function DetailPage({ doc }: { doc: Doc }) {
  const [tab, setTab] = useState<Tab>('preview')
  const copy = (value: string) => <CopyButton value={value} />
  const usage = ({
    'floating-toolbar': `import { FloatingToolbar } from '@/components/ui/floating-toolbar'

const items = [{ id: 'save', label: 'Save', icon: <svg viewBox="0 0 24 24"><path d="M5 4h14v16l-7-4-7 4z" /></svg> }]

export function Example() {
  return <FloatingToolbar items={items} onSelect={(id) => console.log(id)} />
}`,
    'magnetic-button': `import { MagneticButton } from '@/components/ui/magnetic-button'

export function Example() {
  return <MagneticButton variant="outline" onClick={() => alert('Saved')}>Save changes</MagneticButton>
}`,
    'command-palette': `import { useState } from 'react'
import { CommandPalette } from '@/components/ui/command-palette'

export function Example() {
  const [open, setOpen] = useState(false)
  const items = [{ id: 'new', label: 'New document' }]
  return <><button onClick={() => setOpen(true)}>Open commands</button><CommandPalette open={open} items={items} onOpenChange={setOpen} onSelect={(item) => console.log(item.id)} /></>
}`,
    'otp-input': `import { useState } from 'react'
import { OtpInput } from '@/components/ui/otp-input'

export function Example() {
  const [code, setCode] = useState('')
  return <OtpInput value={code} onChange={setCode} length={6} label="Verification code" />
}`,
    'toast-notification': `import { useState } from 'react'
import { ToastNotification } from '@/components/ui/toast-notification'

export function Example() {
  const [open, setOpen] = useState(false)
  return <><button onClick={() => setOpen(true)}>Save</button><ToastNotification open={open} title="Saved" onClose={() => setOpen(false)} tone="success" /></>
}`,
    'spotlight-card': `import { SpotlightCard } from '@/components/ui/spotlight-card'

export function Example() {
  return <SpotlightCard title="Analytics" description="See your latest activity." accent="#8ea2ff" />
}`,
  } as Record<ComponentName, string>)[doc.name]
  return <main className="docs-main"><nav className="breadcrumbs" aria-label="Breadcrumb"><a href="/components">Components</a><span>/</span><span>{doc.title}</span></nav><a className="back-link" href="/components">← Back to Components</a><div className="component-intro"><p className="eyebrow">{doc.category.toUpperCase()} / COMPONENT</p><h1>{doc.title}</h1><p>{doc.description}</p></div><section className="docs-section demo-section"><div className="section-heading"><span className="eyebrow">01</span><div><h2>Interactive preview</h2><p>Try the component before you install it.</p></div></div><div className="docs-tabs" role="tablist"><button role="tab" aria-selected={tab === 'preview'} className={tab === 'preview' ? 'is-active' : ''} onClick={() => setTab('preview')} type="button">Preview</button><button role="tab" aria-selected={tab === 'code'} className={tab === 'code' ? 'is-active' : ''} onClick={() => setTab('code')} type="button">Code</button></div><div className="preview-panel"><div hidden={tab !== 'preview'}><Preview doc={doc} /></div><div hidden={tab !== 'code'}><CodePanel filename={`${doc.name}.tsx`} code={doc.source} copy={copy} /></div></div></section><section className="docs-section"><div className="section-heading"><span className="eyebrow">03</span><div><h2>Usage</h2><p>A complete starting point for this component.</p></div></div><CodePanel filename="example.tsx" code={usage} copy={copy} /></section><Installation doc={doc} /><section className="docs-section"><div className="section-heading"><span className="eyebrow">04</span><div><h2>API & accessibility</h2><p>Props and defaults are derived from the source.</p></div></div><div className="api-table-wrap"><table className="api-table"><thead><tr><th>Prop</th><th>Type</th><th>Default / notes</th></tr></thead><tbody>{doc.api.map((row) => <tr key={row[0]}>{row.map((cell, index) => <td key={index}><code>{cell}</code></td>)}</tr>)}</tbody></table></div><p className="api-note">Native semantics and visible focus states are preserved. Pointer effects fall back to static surfaces for touch and reduced-motion users.</p></section></main>
}

export function DocsApp({ page = 'index' }: { page?: 'index' | ComponentName }) {
  const [theme, setTheme] = useState<Theme>(() => { try { return localStorage.getItem('interfaze-docs-theme') === 'dark' ? 'dark' : 'light' } catch { return 'light' } })
  useEffect(() => { document.documentElement.dataset.docsTheme = theme; try { localStorage.setItem('interfaze-docs-theme', theme) } catch { /* storage can be unavailable */ } }, [theme])
  const doc = docs.find((item) => item.name === page)
  return <div className="docs-app" data-theme={theme}><DocsNav theme={theme} setTheme={setTheme} />{doc ? <DetailPage doc={doc} /> : <ComponentsIndex />}</div>
}
