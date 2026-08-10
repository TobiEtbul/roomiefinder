import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/registrarse.css'

const INITIAL_TAGS = ['Ordenado', 'Sociable', 'Tranquilo', 'Introvertido', 'Divertido']

// El backend espera el género como enum; mapeamos desde las opciones del form.
const GENERO_MAP = {
  'Masculino': 'masculino',
  'Femenino': 'femenino',
  'No binario': 'no_binario',
  'Prefiero no decir': 'prefiero_no_decir',
}

export default function RegisterPage() {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const [fecha, setFecha] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [tags, setTags] = useState(INITIAL_TAGS.map(t => ({ label: t, active: false })))
  const [showAddInput, setShowAddInput] = useState(false)
  const [newTag, setNewTag] = useState('')
  const [fotoPerfil, setFotoPerfil] = useState(null)
  const [nombre, setNombre] = useState('')
  const [dni, setDni] = useState('')
  const [genero, setGenero] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [terminos, setTerminos] = useState(false)
  const [descripcion, setDescripcion] = useState('')
  const [modalCampos, setModalCampos] = useState(null)
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)
  const fileInputRef = useRef(null)
  const navigate = useNavigate()
  const { registrar } = useAuth()

  function handleFotoClick() {
    fileInputRef.current.click()
  }

  function handleFotoChange(e) {
    const file = e.target.files[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setFotoPerfil(url)
  }

  async function handleContinuar() {
    setError('')
    const camposFaltantes = []
    if (!fotoPerfil) camposFaltantes.push('Foto de perfil')
    if (!nombre.trim()) camposFaltantes.push('Nombre completo')
    if (!dni.trim()) camposFaltantes.push('DNI')
    if (!genero) camposFaltantes.push('Género')
    if (!email.trim()) camposFaltantes.push('Correo electrónico')
    if (fecha.length < 10) camposFaltantes.push('Fecha de nacimiento')
    if (!password.trim()) camposFaltantes.push('Contraseña')
    if (!terminos) camposFaltantes.push('Términos y condiciones')
    if (descripcion.trim().split(/\s+/).filter(Boolean).length < 50) camposFaltantes.push('Descripción personal (mínimo 50 palabras)')

    if (camposFaltantes.length > 0) {
      setModalCampos(camposFaltantes)
      return
    }

    // Partimos "Nombre completo" en nombre + apellido (el backend los pide separados).
    const partes = nombre.trim().split(/\s+/)
    const nombreN = partes[0]
    const apellidoN = partes.slice(1).join(' ') || partes[0]

    // Fecha DD/MM/AAAA -> YYYY-MM-DD que espera el backend.
    const [dd, mm, aaaa] = fecha.split('/')
    const fechaISO = `${aaaa}-${mm}-${dd}`

    const payload = {
      nombre: nombreN,
      apellido: apellidoN,
      dni: dni.trim(),
      email: email.trim(),
      password,
      fecha_nacimiento: fechaISO,
      genero: GENERO_MAP[genero] || 'prefiero_no_decir',
    }

    const extras = {
      descripcion: descripcion.trim(),
      preferencias: tags.filter(t => t.active).map(t => t.label).join(', '),
    }

    setEnviando(true)
    try {
      await registrar(payload, extras)
      navigate('/home')
    } catch (err) {
      setError(err.message || 'No se pudo crear la cuenta.')
    } finally {
      setEnviando(false)
    }
  }

  function handleFechaChange(e) {
    let v = e.target.value.replace(/\D/g, '')
    if (v.length > 8) v = v.slice(0, 8)
    let out = ''
    if (v.length > 0) out = v.slice(0, 2)
    if (v.length >= 3) out += '/' + v.slice(2, 4)
    if (v.length >= 5) out += '/' + v.slice(4, 8)
    setFecha(out)
  }

  function handleFechaKeyDown(e) {
    if (e.key === 'Backspace' && fecha.endsWith('/')) {
      e.preventDefault()
      setFecha(fecha.slice(0, -1))
    }
  }

  function toggleTag(index) {
    setTags(tags.map((t, i) => i === index ? { ...t, active: !t.active } : t))
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

  return (
    <div className="register-page">

      <header className="page-header">
        <h1 className="page-title">Crear perfil</h1>
      </header>

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

          <div className="form-row">
            <input
              type="text"
              className="input-field half"
              placeholder="DNI"
              value={dni}
              onChange={e => setDni(e.target.value)}
            />
            <div className="select-wrapper half">
              <select
                className="input-field select"
                value={genero}
                onChange={e => setGenero(e.target.value)}
              >
                <option value="" disabled>Genero</option>
                <option>Masculino</option>
                <option>Femenino</option>
                <option>No binario</option>
                <option>Prefiero no decir</option>
              </select>
              <span className="select-arrow">&#x2304;</span>
            </div>
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
            <input
              type="text"
              className="input-field"
              placeholder="DD/MM/AAAA"
              maxLength={10}
              inputMode="numeric"
              value={fecha}
              onChange={handleFechaChange}
              onKeyDown={handleFechaKeyDown}
            />
          </div>

          <div className="form-group">
            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                className="input-field"
                placeholder="Contraseña"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowPassword(v => !v)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? (
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="checkbox-row">
            <input
              type="checkbox"
              id="terms"
              className="checkbox"
              checked={terminos}
              onChange={e => setTerminos(e.target.checked)}
            />
            <label htmlFor="terms" className="checkbox-label">Acepto los terminos y condiciones</label>
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button className="btn-continuar" onClick={handleContinuar} disabled={enviando}>
            {enviando ? 'Creando cuenta…' : 'Continuar'}
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
      {modalCampos && (
        <div className="modal-overlay" onClick={() => setModalCampos(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">Campos incompletos</h2>
            <p className="modal-subtitle">Completá los siguientes campos para continuar:</p>
            <ul className="modal-list">
              {modalCampos.map((campo, i) => (
                <li key={i} className="modal-item">{campo}</li>
              ))}
            </ul>
            <button className="modal-btn" onClick={() => setModalCampos(null)}>Entendido</button>
          </div>
        </div>
      )}
    </div>
  )
}
