const pool = require('../../database');

async function listarUsuarios(req, res) {
  try {
    const [rows] = await pool.query(`
      SELECT u.id, u.email, u.nombre_completo, u.activo, u.fecha_creacion,
             t.nombre as tienda, r.nombre as rol
      FROM usuarios u
      LEFT JOIN tiendas t ON u.tienda_id = t.id
      LEFT JOIN usuario_roles ur ON u.id = ur.usuario_id
      LEFT JOIN roles r ON ur.rol_id = r.id
      ORDER BY u.id
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Error interno' });
  }
}

async function asignarRol(req, res) {
  try {
    const { usuario_id, rol_id } = req.body;
    const asignado_por = req.usuario.id;
    await pool.query('DELETE FROM usuario_roles WHERE usuario_id = ?', [usuario_id]);
    await pool.query(
      'INSERT INTO usuario_roles (usuario_id, rol_id, asignado_por) VALUES (?, ?, ?)',
      [usuario_id, rol_id, asignado_por]
    );
    res.json({ mensaje: 'Rol asignado correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error interno' });
  }
}

async function toggleActivo(req, res) {
  try {
    const { id } = req.params;
    await pool.query('UPDATE usuarios SET activo = NOT activo WHERE id = ?', [id]);
    const [rows] = await pool.query('SELECT id, email, activo FROM usuarios WHERE id = ?', [id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error interno' });
  }
}

module.exports = { listarUsuarios, asignarRol, toggleActivo };