import { useState, useEffect } from 'react'
import { Toaster } from 'sileo'
import Sidebar      from './components/Sidebar'
import TopBar       from './components/TopBar'
import StatsStrip   from './components/StatsStrip'
import SplashScreen from './components/SplashScreen'
import Pedidos      from './components/Pedidos'
import { Clientes, Empleados, Servicios } from './components/Personas'
import { Insumos, Pagos } from './components/Inventario'
import QueryTool    from './components/QueryTool'

export default function App() {
  const [tab, setTab]           = useState('pedidos')
  const [theme, setTheme]       = useState(() => localStorage.getItem('aquanova-theme') || 'dark')
  const [refresh, setRefresh]   = useState(0)
  const [splash, setSplash]     = useState(true)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('aquanova-theme', theme)
  }, [theme])

  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark')
  const onRefresh   = () => setRefresh(r => r + 1)

  const SECTIONS = {
    pedidos:   <Pedidos   onRefresh={onRefresh} />,
    clientes:  <Clientes  onRefresh={onRefresh} />,
    empleados: <Empleados onRefresh={onRefresh} />,
    servicios: <Servicios />,
    insumos:   <Insumos   onRefresh={onRefresh} />,
    pagos:     <Pagos />,
    query:     <QueryTool />,
  }

  return (
    <>
      <Toaster position="bottom-right" options={{ duration: 4000 }} />
      {splash && <SplashScreen onDone={() => setSplash(false)} />}

      <div style={{
        display: 'flex', minHeight: '100vh',
        flexDirection: isMobile ? 'column' : 'row',
        opacity: splash ? 0 : 1,
        transition: 'opacity .5s',
        position: 'relative', zIndex: 1,
      }}>
        <Sidebar active={tab} onChange={setTab} theme={theme} onToggleTheme={toggleTheme} />

        <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0 }}>
          {!isMobile && <TopBar active={tab} />}
          <StatsStrip refresh={refresh} />

          <main style={{ padding: isMobile ? '12px 12px 40px' : '12px 22px 40px', flex:1 }}>
            <div key={tab} style={{ animation:'fadeUp .28s ease' }}>
              {SECTIONS[tab]}
            </div>
          </main>

          {/* Footer */}
          <footer style={{
            borderTop: '1px solid var(--brd)',
            padding: '8px 22px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            fontSize: '0.55rem', color: 'var(--txt-muted)',
            fontFamily: "'DM Mono', monospace", letterSpacing: '.08em',
            flexWrap: 'wrap', gap: 6,
          }}>
            <span>AQUANOVA · PANEL DE GESTIÓN · 2026</span>
            <div style={{ display:'flex', alignItems:'center', gap:6 }}>
              <img src="/img/elefante.png" alt="PostgreSQL" style={{ width:11, height:11, objectFit:'contain', opacity:.25 }} />
              <span>POSTGRESQL · NODE.JS · REACT · VITE</span>
            </div>
          </footer>
        </div>
      </div>
    </>
  )
}
