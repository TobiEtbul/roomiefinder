import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate, Navigate } from 'react-router-dom'
import AppNavbar from '../components/AppNavbar'
import { useAuth } from '../context/AuthContext'
import { obtenerUsuario } from '../api/auth'
import {
  enviarMensaje,
  listarConversaciones,
  obtenerConversacion,
  marcarLeido,
} from '../api/mensajes'
import '../styles/mensajes.css'

const POLL_LISTA = 8000
const POLL_CHAT = 4000

function PersonIcon({ size = 30 }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="30" height="30">
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>
    </svg>
  )
}

function VideoIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="32" height="32">
      <polygon points="23 7 16 12 23 17 23 7"/>
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
    </svg>
  )
}

function DotsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="30" height="30">
      <circle cx="5" cy="12" r="2.2"/>
      <circle cx="12" cy="12" r="2.2"/>
      <circle cx="19" cy="12" r="2.2"/>
    </svg>
  )
}

function ClipIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="26" height="26">
      <path d="M21.4 11.1l-9.2 9.2a6 6 0 0 1-8.5-8.5l9.2-9.2a4 4 0 0 1 5.7 5.7l-9.2 9.2a2 2 0 0 1-2.8-2.8l8.5-8.5"/>
    </svg>
  )
}

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26">
      <path d="M3.4 20.4l17.4-7.5a1 1 0 0 0 0-1.8L3.4 3.6a1 1 0 0 0-1.4 1.1L4 11l9 1-9 1-2 6.3a1 1 0 0 0 1.4 1.1z"/>
    </svg>
  )
}

function aFecha(valor) {
  if (!valor) return null
  const iso = /[zZ]|[+-]\d\d:?\d\d$/.test(valor) ? valor : `${valor}Z`
  const d = new Date(iso)
  return isNaN(d) ? null : d
}

function formatHora(valor) {
  const d = aFecha(valor)
  if (!d) return ''
  const hoy = new Date()
  if (d.toDateString() === hoy.toDateString()) {
    return d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
  }
  return d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' })
}

function nombreDe(u) {
  if (!u) return 'Usuario'
  return `${u.nombre}${u.apellido ? ' ' + u.apellido : ''}`
}

function Avatar({ usuario, className }) {
  return (
    <span className={`chat-avatar ${className || ''}`}>
      {usuario?.foto_perfil_url
        ? <img src={usuario.foto_perfil_url} alt={nombreDe(usuario)} />
        : <PersonIcon />
      }
    </span>
  )
}

export default function MensajesPage() {
  const { usuarioId } = useParams()
  const navigate = useNavigate()
  const { usuario, token } = useAuth()

  const [conversaciones, setConversaciones] = useState([])
  const [perfiles, setPerfiles] = useState({})
  const [mensajes, setMensajes] = useState([])
  const [texto, setTexto] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState('')
  const finRef = useRef(null)
  const pedidosPerfil = useRef(new Set())

  const cargarPerfil = useCallback((id) => {
    if (!id || pedidosPerfil.current.has(id)) return
    pedidosPerfil.current.add(id)
    obtenerUsuario(id)
      .then(u => setPerfiles(prev => ({ ...prev, [id]: u })))
      .catch(() => pedidosPerfil.current.delete(id))
  }, [])

  const cargarConversaciones = useCallback(async () => {
    if (!token) return
    try {
      const data = await listarConversaciones(token)
      const lista = data || []
      setConversaciones(lista)
      lista.forEach(c => cargarPerfil(c.usuario_id))
    } catch {}
  }, [token, cargarPerfil])

  useEffect(() => {
    cargarConversaciones()
    const t = setInterval(cargarConversaciones, POLL_LISTA)
    return () => clearInterval(t)
  }, [cargarConversaciones])

  useEffect(() => {
    if (usuarioId) cargarPerfil(usuarioId)
  }, [usuarioId, cargarPerfil])

  useEffect(() => {
    if (!usuarioId || !token) return
    let activo = true

    async function cargarChat() {
      try {
        const data = await obtenerConversacion(usuarioId, token)
        if (!activo) return
        const lista = data || []
        setMensajes(prev => (prev.length === lista.length && prev.at(-1)?.id === lista.at(-1)?.id ? prev : lista))
        if (lista.some(m => m.receptor_id === usuario?.id && !m.leido)) {
          marcarLeido(usuarioId, token).catch(() => {})
        }
      } catch {}
    }

    setMensajes([])
    cargarChat()
    const t = setInterval(cargarChat, POLL_CHAT)
    return () => { activo = false; clearInterval(t) }
  }, [usuarioId, token, usuario?.id])

  useEffect(() => {
    finRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [mensajes])

  if (!usuario) return <Navigate to="/iniciar-sesion" replace />

  async function handleEnviar(e) {
    e.preventDefault()
    const contenido = texto.trim()
    if (!contenido || !usuarioId || enviando) return
    setEnviando(true)
    setError('')
    try {
      const nuevo = await enviarMensaje(usuarioId, contenido, token)
      setMensajes(prev => [...prev, nuevo])
      setTexto('')
      cargarConversaciones()
    } catch (err) {
      setError(err.message || 'No se pudo enviar el mensaje.')
    } finally {
      setEnviando(false)
    }
  }

  const otro = usuarioId ? perfiles[usuarioId] : null
  const convActual = conversaciones.find(c => c.usuario_id === usuarioId)
  const ultimaActividad = mensajes.at(-1)?.created_at || convActual?.ultimo_mensaje_fecha

  const lista = [...conversaciones]
  if (usuarioId && !convActual) {
    lista.unshift({ usuario_id: usuarioId, ultimo_mensaje: 'Nueva conversación', no_leidos: 0 })
  }

  return (
    <div className="mensajes-page">
      <AppNavbar />

      <main className={`mensajes-layout${usuarioId ? ' con-chat' : ''}`}>
        <aside className="mensajes-lista">
          <h1 className="mensajes-lista__titulo">Chats</h1>

          {lista.length === 0 ? (
            <p className="mensajes-lista__vacio">
              Todavía no tenés conversaciones. Cuando aceptes a alguien en una publicación, o te acepten a vos, el chat aparece acá.
            </p>
          ) : (
            <ul className="mensajes-lista__items">
              {lista.map(c => {
                const perfil = perfiles[c.usuario_id]
                return (
                  <li key={c.usuario_id}>
                    <button
                      type="button"
                      className={`conv-item${c.usuario_id === usuarioId ? ' activo' : ''}`}
                      onClick={() => navigate(`/mensajes/${c.usuario_id}`)}
                    >
                      <Avatar usuario={perfil} />
                      <span className="conv-item__texto">
                        <span className="conv-item__nombre">{nombreDe(perfil)}</span>
                        <span className="conv-item__ultimo">{c.ultimo_mensaje}</span>
                      </span>
                      {c.no_leidos > 0 && c.usuario_id !== usuarioId && (
                        <span className="conv-item__badge">{c.no_leidos}</span>
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </aside>

        <section className="chat">
          {usuarioId ? (
            <>
              <header className="chat__header">
                <button type="button" className="chat__volver" onClick={() => navigate('/mensajes')} aria-label="Volver">
                  ←
                </button>
                <Avatar usuario={otro} className="chat-avatar--header" />
                <div className="chat__header-texto">
                  <span className="chat__nombre">{nombreDe(otro)}</span>
                  <span className="chat__actividad">
                    {ultimaActividad ? `Última actividad ${formatHora(ultimaActividad)}` : 'Sin mensajes todavía'}
                  </span>
                </div>
                <div className="chat__acciones" aria-hidden="true" title="Próximamente">
                  <PhoneIcon />
                  <VideoIcon />
                  <DotsIcon />
                </div>
              </header>

              <div className="chat__mensajes">
                {mensajes.length === 0 && (
                  <p className="chat__vacio">Escribí el primer mensaje para arrancar la conversación.</p>
                )}
                {mensajes.map(m => {
                  const mio = m.emisor_id === usuario.id
                  return (
                    <div key={m.id} className={`burbuja${mio ? ' burbuja--mia' : ''}`}>
                      <span className="burbuja__texto">{m.contenido}</span>
                      <span className="burbuja__hora">{formatHora(m.created_at)}</span>
                    </div>
                  )
                })}
                <div ref={finRef} />
              </div>

              {error && <p className="chat__error">{error}</p>}

              <form className="chat__form" onSubmit={handleEnviar}>
                <div className="chat__input-wrap">
                  <span className="chat__clip" aria-hidden="true"><ClipIcon /></span>
                  <input
                    className="chat__input"
                    placeholder="Escribe un mensaje"
                    value={texto}
                    maxLength={5000}
                    onChange={e => setTexto(e.target.value)}
                  />
                </div>
                <button type="submit" className="chat__enviar" disabled={!texto.trim() || enviando} aria-label="Enviar">
                  <SendIcon />
                </button>
              </form>
            </>
          ) : (
            <div className="chat__placeholder">
              <p>Elegí una conversación para empezar a chatear.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
