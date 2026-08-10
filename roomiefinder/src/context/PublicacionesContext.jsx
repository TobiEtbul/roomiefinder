import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import * as pubApi from '../api/publicaciones'
import { useAuth } from './AuthContext'

const PublicacionesContext = createContext()

// Traduce una publicación del backend a la forma que usan las pantallas.
function normalizar(p) {
  return {
    id: p.id,
    propietario_id: p.propietario_id,
    title: p.titulo || '',
    location: p.direccion || '',
    precio: p.precio != null ? String(p.precio) : '',
    genero: p.preferencia_genero || '',
    descripcion: p.descripcion || '',
    estado: p.estado,
    created_at: p.created_at,
    image: p.fotos?.[0]?.url || null,
    images: (p.fotos || []).map(f => f.url),
  }
}

// Traduce la forma del front al schema que espera el backend.
function aBackend(data) {
  const payload = {}
  if (data.title !== undefined) payload.titulo = data.title.trim()
  if (data.descripcion !== undefined) payload.descripcion = data.descripcion.trim() || 'Sin descripción'
  if (data.location !== undefined) payload.direccion = data.location.trim() || 'Sin dirección'
  if (data.precio !== undefined) payload.precio = Number(data.precio) || 0
  if (data.genero !== undefined) payload.preferencia_genero = data.genero || 'indiferente'
  return payload
}

export function PublicacionesProvider({ children }) {
  const { token } = useAuth()
  const [publicaciones, setPublicaciones] = useState([])
  const [cargando, setCargando] = useState(true)

  // Trae las publicaciones del backend.
  const recargar = useCallback(async () => {
    setCargando(true)
    try {
      const data = await pubApi.listarPublicaciones()
      setPublicaciones((data || []).map(normalizar))
    } catch {
      // Si falla la carga dejamos la lista como está.
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => {
    recargar()
  }, [recargar])

  async function agregarPublicacion(data) {
    const creada = await pubApi.crearPublicacion(aBackend(data), token)
    setPublicaciones(prev => [normalizar(creada), ...prev])
    return normalizar(creada)
  }

  async function eliminarPublicacion(id) {
    await pubApi.eliminarPublicacion(id, token)
    setPublicaciones(prev => prev.filter(p => p.id !== id))
  }

  async function actualizarPublicacion(id, cambios) {
    const actualizada = await pubApi.actualizarPublicacion(id, aBackend(cambios), token)
    setPublicaciones(prev => prev.map(p => (p.id === id ? normalizar(actualizada) : p)))
    return normalizar(actualizada)
  }

  return (
    <PublicacionesContext.Provider
      value={{ publicaciones, cargando, recargar, agregarPublicacion, eliminarPublicacion, actualizarPublicacion }}
    >
      {children}
    </PublicacionesContext.Provider>
  )
}

export function usePublicaciones() {
  return useContext(PublicacionesContext)
}
