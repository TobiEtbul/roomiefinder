// Funciones de publicaciones contra el backend.
import { apiFetch } from './client'

// Crear, editar y borrar requieren el token del usuario (header Authorization).
function authHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// Lista todas las publicaciones (público, no requiere token).
export function listarPublicaciones() {
  return apiFetch('/publicaciones/')
}

// Trae una publicación por id (público).
export function obtenerPublicacion(id) {
  return apiFetch(`/publicaciones/${id}`)
}

// Crea una publicación. El propietario se deduce del token.
export function crearPublicacion(datos, token) {
  return apiFetch('/publicaciones/', {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(datos),
  })
}

// Actualiza una publicación existente.
export function actualizarPublicacion(id, datos, token) {
  return apiFetch(`/publicaciones/${id}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(datos),
  })
}

// Da de baja una publicación.
export function eliminarPublicacion(id, token) {
  return apiFetch(`/publicaciones/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  })
}
