import { BASE_URL } from './client'

const MAX_LADO = 1600
const CALIDAD = 0.85
const SIN_COMPRIMIR_HASTA = 800 * 1024

function comprimirImagen(file) {
  return new Promise((resolve) => {
    if (!file.type?.startsWith('image/') || file.size <= SIN_COMPRIMIR_HASTA) {
      resolve(file)
      return
    }

    const url = URL.createObjectURL(file)
    const img = new Image()

    img.onload = () => {
      URL.revokeObjectURL(url)
      const escala = Math.min(1, MAX_LADO / Math.max(img.width, img.height))
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(img.width * escala)
      canvas.height = Math.round(img.height * escala)

      const ctx = canvas.getContext('2d')
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      canvas.toBlob(
        (blob) => {
          if (!blob || blob.size >= file.size) {
            resolve(file)
            return
          }
          const nombre = file.name.replace(/\.[^.]+$/, '') + '.jpg'
          resolve(new File([blob], nombre, { type: 'image/jpeg' }))
        },
        'image/jpeg',
        CALIDAD,
      )
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      resolve(file)
    }

    img.src = url
  })
}

export async function subirImagen(file, token) {
  const archivo = await comprimirImagen(file)

  const form = new FormData()
  form.append('archivo', archivo)

  let res
  try {
    res = await fetch(`${BASE_URL}/uploads/imagen`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: form,
    })
  } catch {
    throw new Error(
      'No se pudo subir la imagen. Puede que el archivo sea demasiado grande o falle la conexión.',
    )
  }

  if (res.status === 413) {
    throw new Error('La imagen es demasiado grande. Probá con una más liviana.')
  }

  if (!res.ok) {
    let detalle
    try { detalle = (await res.json())?.detail } catch {}
    throw new Error(detalle || `No se pudo subir la imagen (${res.status})`)
  }

  return res.json()
}
