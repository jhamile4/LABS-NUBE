import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Dashboard from './pages/Dashboard';
import Productos from './pages/Productos';
import Roles from './pages/Roles';
import Usuarios from './pages/Usuarios';

function RutaProtegida({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/" />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/dashboard" element={<RutaProtegida><Dashboard /></RutaProtegida>} />
          <Route path="/productos" element={<RutaProtegida><Productos /></RutaProtegida>} />
          <Route path="/roles" element={<RutaProtegida><Roles /></RutaProtegida>} />
          <Route path="/usuarios" element={<RutaProtegida><Usuarios /></RutaProtegida>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}