import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import AppNavbar from '../components/AppNavbar'
import { usePublicaciones } from '../context/PublicacionesContext'
import { useAuth } from '../context/AuthContext'
import { misPostulaciones } from '../api/postulaciones'
import '../styles/publicaciones.css'

function HouseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="pub-card__house-icon">
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
    </svg>
  )
}

function LocationPinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="20" height="20">
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
      <path d="M19 13H13v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
    </svg>
  )
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18" className="filter-select__chevron">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  )
}

// Convierte el precio guardado en [min, max].
// Soporta montos numéricos ("1200") y rangos viejos ("0-500", "2000+").
function parsePrecio(precio) {
  if (!precio) return [0, Infinity]
  if (precio.endsWith('+')) return [Number(precio.replace('+', '')) || 0, Infinity]
  if (precio.includes('-')) {
    const [lo, hi] = precio.split('-').map(Number)
    return [lo || 0, hi || Infinity]
  }
  const n = Number(precio)
  return Number.isFinite(n) ? [n, n] : [0, Infinity]
}

const EMPTY_FILTERS = { zona: '', min: '', max: '', genero: '', orden: 'recientes' }

export default function HomePage() {
  const [search, setSearch] = useState('')
  const [filtros, setFiltros] = useState(EMPTY_FILTERS)
  const [aplicados, setAplicados] = useState(EMPTY_FILTERS)
  const [nInscripciones, setNInscripciones] = useState(0)
  const navigate = useNavigate()
  const { publicaciones } = usePublicaciones()
  const { usuario, token } = useAuth()
  const foroRef = useRef(null)

  // Números de "Tu actividad".
  const nPublicados = usuario
    ? publicaciones.filter(p => p.propietario_id === usuario.id).length
    : 0
  const nMensajes = 0 // TODO: conectar cuando exista el chat.

  useEffect(() => {
    if (!token) return
    let activo = true
    misPostulaciones(token)
      .then(data => { if (activo) setNInscripciones((data || []).length) })
      .catch(() => {})
    return () => { activo = false }
  }, [token])

  function irAlForo() {
    foroRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  function setFiltro(campo, valor) {
    setFiltros(prev => ({ ...prev, [campo]: valor }))
  }

  function aplicarFiltros() {
    setAplicados(filtros)
  }

  const filtered = publicaciones
    .filter(p => {
      const texto = search.toLowerCase()
      const matchTexto =
        p.title.toLowerCase().includes(texto) ||
        p.location.toLowerCase().includes(texto)

      const matchZona = !aplicados.zona ||
        p.location.toLowerCase().includes(aplicados.zona.toLowerCase())

      const [pLo, pHi] = parsePrecio(p.precio)
      const min = aplicados.min ? Number(aplicados.min) : null
      const max = aplicados.max ? Number(aplicados.max) : null
      const matchMin = min === null || pHi >= min
      const matchMax = max === null || pLo <= max

      const matchGenero = !aplicados.genero || p.genero === aplicados.genero

      return matchTexto && matchZona && matchMin && matchMax && matchGenero
    })
    .sort((a, b) => {
      if (aplicados.orden === 'precio-asc') return parsePrecio(a.precio)[0] - parsePrecio(b.precio)[0]
      if (aplicados.orden === 'precio-desc') return parsePrecio(b.precio)[0] - parsePrecio(a.precio)[0]
      return 0 // más recientes: ya vienen ordenados por creación
    })

  return (
    <div className="publicaciones-page">
      <AppNavbar />

      {/* HERO / Tu actividad */}
      <section className="home-hero">
        <div className="home-hero__text">
          <h1 className="home-hero__title">Tu próximo hogar, con la gente correcta</h1>
          <p className="home-hero__subtitle">
            Buscá tu próximo hogar y con quién compartirlo, de forma simple y segura.
          </p>

          <h2 className="home-hero__actividad">Tu actividad</h2>
          <div className="home-hero__stats">
            <div className="home-stat">
              <span className="home-stat__num">{nInscripciones}</span>
              <span className="home-stat__label">Inscripciones</span>
            </div>
            <div className="home-stat">
              <span className="home-stat__num">{nMensajes}</span>
              <span className="home-stat__label">Mensajes</span>
            </div>
            <div className="home-stat">
              <span className="home-stat__num">{nPublicados}</span>
              <span className="home-stat__label">Publicados</span>
            </div>
          </div>
        </div>

        <div className="home-hero__cards" aria-hidden="true">
          <div className="home-mini-card home-mini-card--back">
            <div className="home-mini-card__img">
              <svg viewBox="0 0 24 24" fill="currentColor" width="60" height="60"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
            </div>
            <div className="home-mini-card__band">
              <span>Nombre</span>
              <span className="home-mini-card__ubi">Ubi
                <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg>
              </span>
            </div>
          </div>
          <div className="home-mini-card home-mini-card--front">
            <div className="home-mini-card__img">
              <svg viewBox="0 0 24 24" fill="currentColor" width="60" height="60"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
            </div>
            <div className="home-mini-card__band">
              <span>Nombre</span>
              <span className="home-mini-card__ubi">Ubi
                <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg>
              </span>
            </div>
          </div>
        </div>

        <button className="home-hero__scroll" onClick={irAlForo}>
          Mirá las publicaciones
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="26" height="26">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </section>

      <div className="page-body" ref={foroRef}>

        <aside className="filters-sidebar">
          <h2 className="filters-title">Filtros</h2>

          <div className="filter-group">
            <label className="filter-label">Zona</label>
            <input
              type="text"
              className="filter-input"
              placeholder="Ubicacion"
              value={filtros.zona}
              onChange={e => setFiltro('zona', e.target.value)}
            />
          </div>

          <div className="filter-group">
            <span className="filter-label">Precio de alquiler</span>
            <div className="filter-row">
              <input
                type="number"
                className="filter-input"
                placeholder="$ Minimo"
                value={filtros.min}
                onChange={e => setFiltro('min', e.target.value)}
              />
              <input
                type="number"
                className="filter-input"
                placeholder="$ Maximo"
                value={filtros.max}
                onChange={e => setFiltro('max', e.target.value)}
              />
            </div>
          </div>

          <div className="filter-group">
            <span className="filter-label">Preferencia</span>
            <div className="filter-select-wrapper">
              <select
                className="filter-input filter-select"
                value={filtros.genero}
                onChange={e => setFiltro('genero', e.target.value)}
              >
                <option value="">Genero</option>
                <option value="indiferente">Sin preferencia</option>
                <option value="masculino">Masculino</option>
                <option value="femenino">Femenino</option>
                <option value="no_binario">No binario</option>
              </select>
              <ChevronIcon />
            </div>
          </div>

          <div className="filter-group">
            <span className="filter-label">Ordenado por</span>
            <div className="filter-select-wrapper">
              <select
                className="filter-input filter-select"
                value={filtros.orden}
                onChange={e => setFiltro('orden', e.target.value)}
              >
                <option value="recientes">Mas recientes</option>
                <option value="precio-asc">Precio: menor a mayor</option>
                <option value="precio-desc">Precio: mayor a menor</option>
              </select>
              <ChevronIcon />
            </div>
          </div>

          <button className="btn-filtrar" onClick={aplicarFiltros}>Filtrar</button>
        </aside>

        <div className="page-content">
          <h1 className="page-title">Publicaciones</h1>

          <div className="search-row">
            <div className="search-wrapper">
              <span className="search-icon"><SearchIcon /></span>
              <input
                type="text"
                className="search-input"
                placeholder="Buscar por palabras clave"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <button className="btn-add" onClick={() => navigate('/nueva-publicacion')}><PlusIcon /></button>
          </div>

          {filtered.length === 0 ? (
            <p className="empty-state">
              No hay publicaciones todavía. ¡Creá la primera con el +!
            </p>
          ) : (
            <div className="cards-grid">
              {filtered.map(post => (
                <div
                  key={post.id}
                  className="pub-card"
                  onClick={() => navigate(`/publicacion/${post.id}`)}
                >
                  <div className="pub-card__image">
                    {post.image ? (
                      <img src={post.image} alt={post.title} />
                    ) : (
                      <HouseIcon />
                    )}
                  </div>
                  <div className="pub-card__info">
                    <div className="pub-card__title">{post.title}</div>
                    <div className="pub-card__location">
                      {post.location} <LocationPinIcon />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
