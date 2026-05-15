import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Cancelaciones() {
  const { db } = useAuth();
  const [cancelaciones, setCancelaciones] = useState([]);

  useEffect(() => {
    if (db) {
      setCancelaciones(db.cancelaciones || []);
    }
  }, [db]);

  return (
    <div className="min-h-screen p-4" style={{ background: '#F2F2F2' }}>
      <div className="max-w-6xl mx-auto">
        <div className="glass-card p-4 mb-4">
          <h3 className="font-semibold text-gray-800">📋 Historial de Cancelaciones</h3>
          <p className="text-xs text-gray-400">Registro de todas las citas canceladas</p>
        </div>
        {cancelaciones.length === 0 ? (
          <div className="text-center text-gray-400 py-12">No hay cancelaciones registradas</div>
        ) : (
          <div className="space-y-2">
            {cancelaciones.slice().reverse().map(c => (
              <div key={c.id} className="bg-white rounded-xl p-4 border-l-4 border-red-500 shadow-sm">
                <p className="font-semibold">{c.clienteNombre}</p>
                <p className="text-sm text-gray-600">{c.servicioNombre}</p>
                <p className="text-xs text-gray-400">Cancelada: {new Date(c.fechaCancelacion).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}