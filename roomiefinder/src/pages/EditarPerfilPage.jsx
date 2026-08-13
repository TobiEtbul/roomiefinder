import { useState, useRef } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import AppNavbar from '../components/AppNavbar'
import { useAuth } from '../context/AuthContext'
import { subirImagen } from '../api/uploads'
import '../styles/registrarse.css'

const INITIAL_TAGS = ['Ordenado', 'Sociable', 'Tranquilo', 'Fiestero', 'Divertido']

export default function EditarPerfilPage() {
  const navigate = useNavigate()
  const { usuario, token, actualizarPerfil } = useAuth()

  // Estado inicial precargado con los datos del usuario.
  const [nombre, setNombre] = useState(
    usuario ? `${usuario.nombre}${usuario.apellido ? ' ' + usuario.apellido : ''}` : ''
  )
  const [email, setEmail] = useState(usuario?.email || '')
  const [genero, setGenero] = useState(usuario?.genero || '')
  const [fotoPerfil, setFotoPerfil] = useState(usuario?.foto_perfil_url || null)
  const [fotoFile, setFotoFile] = useState(null)
  const [descripcion, setDescripcion] = useState(usuario?.descripcion || '')
  const [tags, setTags] = useState(() => {
    const prefs = (usuario?.preferencias || '').split(',').map(s => s.trim()).filter(Boolean)
    const base = INITIAL_TAGS.map(t => ({ label: t, active: prefs.includes(t) }))
    const extra = prefs
      .filter(p => !INITIAL_TAGS.includes(p))
      .map(p => ({ label: p, active: true }))
    return [...base, ...extra]
  })
  const [showAddInput, setShowAddInput] = useState(false)
  const [newTag, setNewTag] = useState('')
  const [error, setError] = useState('')
  const [guardando, setGuardando] = useState(false)
  const fileInputRef = useRef(null)

  // Si no hay sesión, no se puede editar el perfil.
  if (!usuario) return <Navigate to="/iniciar-sesion" replace />

  function handleFotoClick() {
    fileInputRef.current.click()
  }

  function handleFotoChange(e) {
    const file = e.target.files[0]
    if (!file) return
    setFotoFile(file)
    setFotoPerfil(URL.createObjectURL(file))
  }

  function toggleTag(index) {
    setTags(tags.map((t, i) => (i === index ? { ...t, active: !t.active } : t)))
  }

  function confirmNewTag() {
    const text = newTag.trim()
    if (!text) return
    setTags([...tags, { label: text, active: true }])
    setNewTag('')
    setShowAddInput(false)
  }

  function cancelAddTag() {
    setNewTag('')
    setShowAddInput(false)
  }

  function handleNewTagKeyDown(e) {
    if (e.key === 'Enter') confirmNewTag()
    if (e.key === 'Escape') cancelAddTag()
  }

  async function handleGuardar() {
    setError('')
    if (!nombre.trim()) {
      setError('Ingresá tu nombre.')
      return
    }

    const partes = nombre.trim().split(/\s+/)
    const cambios = {
      nombre: partes[0],
      apellido: partes.slice(1).join(' ') || partes[0],
      email: email.trim(),
      genero: genero || undefined,
      descripcion: descripcion.trim(),
      preferencias: tags.filter(t => t.active).map(t => t.label).join(', '),
    }

    setGuardando(true)
    try {
      // Si eligió una foto nueva, la subimos y guardamos su URL.
      if (fotoFile) {
        const { url } = await subirImagen(fotoFile, token)
        cambios.foto_perfil_url = url
      }
      await actualizarPerfil(cambios)
      navigate('/perfil')
    } catch (err) {
      setError(err.message || 'No se pudo guardar el perfil.')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="register-page editar-perfil">
      <AppNavbar />

      <main className="container">

        <section className="card left-panel">

          <div className="avatar-wrapper" onClick={handleFotoClick} style={{ cursor: 'pointer' }}>
            <div className="avatar-circle">
              {fotoPerfil
                ? <img src={fotoPerfil} alt="Foto de perfil" className="avatar-preview" />
                : <img src="/user-icon.svg" alt="Usuario" className="camera-icon" />
              }
            </div>
            <span className="avatar-dot" />
            <p className="avatar-label">Foto de perfil</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFotoChange}
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              className="input-field"
              placeholder="Nombre completo"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
            />
          </div>

          <div className="form-group">
            <input
              type="email"
              className="input-field"
              placeholder="Correo electronico"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <div className="select-wrapper">
              <select
                className="input-field select"
                value={genero}
                onChange={e => setGenero(e.target.value)}
              >
                <option value="" disabled>Genero</option>
                <option value="masculino">Masculino</option>
                <option value="femenino">Femenino</option>
                <option value="no_binario">No binario</option>
                <option value="prefiero_no_decir">Prefiero no decir</option>
              </select>
              <span className="select-arrow">&#x2304;</span>
            </div>
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button className="btn-continuar" onClick={handleGuardar} disabled={guardando}>
            {guardando ? 'Guardando…' : 'Guardar cambios'}
          </button>
        </section>

        <aside className="right-column">

          <div className="card description-card">
            <h2 className="card-title">Descripcion personal</h2>
            <textarea
              className="textarea"
              placeholder="Gustos personales, preferencias, costumbres"
              rows={8}
              value={descripcion}
              onChange={e => setDescripcion(e.target.value)}
            />
            <p className="hint">Minimo 50 palabras</p>
          </div>

          <div className="card preferences-card">
            <h2 className="card-title">Preferencias de roomies</h2>
            <div className="tags-grid">
              {tags.map((tag, i) => (
                <button
                  key={i}
                  className={`tag${tag.active ? ' tag--active' : ''}`}
                  onClick={() => toggleTag(i)}
                >
                  {tag.label}
                </button>
              ))}
              {!showAddInput && (
                <button className="tag tag--add" onClick={() => setShowAddInput(true)}>+</button>
              )}
            </div>

            {showAddInput && (
              <div className="add-tag-row">
                <input
                  type="text"
                  className="input-field add-tag-input"
                  placeholder="Nueva preferencia..."
                  maxLength={24}
                  value={newTag}
                  onChange={e => setNewTag(e.target.value)}
                  onKeyDown={handleNewTagKeyDown}
                  autoFocus
                />
                <button className="add-tag-confirm" onClick={confirmNewTag}>&#10003;</button>
                <button className="add-tag-cancel" onClick={cancelAddTag}>&#10005;</button>
              </div>
            )}
          </div>

        </aside>
      </main>
    </div>
  )
}
