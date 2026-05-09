import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API from '../api/client';

export default function Productos() {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ nombre: '', descripcion: '', precio: '', stock: '', categoria: '', tienda_id: usuario?.tienda_id || 1, es_premium: false });
  const [editando, setEditando] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => { cargar(); }, []);

  async function cargar() {
    const res = await API.get('/productos');
    setProductos(res.data);
  }

  async function guardar(e) {
    e.preventDefault();
    setError('');
    try {
      if (editando) {
        // Empleado solo actualiza stock
        const datos = usuario?.rol === 'Empleado' ? { stock: form.stock } : form;
        await API.put(`/productos/${editando}`, datos);
      } else {
        await API.post('/productos', form);
      }
      setModal(false);
      setEditando(null);
      cargar();
    } catch (err) {
      setError(err.response?.data?.error || 'Error');
    }
  }

  async function eliminar(id) {
    if (!confirm('¿Eliminar este producto?')) return;
    try {
      await API.delete(`/productos/${id}`);
      cargar();
    } catch (err) {
      alert(err.response?.data?.error || 'Error al eliminar');
    }
  }

  function abrirEditar(p) {
    setForm({ nombre: p.nombre, descripcion: p.descripcion, precio: p.precio, stock: p.stock, categoria: p.categoria, tienda_id: p.tienda_id, es_premium: p.es_premium });
    setEditando(p.id);
    setModal(true);
  }

  const puedeCrear = ['Admin', 'Gerente', 'Empleado'].includes(usuario?.rol);
  const puedeEliminar = ['Admin', 'Gerente'].includes(usuario?.rol);

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <button onClick={() => navigate('/dashboard')} className="text-slate-400 hover:text-white text-sm mb-2 block">← Volver</button>
            <h1 className="text-2xl font-bold">📦 Productos</h1>
          </div>
          {puedeCrear && (
            <button onClick={() => { setModal(true); setEditando(null); setForm({ nombre: '', descripcion: '', precio: '', stock: '', categoria: '', tienda_id: usuario?.tienda_id || 1, es_premium: false }); }}
              className="bg-indigo-500 hover:bg-indigo-400 px-4 py-2 rounded-lg font-medium transition-all">
              + Nuevo Producto
            </button>
          )}
        </div>

        <div className="grid gap-4">
          {productos.map(p => (
            <div key={p.id} className="bg-slate-800 border border-slate-700 rounded-xl p-5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-lg">{p.nombre}</span>
                  {p.es_premium && <span className="bg-yellow-500/20 text-yellow-300 text-xs px-2 py-0.5 rounded-full border border-yellow-500/30">⭐ Premium</span>}
                </div>
                <div className="text-slate-400 text-sm mt-1">{p.categoria} · {p.tienda_nombre}</div>
                <div className="flex gap-4 mt-2 text-sm">
                  <span className="text-green-400">S/ {parseFloat(p.precio).toFixed(2)}</span>
                  <span className="text-blue-400">Stock: {p.stock}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => abrirEditar(p)} className="bg-slate-700 hover:bg-slate-600 px-3 py-2 rounded-lg text-sm transition-all">
                  ✏️ {usuario?.rol === 'Empleado' ? 'Stock' : 'Editar'}
                </button>
                {puedeEliminar && (
                  <button onClick={() => eliminar(p.id)} className="bg-red-500/20 hover:bg-red-500/40 border border-red-500/30 text-red-300 px-3 py-2 rounded-lg text-sm transition-all">
                    🗑️
                  </button>
                )}
              </div>
            </div>
          ))}
          {productos.length === 0 && <div className="text-center text-slate-500 py-12">No hay productos aún</div>}
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{editando ? 'Editar Producto' : 'Nuevo Producto'}</h2>
            {error && <div className="bg-red-500/20 text-red-300 rounded-lg p-3 text-sm mb-4">⚠️ {error}</div>}
            <form onSubmit={guardar} className="space-y-3">
              {usuario?.rol === 'Empleado' ? (
                <div>
                  <label className="text-slate-300 text-sm block mb-1">Stock</label>
                  <input type="number" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white" />
                </div>
              ) : (
                <>
                  {['nombre', 'descripcion', 'categoria'].map(campo => (
                    <div key={campo}>
                      <label className="text-slate-300 text-sm block mb-1 capitalize">{campo}</label>
                      <input type="text" value={form[campo]} onChange={e => setForm({...form, [campo]: e.target.value})}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white" />
                    </div>
                  ))}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-300 text-sm block mb-1">Precio</label>
                      <input type="number" step="0.01" value={form.precio} onChange={e => setForm({...form, precio: e.target.value})}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white" />
                    </div>
                    <div>
                      <label className="text-slate-300 text-sm block mb-1">Stock</label>
                      <input type="number" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white" />
                    </div>
                  </div>
                  {usuario?.rol === 'Admin' && (
                    <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                      <input type="checkbox" checked={form.es_premium} onChange={e => setForm({...form, es_premium: e.target.checked})} className="w-4 h-4" />
                      Producto Premium ⭐
                    </label>
                  )}
                </>
              )}
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 bg-indigo-500 hover:bg-indigo-400 py-2 rounded-lg font-medium transition-all">
                  Guardar
                </button>
                <button type="button" onClick={() => setModal(false)} className="flex-1 bg-slate-700 hover:bg-slate-600 py-2 rounded-lg transition-all">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}