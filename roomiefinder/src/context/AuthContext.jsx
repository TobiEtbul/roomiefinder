import { createContext, useContext, useState } from 'react'
import * as authApi from '../api/auth'
import { subirImagen } from '../api/uploads'

const AuthContext = createContext()
const USER_KEY = 'roomie_usuario'
const TOKEN_KEY = 'roomie_token'

export function AuthProvider({ children }) {

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

  async function registrar(datos, fotoFile) {
    const creado = await authApi.registrarUsuario(datos)
    const { token: nuevoToken } = await authApi.login(datos.email, datos.password)

    let usuarioFinal = creado
    if (fotoFile) {
      const { url } = await subirImagen(fotoFile, nuevoToken)
      usuarioFinal = await authApi.actualizarUsuario(
        creado.id,
        { foto_perfil_url: url },
        nuevoToken,
      )
    }

    guardar(usuarioFinal, nuevoToken)
    return usuarioFinal
  }

  async function iniciarSesion(email, password) {
    const { token: nuevoToken, user_id } = await authApi.login(email, password)
    const u = await authApi.obtenerUsuario(user_id)
    guardar(u, nuevoToken)
    return u
  }

  async function actualizarPerfil(cambios) {
    const u = await authApi.actualizarUsuario(usuario.id, cambios, token)
    guardar(u, token)
    return u
  }

  function cerrarSesion() {
    guardar(null, null)
  }

  return (
    <AuthContext.Provider value={{ usuario, token, registrar, iniciarSesion, actualizarPerfil, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
