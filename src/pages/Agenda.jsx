import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Agenda() {
  const { db } = useAuth();
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (db) {
      setCitas(db.appointments || []);
      setLoading(false);
    }
  }, [db]);

  if (loading) {
    return <div className="p-8 text-center">Cargando agenda...</div>;
  }

  return (
    <div className="min-h-screen p-4" style={{ background: '#F2F2F2' }}>
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl p-5 mb-5 shadow-sm">
          <h1 className="text-xl font-bold" style={{ color: '#8C5E35' }}>📅 Agenda de Citas</h1>
          <p className="text-sm text-gray-500">Próximas citas</p>
        </div>

        {citas.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center text-gray-400">No hay citas agendadas</div>
        ) : (
          <div className="space-y-3">
            {citas.map(cita => {
              const cliente = db.clients?.find(c => c.id === cita.clientId);
              const servicio = db.services?.find(s => s.id === cita.serviceId);
              const fecha = new Date(cita.date);
              return (
                <div key={cita.id} className="bg-white rounded-xl p-4 shadow-sm flex justify-between items-center">
                  <div>
                    <p className="font-semibold" style={{ color: '#8C5E35' }}>{cliente?.name || 'Cliente'}</p>
                    <p className="text-sm text-gray-500">{servicio?.name}</p>
                    <p className="text-xs text-gray-400">{fecha.toLocaleDateString()} - {fecha.toLocaleTimeString()}</p>
                  </div>
                  <button className="text-red-500 text-sm">Cancelar</button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}