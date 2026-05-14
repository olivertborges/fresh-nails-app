import React, { useState } from 'react';
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
import ModalAgendarCita from './components/Modals/ModalAgendarCita';
import ModalConfirmarCancelacion from './components/Modals/ModalConfirmarCancelacion';
import ModalRecuperarPassword from './components/Modals/ModalRecuperarPassword';
import ModalCambiarPassword from './components/Modals/ModalCambiarPassword';

// Contexto global para modales
export const ModalContext = React.createContext();

function ModalProvider({ children }) {
  const [modalAgendarCita, setModalAgendarCita] = useState({ isOpen: false, clienteId: null });
  const [modalConfirmarCancelacion, setModalConfirmarCancelacion] = useState({ isOpen: false, citaId: null, citaInfo: null });
  const [modalRecuperarPassword, setModalRecuperarPassword] = useState(false);
  const [modalCambiarPassword, setModalCambiarPassword] = useState(false);

  return (
    <ModalContext.Provider value={{
      modalAgendarCita, setModalAgendarCita,
      modalConfirmarCancelacion, setModalConfirmarCancelacion,
      modalRecuperarPassword, setModalRecuperarPassword,
      modalCambiarPassword, setModalCambiarPassword
    }}>
      {children}
      
      <ModalAgendarCita
        isOpen={modalAgendarCita.isOpen}
        onClose={() => setModalAgendarCita({ isOpen: false, clienteId: null })}
        clienteId={modalAgendarCita.clienteId}
      />
      
      <ModalConfirmarCancelacion
        isOpen={modalConfirmarCancelacion.isOpen}
        onClose={() => setModalConfirmarCancelacion({ isOpen: false, citaId: null, citaInfo: null })}
        citaInfo={modalConfirmarCancelacion.citaInfo}
        onConfirm={() => {
          // Lógica de cancelación
          setModalConfirmarCancelacion({ isOpen: false, citaId: null, citaInfo: null });
        }}
      />
      
      <ModalRecuperarPassword
        isOpen={modalRecuperarPassword}
        onClose={() => setModalRecuperarPassword(false)}
      />
      
      <ModalCambiarPassword
        isOpen={modalCambiarPassword}
        onClose={() => setModalCambiarPassword(false)}
      />
    </ModalContext.Provider>
  );
}

// Componente para rutas protegidas
const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, role, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(role)) return <Navigate to="/" />;
  return children;
};

// Layout para admin/staff
const AdminLayout = () => {
  const { logout, role } = useAuth();
  const [activeTab, setActiveTab] = React.useState('dashboard');
  const { setModalAgendarCita } = React.useContext(ModalContext);

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
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-lg border-b border-pink-100">
          <div className="px-4 py-3 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg overflow-hidden bg-transparent">
                <div className="text-2xl">💅</div>
              </div>
              <div>
                <h1 className="font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent text-lg">Salón Fresh Nails</h1>
                <p className="text-[10px] text-gray-400">Salón de Belleza Profesional</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button id="darkModeToggle" className="w-9 h-9 rounded-full bg-pink-50 dark:bg-gray-800 flex items-center justify-center shadow-md">
                <i id="darkModeIcon" className="fas fa-moon text-pink-500 text-sm"></i>
              </button>
              <button onClick={logout} className="w-9 h-9 rounded-full bg-pink-50 dark:bg-gray-800 flex items-center justify-center shadow-md">
                <i className="fas fa-sign-out-alt text-pink-500 text-sm"></i>
              </button>
            </div>
          </div>
          <div className="px-3 pb-2 overflow-x-auto">
            <div className="flex gap-1" style={{ scrollbarWidth: 'none' }}>
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
      </header>
      <main className="p-4 pb-24">
        <div className="flex justify-end mb-4">
          <button onClick={() => setModalAgendarCita({ isOpen: true, clienteId: null })} className="btn-primary text-white px-5 py-2 rounded-xl font-semibold flex items-center gap-2">
            <i className="fas fa-plus-circle"></i> Nueva cita
          </button>
        </div>
        {activeTab === 'dashboard' && <AdminDashboard />}
        {activeTab === 'agenda' && <Agenda />}
        {activeTab === 'clientes' && <Clientes />}
        {activeTab === 'servicios' && <Servicios />}
        {activeTab === 'historial' && <div>Historial de citas</div>}
        {activeTab === 'cancelaciones' && <Cancelaciones />}
        {activeTab === 'tienda' && <Tienda />}
        {activeTab === 'staff' && <div>Gestión de Staff</div>}
        {activeTab === 'galeria' && <Galeria />}
      </main>
    </div>
  );
};

function AppRoutes() {
  const { role } = useAuth();
  const { setModalRecuperarPassword, setModalCambiarPassword } = React.useContext(ModalContext);

  React.useEffect(() => {
    // Exponer funciones globales para los botones onclick
    window.abrirModalRecuperarPassword = () => setModalRecuperarPassword(true);
    window.abrirModalCambiarPassword = () => setModalCambiarPassword(true);
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route path="/admin" element={
        <PrivateRoute allowedRoles={['admin', 'staff']}>
          <AdminLayout />
        </PrivateRoute>
      } />
      
      <Route path="/dashboard" element={
        <PrivateRoute allowedRoles={['client']}>
          <ClientDashboard />
        </PrivateRoute>
      } />
      
      <Route path="/perfil" element={<Perfil />} />
      <Route path="/carrito" element={<Carrito />} />
      
      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ModalProvider>
          <Toaster position="top-right" />
          <AppRoutes />
        </ModalProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;