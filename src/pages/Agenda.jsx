import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Agenda() {
  const { db } = useAuth();
  const [citas, setCitas] = useState([]);
  const [currentWeek, setCurrentWeek] = useState(0);

  useEffect(() => {
    if (db) {
      setCitas(db.appointments || []);
    }
  }, [db]);

  const getWeekDates = () => {
    const now = new Date();
    const current = new Date(now);
    current.setDate(now.getDate() + (currentWeek * 7));
    const day = current.getDay();
    const diff = current.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(current.setDate(diff));
    const week = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      week.push(date);
    }
    return week;
  };

  const weekDates = getWeekDates();
  const diasSemana = ['LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO', 'DOMINGO'];

  return (
    <div className="min-h-screen p-4" style={{ background: '#F2F2F2' }}>
      <div className="max-w-6xl mx-auto">
        <div className="glass-card rounded-2xl p-4 mb-4">
          <div className="flex justify-between items-center">
            <button onClick={() => setCurrentWeek(currentWeek - 1)} className="w-10 h-10 rounded-full bg-pink-100 text-pink-600">←</button>
            <h3 className="font-bold text-gray-800">
              {weekDates[0]?.toLocaleDateString()} - {weekDates[6]?.toLocaleDateString()}
            </h3>
            <button onClick={() => setCurrentWeek(currentWeek + 1)} className="w-10 h-10 rounded-full bg-pink-100 text-pink-600">→</button>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 overflow-x-auto">
          <div className="calendario-grid min-w-[800px]">
            <div className="calendario-header grid grid-cols-8 bg-pink-50 border-b-2 border-pink-500">
              <div className="p-2 text-center font-bold">Hora</div>
              {weekDates.map((date, idx) => (
                <div key={idx} className="p-2 text-center">
                  <div className="font-bold text-pink-600">{diasSemana[idx]}</div>
                  <div className="text-2xl font-bold">{date.getDate()}</div>
                </div>
              ))}
            </div>
            {[9,10,11,12,13,14,15,16,17,18,19,20].map(hora => (
              <div key={hora} className="calendario-fila grid grid-cols-8 border-b">
                <div className="p-2 text-center font-medium text-pink-500">{hora}:00</div>
                {weekDates.map((date, idx) => {
                  const fechaStr = date.toISOString().split('T')[0];
                  const citaEnHora = citas.find(c => c.date?.startsWith(fechaStr) && new Date(c.date).getHours() === hora);
                  return (
                    <div key={idx} className="p-1 min-h-[70px] border">
                      {citaEnHora && (
                        <div className="bg-white rounded-lg p-1 text-xs border-l-3 border-pink-500">
                          <p className="font-semibold">{db.clients?.find(c => c.id === citaEnHora.clientId)?.name}</p>
                          <p className="text-gray-500">{db.services?.find(s => s.id === citaEnHora.serviceId)?.name}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}