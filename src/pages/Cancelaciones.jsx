import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../config/supabase';
import toast from 'react-hot-toast';

export default function Cancelaciones() {
  const { db, loadData } = useAuth();
  const [cancelaciones, setCancelaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarCancelaciones = async () => {
      if (db) {
        setCancelaciones(db.cancelaciones || []);
        setLoading(false);
      } else {
        // Si db no está cargado, esperar
        await loadData();
        if (window.db?.cancelaciones) {
          setCancelaciones(window.db.cancelaciones);
        }
        setLoading(false);
      }
    };
    cargarCancelaciones();
  }, [db, loadData]);

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este registro de cancelación?')) return;
    
    const nuevasCancelaciones = cancelaciones.filter(c => c.id !== id);
    
    try {
      const { data, error } = await supabase
        .from('nail_data')
        .select('content')
        .eq('id', 1)
        .single();
      
      if (error) throw error;
      
      const dbData = JSON.parse(data.content);
      dbData.cancelaciones = nuevasCancelaciones;
      
      await supabase
        .from('nail_data')
        .upsert({ id: 1, content: JSON.stringify(dbData), updated_at: new Date().toISOString() });
      
      setCancelaciones(nuevasCancelaciones);
      await loadData();
      toast.success('Registro eliminado');
    } catch (error) {
      toast.error('Error al eliminar');
    }
  };

  if (loading) return <div className="p-8 text-center">Cargando...</div>;

  return (
    <div className="min-h-screen p-4" style={{ background: '#F2F2F2' }}>
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl p-5 mb-5 shadow-sm">
          <h1 className="text-xl font-bold" style={{ color: '#8C5E35' }}>📋 Historial de Cancelaciones</h1>
          <p className="text-sm text-gray-500">Registro de todas las citas canceladas</p>
        </div>

        {cancelaciones.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center text-gray-400">
            No hay cancelaciones registradas
          </div>
        ) : (
          <div className="space-y-3">
            {cancelaciones.slice().reverse().map(cancelacion => (
              <div key={cancelacion.id} className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-red-500">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold" style={{ color: '#8C5E35' }}>{cancelacion.clienteNombre}</p>
                    <p className="text-sm text-gray-500">{cancelacion.servicioNombre}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      📅 Original: {new Date(cancelacion.fechaOriginal).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-red-500">
                      ❌ Cancelada: {new Date(cancelacion.fechaCancelacion).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(cancelacion.id)}
                    className="text-red-500 p-2"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}