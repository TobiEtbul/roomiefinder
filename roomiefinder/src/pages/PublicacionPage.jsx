import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AppNavbar from '../components/AppNavbar'
import { usePublicaciones } from '../context/PublicacionesContext'
import '../styles/detalle-publicacion.css'

const PRECIO_LABELS = {
  '0-500': '$0 – $500 USD',
  '500-1000': '$500 – $1.000 USD',
  '1000-2000': '$1.000 – $2.000 USD',
  '2000+': '+ $2.000 USD',
}

const GENERO_LABELS = {
  'sin-preferencia': 'Sin preferencia',
  'masculino': 'Masculino',
  'femenino': 'Femenino',
  'mixto': 'Mixto',
}

function HouseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="detalle-house-icon">
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
    </svg>
  )
}

export default function PublicacionPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { publicaciones } = usePublicaciones()

  const post = publicaciones.find(p => String(p.id) === id)

  const images = post
    ? (post.images?.length ? post.images : (post.image ? [post.image] : []))
    : []

  const [lightboxIndex, setLightboxIndex] = useState(null)

  const closeLightbox = useCallback(() => setLightboxIndex(null), [])
  const showPrev = useCallback(
    () => setLightboxIndex(i => (i - 1 + images.length) % images.length),
    [images.length]
  )
  const showNext = useCallback(
    () => setLightboxIndex(i => (i + 1) % images.length),
    [images.length]
  )

  useEffect(() => {
    if (lightboxIndex === null) return
    function onKey(e) {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowLeft') showPrev()
      if (e.key === 'ArrowRight') showNext()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightboxIndex, closeLightbox, showPrev, showNext])

  if (!post) {
    return (
      <div className="detalle-page">
        <AppNavbar />
        <div className="page-content">
          <div className="detalle-not-found">
            <p>No se encontró la publicación.</p>
            <button className="btn-volver" onClick={() => navigate('/home')}>
              Volver a publicaciones
            </button>
          </div>
        </div>
      </div>
    )
  }

  const precioLabel = PRECIO_LABELS[post.precio] || post.precio || ''
  const generoLabel = GENERO_LABELS[post.genero] || post.genero || ''
  const hasImages = images.length > 0

  return (
    <div className="detalle-page">
      <AppNavbar />

      <div className="page-content">
        <div className="layout">

          {/* LEFT — imagen + descripción de persona + inscripción */}
          <section className="left-card">
            <div
              className={`detalle-image${hasImages ? ' detalle-image--clickable' : ''}`}
              onClick={() => hasImages && setLightboxIndex(0)}
            >
              {hasImages ? (
                <>
                  <img src={images[0]} alt={post.title} />
                  {images.length > 1 && (
                    <span className="detalle-image__count">1 / {images.length}</span>
                  )}
                </>
              ) : (
                <HouseIcon />
              )}
            </div>

            {images.length > 1 && (
              <div className="detalle-thumbs">
                {images.map((img, i) => (
                  <button
                    key={i}
                    className="detalle-thumb"
                    onClick={() => setLightboxIndex(i)}
                  >
                    <img src={img} alt={`Foto ${i + 1}`} />
                  </button>
                ))}
              </div>
            )}

            <div className="persona-box">
              <p className="persona-placeholder">Corta descripción de persona<br />(edad, gustos, etc)</p>
            </div>

            <button className="btn-inscripcion">Inscripción</button>
          </section>

          {/* RIGHT — datos de la publicación */}
          <section className="right-card">

            <div className="field field--full">
              <span className="field-value">{post.title}</span>
            </div>

            <div className="field field--full">
              <span className={post.location ? 'field-value' : 'field-empty'}>
                {post.location || 'Ubicación'}
              </span>
            </div>

            <div className="field-row">
              <div className="field">
                <span className={precioLabel ? 'field-value' : 'field-empty'}>
                  {precioLabel || 'Precio'}
                </span>
              </div>
              <div className="field">
                <span className={generoLabel ? 'field-value' : 'field-empty'}>
                  {generoLabel || 'Género preferido'}
                </span>
              </div>
            </div>

            <div className="field field--description">
              <span className="field-label">Descripción agregada</span>
              {post.descripcion
                ? <p className="field-value">{post.descripcion}</p>
                : <span className="field-empty">Sin descripción</span>
              }
            </div>

          </section>

        </div>
      </div>

      {/* LIGHTBOX */}
      {lightboxIndex !== null && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <button className="lightbox-close" onClick={closeLightbox} aria-label="Cerrar">
            &#10005;
          </button>

          {images.length > 1 && (
            <button
              className="lightbox-nav lightbox-prev"
              onClick={e => { e.stopPropagation(); showPrev() }}
              aria-label="Anterior"
            >
              &#8249;
            </button>
          )}

          <img
            className="lightbox-img"
            src={images[lightboxIndex]}
            alt={`Foto ${lightboxIndex + 1}`}
            onClick={e => e.stopPropagation()}
          />

          {images.length > 1 && (
            <button
              className="lightbox-nav lightbox-next"
              onClick={e => { e.stopPropagation(); showNext() }}
              aria-label="Siguiente"
            >
              &#8250;
            </button>
          )}

          {images.length > 1 && (
            <div className="lightbox-counter">
              {lightboxIndex + 1} / {images.length}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
