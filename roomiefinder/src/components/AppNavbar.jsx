import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/app-navbar.css'

function PersonIcon({ size = 32 }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
    </svg>
  )
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="26" height="26">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  )
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="28" height="28">
      <line x1="3" y1="6" x2="21" y2="6"/>
      <line x1="3" y1="12" x2="21" y2="12"/>
      <line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  )
}

export default function AppNavbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { usuario, cerrarSesion } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  const isActive = (path) => location.pathname === path
  const nombreMostrado = usuario
    ? `${usuario.nombre}${usuario.apellido ? ' ' + usuario.apellido : ''}`
    : 'Nombre Persona'

  function handleCerrarSesion() {
    setMenuOpen(false)
    cerrarSesion()
    navigate('/iniciar-sesion')
  }

  // Cerrar el menú al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    if (menuOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpen])

  return (
    <header className="app-navbar">
      <Link to="/home" className="app-navbar__brand">Roomie Finder</Link>

      <div className="app-navbar__right">
        <Link to="/perfil" className="app-navbar__user">
          <span className="app-navbar__avatar">
            {usuario?.foto_perfil_url
              ? <img src={usuario.foto_perfil_url} alt={nombreMostrado} />
              : <PersonIcon size={26} />
            }
          </span>
          <span className="app-navbar__username">{nombreMostrado}</span>
        </Link>

        <button type="button" className="app-navbar__icon-btn" aria-label="Notificaciones">
          <BellIcon />
        </button>

        <div className="app-navbar__menu" ref={menuRef}>
          <button
            type="button"
            className="app-navbar__icon-btn"
            aria-label="Menú"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(v => !v)}
          >
            <MenuIcon />
          </button>

          {menuOpen && (
            <nav className="app-navbar__dropdown">
              <Link
                to="/home"
                className={`app-navbar__dropdown-item${isActive('/home') ? ' active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/chats"
                className={`app-navbar__dropdown-item${isActive('/chats') ? ' active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                Chats
              </Link>
              <Link
                to="/perfil"
                className={`app-navbar__dropdown-item${isActive('/perfil') ? ' active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                Perfil
              </Link>
              {usuario && (
                <button
                  type="button"
                  className="app-navbar__dropdown-item app-navbar__dropdown-item--logout"
                  onClick={handleCerrarSesion}
                >
                  Cerrar sesión
                </button>
              )}
            </nav>
          )}
        </div>
      </div>
    </header>
  )
}
