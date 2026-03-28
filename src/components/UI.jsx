export function Card({ children, style, accent }) {
  const c = accent || 'var(--agua)'
  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--brd)',
      borderRadius: 10,
      padding: '20px 22px',
      marginBottom: 18,
      boxShadow: 'var(--shadow-sm)',
      position: 'relative',
      overflow: 'hidden',
      animation: 'fadeUp .3s ease both',
      transition: 'border-color .2s, box-shadow .2s',
      ...style,
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--brd-med)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--brd)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)' }}
    >
      {/* Accent line top */}
      <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:`linear-gradient(90deg, ${c}, transparent 60%)`, opacity:.7 }} />
      {children}
    </div>
  )
}

export function CardTitle({ icon, children, accent = 'var(--agua)' }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      marginBottom: 18, paddingBottom: 14,
      borderBottom: '1px solid var(--brd)',
    }}>
      {icon && (
        <div style={{
          width: 26, height: 26, borderRadius: 5, flexShrink: 0,
          background: `color-mix(in srgb, ${accent} 15%, transparent)`,
          border: `1px solid color-mix(in srgb, ${accent} 30%, transparent)`,
          display: 'grid', placeItems: 'center',
        }}>
          {typeof icon === 'string'
            ? <img src={icon} alt="" style={{ width:14, height:14, objectFit:'contain' }} />
            : icon}
        </div>
      )}
      <span style={{
        fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: '0.72rem',
        color: 'var(--txt-secondary)', letterSpacing: '.12em',
        textTransform: 'uppercase',
      }}>
        {children}
      </span>
    </div>
  )
}

export function PageTitle({ children, subtitle }) {
  return (
    <div style={{ marginBottom: 22, animation: 'slideIn .3s ease' }}>
      <div style={{ display:'flex', alignItems:'baseline', gap:14 }}>
        <h1 style={{
          fontFamily: "'Syne', sans-serif", fontWeight: 800,
          fontSize: '1.55rem', color: 'var(--txt-primary)',
          letterSpacing: '-.03em', lineHeight: 1.1,
        }}>
          {children}
        </h1>
        {subtitle && (
          <span style={{
            fontSize: '0.62rem', color: 'var(--txt-muted)',
            letterSpacing: '.1em', textTransform: 'uppercase',
            fontFamily: "'DM Mono', monospace",
          }}>
            / {subtitle}
          </span>
        )}
      </div>
      {/* Underline */}
      <div style={{ height: 1, marginTop: 10, background: 'linear-gradient(90deg, var(--brd-med), transparent)' }} />
    </div>
  )
}

export function Badge({ type = 'cyan', children }) {
  const map = {
    cyan:   { bg:'var(--agua-dim)',    color:'var(--agua)',    brd:'var(--agua-brd)'    },
    ok:     { bg:'var(--success-dim)', color:'var(--success)', brd:'var(--success-brd)' },
    warn:   { bg:'var(--warn-dim)',    color:'var(--warn)',    brd:'var(--ambar-brd)'   },
    err:    { bg:'var(--danger-dim)',  color:'var(--danger)',  brd:'var(--danger-brd)'  },
    yellow: { bg:'var(--ambar-dim)',   color:'var(--ambar)',   brd:'var(--ambar-brd)'   },
  }
  const s = map[type] || map.cyan
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '2px 8px', borderRadius: 3,
      fontSize: '0.6rem', fontWeight: 500,
      fontFamily: "'DM Mono', monospace",
      letterSpacing: '.06em', textTransform: 'uppercase',
      whiteSpace: 'nowrap',
      background: s.bg, color: s.color, border: `1px solid ${s.brd}`,
    }}>
      {children}
    </span>
  )
}

export function Btn({ variant = 'primary', onClick, children, style, disabled }) {
  const variants = {
    primary: { bg:'var(--agua-dim)', color:'var(--agua)', brd:'var(--agua-brd)', hover:'var(--agua-glow)' },
    success: { bg:'var(--success-dim)', color:'var(--success)', brd:'var(--success-brd)', hover:'rgba(16,217,160,.12)' },
    ghost:   { bg:'transparent', color:'var(--txt-secondary)', brd:'var(--brd)', hover:'var(--bg-hover)' },
    yellow:  { bg:'var(--ambar-dim)', color:'var(--ambar)', brd:'var(--ambar-brd)', hover:'rgba(245,158,11,.12)' },
  }
  const v = variants[variant] || variants.primary
  return (
    <button disabled={disabled} onClick={onClick}
      style={{
        padding: '8px 18px', borderRadius: 6,
        border: `1px solid ${v.brd}`,
        background: v.bg, color: v.color,
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '0.75rem', fontWeight: 500,
        display: 'inline-flex', alignItems: 'center', gap: 6,
        transition: 'all .15s', opacity: disabled ? .4 : 1,
        letterSpacing: '.03em',
        ...style,
      }}
      onMouseEnter={e => { if (!disabled) { e.currentTarget.style.background = v.hover; e.currentTarget.style.transform = 'translateY(-1px)' }}}
      onMouseLeave={e => { e.currentTarget.style.background = v.bg; e.currentTarget.style.transform = 'translateY(0)' }}
    >
      {children}
    </button>
  )
}

export function BtnRow({ children }) {
  return <div style={{ display:'flex', gap:8, flexWrap:'wrap', alignItems:'center' }}>{children}</div>
}

export function FormGrid({ children }) {
  return <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(190px,1fr))', gap:14, marginBottom:18 }}>{children}</div>
}

export function Field({ label, children }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
      <label style={{
        fontSize: '0.6rem', fontWeight: 400,
        color: 'var(--txt-muted)', letterSpacing: '.1em',
        textTransform: 'uppercase', fontFamily: "'DM Mono', monospace",
      }}>
        {label}
      </label>
      {children}
    </div>
  )
}

const inputBase = {
  width: '100%', height: 36, padding: '0 12px',
  background: 'var(--bg-elevated)',
  border: '1px solid var(--brd)',
  borderRadius: 5, color: 'var(--txt-primary)',
  fontFamily: "'DM Sans', sans-serif", fontSize: '0.82rem',
  outline: 'none',
  transition: 'border-color .15s, box-shadow .15s',
}

export function Input({ style: xs, ...props }) {
  return (
    <input {...props} style={{ ...inputBase, ...xs }}
      onFocus={e => { e.target.style.borderColor = 'var(--agua)'; e.target.style.boxShadow = '0 0 0 2px var(--agua-dim)' }}
      onBlur={e => { e.target.style.borderColor = 'var(--brd)'; e.target.style.boxShadow = 'none' }}
    />
  )
}

export function Select({ children, style: xs, ...props }) {
  return (
    <select {...props} style={{ ...inputBase, cursor:'pointer', appearance:'none', ...xs }}
      onFocus={e => { e.target.style.borderColor = 'var(--agua)'; e.target.style.boxShadow = '0 0 0 2px var(--agua-dim)' }}
      onBlur={e => { e.target.style.borderColor = 'var(--brd)'; e.target.style.boxShadow = 'none' }}
    >
      {children}
    </select>
  )
}

export function Table({ columns, rows, emptyMsg = 'Sin registros' }) {
  return (
    <div style={{ overflowX:'auto', borderRadius:8, border:'1px solid var(--brd)' }}>
      <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'0.78rem' }}>
        <thead>
          <tr style={{ background:'var(--bg-elevated)', borderBottom:'1px solid var(--brd-med)' }}>
            {columns.map((c,i) => (
              <th key={i} style={{
                padding: '9px 14px', textAlign:'left',
                color: 'var(--txt-muted)', fontSize:'0.58rem',
                letterSpacing:'.12em', textTransform:'uppercase',
                whiteSpace:'nowrap', fontFamily:"'DM Mono',monospace", fontWeight:400,
              }}>
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0
            ? (
              <tr>
                <td colSpan={columns.length} style={{ textAlign:'center', padding:36, color:'var(--txt-muted)', fontFamily:"'DM Mono',monospace", fontSize:'0.72rem', letterSpacing:'.06em' }}>
                  {emptyMsg}
                </td>
              </tr>
            )
            : rows.map((row, i) => (
              <tr key={i} style={{ borderBottom: i < rows.length-1 ? '1px solid var(--brd)' : 'none', transition:'background .1s', cursor:'default' }}
                onMouseEnter={e => e.currentTarget.querySelectorAll('td').forEach(td => td.style.background = 'var(--bg-hover)')}
                onMouseLeave={e => e.currentTarget.querySelectorAll('td').forEach(td => td.style.background = '')}
              >
                {row.map((cell, j) => (
                  <td key={j} style={{ padding:'10px 14px', color:'var(--txt-primary)', verticalAlign:'middle' }}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  )
}
