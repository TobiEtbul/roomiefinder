// Subida de imágenes al backend (que las sube a Cloudinary y devuelve la URL).
import { BASE_URL } from './client'

// Sube un archivo de imagen y devuelve { url }.
// Es multipart/form-data, así que NO seteamos Content-Type (lo pone el browser).
export async function subirImagen(file, token) {
  const form = new FormData()
  form.append('archivo', file)

  const res = await fetch(`${BASE_URL}/uploads/imagen`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
  })

  if (!res.ok) {
    let detalle
    try { detalle = (await res.json())?.detail } catch { /* ignore */ }
    throw new Error(detalle || `No se pudo subir la imagen (${res.status})`)
  }

  return res.json() // { url }
}
