import { useState, useEffect } from 'react'
import { sileo } from 'sileo'
import { Users, UserCheck, Sparkles, Plus, Save, Pencil, Trash2, X, Check } from 'lucide-react'
import { useApi, apiFetch } from '../hooks/useApi'
import { Card, CardTitle, PageTitle, Badge, Btn, BtnRow, FormGrid, Field, Input, Table } from './UI'

function useCRUD(endpoint) {
  const { call, loading } = useApi()
  const [data, setData] = useState([])
  const [editId, setEditId] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [deleteId, setDeleteId] = useState(null)

  const load = async () => { const r = await apiFetch('GET', endpoint); setData(r.datos||[]) }
  useEffect(() => { load() }, [])

  const startEdit = (item, fields) => { setEditId(item[Object.keys(item)[0]]); setEditForm(fields) }
  const cancelEdit = () => { setEditId(null); setEditForm({}) }
  const saveEdit = async (id, msg) => {
    const r = await call('PUT', `${endpoint}/${id}`, editForm)
    if (r.ok) { sileo.success({ title: msg || 'Actualizado correctamente' }); cancelEdit(); load() }
    else sileo.error({ title: r.mensaje, description: r.error })
  }
  const confirmDelete = (id) => setDeleteId(id)
  const cancelDelete  = () => setDeleteId(null)
  const doDelete = async (id, msg) => {
    const r = await call('DELETE', `${endpoint}/${id}`)
    if (r.ok) { sileo.success({ title: msg || 'Eliminado correctamente' }); setDeleteId(null); load() }
    else sileo.error({ title: r.mensaje, description: r.error })
  }

  return { data, load, loading, call, editId, editForm, setEditForm, startEdit, cancelEdit, saveEdit, deleteId, confirmDelete, cancelDelete, doDelete }
}

function ActionBtns({ isEditing, onEdit, onSave, onCancel, onDelete, isConfirmingDelete, onConfirmDelete, onCancelDelete }) {
  if (isConfirmingDelete) return (
    <div style={{ display:'flex', gap:4, alignItems:'center' }}>
      <span style={{ fontSize:'0.6rem', color:'var(--danger)', fontFamily:"'DM Mono',monospace", whiteSpace:'nowrap' }}>¿Eliminar?</span>
      <button onClick={onConfirmDelete} title="Confirmar"
        style={{ width:26, height:26, borderRadius:4, border:'1px solid var(--danger-brd)', background:'var(--danger-dim)', color:'var(--danger)', cursor:'pointer', display:'grid', placeItems:'center' }}>
        <Check size={12} strokeWidth={2.5} />
      </button>
      <button onClick={onCancelDelete} title="Cancelar"
        style={{ width:26, height:26, borderRadius:4, border:'1px solid var(--brd)', background:'transparent', color:'var(--txt-secondary)', cursor:'pointer', display:'grid', placeItems:'center' }}>
        <X size={12} strokeWidth={2.5} />
      </button>
    </div>
  )
  if (isEditing) return (
    <div style={{ display:'flex', gap:4 }}>
      <button onClick={onSave} title="Guardar"
        style={{ width:26, height:26, borderRadius:4, border:'1px solid var(--success-brd)', background:'var(--success-dim)', color:'var(--success)', cursor:'pointer', display:'grid', placeItems:'center' }}>
        <Check size={12} strokeWidth={2.5} />
      </button>
      <button onClick={onCancel} title="Cancelar"
        style={{ width:26, height:26, borderRadius:4, border:'1px solid var(--brd)', background:'transparent', color:'var(--txt-secondary)', cursor:'pointer', display:'grid', placeItems:'center' }}>
        <X size={12} strokeWidth={2.5} />
      </button>
    </div>
  )
  return (
    <div style={{ display:'flex', gap:4 }}>
      <button onClick={onEdit} title="Editar"
        style={{ width:26, height:26, borderRadius:4, border:'1px solid var(--brd)', background:'transparent', color:'var(--txt-secondary)', cursor:'pointer', display:'grid', placeItems:'center', transition:'all .12s' }}
        onMouseEnter={e=>{ e.currentTarget.style.borderColor='var(--agua-brd)'; e.currentTarget.style.color='var(--agua)'; e.currentTarget.style.background='var(--agua-dim)' }}
        onMouseLeave={e=>{ e.currentTarget.style.borderColor='var(--brd)'; e.currentTarget.style.color='var(--txt-secondary)'; e.currentTarget.style.background='transparent' }}>
        <Pencil size={11} strokeWidth={2} />
      </button>
      <button onClick={onDelete} title="Eliminar"
        style={{ width:26, height:26, borderRadius:4, border:'1px solid var(--brd)', background:'transparent', color:'var(--txt-secondary)', cursor:'pointer', display:'grid', placeItems:'center', transition:'all .12s' }}
        onMouseEnter={e=>{ e.currentTarget.style.borderColor='var(--danger-brd)'; e.currentTarget.style.color='var(--danger)'; e.currentTarget.style.background='var(--danger-dim)' }}
        onMouseLeave={e=>{ e.currentTarget.style.borderColor='var(--brd)'; e.currentTarget.style.color='var(--txt-secondary)'; e.currentTarget.style.background='transparent' }}>
        <Trash2 size={11} strokeWidth={2} />
      </button>
    </div>
  )
}

const EditInput = ({ value, onChange, placeholder, type='text', style: xs }) => (
  <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
    style={{ height:30, padding:'0 8px', borderRadius:4, border:'1px solid var(--brd)', background:'var(--bg-elevated)', color:'var(--txt-primary)', fontFamily:"'DM Sans',sans-serif", fontSize:'0.76rem', outline:'none', transition:'border-color .15s', width:'100%', ...xs }}
    onFocus={e=>{ e.target.style.borderColor='var(--agua)'; e.target.style.boxShadow='0 0 0 2px var(--agua-dim)' }}
    onBlur={e=>{ e.target.style.borderColor='var(--brd)'; e.target.style.boxShadow='none' }}
  />
)

export function Clientes({ onRefresh }) {
  const crud = useCRUD('/clientes')
  const [form, setForm] = useState({ nombre:'', telefono:'', email:'', direccion:'' })
  const set = (k,v) => setForm(f=>({...f,[k]:v}))

  const guardar = async () => {
    if (!form.nombre) { sileo.error({ title:'El nombre es obligatorio' }); return }
    const r = await crud.call('POST','/clientes',form)
    if (r.ok) { sileo.success({ title:r.mensaje, description:`ID #${r.datos.id_cliente}` }); setForm({nombre:'',telefono:'',email:'',direccion:''}); crud.load(); onRefresh() }
    else sileo.error({ title:r.mensaje, description:r.error })
  }

  const rows = crud.data.map(c => {
    const isEditing  = crud.editId === c.id_cliente
    const isDeleting = crud.deleteId === c.id_cliente
    return [
      <Badge type="cyan">#{c.id_cliente}</Badge>,
      isEditing
        ? <EditInput value={crud.editForm.nombre||''} onChange={v=>crud.setEditForm(f=>({...f,nombre:v}))} />
        : <strong>{c.nombre}</strong>,
      isEditing
        ? <EditInput value={crud.editForm.telefono||''} onChange={v=>crud.setEditForm(f=>({...f,telefono:v}))} placeholder="Teléfono" />
        : c.telefono||'—',
      isEditing
        ? <EditInput type="email" value={crud.editForm.email||''} onChange={v=>crud.setEditForm(f=>({...f,email:v}))} placeholder="Correo" />
        : c.email||'—',
      isEditing
        ? <EditInput value={crud.editForm.direccion||''} onChange={v=>crud.setEditForm(f=>({...f,direccion:v}))} placeholder="Dirección" />
        : c.direccion||'—',
      <ActionBtns
        isEditing={isEditing} isConfirmingDelete={isDeleting}
        onEdit={() => crud.startEdit(c, { nombre:c.nombre, telefono:c.telefono||'', email:c.email||'', direccion:c.direccion||'' })}
        onSave={() => crud.saveEdit(c.id_cliente, `Cliente #${c.id_cliente} actualizado`)}
        onCancel={crud.cancelEdit}
        onDelete={() => crud.confirmDelete(c.id_cliente)}
        onConfirmDelete={() => crud.doDelete(c.id_cliente, `Cliente #${c.id_cliente} eliminado`)}
        onCancelDelete={crud.cancelDelete}
      />
    ]
  })

  return (
    <div>
      <PageTitle subtitle="registro de clientes">Clientes</PageTitle>
      <Card accent="var(--ambar)">
        <CardTitle icon={<Plus size={13} color="var(--ambar)" strokeWidth={2.5} />} accent="var(--ambar)">Nuevo cliente</CardTitle>
        <FormGrid>
          <Field label="Nombre completo"><Input placeholder="Ana Torres" value={form.nombre} onChange={e=>set('nombre',e.target.value)} /></Field>
          <Field label="Teléfono"><Input placeholder="9811234567" value={form.telefono} onChange={e=>set('telefono',e.target.value)} /></Field>
          <Field label="Correo electrónico"><Input type="email" placeholder="correo@ejemplo.com" value={form.email} onChange={e=>set('email',e.target.value)} /></Field>
          <Field label="Dirección"><Input placeholder="Calle, número, colonia" value={form.direccion} onChange={e=>set('direccion',e.target.value)} /></Field>
        </FormGrid>
        <BtnRow><Btn variant="success" onClick={guardar} disabled={crud.loading}><Save size={12} strokeWidth={2} />Guardar cliente</Btn></BtnRow>
      </Card>
      <Card>
        <CardTitle icon={<Users size={13} color="var(--ambar)" strokeWidth={2} />} accent="var(--ambar)">Lista de clientes</CardTitle>
        <Table columns={['#','Nombre','Teléfono','Correo','Dirección','Acciones']} rows={rows} emptyMsg="Sin clientes registrados" />
      </Card>
    </div>
  )
}

export function Empleados({ onRefresh }) {
  const crud = useCRUD('/empleados')
  const [form, setForm] = useState({ nombre_empleado:'', puesto:'', departamento:'', salario:'' })
  const set = (k,v) => setForm(f=>({...f,[k]:v}))

  const guardar = async () => {
    if (!form.nombre_empleado||!form.puesto) { sileo.error({ title:'Nombre y puesto son obligatorios' }); return }
    const r = await crud.call('POST','/empleados',form)
    if (r.ok) { sileo.success({ title:r.mensaje, description:`ID #${r.datos.id_empleado}` }); setForm({nombre_empleado:'',puesto:'',departamento:'',salario:''}); crud.load(); onRefresh() }
    else sileo.error({ title:r.mensaje, description:r.error })
  }

  const rows = crud.data.map(e => {
    const isEditing  = crud.editId === e.id_empleado
    const isDeleting = crud.deleteId === e.id_empleado
    return [
      <Badge type="ok">#{e.id_empleado}</Badge>,
      isEditing
        ? <EditInput value={crud.editForm.nombre_empleado||''} onChange={v=>crud.setEditForm(f=>({...f,nombre_empleado:v}))} />
        : <strong>{e.nombre_empleado}</strong>,
      isEditing
        ? <EditInput value={crud.editForm.puesto||''} onChange={v=>crud.setEditForm(f=>({...f,puesto:v}))} placeholder="Puesto" />
        : e.puesto,
      isEditing
        ? <EditInput value={crud.editForm.departamento||''} onChange={v=>crud.setEditForm(f=>({...f,departamento:v}))} placeholder="Departamento" />
        : e.departamento||'—',
      isEditing
        ? <EditInput type="number" value={crud.editForm.salario||''} onChange={v=>crud.setEditForm(f=>({...f,salario:v}))} placeholder="Salario" style={{width:100}} />
        : <span style={{fontFamily:"'DM Mono',monospace",fontSize:'0.78rem'}}>${parseFloat(e.salario||0).toFixed(2)}</span>,
      <ActionBtns
        isEditing={isEditing} isConfirmingDelete={isDeleting}
        onEdit={() => crud.startEdit(e, { nombre_empleado:e.nombre_empleado, puesto:e.puesto, departamento:e.departamento||'', salario:e.salario })}
        onSave={() => crud.saveEdit(e.id_empleado, `Empleado #${e.id_empleado} actualizado`)}
        onCancel={crud.cancelEdit}
        onDelete={() => crud.confirmDelete(e.id_empleado)}
        onConfirmDelete={() => crud.doDelete(e.id_empleado, `Empleado #${e.id_empleado} eliminado`)}
        onCancelDelete={crud.cancelDelete}
      />
    ]
  })

  return (
    <div>
      <PageTitle subtitle="personal y nómina">Empleados</PageTitle>
      <Card accent="var(--success)">
        <CardTitle icon={<Plus size={13} color="var(--success)" strokeWidth={2.5} />} accent="var(--success)">Nuevo empleado</CardTitle>
        <FormGrid>
          <Field label="Nombre completo"><Input placeholder="María González" value={form.nombre_empleado} onChange={e=>set('nombre_empleado',e.target.value)} /></Field>
          <Field label="Puesto"><Input placeholder="Operador" value={form.puesto} onChange={e=>set('puesto',e.target.value)} /></Field>
          <Field label="Departamento"><Input placeholder="Lavado" value={form.departamento} onChange={e=>set('departamento',e.target.value)} /></Field>
          <Field label="Salario"><Input type="number" placeholder="0.00" step="0.01" value={form.salario} onChange={e=>set('salario',e.target.value)} /></Field>
        </FormGrid>
        <BtnRow><Btn variant="success" onClick={guardar} disabled={crud.loading}><Save size={12} strokeWidth={2} />Guardar empleado</Btn></BtnRow>
      </Card>
      <Card>
        <CardTitle icon={<UserCheck size={13} color="var(--success)" strokeWidth={2} />} accent="var(--success)">Lista de empleados</CardTitle>
        <Table columns={['#','Nombre','Puesto','Departamento','Salario','Acciones']} rows={rows} emptyMsg="Sin empleados registrados" />
      </Card>
    </div>
  )
}

export function Servicios() {
  const crud = useCRUD('/servicios')
  const [form, setForm] = useState({ nom_servicio:'', costo:'' })

  const guardar = async () => {
    if (!form.nom_servicio||!form.costo) { sileo.error({ title:'Nombre y costo son obligatorios' }); return }
    const r = await crud.call('POST','/servicios',form)
    if (r.ok) { sileo.success({ title:r.mensaje }); setForm({nom_servicio:'',costo:''}); crud.load() }
    else sileo.error({ title:r.mensaje, description:r.error })
  }

  const rows = crud.data.map(s => {
    const isEditing  = crud.editId === s.id_servicio
    const isDeleting = crud.deleteId === s.id_servicio
    return [
      <Badge type="cyan">#{s.id_servicio}</Badge>,
      isEditing
        ? <EditInput value={crud.editForm.nom_servicio||''} onChange={v=>crud.setEditForm(f=>({...f,nom_servicio:v}))} placeholder="Nombre servicio" />
        : <strong>{s.nom_servicio}</strong>,
      isEditing
        ? <EditInput type="number" value={crud.editForm.costo||''} onChange={v=>crud.setEditForm(f=>({...f,costo:v}))} placeholder="0.00" style={{width:100}} />
        : <Badge type="yellow">${parseFloat(s.costo||0).toFixed(2)}</Badge>,
      <ActionBtns
        isEditing={isEditing} isConfirmingDelete={isDeleting}
        onEdit={() => crud.startEdit(s, { nom_servicio:s.nom_servicio, costo:s.costo })}
        onSave={() => crud.saveEdit(s.id_servicio, `Servicio actualizado`)}
        onCancel={crud.cancelEdit}
        onDelete={() => crud.confirmDelete(s.id_servicio)}
        onConfirmDelete={() => crud.doDelete(s.id_servicio, `Servicio eliminado`)}
        onCancelDelete={crud.cancelDelete}
      />
    ]
  })

  return (
    <div>
      <PageTitle subtitle="catálogo de servicios">Servicios</PageTitle>
      <Card accent="#a78bfa">
        <CardTitle icon={<Plus size={13} color="#a78bfa" strokeWidth={2.5} />} accent="#a78bfa">Nuevo servicio</CardTitle>
        <FormGrid>
          <Field label="Nombre del servicio"><Input placeholder="Lavado Express" value={form.nom_servicio} onChange={e=>setForm(f=>({...f,nom_servicio:e.target.value}))} /></Field>
          <Field label="Costo"><Input type="number" placeholder="0.00" step="0.01" value={form.costo} onChange={e=>setForm(f=>({...f,costo:e.target.value}))} /></Field>
        </FormGrid>
        <BtnRow><Btn variant="success" onClick={guardar} disabled={crud.loading}><Save size={12} strokeWidth={2} />Guardar servicio</Btn></BtnRow>
      </Card>
      <Card>
        <CardTitle icon={<Sparkles size={13} color="#a78bfa" strokeWidth={2} />} accent="#a78bfa">Catálogo de servicios</CardTitle>
        <Table columns={['#','Servicio','Precio','Acciones']} rows={rows} emptyMsg="Sin servicios registrados" />
      </Card>
    </div>
  )
}
