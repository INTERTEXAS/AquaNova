import { useState, useCallback } from 'react'

const BASE = '/api'

export async function apiFetch(method, path, body = null) {
  const opts = { method, headers: { 'Content-Type': 'application/json' } }
  if (body) opts.body = JSON.stringify(body)
  const r = await fetch(BASE + path, opts)
  return r.json()
}

export function useApi() {
  const [loading, setLoading] = useState(false)
  const call = useCallback(async (method, path, body = null) => {
    setLoading(true)
    try {
      return await apiFetch(method, path, body)
    } catch (e) {
      return { ok: false, mensaje: 'Error de conexión', error: e.message }
    } finally {
      setLoading(false)
    }
  }, [])
  return { call, loading }
}
