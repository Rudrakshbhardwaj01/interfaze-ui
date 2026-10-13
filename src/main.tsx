import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import './docs/docs.css'
import { DocsApp } from './docs/DocsApp'

const Arrow = () => <span className="arrow" aria-hidden="true">→</span>

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
  if (window.location.pathname === '/components' || window.location.pathname === '/components/') {
    return <DocsApp page="index" />
  }

  if (window.location.pathname === '/components/floating-toolbar' || window.location.pathname === '/components/floating-toolbar/') {
    return <DocsApp page="floating-toolbar" />
  }

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
