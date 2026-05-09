const express = require('express');
const router = express.Router();
const { registrar, login, verificarMFA } = require('../controllers/authController');

router.post('/registrar', registrar);
router.post('/login', login);
router.post('/verificar-mfa', verificarMFA);

module.exports = router;