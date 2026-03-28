import { useState, useEffect } from 'react'
import { sileo } from 'sileo'
import { Package, CreditCard, Plus, Save, AlertTriangle, CheckCircle } from 'lucide-react'
import { useApi, apiFetch } from '../hooks/useApi'
import { Card, CardTitle, PageTitle, Badge, Btn, BtnRow, FormGrid, Field, Input, Select, Table } from './UI'

export function Insumos({ onRefresh }) {
  const { call, loading } = useApi()
  const [data, setData] = useState([])
  const [form, setForm] = useState({ nombre:'',tipo_insumo:'',cantidad_stock:'',unidad_medida:'kg',stock_minimo:'',fecha_compra:'',precio_compra:'' })
  const load = async () => { const r = await apiFetch('GET','/insumos'); setData(r.datos||[]) }
  useEffect(() => { load() }, [])
  const set = (k,v) => setForm(f=>({...f,[k]:v}))
  const guardar = async () => {
    if (!form.nombre||!form.cantidad_stock) { sileo.error({ title:'Nombre y cantidad son obligatorios' }); return }
    const r = await call('POST','/insumos',form)
    if (r.ok) { sileo.success({ title:r.mensaje, description:`"${form.nombre}" registrado` }); setForm({nombre:'',tipo_insumo:'',cantidad_stock:'',unidad_medida:'kg',stock_minimo:'',fecha_compra:'',precio_compra:''}); load(); onRefresh() }
    else sileo.error({ title:r.mensaje, description:r.error })
  }
  const rows = data.map(i=>[
    <Badge type="cyan">#{i.id_insumo}</Badge>,
    <strong>{i.nombre}</strong>,
    i.tipo_insumo||'—',
    <span style={{fontFamily:"'DM Mono',monospace",fontSize:'0.78rem'}}>{i.cantidad_stock}</span>,
    i.unidad_medida, i.stock_minimo,
    i.alerta_stock
      ? <span style={{display:'inline-flex',alignItems:'center',gap:4,color:'var(--danger)',fontSize:'0.72rem'}}><AlertTriangle size={11} strokeWidth={2} />Bajo</span>
      : <span style={{display:'inline-flex',alignItems:'center',gap:4,color:'var(--success)',fontSize:'0.72rem'}}><CheckCircle size={11} strokeWidth={2} />OK</span>,
    `$${parseFloat(i.precio_compra||0).toFixed(2)}`,
  ])
  return (
    <div>
      <PageTitle subtitle="control de stock">Inventario</PageTitle>
      <Card accent="#fb923c">
        <CardTitle icon={<Plus size={13} color="#fb923c" strokeWidth={2.5} />} accent="#fb923c">Nuevo insumo</CardTitle>
        <FormGrid>
          <Field label="Nombre"><Input placeholder="Detergente Ariel" value={form.nombre} onChange={e=>set('nombre',e.target.value)} /></Field>
          <Field label="Tipo"><Input placeholder="Detergente" value={form.tipo_insumo} onChange={e=>set('tipo_insumo',e.target.value)} /></Field>
          <Field label="Cantidad en stock"><Input type="number" placeholder="0.00" step="0.01" value={form.cantidad_stock} onChange={e=>set('cantidad_stock',e.target.value)} /></Field>
          <Field label="Unidad de medida"><Select value={form.unidad_medida} onChange={e=>set('unidad_medida',e.target.value)}>{['kg','g','L','ml','pza'].map(u=><option key={u}>{u}</option>)}</Select></Field>
          <Field label="Stock mínimo"><Input type="number" placeholder="0.00" step="0.01" value={form.stock_minimo} onChange={e=>set('stock_minimo',e.target.value)} /></Field>
          <Field label="Fecha de compra"><Input type="date" value={form.fecha_compra} onChange={e=>set('fecha_compra',e.target.value)} /></Field>
          <Field label="Precio de compra"><Input type="number" placeholder="0.00" step="0.01" value={form.precio_compra} onChange={e=>set('precio_compra',e.target.value)} /></Field>
        </FormGrid>
        <BtnRow><Btn variant="success" onClick={guardar} disabled={loading}><Save size={12} strokeWidth={2} />Guardar insumo</Btn></BtnRow>
      </Card>
      <Card>
        <CardTitle icon={<Package size={13} color="#fb923c" strokeWidth={2} />} accent="#fb923c">Inventario actual</CardTitle>
        <Table columns={['#','Nombre','Tipo','Stock','Unidad','Mínimo','Estado','Precio']} rows={rows} emptyMsg="Sin insumos registrados" />
      </Card>
    </div>
  )
}

export function Pagos() {
  const { call, loading } = useApi()
  const [data, setData] = useState([])
  const [form, setForm] = useState({ id_pedido:'',monto:'',forma_pago:'Efectivo',tipo_tarjeta:'',referencia_transferencia:'' })
  const load = async () => { const r = await apiFetch('GET','/pagos'); setData(r.datos||[]) }
  useEffect(() => { load() }, [])
  const set = (k,v) => setForm(f => { const n={...f,[k]:v}; if(k==='forma_pago'){n.tipo_tarjeta='';n.referencia_transferencia=''} return n })

  const esTarjeta       = form.forma_pago === 'Tarjeta'
  const esTransferencia = form.forma_pago === 'Transferencia'

  const guardar = async () => {
    if (!form.id_pedido||!form.monto) { sileo.error({ title:'ID de pedido y monto son obligatorios' }); return }
    if (esTarjeta&&!form.tipo_tarjeta) { sileo.error({ title:'Selecciona el tipo de tarjeta' }); return }
    if (esTransferencia&&!form.referencia_transferencia) { sileo.error({ title:'Ingresa la referencia de transferencia' }); return }
    const r = await call('POST','/pagos',form)
    if (r.ok) { sileo.success({ title:r.mensaje, description:`$${parseFloat(form.monto).toFixed(2)} registrado` }); setForm({id_pedido:'',monto:'',forma_pago:'Efectivo',tipo_tarjeta:'',referencia_transferencia:''}); load() }
    else sileo.error({ title:r.mensaje, description:r.error })
  }

  const tipoBadge = p => {
    if (p.forma_pago==='Tarjeta')       return <Badge type="cyan">{p.tipo_tarjeta||'Tarjeta'}</Badge>
    if (p.forma_pago==='Transferencia') return <Badge type="yellow">Transferencia</Badge>
    return <Badge type="ok">Efectivo</Badge>
  }

  const rows = data.map(p=>[
    <Badge type="cyan">#{p.id_pago}</Badge>,
    <strong>{p.cliente}</strong>,
    <span style={{fontFamily:"'DM Mono',monospace",fontSize:'0.78rem'}}>${parseFloat(p.monto||0).toFixed(2)}</span>,
    tipoBadge(p),
    p.referencia_transferencia ? <span style={{fontFamily:"'DM Mono',monospace",fontSize:'0.72rem',color:'var(--agua)'}}>{p.referencia_transferencia}</span> : p.tipo_tarjeta||'—',
    new Date(p.fecha_pago).toLocaleString('es-MX'),
  ])

  return (
    <div>
      <PageTitle subtitle="registro de cobros">Pagos</PageTitle>
      <Card accent="#f472b6">
        <CardTitle icon={<Plus size={13} color="#f472b6" strokeWidth={2.5} />} accent="#f472b6">Registrar pago</CardTitle>
        <FormGrid>
          <Field label="ID de pedido"><Input type="number" placeholder="Número de pedido" value={form.id_pedido} onChange={e=>set('id_pedido',e.target.value)} /></Field>
          <Field label="Monto"><Input type="number" placeholder="0.00" step="0.01" value={form.monto} onChange={e=>set('monto',e.target.value)} /></Field>
          <Field label="Forma de pago"><Select value={form.forma_pago} onChange={e=>set('forma_pago',e.target.value)}><option>Efectivo</option><option>Tarjeta</option><option>Transferencia</option></Select></Field>
          {esTarjeta && <Field label="Tipo de tarjeta"><Select value={form.tipo_tarjeta} onChange={e=>set('tipo_tarjeta',e.target.value)}><option value="">Seleccionar...</option><option value="VISA">VISA</option><option value="Mastercard">Mastercard</option><option value="AMEX">AMEX</option></Select></Field>}
          {esTransferencia && <Field label="Referencia de transferencia"><Input placeholder="REF-20260320-001" value={form.referencia_transferencia} onChange={e=>set('referencia_transferencia',e.target.value)} /></Field>}
        </FormGrid>
        {(esTarjeta||esTransferencia) && (
          <div style={{ marginBottom:14, padding:'8px 12px', borderRadius:5, background: esTarjeta?'var(--agua-dim)':'var(--ambar-dim)', border:`1px solid ${esTarjeta?'var(--agua-brd)':'var(--ambar-brd)'}`, fontSize:'0.72rem', color:'var(--txt-secondary)', display:'flex', alignItems:'center', gap:8 }}>
            <CreditCard size={12} strokeWidth={1.8} color={esTarjeta?'var(--agua)':'var(--ambar)'} />
            {esTarjeta ? 'Selecciona VISA, Mastercard o AMEX para completar el registro.' : 'Ingresa el número de referencia del comprobante de transferencia del cliente.'}
          </div>
        )}
        <BtnRow><Btn variant="success" onClick={guardar} disabled={loading}><Save size={12} strokeWidth={2} />Registrar pago</Btn></BtnRow>
      </Card>
      <Card>
        <CardTitle icon={<CreditCard size={13} color="#f472b6" strokeWidth={2} />} accent="#f472b6">Historial de pagos</CardTitle>
        <Table columns={['#','Cliente','Monto','Tipo de pago','Referencia / Tarjeta','Fecha']} rows={rows} emptyMsg="Sin pagos registrados" />
      </Card>
    </div>
  )
}
