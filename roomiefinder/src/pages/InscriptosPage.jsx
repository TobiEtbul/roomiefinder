import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AppNavbar from '../components/AppNavbar'
import { usePublicaciones } from '../context/PublicacionesContext'
import '../styles/inscriptos.css'

function PersonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="140" height="140">
      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
    </svg>
  )
}

// Datos hardcodeados. TODO: reemplazar por GET /postulaciones/publicacion/{id}
// + GET /users/{id} cuando conectemos las inscripciones.
const INSCRIPTOS_MOCK = [
  {
    id: 'a1',
    nombre: 'Juan Pérez',
    edad: 24,
    genero: 'Masculino',
    descripcion: 'Estudiante de ingeniería, tranquilo y ordenado. Me gusta cocinar y mantener los espacios comunes prolijos. Busco un lugar cerca de la facultad.',
    preferencias: ['Ordenado', 'Tranquilo', 'Sociable'],
    foto: null,
  },
  {
    id: 'a2',
    nombre: 'Mora González',
    edad: 22,
    genero: 'Femenino',
    descripcion: 'Diseñadora gráfica, sociable y divertida. Me encanta juntar gente los fines de semana y cocinar para todos. Súper respetuosa con los horarios.',
    preferencias: ['Sociable', 'Divertido', 'Fiestero'],
    foto: null,
  },
  {
    id: 'a3',
    nombre: 'Lucas Ramírez',
    edad: 27,
    genero: 'Masculino',
    descripcion: 'Trabajo en IT desde casa, así que valoro los ambientes tranquilos y ordenados durante el día. Tranquilo, limpio y de bajo perfil.',
    preferencias: ['Ordenado', 'Tranquilo'],
    foto: null,
  },
]

export default function InscriptosPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { publicaciones } = usePublicaciones()

  const publicacion = publicaciones.find(p => String(p.id) === id)
  const [indice, setIndice] = useState(0)

  const inscripto = INSCRIPTOS_MOCK[indice]

  // TODO: al conectar inscripciones, aceptar/rechazar llamarán a
  // PUT /postulaciones/{id} con el estado correspondiente.
  function aceptar() {
    setIndice(i => i + 1)
  }

  function rechazar() {
    setIndice(i => i + 1)
  }

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

        {inscripto ? (
          <div className="inscriptos-body">

            {/* IZQUIERDA — perfil del inscripto */}
            <div className="inscriptos-left">
              <section className="card persona-card">
                <h2 className="persona-nombre">{inscripto.nombre}</h2>

                <div className="persona-datos">
                  <div className="persona-pill">{inscripto.edad} años</div>
                  <div className="persona-pill">{inscripto.genero}</div>
                </div>

                <div className="persona-descripcion">
                  {inscripto.descripcion}
                </div>
              </section>

              <section className="card preferencias-card">
                <h3 className="preferencias-titulo">Preferencias de roomies</h3>
                <div className="preferencias-tags">
                  {inscripto.preferencias.map((pref, i) => (
                    <span key={i} className="pref-tag">{pref}</span>
                  ))}
                </div>
              </section>
            </div>

            {/* DERECHA — foto + aceptar/rechazar */}
            <div className="inscriptos-right">
              <div className="persona-foto">
                {inscripto.foto
                  ? <img src={inscripto.foto} alt={inscripto.nombre} />
                  : <span className="persona-foto__placeholder"><PersonIcon /></span>
                }

                <button className="btn-decision btn-rechazar" onClick={rechazar} aria-label="Rechazar">
                  <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                    <line x1="6" y1="6" x2="18" y2="18" />
                    <line x1="18" y1="6" x2="6" y2="18" />
                  </svg>
                </button>

                <button className="btn-decision btn-aceptar" onClick={aceptar} aria-label="Aceptar">
                  <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="5 13 10 18 19 6" />
                  </svg>
                </button>
              </div>
            </div>

          </div>
        ) : (
          <div className="inscriptos-vacio">
            <p>No hay más inscriptos para revisar.</p>
            <button className="btn-volver-perfil" onClick={() => navigate('/perfil')}>
              Volver al perfil
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
