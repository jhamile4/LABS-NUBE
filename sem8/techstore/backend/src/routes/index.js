const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const rolesRoutes = require('./roles');
const usuariosRoutes = require('./usuarios');
const productosRoutes = require('./productos');

router.use('/auth', authRoutes);
router.use('/roles', rolesRoutes);
router.use('/usuarios', usuariosRoutes);
router.use('/productos', productosRoutes);

module.exports = router;