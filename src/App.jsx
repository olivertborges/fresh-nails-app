import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import ClientDashboard from './pages/ClientDashboard';
import Agenda from './pages/Agenda';
import Clientes from './pages/Clientes';
import Servicios from './pages/Servicios';
import Galeria from './pages/Galeria';
import Tienda from './pages/Tienda';
import Carrito from './pages/Carrito';
import Perfil from './pages/Perfil';
import Cancelaciones from './pages/Cancelaciones';
import Staff from './pages/Staff';

// Componente para rutas protegidas
const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, role, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(role)) return <Navigate to="/" />;
  return children;
};

// Layout para admin/staff con tabs
const AdminLayout = () => {
  const { logout, role } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved === 'true') {
      setDarkMode(true);
      document.body.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark');
    localStorage.setItem('darkMode', !darkMode);
  };

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: 'fas fa-chart-line', roles: ['admin', 'staff'] },
    { id: 'agenda', name: 'Agenda', icon: 'fas fa-calendar-alt', roles: ['admin', 'staff'] },
    { id: 'clientes', name: 'Clientas', icon: 'fas fa-users', roles: ['admin'] },
    { id: 'servicios', name: 'Servicios', icon: 'fas fa-spa', roles: ['admin'] },
    { id: 'historial', name: 'Historial', icon: 'fas fa-history', roles: ['admin', 'staff'] },
    { id: 'cancelaciones', name: 'Cancelaciones', icon: 'fas fa-history', roles: ['admin', 'staff'] },
    { id: 'tienda', name: 'Tienda', icon: 'fas fa-store', roles: ['admin'] },
    { id: 'staff', name: 'Staff', icon: 'fas fa-users-gear', roles: ['admin'] },
    { id: 'galeria', name: 'Galería', icon: 'fas fa-images', roles: ['admin', 'staff'] },
  ];

  const visibleTabs = tabs.filter(tab => tab.roles.includes(role));

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30">
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-lg border-b border-pink-100 dark:border-pink-800">
          <div className="px-4 py-3 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg overflow-hidden bg-transparent">
                  <div className="text-2xl">💅</div>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white dark:border-gray-900"></div>
              </div>
              <div>
                <h1 className="font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent text-lg">Salón Fresh Nails</h1>
                <p className="text-[10px] text-gray-400 dark:text-gray-500">Salón de Belleza Profesional</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={toggleDarkMode} className="relative w-9 h-9 rounded-full bg-pink-50 dark:bg-gray-800 hover:bg-pink-100 dark:hover:bg-gray-700 transition-all duration-300 flex items-center justify-center shadow-md">
                <i className={`fas fa-${darkMode ? 'sun' : 'moon'} text-pink-500 dark:text-pink-400 text-sm transition-transform duration-300 hover:rotate-12`}></i>
              </button>
              <button onClick={logout} className="relative w-9 h-9 rounded-full bg-pink-50 dark:bg-gray-800 hover:bg-pink-100 dark:hover:bg-gray-700 transition-all duration-300 flex items-center justify-center shadow-md group">
                <i className="fas fa-sign-out-alt text-pink-500 dark:text-pink-400 text-sm group-hover:translate-x-1 transition-transform"></i>
              </button>
            </div>
          </div>
          <div className="px-3 pb-2 overflow-x-auto">
            <div className="flex gap-1 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
              {visibleTabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`tab-btn px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex items-center gap-2 ${activeTab === tab.id ? 'active' : ''}`}
                >
                  <i className={`${tab.icon} text-xs`}></i>
                  <span>{tab.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="hidden md:block fixed top-20 right-4 z-20">
          <div className="flex items-center gap-1 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-full px-2 py-1 shadow-md text-[10px]">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-gray-500 dark:text-gray-400">Online</span>
          </div>
        </div>
      </header>
      <main className="p-4 pb-24">
        <section className="tab-content">
          {activeTab === 'dashboard' && <AdminDashboard />}
          {activeTab === 'agenda' && <Agenda />}
          {activeTab === 'clientes' && <Clientes />}
          {activeTab === 'servicios' && <Servicios />}
          {activeTab === 'historial' && <div className="glass-card p-4">Historial de citas</div>}
          {activeTab === 'cancelaciones' && <Cancelaciones />}
          {activeTab === 'tienda' && <Tienda />}
          {activeTab === 'staff' && <Staff />}
          {activeTab === 'galeria' && <Galeria />}
        </section>
      </main>
    </div>
  );
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin" element={<PrivateRoute allowedRoles={['admin', 'staff']}><AdminLayout /></PrivateRoute>} />
      <Route path="/dashboard" element={<PrivateRoute allowedRoles={['client']}><ClientDashboard /></PrivateRoute>} />
      <Route path="/tienda" element={<Tienda />} />
      <Route path="/carrito" element={<Carrito />} />
      <Route path="/perfil" element={<Perfil />} />
      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;