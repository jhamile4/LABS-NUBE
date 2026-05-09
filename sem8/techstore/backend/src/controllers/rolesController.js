const pool = require('../../database');

async function listarRoles(req, res) {
  try {
    const [rows] = await pool.query('SELECT * FROM roles ORDER BY id');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Error interno' });
  }
}

async function crearRol(req, res) {
  try {
    const { nombre, descripcion } = req.body;
    const [result] = await pool.query(
      'INSERT INTO roles (nombre, descripcion) VALUES (?, ?)', [nombre, descripcion]
    );
    const [rows] = await pool.query('SELECT * FROM roles WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error interno' });
  }
}

async function actualizarRol(req, res) {
  try {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;
    await pool.query('UPDATE roles SET nombre = ?, descripcion = ? WHERE id = ?', [nombre, descripcion, id]);
    const [rows] = await pool.query('SELECT * FROM roles WHERE id = ?', [id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error interno' });
  }
}

async function eliminarRol(req, res) {
  try {
    const { id } = req.params;
    const [count] = await pool.query('SELECT COUNT(*) as total FROM usuario_roles WHERE rol_id = ?', [id]);
    if (count[0].total > 0) {
      return res.status(400).json({ error: 'No se puede eliminar: hay usuarios con este rol' });
    }
    await pool.query('DELETE FROM roles WHERE id = ?', [id]);
    res.json({ mensaje: 'Rol eliminado' });
  } catch (err) {
    res.status(500).json({ error: 'Error interno' });
  }
}

module.exports = { listarRoles, crearRol, actualizarRol, eliminarRol };