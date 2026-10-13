import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import './docs/docs.css'
import { DocsApp } from './docs/DocsApp'

const Arrow = () => <span className="arrow" aria-hidden="true">→</span>

function NotFound() {
  return <main className="hero"><div className="hero-content"><p className="eyebrow">404 / NOT FOUND</p><h1>Page not found.</h1><p className="hero-copy">The page you requested does not exist.</p><a className="primary-button" href="/components"><span>Browse Components</span><Arrow /></a></div></main>
}

function Navigation() {
  return (
    <header className="site-header">
      <a className="nav-brand" href="/" aria-label="InterfaZe home">InterfaZe</a>
      <nav className="nav-links" aria-label="Primary navigation">
        <a className="active" href="/" aria-current="page">Home</a>
        <a href="/components">Components</a>
      </nav>
    </header>
  )
}

function Hero() {
  return (
    <main className="hero">
      <div className="hero-content">
        <h1>InterfaZe</h1>
        <p className="hero-copy">
          A modern collection of reusable UI components.<br />
          Copy. Customize. Create beautiful interfaces.
        </p>
        <a className="primary-button" href="/components">
          <span>Explore Components</span><Arrow />
        </a>
      </div>
    </main>
  )
}

function App() {
  const path = window.location.pathname.replace(/\/$/, '')
  if (path === '/components') return <DocsApp page="index" />
  const component = path.startsWith('/components/') ? path.slice('/components/'.length) : ''
  if (['floating-toolbar', 'magnetic-button', 'command-palette', 'otp-input', 'toast-notification', 'spotlight-card'].includes(component)) {
    return <DocsApp page={component as 'floating-toolbar' | 'magnetic-button' | 'command-palette' | 'otp-input' | 'toast-notification' | 'spotlight-card'} />
  }
  if (path.startsWith('/components/')) return <><Navigation /><NotFound /></>

  if (path !== '' && path !== '/') return <><Navigation /><NotFound /></>
  return (
    <div className="page-shell">
      <Navigation />
      <Hero />
    </div>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode><App /></StrictMode>,
)
