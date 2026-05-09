// Utilidad auxiliar para MFA (reservado para futuras extensiones TOTP)
function generarCodigo6Digitos() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

module.exports = { generarCodigo6Digitos };