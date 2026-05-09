const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middlewares/auth.middleware');
const { requiereRol } = require('../middlewares/rbac.middleware');
const { listarRoles, crearRol, actualizarRol, eliminarRol } = require('../controllers/rolesController');

router.get('/', verificarToken, listarRoles);
router.post('/', verificarToken, requiereRol('Admin'), crearRol);
router.put('/:id', verificarToken, requiereRol('Admin'), actualizarRol);
router.delete('/:id', verificarToken, requiereRol('Admin'), eliminarRol);

module.exports = router;