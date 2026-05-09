import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/client';

export default function Login() {
  const [paso, setPaso] = useState(1); // 1=credenciales, 2=MFA
  const [form, setForm] = useState({ email: '', password: '' });
  const [codigo, setCodigo] = useState('');
  const [usuarioId, setUsuarioId] = useState(null);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    setCargando(true);
    try {
      const res = await API.post('/auth/login', form);
      setUsuarioId(res.data.usuarioId);
      setPaso(2);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al iniciar sesión');
    } finally {
      setCargando(false);
    }
  }

  async function handleMFA(e) {
    e.preventDefault();
    setError('');
    setCargando(true);
    try {
      const res = await API.post('/auth/verificar-mfa', { usuario_id: usuarioId, codigo });
      login(res.data.usuario, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Código incorrecto');
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🏪</div>
          <h1 className="text-3xl font-bold text-white">TechStore</h1>
          <p className="text-indigo-300 mt-1">Sistema de Gestión de Inventario</p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 rounded-lg p-3 mb-4 text-sm">
            ⚠️ {error}
          </div>
        )}

        {paso === 1 ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-indigo-200 text-sm block mb-1">Email</label>
              <input
                type="email" required
                value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="tu@email.com"
              />
            </div>
            <div>
              <label className="text-indigo-200 text-sm block mb-1">Contraseña</label>
              <input
                type="password" required
                value={form.password}
                onChange={e => setForm({...form, password: e.target.value})}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit" disabled={cargando}
              className="w-full bg-indigo-500 hover:bg-indigo-400 text-white font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-50"
            >
              {cargando ? 'Verificando...' : 'Iniciar Sesión →'}
            </button>
            <p className="text-center text-indigo-300 text-sm">
              ¿No tienes cuenta?{' '}
              <span onClick={() => navigate('/registro')} className="text-indigo-200 underline cursor-pointer hover:text-white">
                Regístrate
              </span>
            </p>
          </form>
        ) : (
          <form onSubmit={handleMFA} className="space-y-4">
            <div className="text-center text-indigo-200 text-sm mb-4">
              📧 Te enviamos un código de 6 dígitos a tu email. Válido por 5 minutos.
            </div>
            <div>
              <label className="text-indigo-200 text-sm block mb-1">Código MFA</label>
              <input
                type="text" required maxLength={6}
                value={codigo}
                onChange={e => setCodigo(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white text-center text-2xl tracking-widest placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="000000"
              />
            </div>
            <button
              type="submit" disabled={cargando}
              className="w-full bg-green-500 hover:bg-green-400 text-white font-semibold py-3 rounded-lg transition-all"
            >
              {cargando ? 'Verificando...' : '✓ Verificar Código'}
            </button>
            <button type="button" onClick={() => setPaso(1)} className="w-full text-indigo-300 text-sm hover:text-white">
              ← Volver al login
            </button>
          </form>
        )}
      </div>
    </div>
  );
}