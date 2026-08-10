// Funciones de autenticación y usuarios contra el backend.
import { apiFetch } from './client'

// Crea un usuario. `datos` debe cumplir el schema UserCreate:
// { nombre, apellido, dni, email, password, fecha_nacimiento (YYYY-MM-DD), genero }
export function registrarUsuario(datos) {
  return apiFetch('/users/', {
    method: 'POST',
    body: JSON.stringify(datos),
  })
}

// Valida credenciales. El backend recibe { email, password } en el body
// y devuelve { token, token_type, user_id, expira_en }.
export function login(email, password) {
  return apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

// Trae un usuario completo por su id.
export function obtenerUsuario(id) {
  return apiFetch(`/users/${id}`)
}

// Trae la lista de usuarios.
export function listarUsuarios() {
  return apiFetch('/users/')
}
