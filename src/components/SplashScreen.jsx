import { useEffect, useState } from 'react'

export default function SplashScreen({ onDone }) {
  const [progress, setProgress] = useState(0)
  const [step, setStep]         = useState(0)

  const steps = [
    'Verificando entorno...',
    'Conectando a PostgreSQL...',
    'Cargando módulos...',
    'Inicializando interfaz...',
    'Listo',
  ]

  useEffect(() => {
    const timeline = [
      { p:18, s:0, t:300  },
      { p:42, s:1, t:700  },
      { p:68, s:2, t:1100 },
      { p:88, s:3, t:1500 },
      { p:100,s:4, t:1900 },
    ]
    timeline.forEach(({ p, s, t }) => setTimeout(() => { setProgress(p); setStep(s) }, t))
    setTimeout(onDone, 2400)
  }, [])

  return (
    <div style={{
      position:'fixed', inset:0, zIndex:9999,
      background:'#050710',
      display:'flex', flexDirection:'column',
      alignItems:'center', justifyContent:'center', gap:44,
    }}>
      {/* Grid */}
      <div style={{
        position:'absolute', inset:0, opacity:.035,
        backgroundImage:`linear-gradient(rgba(34,211,238,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,.6) 1px, transparent 1px)`,
        backgroundSize:'44px 44px',
        mask:'radial-gradient(ellipse 60% 60% at 50% 50%, black, transparent)',
        pointerEvents:'none',
      }} />

      {/* Orbe central */}
      <div style={{ position:'absolute', width:320, height:320, borderRadius:'50%', background:'radial-gradient(circle, rgba(34,211,238,0.05) 0%, transparent 70%)', pointerEvents:'none' }} />

      {/* Logo + texto */}
      <div style={{ position:'relative', zIndex:1, textAlign:'center' }}>
        {/* Logo con anillos */}
        <div style={{ position:'relative', display:'inline-block', marginBottom:28 }}>
          <img src="/img/logo.png" alt="" style={{ width:80, height:80, borderRadius:18, objectFit:'cover', display:'block' }} />
          {[1,2].map(i => (
            <div key={i} style={{
              position:'absolute',
              inset: -(i*10),
              borderRadius: 18 + i*10,
              border: `1px solid rgba(34,211,238,${.25 - i*.1})`,
              animation: `pulse-ring ${1.4 + i*.4}s ease infinite`,
              animationDelay: `${i*.2}s`,
            }} />
          ))}
        </div>

        <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:'2.2rem', color:'#fff', letterSpacing:'-.02em', lineHeight:1 }}>
          AQUA<span style={{ color:'#22d3ee' }}>NOVA</span>
        </div>
        <div style={{ marginTop:6, fontSize:'0.58rem', color:'rgba(255,255,255,.2)', letterSpacing:'.22em', fontFamily:"'DM Mono',monospace" }}>
          SISTEMA DE GESTIÓN · LAVANDERÍA
        </div>
      </div>

      {/* Progress */}
      <div style={{ position:'relative', zIndex:1, width:280 }}>
        {/* Bar */}
        <div style={{ height:1, background:'rgba(255,255,255,.06)', borderRadius:99, overflow:'hidden', marginBottom:14 }}>
          <div style={{
            height:'100%', borderRadius:99,
            background:'linear-gradient(90deg, #22d3ee, #10d9a0)',
            width:`${progress}%`,
            transition:'width .45s cubic-bezier(.4,0,.2,1)',
            boxShadow:'0 0 10px rgba(34,211,238,.5)',
          }} />
        </div>

        {/* Info row */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span style={{ fontSize:'0.6rem', color:'rgba(255,255,255,.25)', fontFamily:"'DM Mono',monospace", letterSpacing:'.05em' }}>
            {steps[step]}
          </span>
          <span style={{ fontSize:'0.62rem', color:'#22d3ee', fontFamily:"'DM Mono',monospace", fontWeight:500 }}>
            {progress}%
          </span>
        </div>
      </div>

      <style>{`
        @keyframes pulse-ring {
          0%,100%{opacity:.2;transform:scale(1)}
          50%{opacity:.5;transform:scale(1.03)}
        }
      `}</style>
    </div>
  )
}
