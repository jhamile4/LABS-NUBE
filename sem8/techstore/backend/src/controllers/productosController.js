const pool = require('../../database');
const { verificarPermisoProducto } = require('../middlewares/abac.middleware');

async function listarProductos(req, res) {
  try {
    const { rol, tienda_id } = req.usuario;
    let query = `SELECT p.*, t.nombre as tienda_nombre 
                 FROM productos p LEFT JOIN tiendas t ON p.tienda_id = t.id`;
    let params = [];

    if (!['Admin', 'Auditor'].includes(rol)) {
      query += ' WHERE p.tienda_id = ?';
      params = [tienda_id];
    }

    const [rows] = await pool.query(query + ' ORDER BY p.id', params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Error interno' });
  }
}

async function crearProducto(req, res) {
  try {
    const { rol, id: usuario_id, tienda_id } = req.usuario;
    const { nombre, descripcion, precio, stock, categoria, tienda_id: prod_tienda, es_premium } = req.body;

    if (rol === 'Auditor') return res.status(403).json({ error: 'Auditores no pueden crear productos' });
    if (rol === 'Empleado' && es_premium) return res.status(403).json({ error: 'Empleados no pueden crear productos premium' });
    if (rol !== 'Admin' && prod_tienda && prod_tienda != tienda_id) return res.status(403).json({ error: 'Solo puedes crear productos en tu tienda' });

    const [result] = await pool.query(
      `INSERT INTO productos (nombre, descripcion, precio, stock, categoria, tienda_id, es_premium, creado_por)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [nombre, descripcion, precio, stock, categoria, prod_tienda || tienda_id, es_premium || false, usuario_id]
    );
    const [rows] = await pool.query('SELECT * FROM productos WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno' });
  }
}

async function actualizarProducto(req, res) {
  try {
    const { rol, tienda_id } = req.usuario;
    const { id } = req.params;
    const campos = req.body;

    const [prodRows] = await pool.query('SELECT * FROM productos WHERE id = ?', [id]);
    const producto = prodRows[0];
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });

    const permitido = await verificarPermisoProducto('UPDATE', req.usuario.id, rol, tienda_id, parseInt(id));
    if (!permitido) return res.status(403).json({ error: 'Sin permisos para actualizar este producto' });

    if (rol === 'Empleado') {
      if (campos.stock === undefined) return res.status(400).json({ error: 'Empleados solo pueden actualizar el stock' });
      await pool.query('UPDATE productos SET stock = ? WHERE id = ?', [campos.stock, id]);
    } else {
      const camposPermitidos = rol === 'Gerente'
        ? ['nombre', 'descripcion', 'precio', 'stock']
        : ['nombre', 'descripcion', 'precio', 'stock', 'categoria', 'es_premium'];

      const setClauses = [];
      const values = [];

      for (const campo of camposPermitidos) {
        if (campos[campo] !== undefined) {
          setClauses.push(`${campo} = ?`);
          values.push(campos[campo]);
        }
      }
      if (setClauses.length === 0) return res.status(400).json({ error: 'No hay campos para actualizar' });
      values.push(id);
      await pool.query(`UPDATE productos SET ${setClauses.join(', ')} WHERE id = ?`, values);
    }

    const [updated] = await pool.query('SELECT * FROM productos WHERE id = ?', [id]);
    res.json(updated[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno' });
  }
}

async function eliminarProducto(req, res) {
  try {
    const { rol, tienda_id } = req.usuario;
    const { id } = req.params;

    const [prodRows] = await pool.query('SELECT * FROM productos WHERE id = ?', [id]);
    const producto = prodRows[0];
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });

    const permitido = await verificarPermisoProducto('DELETE', req.usuario.id, rol, tienda_id, parseInt(id));
    if (!permitido) return res.status(403).json({ error: 'Sin permisos para eliminar este producto' });

    await pool.query('DELETE FROM productos WHERE id = ?', [id]);
    res.json({ mensaje: 'Producto eliminado' });
  } catch (err) {
    res.status(500).json({ error: 'Error interno' });
  }
}

module.exports = { listarProductos, crearProducto, actualizarProducto, eliminarProducto };