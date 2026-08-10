import { createContext, useContext, useState } from 'react'
import * as authApi from '../api/auth'

const AuthContext = createContext()
const USER_KEY = 'roomie_usuario'
const TOKEN_KEY = 'roomie_token'

export function AuthProvider({ children }) {
  // Usuario logueado, persistido en localStorage para sobrevivir recargas.
  const [usuario, setUsuario] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY)) || null
    } catch {
      return null
    }
  })
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || null)

  function guardar(u, t) {
    setUsuario(u)
    setToken(t ?? null)
    if (u) localStorage.setItem(USER_KEY, JSON.stringify(u))
    else localStorage.removeItem(USER_KEY)
    if (t) localStorage.setItem(TOKEN_KEY, t)
    else localStorage.removeItem(TOKEN_KEY)
  }

  // Registra el usuario en el backend y lo deja logueado.
  async function registrar(datos) {
    const u = await authApi.registrarUsuario(datos)
    guardar(u, null)
    return u
  }

  // Valida credenciales, usa el user_id que devuelve el login para traer
  // el usuario completo, y guarda usuario + token.
  async function iniciarSesion(email, password) {
    const { token: nuevoToken, user_id } = await authApi.login(email, password)
    const u = await authApi.obtenerUsuario(user_id)
    guardar(u, nuevoToken)
    return u
  }

  function cerrarSesion() {
    guardar(null, null)
  }

  return (
    <AuthContext.Provider value={{ usuario, token, registrar, iniciarSesion, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
