import { useEffect, useState, useRef } from 'react'
import { ClipboardList, Users, UserCheck, AlertTriangle } from 'lucide-react'
import { apiFetch } from '../hooks/useApi'

const STATS = [
  { key:'pedidos',   label:'Total Pedidos',  Icon:ClipboardList,  color:'#22d3ee', bg:'rgba(34,211,238,.08)',  brd:'rgba(34,211,238,.18)', ep:'/pedidos'  },
  { key:'clientes',  label:'Clientes',       Icon:Users,          color:'#f59e0b', bg:'rgba(245,158,11,.08)',  brd:'rgba(245,158,11,.18)', ep:'/clientes' },
  { key:'empleados', label:'Empleados',      Icon:UserCheck,      color:'#10d9a0', bg:'rgba(16,217,160,.08)',  brd:'rgba(16,217,160,.18)', ep:'/empleados'},
  { key:'alertas',   label:'Alertas Stock',  Icon:AlertTriangle,  color:'#f43f5e', bg:'rgba(244,63,94,.08)',   brd:'rgba(244,63,94,.18)',  ep:'/insumos'  },
]

function Num({ value }) {
  const [n, setN] = useState(0)
  const p = useRef(0)
  useEffect(() => {
    if (typeof value !== 'number') return
    const s = p.current, e = value, d = 600, t0 = performance.now()
    const tick = now => {
      const prog = Math.min((now - t0) / d, 1)
      const ease = 1 - Math.pow(1 - prog, 3)
      setN(Math.round(s + (e - s) * ease))
      if (prog < 1) requestAnimationFrame(tick)
      else p.current = e
    }
    requestAnimationFrame(tick)
  }, [value])
  return <span style={{ animation:'countUp .3s ease' }}>{typeof value === 'number' ? n : '—'}</span>
}

export default function StatsStrip({ refresh }) {
  const [counts, setCounts] = useState({ pedidos:null, clientes:null, empleados:null, alertas:null })

  useEffect(() => {
    Promise.all([
      apiFetch('GET','/pedidos'), apiFetch('GET','/clientes'),
      apiFetch('GET','/empleados'), apiFetch('GET','/insumos')
    ]).then(([rp,rc,re,ri]) => setCounts({
      pedidos:   rp.datos?.length ?? 0,
      clientes:  rc.datos?.length ?? 0,
      empleados: re.datos?.length ?? 0,
      alertas:   (ri.datos||[]).filter(i=>i.alerta_stock).length,
    }))
  }, [refresh])

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(145px,1fr))',
      gap: 10, padding: '12px 14px',
      position: 'relative', zIndex: 1,
    }}>
      {STATS.map(({ key, label, Icon, color, bg, brd }, i) => (
        <div key={key} style={{
          background: 'var(--bg-surface)',
          border: `1px solid ${brd}`,
          borderRadius: 8, padding: '14px 16px',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex', flexDirection: 'column', gap: 10,
          animation: `fadeUp .35s ease ${i*.07}s both`,
          cursor: 'default', transition: 'transform .15s, box-shadow .15s',
          position: 'relative', overflow: 'hidden',
        }}
          onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow=`0 6px 24px rgba(0,0,0,.3), 0 0 0 1px ${brd}` }}
          onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='var(--shadow-sm)' }}
        >
          {/* Top accent line */}
          <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:`linear-gradient(90deg, ${color}, transparent)`, opacity:.6 }} />

          {/* Header row */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <span style={{ fontSize:'0.56rem', color:'var(--txt-muted)', letterSpacing:'.1em', textTransform:'uppercase', fontFamily:"'DM Mono',monospace" }}>
              {label}
            </span>
            <div style={{ width:22, height:22, borderRadius:4, background:bg, border:`1px solid ${brd}`, display:'grid', placeItems:'center' }}>
              <Icon size={11} color={color} strokeWidth={1.8} />
            </div>
          </div>

          {/* Number */}
          <div style={{
            fontFamily: "'Syne',sans-serif", fontWeight:800,
            fontSize: '1.7rem', lineHeight:1,
            color: key==='alertas' && counts.alertas > 0 ? '#f43f5e' : 'var(--txt-primary)',
          }}>
            <Num value={counts[key]} />
          </div>
        </div>
      ))}
    </div>
  )
}
