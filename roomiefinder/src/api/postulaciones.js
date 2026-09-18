import { apiFetch } from './client'

function authHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export function crearPostulacion(publicacionId, token) {
  return apiFetch('/postulaciones/', {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ publicacion_id: publicacionId }),
  })
}

export function listarEstados() {
  return apiFetch('/postulaciones/estados')
}

export function misPostulaciones(token) {
  return apiFetch('/postulaciones/mias', { headers: authHeaders(token) })
}

export function postulacionesDePublicacion(publicacionId, token) {
  return apiFetch(`/postulaciones/publicacion/${publicacionId}`, {
    headers: authHeaders(token),
  })
}

export function actualizarEstado(postulacionId, estadoId, token) {
  return apiFetch(`/postulaciones/${postulacionId}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify({ estado_id: estadoId }),
  })
}
