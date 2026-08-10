import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AppNavbar from '../components/AppNavbar'
import { usePublicaciones } from '../context/PublicacionesContext'
import { useAuth } from '../context/AuthContext'
import '../styles/perfil.css'

const PRECIO_LABELS = {
  '0-500': '$0 – $500 USD',
  '500-1000': '$500 – $1.000 USD',
  '1000-2000': '$1.000 – $2.000 USD',
  '2000+': '+ $2.000 USD',
}

function PersonIcon({ size = 90 }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
    </svg>
  )
}

function HouseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="perfil-row__house-icon">
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

function EditIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
    </svg>
  )
}

export default function PerfilPage() {
  const navigate = useNavigate()
  const { publicaciones, eliminarPublicacion } = usePublicaciones()
  const { usuario } = useAuth()
  const [tab, setTab] = useState('publicacion')
  const [menuAbierto, setMenuAbierto] = useState(null)

  const nombreUsuario = usuario
    ? `${usuario.nombre}${usuario.apellido ? ' ' + usuario.apellido : ''}`
    : 'Nombre Usuario'

  // Publicaciones creadas por el usuario logueado.
  const misPublicaciones = usuario
    ? publicaciones.filter(p => p.propietario_id === usuario.id)
    : []

  // Cierra el menú al hacer click en cualquier otro lado.
  useEffect(() => {
    if (menuAbierto === null) return
    function cerrar() { setMenuAbierto(null) }
    window.addEventListener('click', cerrar)
    return () => window.removeEventListener('click', cerrar)
  }, [menuAbierto])

  function handleEditar(e, id) {
    e.stopPropagation()
    setMenuAbierto(null)
    navigate(`/editar-publicacion/${id}`)
  }

  async function handleEliminar(e, id) {
    e.stopPropagation()
    setMenuAbierto(null)
    try {
      await eliminarPublicacion(id)
    } catch {
      // Si falla el borrado, la publicación queda como estaba.
    }
  }

  return (
    <div className="perfil-page">
      <AppNavbar />

      <div className="page-content">
        <div className="perfil-layout">

          {/* SIDEBAR */}
          <aside className="perfil-sidebar">
            <div className="perfil-avatar">
              {usuario?.foto_perfil_url
                ? <img src={usuario.foto_perfil_url} alt={nombreUsuario} />
                : <PersonIcon />
              }
            </div>

            <h2 className="perfil-nombre">{nombreUsuario}</h2>

            <button className="btn-editar" onClick={() => navigate('/editar-perfil')}>
              <EditIcon /> Editar Perfil
            </button>
          </aside>

          {/* MAIN */}
          <main className="perfil-main">

            <div className="perfil-tabs">
              <button
                className={`perfil-tab${tab === 'publicacion' ? ' active' : ''}`}
                onClick={() => setTab('publicacion')}
              >
                Publicación
              </button>
              <button
                className={`perfil-tab${tab === 'inscripciones' ? ' active' : ''}`}
                onClick={() => setTab('inscripciones')}
              >
                Inscripción
              </button>
            </div>

            <div className="perfil-panel">
              {tab === 'publicacion' ? (
                misPublicaciones.length === 0 ? (
                  <p className="perfil-empty">
                    Todavía no creaste ninguna publicación.
                  </p>
                ) : (
                  misPublicaciones.map(post => {
                    const img = post.image || post.images?.[0] || null
                    const precio = post.precio
                      ? (PRECIO_LABELS[post.precio] || `$ ${post.precio} USD`)
                      : ''
                    return (
                      <div
                        key={post.id}
                        className="perfil-row"
                        onClick={() => navigate(`/publicacion/${post.id}`)}
                      >
                        <div className="perfil-row__image">
                          {img ? <img src={img} alt={post.title} /> : <HouseIcon />}
                        </div>
                        <div className="perfil-row__info">
                          <div className="perfil-row__title">{post.title}</div>
                          {post.location && (
                            <div className="perfil-row__location">
                              <LocationPinIcon /> {post.location}
                            </div>
                          )}
                          {precio && (
                            <div className="perfil-row__precio">{precio} / mes</div>
                          )}
                          <div className="perfil-row__meta">0 interesados</div>

                          <div className="perfil-row__more-wrap">
                          <button
                            className="perfil-row__more"
                            onClick={e => {
                              e.stopPropagation()
                              setMenuAbierto(menuAbierto === post.id ? null : post.id)
                            }}
                            aria-label="Más opciones"
                          >
                            ···
                          </button>

                          {menuAbierto === post.id && (
                            <div
                              className="perfil-menu"
                              onClick={e => e.stopPropagation()}
                            >
                              <button
                                className="perfil-menu__item"
                                onClick={e => handleEditar(e, post.id)}
                              >
                                Editar
                              </button>
                              <button
                                className="perfil-menu__item perfil-menu__item--danger"
                                onClick={e => handleEliminar(e, post.id)}
                              >
                                Eliminar
                              </button>
                            </div>
                          )}
                          </div>
                        </div>
                      </div>
                    )
                  })
                )
              ) : (
                <p className="perfil-empty">
                  Todavía no te inscribiste en ninguna publicación.
                </p>
              )}
            </div>

          </main>

        </div>
      </div>
    </div>
  )
}
