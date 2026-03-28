import { useState, useEffect } from 'react'
import { apiFetch } from '../hooks/useApi'
import { Wifi, WifiOff } from 'lucide-react'

const LABELS = {
  pedidos:'Pedidos', clientes:'Clientes', empleados:'Empleados',
  servicios:'Servicios', insumos:'Inventario', pagos:'Pagos', query:'Query'
}

export default function TopBar({ active }) {
  const [connected, setConnected] = useState(false)
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    apiFetch('GET', '/clientes').then(r => setConnected(r.ok)).catch(() => setConnected(false))
  }, [])

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <div style={{
      height: 46, background: 'var(--bg-elevated)',
      borderBottom: '1px solid var(--brd)',
      display: 'flex', alignItems: 'center',
      padding: '0 22px', gap: 16,
      position: 'sticky', top: 0, zIndex: 40,
    }}>
      {/* Breadcrumb */}
      <div style={{ display:'flex', alignItems:'center', gap:6, flex:1 }}>
        <span style={{ fontSize:'0.6rem', color:'var(--txt-muted)', fontFamily:"'DM Mono',monospace", letterSpacing:'.06em' }}>AQUANOVA</span>
        <span style={{ color:'var(--brd-med)', fontSize:'0.7rem' }}>/</span>
        <span style={{ fontSize:'0.65rem', color:'var(--agua)', fontFamily:"'DM Mono',monospace", letterSpacing:'.08em', fontWeight:500 }}>
          {LABELS[active]?.toUpperCase()}
        </span>
      </div>

      {/* Clock */}
      <div style={{ fontSize:'0.65rem', color:'var(--txt-muted)', fontFamily:"'DM Mono',monospace", letterSpacing:'.06em' }}>
        {time.toLocaleTimeString('es-MX', { hour:'2-digit', minute:'2-digit', second:'2-digit' })}
      </div>

      {/* Status badge */}
      <div style={{
        display:'flex', alignItems:'center', gap:5,
        padding:'3px 10px', borderRadius:4,
        border:`1px solid ${connected ? 'var(--success-brd)' : 'var(--danger-brd)'}`,
        background: connected ? 'var(--success-dim)' : 'var(--danger-dim)',
        fontSize:'0.58rem', fontFamily:"'DM Mono',monospace",
        color: connected ? 'var(--success)' : 'var(--danger)',
        letterSpacing:'.06em',
      }}>
        {connected
          ? <Wifi size={10} strokeWidth={2} />
          : <WifiOff size={10} strokeWidth={2} />
        }
        {connected ? 'POSTGRESQL · EN LÍNEA' : 'SIN CONEXIÓN'}
      </div>
    </div>
  )
}
