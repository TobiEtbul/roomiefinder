import { apiFetch } from './client'

export function registrarUsuario(datos) {
  return apiFetch('/users/', {
    method: 'POST',
    body: JSON.stringify(datos),
  })
}

export function login(email, password) {
  return apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export function obtenerUsuario(id) {
  return apiFetch(`/users/${id}`)
}

export function actualizarUsuario(id, datos, token) {
  return apiFetch(`/users/${id}`, {
    method: 'PUT',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: JSON.stringify(datos),
  })
}

export function listarUsuarios() {
  return apiFetch('/users/')
}
