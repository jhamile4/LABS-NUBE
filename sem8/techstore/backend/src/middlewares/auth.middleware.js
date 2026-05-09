const jwt = require('jsonwebtoken');
require('dotenv').config();

function verificarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  console.log('Verificando token:', !!token);

  if (!token) {
    return res.status(401).json({ error: 'Token requerido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    console.log('Token válido para usuario:', decoded.id);
    next();
  } catch (err) {
    console.log('Token inválido:', err.message);
    return res.status(403).json({ error: 'Token inválido o expirado' });
  }
}

module.exports = { verificarToken };