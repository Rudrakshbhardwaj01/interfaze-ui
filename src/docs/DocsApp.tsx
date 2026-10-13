import { useEffect, useMemo, useState } from 'react'
import { FloatingToolbar, type FloatingToolbarItem } from '../components/FloatingToolbar'
import { ArrowLeftIcon, ArrowRightIcon, BellIcon, BookmarkIcon, CheckIcon, CopyIcon, MenuIcon, MoonIcon, SearchIcon, SunIcon } from '../components/Icons'
import manualCode from '../../registry/default/floating-toolbar/floating-toolbar.tsx?raw'

type DocsPage = 'index' | 'floating-toolbar'
type Theme = 'light' | 'dark'
type InstallMode = 'cli' | 'manual'
type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun'

const toolbarItems: FloatingToolbarItem[] = [
  { id: 'menu', label: 'Menu', icon: <MenuIcon />, shortcut: '⌘ M' },
  { id: 'search', label: 'Search', icon: <SearchIcon />, shortcut: '⌘ K' },
  { id: 'notifications', label: 'Notifications', icon: <BellIcon />, notification: true },
  { id: 'bookmarks', label: 'Bookmarks', icon: <BookmarkIcon />, shortcut: '⌘ B' },
]

const importCode = `import { FloatingToolbar } from './components/FloatingToolbar'`
const usageCode = `import { FloatingToolbar } from './components/FloatingToolbar'
import { BellIcon, BookmarkIcon, MenuIcon, SearchIcon } from './components/Icons'

const items = [
  { id: 'menu', label: 'Menu', icon: <MenuIcon />, shortcut: '⌘ M' },
  { id: 'search', label: 'Search', icon: <SearchIcon />, shortcut: '⌘ K' },
  { id: 'notifications', label: 'Notifications', icon: <BellIcon />, notification: true },
  { id: 'bookmarks', label: 'Bookmarks', icon: <BookmarkIcon /> },
]

export function ToolbarExample() {
  const handleSelect = (id: string) => console.log('Selected:', id)
  return <FloatingToolbar items={items} onSelect={handleSelect} />
}`

function CopyButton({ value, label = 'Copy' }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false)
  const [failed, setFailed] = useState(false)
  const copy = async () => {
    try { await navigator.clipboard.writeText(value); setFailed(false); setCopied(true); window.setTimeout(() => setCopied(false), 1800) } catch { setCopied(false); setFailed(true); window.setTimeout(() => setFailed(false), 2200) }
  }
  return <button className="docs-copy" type="button" onClick={copy} aria-label={`${label} to clipboard`}><span>{copied ? <CheckIcon size={15} /> : <CopyIcon size={15} />}</span>{copied ? 'Copied' : failed ? 'Copy failed' : label}</button>
}

function highlightCode(value: string) {
  const escaped = value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  return escaped
    .replace(/(['"`])(?:(?!\1)[^\\]|\\.)*\1/g, '<span class="token-string">$&</span>')
    .replace(/\b(import|from|export|function|return|const|type|interface|class|new|if|true|false|async|await)\b/g, '<span class="token-keyword">$1</span>')
    .replace(/\b(string|number|boolean|ReactNode|FloatingToolbarItem|FloatingToolbarProps)\b/g, '<span class="token-type">$1</span>')
}

function DocsNav({ theme, setTheme }: { theme: Theme; setTheme: (theme: Theme) => void }) {
  return <header className="docs-nav"><a href="/" className="docs-brand" aria-label="InterfaZe home">InterfaZe</a><nav className="docs-nav-links" aria-label="Documentation navigation"><a href="/">Home</a><a className="is-current" href="/components">Components</a></nav><button className="theme-toggle" type="button" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}>{theme === 'light' ? <MoonIcon size={17} /> : <SunIcon size={17} />}</button></header>
}

function CodePanel({ filename, code }: { filename: string; code: string }) {
  return <div className="code-panel"><div className="code-toolbar"><span>{filename}</span><CopyButton value={code} /></div><pre><code dangerouslySetInnerHTML={{ __html: highlightCode(code) }} /></pre></div>
}

function Tabs({ tab, setTab }: { tab: 'preview' | 'code'; setTab: (tab: 'preview' | 'code') => void }) {
  return <div className="docs-tabs" role="tablist" aria-label="Component display modes"><button className={tab === 'preview' ? 'is-active' : ''} type="button" role="tab" aria-selected={tab === 'preview'} onClick={() => setTab('preview')}>Preview</button><button className={tab === 'code' ? 'is-active' : ''} type="button" role="tab" aria-selected={tab === 'code'} onClick={() => setTab('code')}>Code</button></div>
}

function Installation() {
  const [mode, setMode] = useState<InstallMode>('cli')
  const [manager, setManager] = useState<PackageManager>('npm')
  const command = useMemo(() => ({ npm: 'npx shadcn@latest add <your-registry-url>/floating-toolbar', pnpm: 'pnpm dlx shadcn@latest add <your-registry-url>/floating-toolbar', yarn: 'yarn dlx shadcn@latest add <your-registry-url>/floating-toolbar', bun: 'bunx --bun shadcn@latest add <your-registry-url>/floating-toolbar' })[manager], [manager])
  return <section className="docs-section"><div className="section-heading"><span className="eyebrow">02</span><div><h2>Installation</h2><p>Add Floating Toolbar to your project.</p></div></div><div className="mode-tabs" role="tablist"><button className={mode === 'cli' ? 'is-active' : ''} type="button" onClick={() => setMode('cli')}>CLI</button><button className={mode === 'manual' ? 'is-active' : ''} type="button" onClick={() => setMode('manual')}>Manual</button></div>{mode === 'cli' ? <div className="install-card"><p>Use the shadcn-compatible CLI to add the component. A production registry endpoint has not been deployed yet, so replace the placeholder with your configured registry URL.</p><div className="manager-row">{(['npm', 'pnpm', 'yarn', 'bun'] as PackageManager[]).map((item) => <button key={item} className={manager === item ? 'is-active' : ''} type="button" onClick={() => setManager(item)}>{item}</button>)}</div><div className="command-row"><code>{command}</code><CopyButton value={command} /></div></div> : <CodePanel filename="floating-toolbar.tsx" code={manualCode} />}</section>
}

function PropsTable() {
  return <section className="docs-section"><div className="section-heading"><span className="eyebrow">05</span><div><h2>API reference</h2><p>Props for the FloatingToolbar component.</p></div></div><div className="props-table-wrap"><table className="props-table"><thead><tr><th>Property</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody><tr><td><code>items</code></td><td><code>FloatingToolbarItem[]</code></td><td>—</td><td>Toolbar items to render. Each item has an id, label, icon, and optional shortcut or notification.</td></tr><tr><td><code>onSelect</code></td><td><code>(id: string) =&gt; void</code></td><td>—</td><td>Called after an item is selected.</td></tr><tr><td><code>className</code></td><td><code>string</code></td><td><code>''</code></td><td>Optional class name for custom styling.</td></tr></tbody></table></div><div className="accessibility-note"><strong>Accessibility</strong><span>Items are native buttons with visible focus states and pressed semantics. Shortcuts are informational labels and are not intercepted by the component.</span></div></section>
}

function ComponentsIndex() {
  return <div className="docs-index"><p className="eyebrow">COMPONENT LIBRARY</p><h1>Components</h1><p className="index-intro">Carefully crafted interface primitives for modern products.</p><div className="component-index-card"><div><span className="component-category">OVERLAYS &amp; POPOVERS</span><h2>Floating Toolbar</h2><p>A polished toolbar with fluid active states and shared tooltip transitions.</p></div><a className="text-link" href="/components/floating-toolbar">View component <ArrowRightIcon size={16} /></a></div></div>
}

function FloatingToolbarPage() {
  const [tab, setTab] = useState<'preview' | 'code'>('preview')
  const [selected, setSelected] = useState('menu')
  return <main className="docs-main"><a className="back-link" href="/components"><ArrowLeftIcon size={16} /> Back to Components</a><div className="component-intro"><p className="eyebrow">OVERLAYS &amp; POPOVERS</p><h1>Floating Toolbar</h1><p>A polished, specific-use toolbar featuring smooth shared-element transitions for tooltips and active states, creating a seamless and fluid user interaction experience.</p></div><section className="docs-section demo-section"><div className="section-heading"><span className="eyebrow">01</span><div><h2>Interactive preview</h2><p>Explore the toolbar behavior and selection state.</p></div></div><Tabs tab={tab} setTab={setTab} />{tab === 'preview' ? <div className="preview-panel"><FloatingToolbar items={toolbarItems} onSelect={setSelected} /><p className="selected-label">Selected: <strong>{toolbarItems.find((item) => item.id === selected)?.label ?? 'None'}</strong></p></div> : <CodePanel filename="FloatingToolbar.tsx" code={manualCode} />}</section><section className="docs-section"><div className="section-heading"><span className="eyebrow">03</span><div><h2>Usage</h2><p>Import the component and pass an array of toolbar item definitions.</p></div></div><CodePanel filename="ToolbarExample.tsx" code={usageCode} /></section><section className="docs-section"><div className="section-heading"><span className="eyebrow">04</span><div><h2>Import</h2><p>Use the component from its source module.</p></div></div><CodePanel filename="import.ts" code={importCode} /></section><Installation /><PropsTable /></main>
}

export function DocsApp({ page }: { page: DocsPage }) {
  const [theme, setThemeState] = useState<Theme>(() => (localStorage.getItem('interfaze-docs-theme') as Theme) || 'light')
  useEffect(() => { document.documentElement.dataset.docsTheme = theme; localStorage.setItem('interfaze-docs-theme', theme) }, [theme])
  return <div className="docs-app" data-theme={theme}><DocsNav theme={theme} setTheme={setThemeState} />{page === 'index' ? <ComponentsIndex /> : <FloatingToolbarPage />}</div>
}
