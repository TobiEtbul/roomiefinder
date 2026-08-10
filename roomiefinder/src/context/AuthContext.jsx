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

  // Registra el usuario y lo deja logueado.
  // `extras` (descripcion, preferencias) no los acepta el registro, así que
  // los guardamos con un PUT usando el token que devuelve el login.
  async function registrar(datos, extras = {}) {
    const creado = await authApi.registrarUsuario(datos)
    const { token: nuevoToken, user_id } = await authApi.login(datos.email, datos.password)

    let usuarioFinal = creado
    const cambios = {}
    if (extras.descripcion) cambios.descripcion = extras.descripcion
    if (extras.preferencias) cambios.preferencias = extras.preferencias
    if (Object.keys(cambios).length > 0) {
      usuarioFinal = await authApi.actualizarUsuario(user_id, cambios, nuevoToken)
    }

    guardar(usuarioFinal, nuevoToken)
    return usuarioFinal
  }

  // Valida credenciales, usa el user_id que devuelve el login para traer
  // el usuario completo, y guarda usuario + token.
  async function iniciarSesion(email, password) {
    const { token: nuevoToken, user_id } = await authApi.login(email, password)
    const u = await authApi.obtenerUsuario(user_id)
    guardar(u, nuevoToken)
    return u
  }

  // Actualiza el perfil en el backend y refresca el usuario guardado.
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
