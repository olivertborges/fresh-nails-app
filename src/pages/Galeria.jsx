import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../config/supabase';
import toast from 'react-hot-toast';

export default function Galeria() {
  const { db, loadData } = useAuth();
  const [fotos, setFotos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [formData, setFormData] = useState({ clientId: '', url: '' });

  useEffect(() => {
    if (db) {
      setFotos(db.photos || []);
      setClientes(db.clients || []);
      setLoading(false);
    }
  }, [db]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.clientId || !formData.url) {
      toast.error('Selecciona una clienta y una imagen');
      return;
    }

    const nuevaFoto = {
      id: Date.now(),
      clientId: parseInt(formData.clientId),
      url: formData.url,
      date: new Date().toISOString()
    };

    const nuevasFotos = [...fotos, nuevaFoto];

    try {
      const { data, error } = await supabase
        .from('nail_data')
        .select('content')
        .eq('id', 1)
        .single();
      
      if (error) throw error;
      
      const dbData = JSON.parse(data.content);
      dbData.photos = nuevasFotos;
      
      await supabase
        .from('nail_data')
        .upsert({ id: 1, content: JSON.stringify(dbData), updated_at: new Date().toISOString() });
      
      setFotos(nuevasFotos);
      await loadData();
      toast.success('Foto agregada');
      setModalOpen(false);
      setFormData({ clientId: '', url: '' });
    } catch (error) {
      toast.error('Error al guardar');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar esta foto?')) return;
    
    const nuevasFotos = fotos.filter(f => f.id !== id);
    
    try {
      const { data, error } = await supabase
        .from('nail_data')
        .select('content')
        .eq('id', 1)
        .single();
      
      if (error) throw error;
      
      const dbData = JSON.parse(data.content);
      dbData.photos = nuevasFotos;
      
      await supabase
        .from('nail_data')
        .upsert({ id: 1, content: JSON.stringify(dbData), updated_at: new Date().toISOString() });
      
      setFotos(nuevasFotos);
      await loadData();
      toast.success('Foto eliminada');
    } catch (error) {
      toast.error('Error al eliminar');
    }
  };

  if (loading) return <div className="p-8 text-center">Cargando...</div>;

  return (
    <div className="min-h-screen p-4" style={{ background: '#F2F2F2' }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-xl font-bold" style={{ color: '#8C5E35' }}>📸 Galería de Trabajos</h1>
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 rounded-full text-sm font-semibold"
            style={{ background: '#D9AE79', color: '#8C5E35' }}
          >
            + Subir Foto
          </button>
        </div>

        {fotos.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center text-gray-400">No hay fotos en la galería</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {fotos.map(foto => {
              const cliente = clientes.find(c => c.id === foto.clientId);
              return (
                <div key={foto.id} className="bg-white rounded-xl overflow-hidden shadow-sm">
                  <img 
                    src={foto.url} 
                    alt={cliente?.name} 
                    className="w-full h-48 object-cover cursor-pointer"
                    onClick={() => setSelectedImage(foto.url)}
                  />
                  <div className="p-2 flex justify-between items-center">
                    <p className="text-sm font-semibold" style={{ color: '#8C5E35' }}>{cliente?.name || 'Cliente'}</p>
                    <button onClick={() => handleDelete(foto.id)} className="text-red-500">🗑️</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal de imagen grande */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4" onClick={() => setSelectedImage(null)}>
            <img src={selectedImage} alt="Ampliada" className="max-w-full max-h-full rounded-xl" />
          </div>
        )}

        {/* Modal de subir foto */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full">
              <h2 className="text-xl font-bold mb-4" style={{ color: '#8C5E35' }}>Subir Foto</h2>
              <form onSubmit={handleSubmit}>
                <select
                  value={formData.clientId}
                  onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                  className="w-full p-3 border border-amber-200 rounded-xl mb-3"
                  required
                >
                  <option value="">Seleccionar clienta</option>
                  {clientes.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <input
                  type="url"
                  placeholder="URL de la imagen"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="w-full p-3 border border-amber-200 rounded-xl mb-4"
                  required
                />
                <div className="flex gap-3">
                  <button type="button" onClick={() => { setModalOpen(false); setFormData({ clientId: '', url: '' }); }} className="flex-1 py-2 rounded-full bg-gray-200">Cancelar</button>
                  <button type="submit" className="flex-1 py-2 rounded-full font-semibold" style={{ background: '#D9AE79', color: '#8C5E35' }}>Subir</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}