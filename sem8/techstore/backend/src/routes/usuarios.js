const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middlewares/auth.middleware');
const { requiereRol } = require('../middlewares/rbac.middleware');
const { listarUsuarios, asignarRol, toggleActivo } = require('../controllers/usuariosController');

router.get('/', verificarToken, requiereRol('Admin'), listarUsuarios);
router.post('/asignar-rol', verificarToken, requiereRol('Admin'), asignarRol);
router.patch('/:id/toggle', verificarToken, requiereRol('Admin'), toggleActivo);

module.exports = router;