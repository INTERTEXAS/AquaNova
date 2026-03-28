import {
  ClipboardList, Users, UserCheck, Sparkles,
  Package, CreditCard, Search,
  ChevronLeft, ChevronRight, Moon, Sun, Menu, X
} from 'lucide-react'
import { useState, useEffect } from 'react'

const TABS = [
  { id:'pedidos',   label:'Pedidos',    Icon:ClipboardList, accent:'#22d3ee' },
  { id:'clientes',  label:'Clientes',   Icon:Users,         accent:'#f59e0b' },
  { id:'empleados', label:'Empleados',  Icon:UserCheck,     accent:'#10d9a0' },
  { id:'servicios', label:'Servicios',  Icon:Sparkles,      accent:'#a78bfa' },
  { id:'insumos',   label:'Inventario', Icon:Package,       accent:'#fb923c' },
  { id:'pagos',     label:'Pagos',      Icon:CreditCard,    accent:'#f472b6' },
  { id:'query',     label:'Query',      Icon:Search,        accent:'#34d399' },
]

const GROUPS = [
  { label:'Operaciones', ids:['pedidos','clientes','empleados'] },
  { label:'Catálogo',    ids:['servicios','insumos'] },
  { label:'Finanzas',    ids:['pagos','query'] },
]

export default function Sidebar({ active, onChange, theme, onToggleTheme }) {
  const [collapsed, setCollapsed] = useState(false)
  const [isMobile,  setIsMobile]  = useState(window.innerWidth < 768)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])

  const go = id => { onChange(id); setMobileOpen(false) }

  const NavItem = ({ id, label, Icon, accent }) => {
    const on = active === id
    return (
      <button onClick={() => go(id)} title={collapsed ? label : ''}
        style={{
          width:'100%', padding: collapsed ? '8px 0' : '7px 10px',
          borderRadius:5, border:'none', cursor:'pointer',
          display:'flex', alignItems:'center', gap:8,
          justifyContent: collapsed ? 'center' : 'flex-start',
          background: on ? `${accent}14` : 'transparent',
          color: on ? accent : 'rgba(255,255,255,.3)',
          transition:'all .15s', position:'relative',
          marginBottom:1,
        }}
        onMouseEnter={e => { if (!on) { e.currentTarget.style.background='rgba(255,255,255,.04)'; e.currentTarget.style.color='rgba(255,255,255,.6)' }}}
        onMouseLeave={e => { if (!on) { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='rgba(255,255,255,.3)' }}}
      >
        {/* Indicator */}
        {on && <div style={{ position:'absolute', left:0, top:'20%', bottom:'20%', width:2, borderRadius:'0 2px 2px 0', background:accent, boxShadow:`0 0 8px ${accent}80` }} />}

        {/* Icon box */}
        <div style={{
          width:26, height:26, borderRadius:5, display:'grid', placeItems:'center', flexShrink:0,
          background: on ? `${accent}18` : 'transparent',
          border: on ? `1px solid ${accent}28` : '1px solid transparent',
          transition:'all .15s',
        }}>
          <Icon size={13} strokeWidth={on ? 2.2 : 1.6} />
        </div>

        {!collapsed && (
          <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.78rem', fontWeight: on ? 500 : 400, letterSpacing:'.01em' }}>
            {label}
          </span>
        )}
      </button>
    )
  }

  const BottomBtn = ({ icon: Icon, label, onClick }) => (
    <button onClick={onClick}
      style={{ width:'100%', padding: collapsed ? '8px 0' : '7px 10px', borderRadius:5, border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:8, justifyContent: collapsed ? 'center' : 'flex-start', background:'transparent', color:'rgba(255,255,255,.2)', transition:'all .15s', marginBottom:1 }}
      onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,.04)'; e.currentTarget.style.color='rgba(255,255,255,.5)' }}
      onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='rgba(255,255,255,.2)' }}
    >
      <div style={{ width:26, height:26, borderRadius:5, display:'grid', placeItems:'center', flexShrink:0 }}>
        <Icon size={13} strokeWidth={1.6} />
      </div>
      {!collapsed && <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.78rem' }}>{label}</span>}
    </button>
  )

  const SidebarBody = ({ mobile = false }) => (
    <div style={{ display:'flex', flexDirection:'column', height:'100%' }}>
      {/* Logo */}
      {!mobile && (
        <div style={{ padding: collapsed ? '16px 0' : '14px 14px', borderBottom:'1px solid rgba(255,255,255,.05)', display:'flex', alignItems:'center', gap:10, justifyContent: collapsed ? 'center' : 'flex-start', minHeight:58 }}>
          <div style={{ position:'relative', flexShrink:0 }}>
            <img src="/img/logo.png" alt="Aquanova" style={{ width:32, height:32, borderRadius:7, objectFit:'cover', display:'block' }} />
            <div style={{ position:'absolute', inset:-1, borderRadius:8, border:'1px solid rgba(34,211,238,.2)', pointerEvents:'none' }} />
          </div>
          {!collapsed && (
            <div>
              <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:'0.95rem', color:'#fff', letterSpacing:'-.01em', lineHeight:1.1 }}>
                AQUA<span style={{ color:'#22d3ee' }}>NOVA</span>
              </div>
              <div style={{ fontSize:'0.46rem', color:'rgba(255,255,255,.2)', letterSpacing:'.18em', marginTop:2 }}>
                GESTIÓN LAVANDERÍA
              </div>
            </div>
          )}
        </div>
      )}

      {/* Nav groups */}
      <nav style={{ flex:1, padding:'10px 8px', overflowY:'auto' }}>
        {GROUPS.map(grp => {
          const items = TABS.filter(t => grp.ids.includes(t.id))
          return (
            <div key={grp.label} style={{ marginBottom:10 }}>
              {!collapsed && !mobile && (
                <div style={{ padding:'0 10px 4px', fontSize:'0.52rem', color:'rgba(255,255,255,.15)', letterSpacing:'.15em', fontFamily:"'DM Mono',monospace", fontWeight:400, textTransform:'uppercase' }}>
                  {grp.label}
                </div>
              )}
              {items.map(t => <NavItem key={t.id} {...t} />)}
            </div>
          )
        })}
      </nav>

      {/* Bottom */}
      <div style={{ padding:'6px 8px 10px', borderTop:'1px solid rgba(255,255,255,.04)' }}>
        <BottomBtn icon={theme === 'dark' ? Sun : Moon} label={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'} onClick={onToggleTheme} />
        {!mobile && (
          <BottomBtn icon={collapsed ? ChevronRight : ChevronLeft} label="Colapsar" onClick={() => setCollapsed(c => !c)} />
        )}
      </div>
    </div>
  )

  /* MOBILE */
  if (isMobile) return (
    <>
      <div style={{ position:'fixed', top:0, left:0, right:0, zIndex:100, background:'var(--sidebar-bg)', borderBottom:'1px solid rgba(255,255,255,.05)', height:50, display:'flex', alignItems:'center', padding:'0 14px', gap:10 }}>
        <button onClick={() => setMobileOpen(o => !o)} style={{ width:32, height:32, borderRadius:5, border:'1px solid rgba(34,211,238,.15)', background:'rgba(34,211,238,.06)', color:'#22d3ee', display:'grid', placeItems:'center', cursor:'pointer', flexShrink:0 }}>
          {mobileOpen ? <X size={14} /> : <Menu size={14} />}
        </button>
        <img src="/img/logo.png" alt="" style={{ width:26, height:26, borderRadius:6, objectFit:'cover', flexShrink:0 }} />
        <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:'0.88rem', color:'#fff' }}>AQUA<span style={{ color:'#22d3ee' }}>NOVA</span></div>
        <div style={{ marginLeft:'auto' }}>
          <button onClick={onToggleTheme} style={{ width:30, height:30, borderRadius:5, border:'1px solid rgba(34,211,238,.15)', background:'rgba(34,211,238,.06)', color:'#22d3ee', display:'grid', placeItems:'center', cursor:'pointer' }}>
            {theme === 'dark' ? <Sun size={12} /> : <Moon size={12} />}
          </button>
        </div>
      </div>
      {mobileOpen && <div onClick={() => setMobileOpen(false)} style={{ position:'fixed', inset:0, zIndex:98, background:'rgba(0,0,0,.7)', backdropFilter:'blur(4px)' }} />}
      <div style={{ position:'fixed', top:50, left:0, bottom:0, width:210, zIndex:99, background:'var(--sidebar-bg)', borderRight:'1px solid rgba(255,255,255,.04)', transform:mobileOpen?'translateX(0)':'translateX(-100%)', transition:'transform .22s cubic-bezier(.4,0,.2,1)' }}>
        <SidebarBody mobile />
      </div>
      <div style={{ height:50, flexShrink:0 }} />
    </>
  )

  /* DESKTOP */
  return (
    <aside style={{ width: collapsed ? 54 : 218, minHeight:'100vh', flexShrink:0, background:'var(--sidebar-bg)', borderRight:'1px solid rgba(255,255,255,.04)', position:'sticky', top:0, height:'100vh', transition:'width .22s cubic-bezier(.4,0,.2,1)', overflow:'hidden', zIndex:50 }}>
      <SidebarBody />
    </aside>
  )
}
