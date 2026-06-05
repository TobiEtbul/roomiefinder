import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppNavbar from '../components/AppNavbar'
import { usePublicaciones } from '../context/PublicacionesContext'
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

export default function PublicacionesPage() {
  const [search, setSearch] = useState('')
  const navigate = useNavigate()
  const { publicaciones } = usePublicaciones()

  const filtered = publicaciones.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.location.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="publicaciones-page">
      <AppNavbar />

      <div className="page-content">
        <h1 className="page-title">Publicaciones</h1>

        <div className="search-row">
          <div className="search-wrapper">
            <span className="search-icon"><SearchIcon /></span>
            <input
              type="text"
              className="search-input"
              placeholder="Buscar por palabras claves"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button className="btn-add" onClick={() => navigate('/nueva-publicacion')}>+</button>
        </div>

        {filtered.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#aaa', marginTop: '60px', fontSize: '1.1rem' }}>
            No hay publicaciones todavía. ¡Creá la primera con el +!
          </p>
        ) : (
          <div className="cards-grid">
            {filtered.map(post => (
              <div key={post.id} className="pub-card">
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
  )
}
