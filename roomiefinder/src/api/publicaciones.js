import { apiFetch } from './client'

function authHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export function listarPublicaciones() {
  return apiFetch('/publicaciones/')
}

export function obtenerPublicacion(id) {
  return apiFetch(`/publicaciones/${id}`)
}

export function crearPublicacion(datos, token) {
  return apiFetch('/publicaciones/', {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(datos),
  })
}

export function actualizarPublicacion(id, datos, token) {
  return apiFetch(`/publicaciones/${id}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(datos),
  })
}

export function eliminarPublicacion(id, token) {
  return apiFetch(`/publicaciones/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  })
}

export function agregarFoto(publicacionId, url, orden, token) {
  return apiFetch(`/publicaciones/${publicacionId}/fotos`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ url, orden }),
  })
}
