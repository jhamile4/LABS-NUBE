const pool = require('../../database');

async function verificarPermisoProducto(accion, usuarioId, rol, tiendaId, productoId = null) {
  let producto = null;
  
  if (productoId) {
    const [rows] = await pool.query('SELECT * FROM productos WHERE id = ?', [productoId]);
    producto = rows[0];
  }

  switch (accion) {
    case 'SELECT':
      return ['Admin', 'Auditor'].includes(rol) || (producto ? producto.tienda_id === tiendaId : true);
    case 'INSERT':
      if (rol === 'Admin') return true;
      if (rol === 'Auditor') return false;
      return true;
    case 'UPDATE':
      if (rol === 'Admin') return true;
      if (rol === 'Auditor') return false;
      if (rol === 'Gerente') return producto && producto.tienda_id === tiendaId;
      if (rol === 'Empleado') return producto && producto.tienda_id === tiendaId;
      return false;
    case 'DELETE':
      if (rol === 'Admin') return true;
      if (rol === 'Gerente') return producto && producto.tienda_id === tiendaId && !producto.es_premium;
      return false;
  }
  return false;
}

module.exports = { verificarPermisoProducto };