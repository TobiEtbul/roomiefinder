import { useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
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

export default function EditarPublicacionPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { publicaciones, actualizarPublicacion } = usePublicaciones()
  const fileInputRef = useRef(null)

  const post = publicaciones.find(p => String(p.id) === id)

  const [nombre, setNombre]       = useState(post?.title || '')
  const [precio, setPrecio]       = useState(post?.precio || '')
  const [genero, setGenero]       = useState(post?.genero || '')
  const [ubicacion, setUbicacion] = useState(post?.location || '')
  const [descripcion, setDescripcion] = useState(post?.descripcion || '')
  const [images, setImages]       = useState(() => {
    const arr = post ? (post.images?.length ? post.images : (post.image ? [post.image] : [])) : []
    // Fotos existentes: ya tienen url (Cloudinary) y no hay que volver a subirlas.
    return arr.map(url => ({ file: null, preview: url }))
  })
  const [error, setError]         = useState('')
  const [guardando, setGuardando] = useState(false)

  // Cantidad de fotos ya guardadas (para no volver a subirlas).
  const fotosPrevias = images.filter(img => !img.file).length

  function handleImageSelect(e) {
    const files = Array.from(e.target.files)
    const nuevas = files.map(f => ({ file: f, preview: URL.createObjectURL(f) }))
    setImages(prev => [...prev, ...nuevas])
    e.target.value = ''
  }

  async function handleGuardar() {
    if (!nombre.trim()) return
    setError('')
    setGuardando(true)
    try {
      await actualizarPublicacion(post.id, {
        title: nombre.trim(),
        location: ubicacion.trim() || 'Ubicacion',
        precio,
        genero,
        descripcion,
        archivos: images.filter(img => img.file).map(img => img.file),
        fotosPrevias,
      })
      navigate(`/publicacion/${post.id}`)
    } catch (err) {
      setError(err.status === 401 || err.status === 403
        ? 'No tenés permiso para editar esta publicación.'
        : err.message || 'No se pudo guardar la publicación.')
    } finally {
      setGuardando(false)
    }
  }

  if (!post) {
    return (
      <div className="nueva-pub-page">
        <AppNavbar />
        <div className="page-content">
          <h1 className="page-title">Editar Publicación</h1>
          <p>No se encontró la publicación.</p>
          <button className="btn-publicar" onClick={() => navigate('/perfil')}>
            Volver al perfil
          </button>
        </div>
      </div>
    )
  }

  const canSave = nombre.trim().length > 0

  return (
    <div className="nueva-pub-page">
      <AppNavbar />

      <div className="page-content">
        <h1 className="page-title">Editar Publicación</h1>

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
              onClick={handleGuardar}
              disabled={!canSave || guardando}
            >
              {guardando ? 'Guardando…' : 'Guardar cambios'}
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
