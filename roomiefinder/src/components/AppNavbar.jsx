import { Link, useLocation } from 'react-router-dom'
import '../styles/app-navbar.css'

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
    </svg>
  )
}

function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
    </svg>
  )
}

function PersonIcon({ size = 32 }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
    </svg>
  )
}

export default function AppNavbar() {
  const location = useLocation()
  const isActive = (path) => location.pathname === path

  return (
    <header className="app-navbar">
      <Link to="/home" className="app-navbar__brand">Roomie Finder</Link>

      <nav className="app-navbar__nav">
        <Link to="/home" className={`app-navbar__item${isActive('/home') ? ' active' : ''}`}>
          <HomeIcon /> Home
        </Link>
        <Link to="/chats" className={`app-navbar__item${isActive('/chats') ? ' active' : ''}`}>
          <ChatIcon /> Chats
        </Link>
        <Link to="/perfil" className={`app-navbar__item${isActive('/perfil') ? ' active' : ''}`}>
          <PersonIcon /> Perfil
        </Link>
      </nav>

      <div className="app-navbar__avatar">
        <PersonIcon size={26} />
      </div>
    </header>
  )
}
