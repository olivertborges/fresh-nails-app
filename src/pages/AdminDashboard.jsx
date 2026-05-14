import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function AdminDashboard() {
  const { db } = useAuth();
  const [stats, setStats] = useState({ citasHoy: 0, clientes: 0, ingresos: 0, puntos: 0 });

  useEffect(() => {
    if (db) {
      const hoy = new Date().toISOString().split('T')[0];
      const citasHoy = db.appointments?.filter(c => c.date?.startsWith(hoy)).length || 0;
      const clientes = db.clients?.length || 0;
      const puntos = db.clients?.reduce((sum, c) => sum + (c.points || 0), 0) || 0;
      setStats({ citasHoy, clientes, ingresos: 0, puntos });
    }
  }, [db]);

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="glass-card p-4">
          <div className="flex justify-between"><span className="text-gray-500">Citas Hoy</span><i className="fas fa-calendar-check text-pink-500"></i></div>
          <p className="text-3xl font-bold text-pink-600">{stats.citasHoy}</p>
        </div>
        <div className="glass-card p-4">
          <div className="flex justify-between"><span className="text-gray-500">Clientas</span><i className="fas fa-female text-pink-500"></i></div>
          <p className="text-3xl font-bold text-pink-600">{stats.clientes}</p>
        </div>
        <div className="glass-card p-4">
          <div className="flex justify-between"><span className="text-gray-500">Ingresos</span><i className="fas fa-dollar-sign text-pink-500"></i></div>
          <p className="text-3xl font-bold text-pink-600">${stats.ingresos}</p>
        </div>
        <div className="glass-card p-4">
          <div className="flex justify-between"><span className="text-gray-500">Puntos totales</span><i className="fas fa-gem text-pink-500"></i></div>
          <p className="text-3xl font-bold text-pink-600">{stats.puntos}</p>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-5 mb-6 overflow-hidden">
        <div style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', borderRadius: '24px', padding: '1.5rem' }}>
          <h3 className="text-white text-xl font-bold mb-4">✨ Panel de Control</h3>
          <p className="text-white/50 text-sm">Estadísticas y métricas en tiempo real</p>
        </div>
      </div>
    </div>
  );
}