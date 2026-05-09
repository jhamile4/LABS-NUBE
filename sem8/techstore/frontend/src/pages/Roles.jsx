import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API from '../api/client';

export default function Roles() {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ nombre: '', descripcion: '' });
  const [editando, setEditando] = useState(null);

  useEffect(() => { cargar(); }, []);
  async function cargar() { const r = await API.get('/roles'); setRoles(r.data); }

  async function guardar(e) {
    e.preventDefault();
    if (editando) await API.put(`/roles/${editando}`, form);
    else await API.post('/roles', form);
    setModal(false); setEditando(null); cargar();
  }

  async function eliminar(id) {
    if (!confirm('¿Eliminar este rol?')) return;
    try { await API.delete(`/roles/${id}`); cargar(); }
    catch (err) { alert(err.response?.data?.error); }
  }

  const esAdmin = usuario?.rol === 'Admin';

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <button onClick={() => navigate('/dashboard')} className="text-slate-400 hover:text-white text-sm mb-2 block">← Volver</button>
            <h1 className="text-2xl font-bold">🎭 Roles del Sistema</h1>
          </div>
          {esAdmin && (
            <button onClick={() => { setModal(true); setEditando(null); setForm({ nombre: '', descripcion: '' }); }}
              className="bg-indigo-500 hover:bg-indigo-400 px-4 py-2 rounded-lg font-medium">
              + Nuevo Rol
            </button>
          )}
        </div>
        <div className="grid gap-4">
          {roles.map(r => (
            <div key={r.id} className="bg-slate-800 border border-slate-700 rounded-xl p-5 flex items-center justify-between">
              <div>
                <div className="font-semibold text-lg">{r.nombre}</div>
                <div className="text-slate-400 text-sm">{r.descripcion}</div>
              </div>
              {esAdmin && (
                <div className="flex gap-2">
                  <button onClick={() => { setForm({ nombre: r.nombre, descripcion: r.descripcion }); setEditando(r.id); setModal(true); }}
                    className="bg-slate-700 hover:bg-slate-600 px-3 py-2 rounded-lg text-sm">✏️ Editar</button>
                  <button onClick={() => eliminar(r.id)} className="bg-red-500/20 hover:bg-red-500/40 border border-red-500/30 text-red-300 px-3 py-2 rounded-lg text-sm">🗑️</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {modal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-sm">
            <h2 className="text-xl font-bold mb-4">{editando ? 'Editar Rol' : 'Nuevo Rol'}</h2>
            <form onSubmit={guardar} className="space-y-3">
              <input required placeholder="Nombre del rol" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white" />
              <textarea placeholder="Descripción" value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white" rows={3} />
              <div className="flex gap-3">
                <button type="submit" className="flex-1 bg-indigo-500 hover:bg-indigo-400 py-2 rounded-lg">Guardar</button>
                <button type="button" onClick={() => setModal(false)} className="flex-1 bg-slate-700 py-2 rounded-lg">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}