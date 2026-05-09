const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../../database');
const { enviarCodigoMFA } = require('../utils/email');
require('dotenv').config();

async function registrar(req, res) {
  try {
    const { email, password, nombre_completo, tienda_id } = req.body;
    
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (!regex.test(password)) {
      return res.status(400).json({ 
        error: 'La contraseña debe tener mínimo 8 caracteres, una mayúscula, un número y un carácter especial' 
      });
    }

    const [emailExiste] = await pool.query('SELECT id FROM usuarios WHERE email = ?', [email]);
    if (emailExiste.length > 0) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    const hash = await bcrypt.hash(password, 12);
    const [result] = await pool.query(
      'INSERT INTO usuarios (email, password, nombre_completo, tienda_id) VALUES (?, ?, ?, ?)',
      [email, hash, nombre_completo, tienda_id]
    );

    const [rolEmpleado] = await pool.query("SELECT id FROM roles WHERE nombre = 'Empleado'");
    await pool.query(
      'INSERT INTO usuario_roles (usuario_id, rol_id, asignado_por) VALUES (?, ?, ?)',
      [result.insertId, rolEmpleado[0].id, result.insertId]
    );

    res.json({ mensaje: 'Usuario registrado exitosamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    const [rows] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    const usuario = rows[0];

    if (!usuario || !usuario.activo) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Verificar si está bloqueado
    if (usuario.bloqueado) {
      return res.status(429).json({ error: 'Cuenta bloqueada. Contacta al administrador.' });
    }

    const passwordOk = await bcrypt.compare(password, usuario.password);
    if (!passwordOk) {
      let intentos = usuario.intentos_fallidos + 1;
      let bloqueado = false;

      if (intentos >= 5) {
        bloqueado = true;
        intentos = 0;
      }

      await pool.query(
        'UPDATE usuarios SET intentos_fallidos = ?, bloqueado = ? WHERE id = ?',
        [intentos, bloqueado, usuario.id]
      );

      if (bloqueado) {
        return res.status(429).json({ error: 'Cuenta bloqueada por demasiados intentos. Contacta al administrador.' });
      }

      return res.status(401).json({ error: `Credenciales inválidas. Intentos fallidos: ${intentos}/5` });
    }

    // Reset intentos al hacer login correcto
    await pool.query(
      'UPDATE usuarios SET intentos_fallidos = 0, bloqueado = FALSE WHERE id = ?',
      [usuario.id]
    );

    // Generar código MFA de 6 dígitos
    const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    const expira = new Date(Date.now() + 5 * 60 * 1000); // 5 minutos

    await pool.query(
      'UPDATE usuarios SET mfa_codigo = ?, mfa_codigo_expira = ? WHERE id = ?',
      [codigo, expira, usuario.id]
    );

    await enviarCodigoMFA(usuario.email, codigo);

    res.json({ 
      mensaje: 'Credenciales correctas. Se envió el código MFA a tu email.',
      requiereMFA: true,
      usuarioId: usuario.id
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

async function verificarMFA(req, res) {
  try {
    const { usuario_id, codigo } = req.body;

    const [rows] = await pool.query('SELECT * FROM usuarios WHERE id = ?', [usuario_id]);
    const usuario = rows[0];

    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

    if (!usuario.mfa_codigo || usuario.mfa_codigo !== codigo) {
      return res.status(401).json({ error: 'Código MFA incorrecto' });
    }

    if (new Date() > new Date(usuario.mfa_codigo_expira)) {
      return res.status(401).json({ error: 'Código MFA expirado. Vuelve a iniciar sesión.' });
    }

    // Limpiar código MFA usado
    await pool.query(
      'UPDATE usuarios SET mfa_codigo = NULL, mfa_codigo_expira = NULL WHERE id = ?',
      [usuario_id]
    );

    // Obtener rol del usuario
    const [rolRows] = await pool.query(
      `SELECT r.nombre FROM roles r 
       JOIN usuario_roles ur ON r.id = ur.rol_id 
       WHERE ur.usuario_id = ? LIMIT 1`,
      [usuario_id]
    );
    const rol = rolRows[0]?.nombre || 'Empleado';

    const token = jwt.sign(
      { 
        id: usuario.id, 
        email: usuario.email, 
        nombre: usuario.nombre_completo, 
        rol, 
        tienda_id: usuario.tienda_id 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({ 
      token, 
      usuario: { 
        id: usuario.id, 
        email: usuario.email, 
        nombre: usuario.nombre_completo, 
        rol, 
        tienda_id: usuario.tienda_id 
      } 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

module.exports = { registrar, login, verificarMFA };