import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';
import toast from 'react-hot-toast';

export default function Register() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre) {
      toast.error('El nombre es obligatorio');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('nail_data')
        .select('content')
        .eq('id', 1)
        .single();

      if (error) throw error;

      const db = JSON.parse(data.content);
      const nuevoId = Date.now();

      const nuevoCliente = {
        id: nuevoId,
        name: nombre,
        phone: telefono || '',
        email: email || '',
        points: 100,
        totalSpent: 0,
        fechaRegistro: new Date().toISOString(),
        codigoReferido: `FRESH${nombre.substring(0, 3).toUpperCase()}${nuevoId.toString().slice(-4)}`
      };

      const username = email || nombre.toLowerCase().replace(/\s/g, '');
      const nuevoUsuario = {
        id: nuevoId,
        username: username,
        password: "1234",
        name: nombre,
        role: "client",
        services: []
      };

      if (!db.users.find(u => u.username === username)) {
        db.users.push(nuevoUsuario);
      }

      db.clients.push(nuevoCliente);

      await supabase
        .from('nail_data')
        .upsert({ id: 1, content: JSON.stringify(db), updated_at: new Date().toISOString() });

      toast.success(`¡Registro exitoso, ${nombre}!`);
      toast.success(`Usuario: ${username} | Contraseña: 1234`);
      
      navigate('/login');
      
    } catch (error) {
      console.error(error);
      toast.error('Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#F9F3E6' }}>
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 w-full max-w-md border border-amber-200">
        <div className="text-center mb-6">
          <div className="text-6xl mb-3">💅</div>
          <h2 className="text-2xl font-bold" style={{ color: '#D9AE79' }}>Registrarse</h2>
          <p className="text-gray-500 text-sm">Crea tu cuenta gratis</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-amber-200 focus:outline-none focus:border-amber-500"
              placeholder="Nombre completo *"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-amber-200 focus:outline-none focus:border-amber-500"
              placeholder="Correo electrónico"
            />
          </div>
          <div className="mb-6">
            <input
              type="tel"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-amber-200 focus:outline-none focus:border-amber-500"
              placeholder="Teléfono"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full font-semibold transition-all"
            style={{ background: 'linear-gradient(135deg, #D9AE79, #c49a5e)', color: '#8C5E35' }}
          >
            {loading ? 'Registrando...' : 'REGISTRARSE'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link to="/login" className="text-sm" style={{ color: '#D9AE79' }}>¿Ya tienes cuenta? Inicia sesión</Link>
        </div>

        <div className="mt-4 text-center text-xs text-gray-400">
          Al registrarte recibes 100 puntos de bienvenida
        </div>
      </div>
    </div>
  );
}