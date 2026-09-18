import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import * as pubApi from '../api/publicaciones'
import { subirImagen } from '../api/uploads'
import { useAuth } from './AuthContext'

const PublicacionesContext = createContext()

function normalizar(p) {

  const urls = (p.fotos || [])
    .map(f => f.url)
    .filter(u => /^https?:\/\//i.test(u))

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
    image: urls[0] || null,
    images: urls,
  }
}

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

  const recargar = useCallback(async () => {
    setCargando(true)
    try {
      const data = await pubApi.listarPublicaciones()
      setPublicaciones((data || []).map(normalizar))
    } catch {

    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => {
    recargar()
  }, [recargar])

  async function subirYAdjuntar(pubId, archivos = [], ordenInicial = 0) {
    for (let i = 0; i < archivos.length; i++) {
      try {
        const { url } = await subirImagen(archivos[i], token)
        await pubApi.agregarFoto(pubId, url, ordenInicial + i, token)
      } catch {

      }
    }
  }

  async function agregarPublicacion(data) {
    const archivos = data.archivos || []
    const creada = await pubApi.crearPublicacion(aBackend(data), token)
    await subirYAdjuntar(creada.id, archivos, 0)

    const completa = archivos.length ? await pubApi.obtenerPublicacion(creada.id) : creada
    setPublicaciones(prev => [normalizar(completa), ...prev])
    return normalizar(completa)
  }

  async function eliminarPublicacion(id) {
    await pubApi.eliminarPublicacion(id, token)
    setPublicaciones(prev => prev.filter(p => p.id !== id))
  }

  async function actualizarPublicacion(id, cambios) {
    const archivos = cambios.archivos || []
    const fotosPrevias = cambios.fotosPrevias || 0
    const actualizada = await pubApi.actualizarPublicacion(id, aBackend(cambios), token)
    await subirYAdjuntar(id, archivos, fotosPrevias)
    const completa = archivos.length ? await pubApi.obtenerPublicacion(id) : actualizada
    setPublicaciones(prev => prev.map(p => (p.id === id ? normalizar(completa) : p)))
    return normalizar(completa)
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
