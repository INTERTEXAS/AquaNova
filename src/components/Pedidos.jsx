import { useState, useEffect } from 'react'
import { sileo } from 'sileo'
import { ClipboardList, Plus, Save, Pencil, X, Check } from 'lucide-react'
import { useApi, apiFetch } from '../hooks/useApi'
import { Card, CardTitle, PageTitle, Badge, Btn, BtnRow, FormGrid, Field, Input, Select, Table } from './UI'

export default function Pedidos({ onRefresh }) {
  const { call, loading } = useApi()
  const [pedidos, setPedidos]     = useState([])
  const [clientes, setClientes]   = useState([])
  const [empleados, setEmpleados] = useState([])
  const [form, setForm]     = useState({ id_cliente:'', id_empleado:'', total_cobrar:'', estado_pedido:'Pendiente', fecha_entrega:'' })
  const [editId, setEditId] = useState(null)
  const [editForm, setEditForm] = useState({})

  const load = async () => {
    const [rp,rc,re] = await Promise.all([apiFetch('GET','/pedidos'),apiFetch('GET','/clientes'),apiFetch('GET','/empleados')])
    setPedidos(rp.datos||[]); setClientes(rc.datos||[]); setEmpleados(re.datos||[])
  }
  useEffect(() => { load() }, [])
  const set = (k,v) => setForm(f=>({...f,[k]:v}))

  // ── CREATE ────────────────────────────────────────────────
  const guardar = async () => {
    if (!form.id_cliente||!form.id_empleado) { sileo.error({ title:'Cliente y empleado son obligatorios' }); return }
    const r = await call('POST','/pedidos',form)
    if (r.ok) {
      sileo.success({ title:r.mensaje, description:`Pedido #${r.datos.id_pedido} registrado` })
      setForm({ id_cliente:'',id_empleado:'',total_cobrar:'',estado_pedido:'Pendiente',fecha_entrega:'' })
      load(); onRefresh()
    } else sileo.error({ title:r.mensaje, description:r.error })
  }

  // ── UPDATE ────────────────────────────────────────────────
  const startEdit = (p) => {
    setEditId(p.id_pedido)
    setEditForm({
      estado_pedido: p.estado_pedido,
      total_cobrar:  p.total_cobrar,
      fecha_entrega: p.fecha_entrega ? new Date(p.fecha_entrega).toISOString().slice(0,16) : '',
    })
  }
  const cancelEdit = () => { setEditId(null); setEditForm({}) }
  const saveEdit = async (id) => {
    const r = await call('PUT', `/pedidos/${id}`, editForm)
    if (r.ok) { sileo.success({ title:'Pedido actualizado', description:`#${id} modificado` }); cancelEdit(); load(); onRefresh() }
    else sileo.error({ title:r.mensaje, description:r.error })
  }

  const badgeMap = { 'Entregado':'ok', 'En proceso':'warn', 'Listo':'cyan', 'Pendiente':'err' }
  const ESTADOS  = ['Pendiente','En proceso','Listo','Entregado']

  const rows = pedidos.map(p => {
    const isEditing = editId === p.id_pedido
    return [
      <Badge type="cyan">#{p.id_pedido}</Badge>,

      // Cliente
      <span style={{ fontFamily:"'DM Sans',sans-serif" }}>{p.cliente}</span>,

      // Empleado
      <span style={{ fontFamily:"'DM Sans',sans-serif" }}>{p.empleado}</span>,

      // Total (editable)
      isEditing
        ? <Input type="number" step="0.01" value={editForm.total_cobrar}
            onChange={e=>setEditForm(f=>({...f,total_cobrar:e.target.value}))}
            style={{ height:30, padding:'0 8px', fontSize:'0.76rem', width:90 }} />
        : <span style={{ fontFamily:"'DM Mono',monospace", fontSize:'0.78rem' }}>${parseFloat(p.total_cobrar||0).toFixed(2)}</span>,

      // Estado (editable — dropdown)
      isEditing
        ? <Select value={editForm.estado_pedido}
            onChange={e=>setEditForm(f=>({...f,estado_pedido:e.target.value}))}
            style={{ height:30, padding:'0 8px', fontSize:'0.72rem', width:120 }}>
            {ESTADOS.map(s=><option key={s}>{s}</option>)}
          </Select>
        : <Badge type={badgeMap[p.estado_pedido]||'cyan'}>{p.estado_pedido}</Badge>,

      // Fecha (editable)
      isEditing
        ? <Input type="datetime-local" value={editForm.fecha_entrega}
            onChange={e=>setEditForm(f=>({...f,fecha_entrega:e.target.value}))}
            style={{ height:30, padding:'0 8px', fontSize:'0.72rem', width:160 }} />
        : <span style={{ fontSize:'0.76rem', color:'var(--txt-secondary)' }}>
            {p.fecha_entrega ? new Date(p.fecha_entrega).toLocaleString('es-MX') : '—'}
          </span>,

      // Acciones
      isEditing
        ? <div style={{ display:'flex', gap:4 }}>
            <button onClick={() => saveEdit(p.id_pedido)} title="Guardar"
              style={{ width:26, height:26, borderRadius:4, border:'1px solid var(--success-brd)', background:'var(--success-dim)', color:'var(--success)', cursor:'pointer', display:'grid', placeItems:'center' }}>
              <Check size={12} strokeWidth={2.5} />
            </button>
            <button onClick={cancelEdit} title="Cancelar"
              style={{ width:26, height:26, borderRadius:4, border:'1px solid var(--brd)', background:'transparent', color:'var(--txt-secondary)', cursor:'pointer', display:'grid', placeItems:'center' }}>
              <X size={12} strokeWidth={2.5} />
            </button>
          </div>
        : <button onClick={() => startEdit(p)} title="Editar"
            style={{ width:26, height:26, borderRadius:4, border:'1px solid var(--brd)', background:'transparent', color:'var(--txt-secondary)', cursor:'pointer', display:'grid', placeItems:'center', transition:'all .15s' }}
            onMouseEnter={e=>{ e.currentTarget.style.borderColor='var(--agua-brd)'; e.currentTarget.style.color='var(--agua)'; e.currentTarget.style.background='var(--agua-dim)' }}
            onMouseLeave={e=>{ e.currentTarget.style.borderColor='var(--brd)'; e.currentTarget.style.color='var(--txt-secondary)'; e.currentTarget.style.background='transparent' }}
          >
            <Pencil size={11} strokeWidth={2} />
          </button>,
    ]
  })

  return (
    <div>
      <PageTitle subtitle="gestión de órdenes">Pedidos</PageTitle>

      <Card accent="var(--agua)">
        <CardTitle icon={<Plus size={13} color="var(--agua)" strokeWidth={2.5} />} accent="var(--agua)">Nuevo pedido</CardTitle>
        <FormGrid>
          <Field label="Cliente">
            <Select value={form.id_cliente} onChange={e=>set('id_cliente',e.target.value)}>
              <option value="">Seleccionar...</option>
              {clientes.map(c=><option key={c.id_cliente} value={c.id_cliente}>{c.nombre}</option>)}
            </Select>
          </Field>
          <Field label="Empleado">
            <Select value={form.id_empleado} onChange={e=>set('id_empleado',e.target.value)}>
              <option value="">Seleccionar...</option>
              {empleados.map(e=><option key={e.id_empleado} value={e.id_empleado}>{e.nombre_empleado}</option>)}
            </Select>
          </Field>
          <Field label="Total a cobrar"><Input type="number" placeholder="0.00" step="0.01" value={form.total_cobrar} onChange={e=>set('total_cobrar',e.target.value)} /></Field>
          <Field label="Estado">
            <Select value={form.estado_pedido} onChange={e=>set('estado_pedido',e.target.value)}>
              {ESTADOS.map(s=><option key={s}>{s}</option>)}
            </Select>
          </Field>
          <Field label="Fecha de entrega"><Input type="datetime-local" value={form.fecha_entrega} onChange={e=>set('fecha_entrega',e.target.value)} /></Field>
        </FormGrid>
        <BtnRow>
          <Btn variant="success" onClick={guardar} disabled={loading}><Save size={12} strokeWidth={2} />Guardar pedido</Btn>
        </BtnRow>
      </Card>

      <Card>
        <CardTitle icon={<ClipboardList size={13} color="var(--agua)" strokeWidth={2} />}>Lista de pedidos</CardTitle>
        {editId && (
          <div style={{ marginBottom:10, padding:'6px 12px', background:'var(--agua-dim)', border:'1px solid var(--agua-brd)', borderRadius:5, fontSize:'0.68rem', color:'var(--agua)', fontFamily:"'DM Mono',monospace" }}>
            Editando pedido #{editId} — modifica los campos y presiona el check para guardar
          </div>
        )}
        <Table
          columns={['#','Cliente','Empleado','Total','Estado','Fecha entrega','Acciones']}
          rows={rows}
          emptyMsg="Sin pedidos registrados"
        />
      </Card>
    </div>
  )
}
