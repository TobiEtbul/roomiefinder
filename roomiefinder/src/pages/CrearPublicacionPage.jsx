import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import AppNavbar from '../components/AppNavbar'
import { usePublicaciones } from '../context/PublicacionesContext'
import '../styles/nueva-publicacion.css'

function PlusIcon({ size = 48 }) {
  return (
    <svg className="plus-icon" viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path d="M19 13H13v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
    </svg>
  )
}

function ChevronIcon() {
  return (
    <svg className="select-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  )
}

export default function CrearPublicacionPage() {
  const navigate = useNavigate()
  const { agregarPublicacion } = usePublicaciones()
  const fileInputRef = useRef(null)

  const [nombre, setNombre]       = useState('')
  const [precio, setPrecio]       = useState('')
  const [genero, setGenero]       = useState('')
  const [ubicacion, setUbicacion] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [images, setImages]       = useState([])
  const [error, setError]         = useState('')
  const [enviando, setEnviando]   = useState(false)

  function handleImageSelect(e) {
    const files = Array.from(e.target.files)
    const nuevas = files.map(f => ({ file: f, preview: URL.createObjectURL(f) }))
    setImages(prev => [...prev, ...nuevas])
    e.target.value = ''
  }

  async function handlePublicar() {
    if (!nombre.trim()) return
    setError('')
    setEnviando(true)
    try {
      await agregarPublicacion({
        title: nombre.trim(),
        location: ubicacion.trim() || 'Ubicacion',
        precio,
        genero,
        descripcion,
        archivos: images.map(img => img.file),
      })
      navigate('/home')
    } catch (err) {
      setError(err.status === 401 || err.status === 403
        ? 'Tenés que iniciar sesión para publicar.'
        : err.message || 'No se pudo crear la publicación.')
    } finally {
      setEnviando(false)
    }
  }

  const canPublish = nombre.trim().length > 0

  return (
    <div className="nueva-pub-page">
      <AppNavbar />

      <div className="page-content">
        <h1 className="page-title">Crear Publicación</h1>

        <div className="layout">

          {/* FORM CARD */}
          <section className="form-card">

            <div className="form-group">
              <input
                type="text"
                className="input-field"
                placeholder="Nombre de publicacion"
                value={nombre}
                onChange={e => setNombre(e.target.value)}
              />
            </div>

            <div className="select-row">
              <div className="price-field">
                <span className="price-field__prefix">$</span>
                <input
                  type="number"
                  min="0"
                  className="price-field__input"
                  placeholder="0"
                  value={precio}
                  onChange={e => setPrecio(e.target.value)}
                />
                <span className="price-field__suffix">USD</span>
              </div>

              <div className="select-wrapper">
                <select
                  className="input-field"
                  value={genero}
                  onChange={e => setGenero(e.target.value)}
                >
                  <option value="" disabled>Genero de preferencia</option>
                  <option value="indiferente">Sin preferencia</option>
                  <option value="masculino">Masculino</option>
                  <option value="femenino">Femenino</option>
                  <option value="no_binario">No binario</option>
                </select>
                <ChevronIcon />
              </div>
            </div>

            <div className="form-group">
              <input
                type="text"
                className="input-field"
                placeholder="Ubicacion"
                value={ubicacion}
                onChange={e => setUbicacion(e.target.value)}
              />
            </div>

            <div className="form-group">
              <textarea
                className="textarea"
                placeholder="Descripcion para agregar"
                value={descripcion}
                onChange={e => setDescripcion(e.target.value)}
                rows={5}
              />
            </div>

            {error && <p className="pub-error">{error}</p>}

            <button
              className="btn-publicar"
              onClick={handlePublicar}
              disabled={!canPublish || enviando}
            >
              {enviando ? 'Publicando…' : 'Publicar'}
            </button>
          </section>

          {/* IMAGE CARD */}
          <aside
            className="image-card"
            onClick={() => images.length === 0 && fileInputRef.current.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              style={{ display: 'none' }}
              onChange={handleImageSelect}
            />

            {images.length === 0 ? (
              <>
                <PlusIcon size={52} />
                <span className="add-label">Agregar<br />Imagen/es</span>
              </>
            ) : (
              <>
                <div className="image-previews">
                  {images.slice(0, 4).map((img, i) => (
                    <div
                      key={i}
                      className={`image-preview-item${images.length === 1 ? ' single' : ''}`}
                    >
                      <img src={img.preview} alt={`preview ${i + 1}`} />
                    </div>
                  ))}
                </div>
                <button
                  className="add-more-btn"
                  onClick={e => { e.stopPropagation(); fileInputRef.current.click() }}
                >
                  +
                </button>
              </>
            )}
          </aside>

        </div>
      </div>
    </div>
  )
}
