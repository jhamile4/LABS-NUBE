import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const coloresPorRol = {
  Admin: 'from-red-500 to-orange-500',
  Gerente: 'from-blue-500 to-cyan-500',
  Empleado: 'from-green-500 to-teal-500',
  Auditor: 'from-purple-500 to-pink-500',
};

export default function Dashboard() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  const menus = [
    { label: '📦 Productos', path: '/productos', roles: ['Admin', 'Gerente', 'Empleado', 'Auditor'] },
    { label: '👥 Usuarios', path: '/usuarios', roles: ['Admin'] },
    { label: '🎭 Roles', path: '/roles', roles: ['Admin', 'Auditor', 'Gerente', 'Empleado'] },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <nav className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🏪</span>
          <span className="font-bold text-lg">TechStore</span>
        </div>
        <div className="flex items-center gap-4">
          <span className={`bg-gradient-to-r ${coloresPorRol[usuario?.rol] || 'from-gray-500 to-gray-600'} px-3 py-1 rounded-full text-sm font-medium`}>
            {usuario?.rol}
          </span>
          <span className="text-slate-300 text-sm">{usuario?.nombre}</span>
          <button onClick={handleLogout} className="bg-red-500/20 hover:bg-red-500/40 border border-red-500/30 text-red-300 px-4 py-2 rounded-lg text-sm transition-all">
            Salir
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-2">Bienvenido, {usuario?.nombre?.split(' ')[0]} 👋</h1>
        <p className="text-slate-400 mb-10">Panel de control del sistema de inventario</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {menus.filter(m => m.roles.includes(usuario?.rol)).map(menu => (
            <Link key={menu.path} to={menu.path}
              className="bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl p-6 text-center transition-all duration-200 hover:scale-105 hover:border-indigo-500">
              <div className="text-4xl mb-3">{menu.label.split(' ')[0]}</div>
              <div className="font-semibold text-lg">{menu.label.split(' ').slice(1).join(' ')}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}