import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AppNavbar from '../components/AppNavbar'
import { usePublicaciones } from '../context/PublicacionesContext'
import { useAuth } from '../context/AuthContext'
import { obtenerUsuario } from '../api/auth'
import {
  postulacionesDePublicacion,
  listarEstados,
  actualizarEstado,
} from '../api/postulaciones'
import '../styles/inscriptos.css'

function PersonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="140" height="140">
      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
    </svg>
  )
}

const GENERO_LABELS = {
  masculino: 'Masculino',
  femenino: 'Femenino',
  no_binario: 'No binario',
  prefiero_no_decir: 'Prefiere no decir',
}

function calcularEdad(fecha) {
  if (!fecha) return null
  const nac = new Date(fecha)
  if (isNaN(nac)) return null
  const hoy = new Date()
  let edad = hoy.getFullYear() - nac.getFullYear()
  const m = hoy.getMonth() - nac.getMonth()
  if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) edad--
  return edad
}

export default function InscriptosPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { publicaciones } = usePublicaciones()
  const { token } = useAuth()

  const publicacion = publicaciones.find(p => String(p.id) === id)

  const [inscriptos, setInscriptos] = useState([])
  const [estados, setEstados] = useState([])
  const [cargando, setCargando] = useState(true)
  const [indice, setIndice] = useState(0)
  const [procesando, setProcesando] = useState(false)

  // Carga las postulaciones pendientes + el perfil de cada postulante.
  useEffect(() => {
    let activo = true
    async function cargar() {
      setCargando(true)
      try {
        const [posts, ests] = await Promise.all([
          postulacionesDePublicacion(id, token),
          listarEstados(),
        ])
        if (!activo) return
        setEstados(ests || [])

        // Solo las pendientes de revisar.
        const pendientes = (posts || []).filter(
          p => p.estado?.estado_actual === 'pendiente'
        )

        // Traemos el perfil de cada postulante.
        const conUsuario = await Promise.all(
          pendientes.map(async p => {
            let u = null
            try { u = await obtenerUsuario(p.postulante_id) } catch { /* ignore */ }
            return { postulacion: p, usuario: u }
          })
        )
        if (activo) setInscriptos(conUsuario)
      } catch {
        if (activo) setInscriptos([])
      } finally {
        if (activo) setCargando(false)
      }
    }
    if (token) cargar()
    else setCargando(false)
    return () => { activo = false }
  }, [id, token])

  function estadoId(nombre) {
    return estados.find(e => e.estado_actual === nombre)?.id
  }

  async function decidir(nombreEstado) {
    const actual = inscriptos[indice]
    if (!actual) return
    const eid = estadoId(nombreEstado)
    if (!eid) return
    setProcesando(true)
    try {
      await actualizarEstado(actual.postulacion.id, eid, token)
      setIndice(i => i + 1)
    } catch {
      // si falla, no avanzamos
    } finally {
      setProcesando(false)
    }
  }

  const actual = inscriptos[indice]
  const u = actual?.usuario
  const edad = calcularEdad(u?.fecha_nacimiento)
  const prefs = (u?.preferencias || '').split(',').map(s => s.trim()).filter(Boolean)

  return (
    <div className="inscriptos-page">
      <AppNavbar />

      <div className="inscriptos-content">
        <div className="inscriptos-topbar">
          <button className="inscriptos-volver" onClick={() => navigate('/perfil')}>
            ← Volver
          </button>
          {publicacion && (
            <span className="inscriptos-pub">Inscriptos a “{publicacion.title}”</span>
          )}
        </div>

        {cargando ? (
          <p className="inscriptos-vacio">Cargando inscriptos…</p>
        ) : actual ? (
          <div className="inscriptos-body">

            {/* IZQUIERDA — perfil del inscripto */}
            <div className="inscriptos-left">
              <section className="card persona-card">
                <h2 className="persona-nombre">
                  {u ? `${u.nombre} ${u.apellido || ''}`.trim() : 'Postulante'}
                </h2>

                <div className="persona-datos">
                  <div className="persona-pill">{edad != null ? `${edad} años` : 'Edad'}</div>
                  <div className="persona-pill">{GENERO_LABELS[u?.genero] || 'Género'}</div>
                </div>

                <div className="persona-descripcion">
                  {u?.descripcion || 'Sin descripción.'}
                </div>
              </section>

              <section className="card preferencias-card">
                <h3 className="preferencias-titulo">Preferencias de roomies</h3>
                <div className="preferencias-tags">
                  {prefs.length > 0
                    ? prefs.map((pref, i) => <span key={i} className="pref-tag">{pref}</span>)
                    : <span className="preferencias-vacio">Sin preferencias cargadas</span>
                  }
                </div>
              </section>
            </div>

            {/* DERECHA — foto + aceptar/rechazar */}
            <div className="inscriptos-right">
              <div className="persona-foto">
                {u?.foto_perfil_url
                  ? <img src={u.foto_perfil_url} alt={u.nombre} />
                  : <span className="persona-foto__placeholder"><PersonIcon /></span>
                }

                <button
                  className="btn-decision btn-rechazar"
                  onClick={() => decidir('rechazada')}
                  disabled={procesando}
                  aria-label="Rechazar"
                >
                  <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                    <line x1="6" y1="6" x2="18" y2="18" />
                    <line x1="18" y1="6" x2="6" y2="18" />
                  </svg>
                </button>

                <button
                  className="btn-decision btn-aceptar"
                  onClick={() => decidir('aceptada')}
                  disabled={procesando}
                  aria-label="Aceptar"
                >
                  <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="5 13 10 18 19 6" />
                  </svg>
                </button>
              </div>
            </div>

          </div>
        ) : (
          <div className="inscriptos-vacio">
            <p>No hay inscriptos pendientes para revisar.</p>
            <button className="btn-volver-perfil" onClick={() => navigate('/perfil')}>
              Volver al perfil
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
