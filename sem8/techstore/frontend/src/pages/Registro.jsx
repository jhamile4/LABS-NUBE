import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/client';

export default function Registro() {
  const [form, setForm] = useState({ email: '', password: '', nombre_completo: '', tienda_id: '1' });
  const [error, setError] = useState('');
  const [exito, setExito] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      await API.post('/auth/registrar', form);
      setExito(true);
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al registrarse');
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Crear Cuenta</h2>
        {exito ? (
          <div className="text-center text-green-300">✅ Registro exitoso. Redirigiendo...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="bg-red-500/20 border border-red-500/50 text-red-200 rounded-lg p-3 text-sm">⚠️ {error}</div>}
            {[
              { label: 'Nombre completo', key: 'nombre_completo', type: 'text' },
              { label: 'Email', key: 'email', type: 'email' },
              { label: 'Contraseña', key: 'password', type: 'password' },
            ].map(({ label, key, type }) => (
              <div key={key}>
                <label className="text-indigo-200 text-sm block mb-1">{label}</label>
                <input
                  type={type} required
                  value={form[key]}
                  onChange={e => setForm({...form, [key]: e.target.value})}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
            ))}
            <div>
              <label className="text-indigo-200 text-sm block mb-1">Tienda asignada</label>
              <select
                value={form.tienda_id}
                onChange={e => setForm({...form, tienda_id: e.target.value})}
                className="w-full bg-indigo-900 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <option value="1">TechStore Lima Centro</option>
                <option value="2">TechStore Miraflores</option>
                <option value="3">TechStore Arequipa</option>
              </select>
            </div>
            <p className="text-indigo-300 text-xs">Contraseña: mínimo 8 caracteres, una mayúscula, un número y un carácter especial (!@#$...)</p>
            <button type="submit" className="w-full bg-indigo-500 hover:bg-indigo-400 text-white font-semibold py-3 rounded-lg transition-all">
              Registrarse
            </button>
            <button type="button" onClick={() => navigate('/')} className="w-full text-indigo-300 text-sm hover:text-white">
              ← Ya tengo cuenta
            </button>
          </form>
        )}
      </div>
    </div>
  );
}