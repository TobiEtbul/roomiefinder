import { apiFetch } from './client'

function authHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export function enviarMensaje(receptorId, contenido, token) {
  return apiFetch('/mensajes/', {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ receptor_id: receptorId, contenido }),
  })
}

export function listarConversaciones(token) {
  return apiFetch('/mensajes/conversaciones', { headers: authHeaders(token) })
}

export function obtenerConversacion(otroUsuarioId, token) {
  return apiFetch(`/mensajes/conversacion/${otroUsuarioId}`, { headers: authHeaders(token) })
}

export function marcarLeido(otroUsuarioId, token) {
  return apiFetch(`/mensajes/conversacion/${otroUsuarioId}/leido`, {
    method: 'PUT',
    headers: authHeaders(token),
  })
}
