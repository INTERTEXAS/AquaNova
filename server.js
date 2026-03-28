import express  from 'express'
import pkg      from 'pg'
import cors     from 'cors'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const { Pool } = pkg
const app  = express()
const PORT = 3000

app.use(cors())
app.use(express.json())

const pool = new Pool({
  host: 'localhost', port: 5432,
  database: 'lavanderia_db',
  user: 'postgres',
  password: 'Lagunes98',
})

pool.connect((err, client, release) => {
  if (err) console.error('❌ Error conectando a PostgreSQL:', err.message)
  else { console.log('✅ Conectado a PostgreSQL — lavanderia_db'); release() }
})

const ok  = (res, data, msg = 'Operación exitosa')      => res.json({ ok: true,  mensaje: msg,  datos: data })
const err = (res, msg = 'Error en la operación', e = '') => res.status(500).json({ ok: false, mensaje: msg, error: e })


app.get('/api/empleados', async (req, res) => {
  try { const r = await pool.query('SELECT * FROM empleados ORDER BY id_empleado'); ok(res, r.rows) }
  catch(e) { err(res, 'Error al consultar empleados', e.message) }
})
app.post('/api/empleados', async (req, res) => {
  const { nombre_empleado, puesto, departamento, salario } = req.body
  try {
    const r = await pool.query(
      'INSERT INTO empleados (nombre_empleado,puesto,departamento,salario) VALUES ($1,$2,$3,$4) RETURNING *',
      [nombre_empleado, puesto, departamento, salario]
    )
    ok(res, r.rows[0], '✅ Empleado guardado')
  } catch(e) { err(res, '❌ Error al guardar empleado', e.message) }
})
app.put('/api/empleados/:id', async (req, res) => {
  const { nombre_empleado, puesto, departamento, salario } = req.body
  try {
    const r = await pool.query(
      'UPDATE empleados SET nombre_empleado=$1,puesto=$2,departamento=$3,salario=$4 WHERE id_empleado=$5 RETURNING *',
      [nombre_empleado, puesto, departamento, salario, req.params.id]
    )
    if (!r.rowCount) return err(res, '❌ Empleado no encontrado')
    ok(res, r.rows[0], '✅ Empleado actualizado')
  } catch(e) { err(res, '❌ Error al actualizar empleado', e.message) }
})
app.delete('/api/empleados/:id', async (req, res) => {
  try {
    const r = await pool.query('DELETE FROM empleados WHERE id_empleado=$1 RETURNING *', [req.params.id])
    if (!r.rowCount) return err(res, '❌ Empleado no encontrado')
    ok(res, r.rows[0], '✅ Empleado eliminado')
  } catch(e) { err(res, '❌ Error al eliminar empleado', e.message) }
})


app.get('/api/clientes', async (req, res) => {
  try { const r = await pool.query('SELECT * FROM clientes ORDER BY id_cliente'); ok(res, r.rows) }
  catch(e) { err(res, 'Error al consultar clientes', e.message) }
})
app.post('/api/clientes', async (req, res) => {
  const { nombre, telefono, email, direccion } = req.body
  try {
    const r = await pool.query(
      'INSERT INTO clientes (nombre,telefono,email,direccion) VALUES ($1,$2,$3,$4) RETURNING *',
      [nombre, telefono, email, direccion]
    )
    ok(res, r.rows[0], '✅ Cliente guardado')
  } catch(e) { err(res, '❌ Error al guardar cliente', e.message) }
})
app.put('/api/clientes/:id', async (req, res) => {
  const { nombre, telefono, email, direccion } = req.body
  try {
    const r = await pool.query(
      'UPDATE clientes SET nombre=$1,telefono=$2,email=$3,direccion=$4 WHERE id_cliente=$5 RETURNING *',
      [nombre, telefono, email, direccion, req.params.id]
    )
    if (!r.rowCount) return err(res, '❌ Cliente no encontrado')
    ok(res, r.rows[0], '✅ Cliente actualizado')
  } catch(e) { err(res, '❌ Error al actualizar cliente', e.message) }
})
app.delete('/api/clientes/:id', async (req, res) => {
  try {
    const r = await pool.query('DELETE FROM clientes WHERE id_cliente=$1 RETURNING *', [req.params.id])
    if (!r.rowCount) return err(res, '❌ Cliente no encontrado')
    ok(res, r.rows[0], '✅ Cliente eliminado')
  } catch(e) { err(res, '❌ Error al eliminar cliente — puede tener pedidos asociados', e.message) }
})


app.get('/api/pedidos', async (req, res) => {
  try {
    const r = await pool.query(`
      SELECT p.*, c.nombre AS cliente, e.nombre_empleado AS empleado
      FROM pedidos p
      JOIN clientes  c ON p.id_cliente  = c.id_cliente
      JOIN empleados e ON p.id_empleado = e.id_empleado
      ORDER BY p.id_pedido DESC`)
    ok(res, r.rows)
  } catch(e) { err(res, 'Error al consultar pedidos', e.message) }
})
app.post('/api/pedidos', async (req, res) => {
  const { id_cliente, id_empleado, total_cobrar, estado_pedido, fecha_entrega } = req.body
  try {
    const r = await pool.query(
      'INSERT INTO pedidos (id_cliente,id_empleado,total_cobrar,estado_pedido,fecha_entrega) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [id_cliente, id_empleado, total_cobrar, estado_pedido, fecha_entrega||null]
    )
    ok(res, r.rows[0], '✅ Pedido guardado')
  } catch(e) { err(res, '❌ Error al guardar pedido', e.message) }
})
app.put('/api/pedidos/:id', async (req, res) => {
  const { estado_pedido, total_cobrar, fecha_entrega } = req.body
  try {
    const r = await pool.query(
      'UPDATE pedidos SET estado_pedido=$1,total_cobrar=$2,fecha_entrega=$3 WHERE id_pedido=$4 RETURNING *',
      [estado_pedido, total_cobrar, fecha_entrega||null, req.params.id]
    )
    if (!r.rowCount) return err(res, '❌ Pedido no encontrado')
    ok(res, r.rows[0], '✅ Pedido actualizado')
  } catch(e) { err(res, '❌ Error al actualizar pedido', e.message) }
})


app.get('/api/servicios', async (req, res) => {
  try { const r = await pool.query('SELECT * FROM servicios ORDER BY costo'); ok(res, r.rows) }
  catch(e) { err(res, 'Error al consultar servicios', e.message) }
})
app.post('/api/servicios', async (req, res) => {
  const { nom_servicio, costo } = req.body
  try {
    const r = await pool.query('INSERT INTO servicios (nom_servicio,costo) VALUES ($1,$2) RETURNING *', [nom_servicio, costo])
    ok(res, r.rows[0], '✅ Servicio guardado')
  } catch(e) { err(res, '❌ Error al guardar servicio', e.message) }
})
app.put('/api/servicios/:id', async (req, res) => {
  const { nom_servicio, costo } = req.body
  try {
    const r = await pool.query(
      'UPDATE servicios SET nom_servicio=$1,costo=$2 WHERE id_servicio=$3 RETURNING *',
      [nom_servicio, costo, req.params.id]
    )
    if (!r.rowCount) return err(res, '❌ Servicio no encontrado')
    ok(res, r.rows[0], '✅ Servicio actualizado')
  } catch(e) { err(res, '❌ Error al actualizar servicio', e.message) }
})
app.delete('/api/servicios/:id', async (req, res) => {
  try {
    const r = await pool.query('DELETE FROM servicios WHERE id_servicio=$1 RETURNING *', [req.params.id])
    if (!r.rowCount) return err(res, '❌ Servicio no encontrado')
    ok(res, r.rows[0], '✅ Servicio eliminado')
  } catch(e) { err(res, '❌ Error al eliminar servicio', e.message) }
})


app.get('/api/insumos', async (req, res) => {
  try {
    const r = await pool.query(`
      SELECT *, CASE WHEN cantidad_stock <= stock_minimo THEN true ELSE false END AS alerta_stock
      FROM inv_insumos ORDER BY nombre`)
    ok(res, r.rows)
  } catch(e) { err(res, 'Error al consultar insumos', e.message) }
})
app.post('/api/insumos', async (req, res) => {
  const { nombre, tipo_insumo, cantidad_stock, unidad_medida, stock_minimo, fecha_compra, precio_compra } = req.body
  try {
    const r = await pool.query(
      'INSERT INTO inv_insumos (nombre,tipo_insumo,cantidad_stock,unidad_medida,stock_minimo,fecha_compra,precio_compra) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
      [nombre, tipo_insumo, cantidad_stock, unidad_medida, stock_minimo, fecha_compra||null, precio_compra]
    )
    ok(res, r.rows[0], '✅ Insumo guardado')
  } catch(e) { err(res, '❌ Error al guardar insumo', e.message) }
})
app.put('/api/insumos/:id', async (req, res) => {
  const { cantidad_stock, stock_minimo, precio_compra } = req.body
  try {
    const r = await pool.query(
      'UPDATE inv_insumos SET cantidad_stock=$1,stock_minimo=$2,precio_compra=$3 WHERE id_insumo=$4 RETURNING *',
      [cantidad_stock, stock_minimo, precio_compra, req.params.id]
    )
    if (!r.rowCount) return err(res, '❌ Insumo no encontrado')
    ok(res, r.rows[0], '✅ Insumo actualizado')
  } catch(e) { err(res, '❌ Error al actualizar insumo', e.message) }
})

app.get('/api/pagos', async (req, res) => {
  try {
    const r = await pool.query(`
      SELECT pg.*, c.nombre AS cliente, p.total_cobrar
      FROM pagos pg
      JOIN pedidos  p ON pg.id_pedido = p.id_pedido
      JOIN clientes c ON p.id_cliente = c.id_cliente
      ORDER BY pg.fecha_pago DESC`)
    ok(res, r.rows)
  } catch(e) { err(res, 'Error al consultar pagos', e.message) }
})
app.post('/api/pagos', async (req, res) => {
  const { id_pedido, monto, forma_pago, tipo_tarjeta, referencia_transferencia } = req.body
  if (forma_pago==='Tarjeta'&&!tipo_tarjeta) return err(res,'❌ Tipo de tarjeta obligatorio para pagos con tarjeta')
  if (forma_pago==='Transferencia'&&!referencia_transferencia) return err(res,'❌ Referencia obligatoria para transferencias')
  try {
    const r = await pool.query(
      'INSERT INTO pagos (id_pedido,monto,forma_pago,tipo_tarjeta,referencia_transferencia) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [id_pedido, monto, forma_pago, forma_pago==='Tarjeta'?tipo_tarjeta:null, forma_pago==='Transferencia'?referencia_transferencia:null]
    )
    ok(res, r.rows[0], '✅ Pago registrado')
  } catch(e) { err(res, '❌ Error al registrar pago', e.message) }
})

app.post('/api/query', async (req, res) => {
  const { sql } = req.body
  if (!sql.trim().toUpperCase().startsWith('SELECT')) return err(res,'❌ Solo se permiten consultas SELECT')
  try {
    const r = await pool.query(sql)
    ok(res, { rows:r.rows, fields:r.fields.map(f=>f.name), total:r.rowCount })
  } catch(e) { err(res,'❌ Error en la consulta SQL', e.message) }
})

app.listen(PORT, () => console.log(`🧺 Aquanova corriendo en http://localhost:${PORT}`))
