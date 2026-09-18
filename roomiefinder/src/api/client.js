export const BASE_URL =
  import.meta.env.VITE_API_URL || 'https://roomie-finder-bay.vercel.app'

export class ApiError extends Error {
  constructor(status, message) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

function formatDetail(detail, fallback) {
  if (!detail) return fallback
  if (typeof detail === 'string') return detail
  if (Array.isArray(detail)) {
    return detail.map(d => d.msg || JSON.stringify(d)).join(', ')
  }
  return JSON.stringify(detail)
}

export async function apiFetch(path, options = {}) {
  let res
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    })
  } catch {

    throw new ApiError(0, 'No se pudo conectar con el servidor. Revisá tu conexión.')
  }

  const text = await res.text()
  const data = text ? JSON.parse(text) : null

  if (!res.ok) {
    throw new ApiError(res.status, formatDetail(data?.detail, `Error ${res.status}`))
  }

  return data
}
