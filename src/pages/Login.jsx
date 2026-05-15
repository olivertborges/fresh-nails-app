import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG } from '../config/emailjs';

// Dentro de una función async
const enviarEmail = async () => {
  const templateParams = {
    to_email: 'cliente@email.com',
    to_name: 'Cliente',
    codigo: '123456'
  };

  try {
    const response = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID,
      templateParams
    );
    console.log('Email enviado:', response);
  } catch (error) {
    console.error('Error:', error);
  }
};

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error('Ingresa usuario y contraseña');
      return;
    }

    setLoading(true);
    const result = await login(username, password);
    
    if (result.success) {
      toast.success('Bienvenido/a');
      if (result.role === 'client') {
        navigate('/dashboard');
      } else {
        navigate('/admin');
      }
    } else {
      toast.error(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#F9F3E6' }}>
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 w-full max-w-md border border-amber-200">
        <div className="text-center mb-6">
          <div className="text-6xl mb-3">💅</div>
          <h2 className="text-2xl font-bold" style={{ color: '#D9AE79' }}>Salón Fresh Nails</h2>
          <p className="text-gray-500 text-sm">Salón de Belleza Profesional</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-amber-200 focus:outline-none focus:border-amber-500"
              placeholder="admin"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-amber-200 focus:outline-none focus:border-amber-500"
              placeholder="••••"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full font-semibold transition-all"
            style={{ background: 'linear-gradient(135deg, #D9AE79, #c49a5e)', color: '#8C5E35' }}
          >
            {loading ? 'Cargando...' : 'INGRESAR'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link to="/register" className="text-sm" style={{ color: '#D9AE79' }}>¿No tienes cuenta? Regístrate</Link>
        </div>

        <div className="mt-4 text-center text-xs text-gray-400">
          Demo: aniexis/1234 | cliente/1234
        </div>
      </div>
    </div>
  );
}