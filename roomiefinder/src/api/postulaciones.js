// Postulaciones (inscripciones) contra el backend.
import { apiFetch } from './client'

function authHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// El usuario logueado se postula a una publicación.
export function crearPostulacion(publicacionId, token) {
  return apiFetch('/postulaciones/', {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ publicacion_id: publicacionId }),
  })
}

// Lista los estados posibles (pendiente / aceptada / rechazada) con sus ids.
export function listarEstados() {
  return apiFetch('/postulaciones/estados')
}

// Postulaciones del usuario logueado (a las que se inscribió).
export function misPostulaciones(token) {
  return apiFetch('/postulaciones/mias', { headers: authHeaders(token) })
}

// Postulaciones recibidas en una publicación (para el dueño).
export function postulacionesDePublicacion(publicacionId, token) {
  return apiFetch(`/postulaciones/publicacion/${publicacionId}`, {
    headers: authHeaders(token),
  })
}

// Cambia el estado de una postulación (aceptar / rechazar).
export function actualizarEstado(postulacionId, estadoId, token) {
  return apiFetch(`/postulaciones/${postulacionId}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify({ estado_id: estadoId }),
  })
}
