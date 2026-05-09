const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middlewares/auth.middleware');
const { registrar, login, verificarMFA, toggleMFA, getEstadoMFA } = require('../controllers/authController');

router.post('/registrar', registrar);
router.post('/login', login);
router.post('/verificar-mfa', verificarMFA);
router.post('/toggle-mfa', verificarToken, toggleMFA);
router.get('/estado-mfa', verificarToken, getEstadoMFA);

module.exports = router;