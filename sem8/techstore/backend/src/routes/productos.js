const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middlewares/auth.middleware');
const { requiereRol } = require('../middlewares/rbac.middleware');
const { listarProductos, crearProducto, actualizarProducto, eliminarProducto } = require('../controllers/productosController');

router.get('/', verificarToken, listarProductos);
router.post('/', verificarToken, requiereRol('Admin', 'Gerente', 'Empleado'), crearProducto);
router.put('/:id', verificarToken, requiereRol('Admin', 'Gerente', 'Empleado'), actualizarProducto);
router.delete('/:id', verificarToken, requiereRol('Admin', 'Gerente'), eliminarProducto);

module.exports = router;