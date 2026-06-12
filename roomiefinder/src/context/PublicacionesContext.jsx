import { createContext, useContext, useState } from 'react'

const PublicacionesContext = createContext()

const INITIAL = []

export function PublicacionesProvider({ children }) {
  const [publicaciones, setPublicaciones] = useState(INITIAL)

  function agregarPublicacion(pub) {
    setPublicaciones(prev => [{ ...pub, id: Date.now() }, ...prev])
  }

  function eliminarPublicacion(id) {
    setPublicaciones(prev => prev.filter(p => p.id !== id))
  }

  function actualizarPublicacion(id, cambios) {
    setPublicaciones(prev =>
      prev.map(p => (p.id === id ? { ...p, ...cambios } : p))
    )
  }

  return (
    <PublicacionesContext.Provider value={{ publicaciones, agregarPublicacion, eliminarPublicacion, actualizarPublicacion }}>
      {children}
    </PublicacionesContext.Provider>
  )
}

export function usePublicaciones() {
  return useContext(PublicacionesContext)
}
