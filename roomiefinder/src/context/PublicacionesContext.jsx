import { createContext, useContext, useState } from 'react'

const PublicacionesContext = createContext()

const INITIAL = []

export function PublicacionesProvider({ children }) {
  const [publicaciones, setPublicaciones] = useState(INITIAL)

  function agregarPublicacion(pub) {
    setPublicaciones(prev => [{ ...pub, id: Date.now() }, ...prev])
  }

  return (
    <PublicacionesContext.Provider value={{ publicaciones, agregarPublicacion }}>
      {children}
    </PublicacionesContext.Provider>
  )
}

export function usePublicaciones() {
  return useContext(PublicacionesContext)
}
