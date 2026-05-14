import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../config/supabase';
import toast from 'react-hot-toast';

export default function Perfil() {
  const { user, db, loadData } = useAuth();
  const [cliente, setCliente] = useState(null);
  const [citas, setCitas] = useState([]);
  const [referidos, setReferidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cambiandoPass, setCambiandoPass] = useState(false);
  const [passData, setPassData] = useState({ actual: '', nueva: '', confirmar: '' });

  useEffect(() => {
    if (db && user) {
      const clienteData = db.clients?.find(c => c.name === user.name);
      setCliente(clienteData);
      if (clienteData) {
        setCitas(db.appointments?.filter(c => c.clientId === clienteData.id) || []);
        setReferidos(db.clients?.filter(c => c.refBy === clienteData.id) || []);
      }
      setLoading(false);
    }
  }, [db, user]);

  const cambiarPassword = async () => {
    if (passData.nueva !== passData.confirmar) {
      toast.error('Las contraseñas no coinciden');
      return;
    }
    if (passData.nueva.length < 4) {
      toast.error('La contraseña debe tener al menos 4 caracteres');
      return;
    }

    const usuario = db.users?.find(u => u.name === user.name);
    if (usuario && usuario.password !== passData.actual) {
      toast.error('Contraseña actual incorrecta');
      return;
    }

    if (usuario) {
      usuario.password = passData.nueva;
      const { data, error } = await supabase
        .from('nail_data')
        .select('content')
        .eq('id', 1)
        .single();
      
      if (error) return;
      
      const dbData = JSON.parse(data.content);
      const userIndex = dbData.users.findIndex(u => u.name === user.name);
      dbData.users[userIndex].password = passData.nueva;
      
      await supabase
        .from('nail_data')
        .upsert({ id: 1, content: JSON.stringify(dbData), updated_at: new Date().toISOString() });
      
      await loadData();
      toast.success('Contraseña actualizada');
      setCambiandoPass(false);
      setPassData({ actual: '', nueva: '', confirmar: '' });
    }
  };

  const copiarCodigo = () => {
    navigator.clipboard.writeText(cliente?.codigoReferido || '');
    toast.success('Código copiado');
  };

  if (loading) return <div className="p-8 text-center">Cargando...</div>;
  if (!cliente) return <div className="p-8 text-center">No se encontró el perfil</div>;

  return (
    <div className="min-h-screen p-4" style={{ background: '#F2F2F2' }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl p-5 mb-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="text-5xl">👤</div>
            <div>
              <h1 className="text-xl font-bold" style={{ color: '#8C5E35' }}>{cliente.name}</h1>
              <p className="text-sm text-gray-500">{cliente.email || 'Sin email'} | {cliente.phone || 'Sin teléfono'}</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <p className="text-2xl font-bold" style={{ color: '#D9AE79' }}>{cliente.points || 0}</p>
            <p className="text-xs text-gray-500">Puntos</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <p className="text-2xl font-bold" style={{ color: '#D9AE79' }}>{citas.length}</p>
            <p className="text-xs text-gray-500">Citas</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <p className="text-2xl font-bold" style={{ color: '#D9AE79' }}>{referidos.length}</p>
            <p className="text-xs text-gray-500">Referidos</p>
          </div>
        </div>

        {/* Código de referido */}
        <div className="bg-gradient-to-r from-teal-100 to-teal-50 rounded-xl p-4 mb-5">
          <p className="text-sm font-semibold text-teal-700 mb-2">🎁 Código de invitación</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={cliente.codigoReferido || ''}
              readOnly
              className="flex-1 bg-white border border-teal-200 rounded-lg px-3 py-2 text-sm font-mono"
            />
            <button onClick={copiarCodigo} className="bg-teal-500 text-white px-4 py-2 rounded-lg text-sm">Copiar</button>
          </div>
          <p className="text-xs text-gray-500 mt-2">Cada amiga que se registre te da 500 puntos</p>
        </div>

        {/* Cambiar contraseña */}
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <button
            onClick={() => setCambiandoPass(!cambiandoPass)}
            className="text-sm font-semibold"
            style={{ color: '#D9AE79' }}
          >
            🔑 {cambiandoPass ? 'Cancelar' : 'Cambiar contraseña'}
          </button>
          
          {cambiandoPass && (
            <div className="mt-4 space-y-3">
              <input
                type="password"
                placeholder="Contraseña actual"
                value={passData.actual}
                onChange={(e) => setPassData({ ...passData, actual: e.target.value })}
                className="w-full p-3 border border-amber-200 rounded-xl"
              />
              <input
                type="password"
                placeholder="Nueva contraseña"
                value={passData.nueva}
                onChange={(e) => setPassData({ ...passData, nueva: e.target.value })}
                className="w-full p-3 border border-amber-200 rounded-xl"
              />
              <input
                type="password"
                placeholder="Confirmar contraseña"
                value={passData.confirmar}
                onChange={(e) => setPassData({ ...passData, confirmar: e.target.value })}
                className="w-full p-3 border border-amber-200 rounded-xl"
              />
              <button
                onClick={cambiarPassword}
                className="w-full py-2 rounded-full font-semibold"
                style={{ background: '#D9AE79', color: '#8C5E35' }}
              >
                Actualizar contraseña
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}