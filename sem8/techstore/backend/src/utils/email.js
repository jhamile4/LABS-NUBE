const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function enviarCodigoMFA(email, codigo) {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: '🔐 Tu código de verificación TechStore',
    html: `
      <div style="font-family: Arial; max-width: 400px; margin: auto; padding: 30px; background: #f8f9fa; border-radius: 12px;">
        <h2 style="color: #4f46e5;">TechStore - Código MFA</h2>
        <p>Tu código de verificación es:</p>
        <div style="background: #4f46e5; color: white; font-size: 32px; letter-spacing: 8px; text-align: center; padding: 20px; border-radius: 8px; font-weight: bold;">
          ${codigo}
        </div>
        <p style="color: #666; font-size: 12px; margin-top: 20px;">Válido por 5 minutos. No compartas este código.</p>
      </div>
    `,
  });
}

module.exports = { enviarCodigoMFA };