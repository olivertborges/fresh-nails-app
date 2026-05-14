import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../config/supabase';
import toast from 'react-hot-toast';

export default function Servicios() {
  const { db, loadData } = useAuth();
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState(null);
  const [formData, setFormData] = useState({ name: '', price: '', duration: '30 min' });

  useEffect(() => {
    if (db) {
      setServicios(db.services || []);
      setLoading(false);
    }
  }, [db]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      toast.error('Nombre y precio son obligatorios');
      return;
    }

    let nuevosServicios;
    if (editando) {
      nuevosServicios = servicios.map(s => 
        s.id === editando.id ? { ...s, ...formData, price: parseInt(formData.price) } : s
      );
    } else {
      const nuevoServicio = {
        id: Date.now(),
        ...formData,
        price: parseInt(formData.price),
        recDays: 21,
        category: 'Manicura'
      };
      nuevosServicios = [...servicios, nuevoServicio];
    }

    try {
      const { data, error } = await supabase
        .from('nail_data')
        .select('content')
        .eq('id', 1)
        .single();
      
      if (error) throw error;
      
      const dbData = JSON.parse(data.content);
      dbData.services = nuevosServicios;
      
      await supabase
        .from('nail_data')
        .upsert({ id: 1, content: JSON.stringify(dbData), updated_at: new Date().toISOString() });
      
      setServicios(nuevosServicios);
      await loadData();
      toast.success(editando ? 'Servicio actualizado' : 'Servicio agregado');
      setModalOpen(false);
      setFormData({ name: '', price: '', duration: '30 min' });
      setEditando(null);
    } catch (error) {
      toast.error('Error al guardar');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este servicio?')) return;
    
    const nuevosServicios = servicios.filter(s => s.id !== id);
    
    try {
      const { data, error } = await supabase
        .from('nail_data')
        .select('content')
        .eq('id', 1)
        .single();
      
      if (error) throw error;
      
      const dbData = JSON.parse(data.content);
      dbData.services = nuevosServicios;
      
      await supabase
        .from('nail_data')
        .upsert({ id: 1, content: JSON.stringify(dbData), updated_at: new Date().toISOString() });
      
      setServicios(nuevosServicios);
      await loadData();
      toast.success('Servicio eliminado');
    } catch (error) {
      toast.error('Error al eliminar');
    }
  };

  const handleEdit = (servicio) => {
    setEditando(servicio);
    setFormData({ name: servicio.name, price: servicio.price, duration: servicio.duration || '30 min' });
    setModalOpen(true);
  };

  if (loading) return <div className="p-8 text-center">Cargando...</div>;

  return (
    <div className="min-h-screen p-4" style={{ background: '#F2F2F2' }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-xl font-bold" style={{ color: '#8C5E35' }}>💅 Servicios</h1>
          <button
            onClick={() => { setEditando(null); setFormData({ name: '', price: '', duration: '30 min' }); setModalOpen(true); }}
            className="px-4 py-2 rounded-full text-sm font-semibold"
            style={{ background: '#D9AE79', color: '#8C5E35' }}
          >
            + Nuevo Servicio
          </button>
        </div>

        {servicios.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center text-gray-400">No hay servicios registrados</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-3">
            {servicios.map(servicio => (
              <div key={servicio.id} className="bg-white rounded-xl p-4 shadow-sm flex justify-between items-center">
                <div>
                  <p className="font-semibold" style={{ color: '#8C5E35' }}>{servicio.name}</p>
                  <p className="text-sm text-gray-500">${servicio.price.toLocaleString()} | {servicio.duration || '30 min'}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(servicio)} className="text-amber-600">✏️</button>
                  <button onClick={() => handleDelete(servicio.id)} className="text-red-500">🗑️</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full">
              <h2 className="text-xl font-bold mb-4" style={{ color: '#8C5E35' }}>{editando ? 'Editar Servicio' : 'Nuevo Servicio'}</h2>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Nombre del servicio *"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 border border-amber-200 rounded-xl mb-3"
                  required
                />
                <input
                  type="number"
                  placeholder="Precio *"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full p-3 border border-amber-200 rounded-xl mb-3"
                  required
                />
                <input
                  type="text"
                  placeholder="Duración (ej: 45 min)"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full p-3 border border-amber-200 rounded-xl mb-4"
                />
                <div className="flex gap-3">
                  <button type="button" onClick={() => { setModalOpen(false); setEditando(null); }} className="flex-1 py-2 rounded-full bg-gray-200">Cancelar</button>
                  <button type="submit" className="flex-1 py-2 rounded-full font-semibold" style={{ background: '#D9AE79', color: '#8C5E35' }}>Guardar</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}