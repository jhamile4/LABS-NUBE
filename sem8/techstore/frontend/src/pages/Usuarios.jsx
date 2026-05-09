import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/client';

export default function Usuarios() {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);

  useEffect(() => { cargar(); }, []);
  async function cargar() {
    const [u, r] = await Promise.all([API.get('/usuarios'), API.get('/roles')]);
    setUsuarios(u.data); setRoles(r.data);
  }

  async function cambiarRol(usuario_id, rol_id) {
    await API.post('/usuarios/asignar-rol', { usuario_id, rol_id });
    cargar();
  }

  async function toggleActivo(id) {
    await API.patch(`/usuarios/${id}/toggle`);
    cargar();
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <button onClick={() => navigate('/dashboard')} className="text-slate-400 hover:text-white text-sm mb-2 block">← Volver</button>
          <h1 className="text-2xl font-bold">👥 Gestión de Usuarios</h1>
        </div>
        <div className="grid gap-4">
          {usuarios.map(u => (
            <div key={u.id} className="bg-slate-800 border border-slate-700 rounded-xl p-5 flex items-center justify-between">
              <div>
                <div className="font-semibold">{u.nombre_completo}</div>
                <div className="text-slate-400 text-sm">{u.email} · {u.tienda}</div>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={roles.find(r => r.nombre === u.rol)?.id || ''}
                  onChange={e => cambiarRol(u.id, e.target.value)}
                  className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm"
                >
                  {roles.map(r => <option key={r.id} value={r.id}>{r.nombre}</option>)}
                </select>
                <button onClick={() => toggleActivo(u.id)}
                  className={`px-3 py-2 rounded-lg text-sm transition-all ${u.activo ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'}`}>
                  {u.activo ? '✓ Activo' : '✗ Inactivo'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}