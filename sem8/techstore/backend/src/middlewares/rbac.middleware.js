function requiereRol(...roles) {
  return (req, res, next) => {
    const rolUsuario = req.usuario?.rol;
    if (!roles.includes(rolUsuario)) {
      return res.status(403).json({ 
        error: `Acceso denegado. Se requiere: ${roles.join(' o ')}` 
      });
    }
    next();
  };
}

module.exports = { requiereRol };