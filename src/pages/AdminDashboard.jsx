import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function AdminDashboard() {
  const { db, loadData } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    citasHoy: 0,
    clientas: 0,
    ingresos: 0,
    puntos: 0,
    ocupacion: 0,
    horaPico: '--:--',
    citasHoraPico: 0,
    diaEstrella: '---',
    citasDiaEstrella: 0,
    clienteTop: '---',
    visitasClienteTop: 0,
    totalSemana: 0,
    weeklyBars: [],
    ticketPromedio: 0,
    proyeccionMensual: 0,
    ratioFidelidad: 0,
    topServicio: '---',
    topServicioCount: 0,
    topServicioPercent: 0,
    servicioPremium: '---',
    servicioPremiumPrecio: 0,
    metaProgress: 0,
    ingresosActuales: 0,
    fraseMotivacional: ''
  });

  useEffect(() => {
    const cargarDatos = async () => {
      await loadData();
      setLoading(false);
    };
    cargarDatos();
  }, []);

  useEffect(() => {
    if (db && !loading) {
      calcularEstadisticas();
    }
  }, [db, loading]);

  const calcularEstadisticas = () => {
    const hoy = new Date().toISOString().split('T')[0];
    
    // Citas de hoy
    const citasHoy = db.appointments?.filter(c => c.date?.startsWith(hoy)).length || 0;
    
    // Total clientas
    const clientas = db.clients?.length || 0;
    
    // Puntos totales
    const puntos = db.clients?.reduce((sum, c) => sum + (c.points || 0), 0) || 0;
    
    // Ocupación (simulada basada en citas totales)
    const totalCitas = db.appointments?.length || 0;
    const ocupacion = Math.min(100, Math.round((totalCitas / 50) * 100));
    
    // Hora más demandada
    const horaCount = {};
    db.appointments?.forEach(c => {
      try {
        const hora = new Date(c.date).getHours();
        horaCount[hora] = (horaCount[hora] || 0) + 1;
      } catch (e) {}
    });
    let maxHora = 0, maxHoraCount = 0;
    for (let [hora, count] of Object.entries(horaCount)) {
      if (count > maxHoraCount) {
        maxHoraCount = count;
        maxHora = hora;
      }
    }
    
    // Día con más citas
    const dayCount = {};
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    db.appointments?.forEach(c => {
      try {
        const day = new Date(c.date).getDay();
        dayCount[day] = (dayCount[day] || 0) + 1;
      } catch (e) {}
    });
    let maxDay = 0, maxDayCount = 0;
    for (let [day, count] of Object.entries(dayCount)) {
      if (count > maxDayCount) {
        maxDayCount = count;
        maxDay = parseInt(day);
      }
    }
    
    // Cliente más fiel
    const clientCount = {};
    db.appointments?.forEach(c => {
      clientCount[c.clientId] = (clientCount[c.clientId] || 0) + 1;
    });
    let maxClientId = null, maxClientCount = 0;
    for (let [id, count] of Object.entries(clientCount)) {
      if (count > maxClientCount) {
        maxClientCount = count;
        maxClientId = parseInt(id);
      }
    }
    const topClient = db.clients?.find(c => c.id === maxClientId);
    
    // Distribución semanal
    const weekDays = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'];
    const appointmentsByDay = [0, 0, 0, 0, 0, 0, 0];
    db.appointments?.forEach(a => {
      try {
        const day = new Date(a.date).getDay();
        const idx = day === 0 ? 6 : day - 1;
        appointmentsByDay[idx]++;
      } catch (e) {}
    });
    const maxDayTotal = Math.max(...appointmentsByDay, 1);
    const totalSemana = appointmentsByDay.reduce((a, b) => a + b, 0);
    
    let weeklyBars = [];
    for (let i = 0; i < 7; i++) {
      const percent = (appointmentsByDay[i] / maxDayTotal) * 100;
      weeklyBars.push({ day: weekDays[i], count: appointmentsByDay[i], percent });
    }
    
    // Ticket promedio
    const citasConPrecio = db.appointments?.filter(a => a.price > 0) || [];
    const totalIngresos = citasConPrecio.reduce((sum, a) => sum + a.price, 0);
    const ticketProm = citasConPrecio.length > 0 ? Math.round(totalIngresos / citasConPrecio.length) : 0;
    
    // Proyección mensual
    const proyeccion = Math.round(ticketProm * 30);
    
    // Ratio de fidelidad (clientes con más de 2 citas)
    const clientesConCitas = new Map();
    db.appointments?.forEach(a => {
      clientesConCitas.set(a.clientId, (clientesConCitas.get(a.clientId) || 0) + 1);
    });
    const clientesFieles = Array.from(clientesConCitas.values()).filter(c => c >= 2).length;
    const ratioFidelidad = Math.round((clientesFieles / (clientesConCitas.size || 1)) * 100);
    
    // Servicio más popular
    const servicioCount = {};
    db.appointments?.forEach(c => {
      servicioCount[c.serviceId] = (servicioCount[c.serviceId] || 0) + 1;
    });
    let topServId = null, topServCount = 0;
    for (let [id, count] of Object.entries(servicioCount)) {
      if (count > topServCount) {
        topServCount = count;
        topServId = parseInt(id);
      }
    }
    const topServ = db.services?.find(s => s.id === topServId);
    const totalCitasServicios = Object.values(servicioCount).reduce((a, b) => a + b, 0);
    const topServPercent = totalCitasServicios > 0 ? (topServCount / totalCitasServicios) * 100 : 0;
    
    // Servicio más caro
    let servicioPremium = null, precioPremium = 0;
    db.services?.forEach(s => {
      if (s.price > precioPremium) {
        precioPremium = s.price;
        servicioPremium = s;
      }
    });
    
    // Meta mensual
    const metaMensualObj = 500000;
    const porcentajeMeta = Math.min(100, Math.round((totalIngresos / metaMensualObj) * 100));
    
    const frases = [
      '✨ "La excelencia no es un acto, es un hábito"',
      '🌟 "Cada cliente merece magia en sus manos"',
      '💅 "Los detalles hacen la diferencia"'
    ];
    
    setStats({
      citasHoy,
      clientas,
      ingresos: totalIngresos,
      puntos,
      ocupacion,
      horaPico: maxHoraCount > 0 ? `${maxHora}:00` : '--:--',
      citasHoraPico: maxHoraCount,
      diaEstrella: maxDayCount > 0 ? days[maxDay] : '---',
      citasDiaEstrella: maxDayCount,
      clienteTop: topClient?.name?.substring(0, 15) || '---',
      visitasClienteTop: maxClientCount,
      totalSemana,
      weeklyBars,
      ticketPromedio: ticketProm,
      proyeccionMensual: proyeccion,
      ratioFidelidad,
      topServicio: topServ?.name?.substring(0, 20) || '---',
      topServicioCount: topServCount,
      topServicioPercent: topServPercent,
      servicioPremium: servicioPremium?.name?.substring(0, 20) || '---',
      servicioPremiumPrecio: precioPremium,
      metaProgress: porcentajeMeta,
      ingresosActuales: totalIngresos,
      fraseMotivacional: frases[Math.floor(Math.random() * frases.length)]
    });
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Cargando estadísticas...</div>;
  }

  return (
    <div>
      {/* Tarjetas superiores */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="glass-card p-4">
          <div className="flex justify-between"><span className="text-gray-500">Citas Hoy</span><i className="fas fa-calendar-check text-pink-500"></i></div>
          <p className="text-3xl font-bold text-pink-600">{stats.citasHoy}</p>
        </div>
        <div className="glass-card p-4">
          <div className="flex justify-between"><span className="text-gray-500">Clientas</span><i className="fas fa-female text-pink-500"></i></div>
          <p className="text-3xl font-bold text-pink-600">{stats.clientas}</p>
        </div>
        <div className="glass-card p-4">
          <div className="flex justify-between"><span className="text-gray-500">Ingresos Semana</span><i className="fas fa-dollar-sign text-pink-500"></i></div>
          <p className="text-3xl font-bold text-pink-600">${stats.ingresos.toLocaleString()}</p>
        </div>
        <div className="glass-card p-4">
          <div className="flex justify-between"><span className="text-gray-500">Puntos totales</span><i className="fas fa-gem text-pink-500"></i></div>
          <p className="text-3xl font-bold text-pink-600">{stats.puntos}</p>
        </div>
      </div>

      {/* Panel de Control */}
      <div className="glass-card rounded-2xl p-5 mb-6 overflow-hidden">
        <div style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', borderRadius: '24px', padding: '1.5rem' }}>
          <div className="flex justify-between items-center mb-6">
            <div><h3 className="text-white text-xl font-bold">✨ Panel de Control</h3><p className="text-pink-300 text-xs">Estadísticas en tiempo real</p></div>
            <div className="flex gap-2"><div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div><span className="text-white/50 text-xs">Live</span></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {/* Ocupación */}
            <div className="bg-white/10 rounded-2xl p-3">
              <div className="flex justify-between items-start mb-2">
                <i className="fas fa-chart-line text-pink-400"></i>
                <span className="text-2xl font-bold text-white">{stats.ocupacion}</span>
              </div>
              <p className="text-white/60 text-xs">Ocupación</p>
              <div className="w-full bg-white/20 rounded-full h-1.5 mt-2">
                <div className="bg-gradient-to-r from-pink-500 to-rose-500 h-1.5 rounded-full" style={{ width: `${stats.ocupacion}%` }}></div>
              </div>
            </div>

            {/* Hora más demandada */}
            <div className="bg-white/10 rounded-2xl p-3">
              <div className="flex justify-between items-start mb-2">
                <i className="fas fa-clock text-pink-400"></i>
                <span className="text-2xl font-bold text-white">{stats.horaPico}</span>
              </div>
              <p className="text-white/60 text-xs">Hora más demandada</p>
              <p className="text-pink-300 text-xs">{stats.citasHoraPico} citas</p>
            </div>

            {/* Día con más citas */}
            <div className="bg-white/10 rounded-2xl p-3">
              <div className="flex justify-between items-start mb-2">
                <i className="fas fa-calendar-star text-pink-400"></i>
                <span className="text-xl font-bold text-white">{stats.diaEstrella}</span>
              </div>
              <p className="text-white/60 text-xs">Día con más citas</p>
              <p className="text-pink-300 text-xs">{stats.citasDiaEstrella} citas</p>
            </div>

            {/* Cliente más fiel */}
            <div className="bg-white/10 rounded-2xl p-3">
              <div className="flex justify-between items-start mb-2">
                <i className="fas fa-crown text-pink-400"></i>
                <span className="text-xl font-bold text-white">{stats.clienteTop}</span>
              </div>
              <p className="text-white/60 text-xs">Cliente más fiel</p>
              <p className="text-pink-300 text-xs">{stats.visitasClienteTop} visitas</p>
            </div>
          </div>

          {/* Distribución semanal */}
          <div className="mt-4">
            <div className="flex justify-between mb-3">
              <span className="text-white/70 text-xs">📊 Distribución semanal</span>
              <span className="text-white/40 text-xs">Total: {stats.totalSemana} citas</span>
            </div>
            <div className="space-y-2">
              {stats.weeklyBars.map(bar => (
                <div key={bar.day} className="flex items-center gap-3">
                  <span className="text-white/50 text-xs w-10">{bar.day}</span>
                  <div className="flex-1 bg-white/10 rounded-full h-6 overflow-hidden">
                    <div className="bg-gradient-to-r from-pink-500 to-rose-500 h-full rounded-full flex items-center justify-end px-2 transition-all duration-700" style={{ width: `${bar.percent}%` }}>
                      {bar.count > 0 && <span className="text-white text-xs font-bold">{bar.count}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-white/10 text-center">
            <p className="text-white/50 text-xs italic">{stats.fraseMotivacional}</p>
          </div>
        </div>
      </div>

      {/* Próximas Citas - Placeholder */}
      <div className="glass-card p-5 mb-6">
        <h3 className="font-bold"><i className="fas fa-clock text-pink-500 mr-2"></i>Próximas Citas</h3>
        <div className="text-center text-gray-400 py-8">No hay citas próximas</div>
      </div>

      {/* Inteligencia de Negocio */}
      <div className="glass-card rounded-2xl p-5">
        <div style={{ background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)', borderRadius: '24px', padding: '1.5rem' }}>
          <div className="flex justify-between items-center mb-5">
            <div>
              <h3 className="text-white text-xl font-bold"><i className="fas fa-chart-simple text-pink-400 mr-2"></i>Inteligencia de Negocio</h3>
              <p className="text-purple-300 text-xs">Métricas predictivas</p>
            </div>
            <div className="bg-white/10 rounded-full px-3 py-1">
              <span className="text-white/70 text-xs">{new Date().toLocaleDateString()}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white/5 rounded-2xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center"><i className="fas fa-receipt text-white text-sm"></i></div>
                <div><p className="text-white/50 text-xs">Ticket Promedio</p><p className="text-2xl font-bold text-white">${stats.ticketPromedio.toLocaleString()}</p></div>
              </div>
              <div className="text-purple-300 text-xs"><i className="fas fa-chart-line"></i> Basado en últimas citas</div>
            </div>

            <div className="bg-white/5 rounded-2xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center"><i className="fas fa-chart-line text-white text-sm"></i></div>
                <div><p className="text-white/50 text-xs">Proyección Mensual</p><p className="text-2xl font-bold text-white">${stats.proyeccionMensual.toLocaleString()}</p></div>
              </div>
              <div className="text-emerald-300 text-xs"><i className="fas fa-arrow-up"></i> Estimado mes actual</div>
            </div>

            <div className="bg-white/5 rounded-2xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center"><i className="fas fa-heart text-white text-sm"></i></div>
                <div><p className="text-white/50 text-xs">Clientas Fieles</p><p className="text-2xl font-bold text-white">{stats.ratioFidelidad}%</p></div>
              </div>
              <div className="text-amber-300 text-xs"><i className="fas fa-users"></i> Reincidencia</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gradient-to-r from-pink-900/30 to-purple-900/30 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3"><i className="fas fa-trophy text-yellow-500"></i><span className="text-white/60 text-xs">Top Servicio</span></div>
              <div className="flex justify-between items-center">
                <span className="text-white font-bold text-lg">{stats.topServicio}</span>
                <span className="text-pink-400 text-2xl font-bold">{stats.topServicioCount}</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-1.5 mt-2">
                <div className="bg-gradient-to-r from-pink-500 to-purple-500 h-1.5 rounded-full" style={{ width: `${stats.topServicioPercent}%` }}></div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-emerald-900/30 to-teal-900/30 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3"><i className="fas fa-gem text-emerald-400"></i><span className="text-white/60 text-xs">Ticket más alto</span></div>
              <div className="flex justify-between items-center">
                <span className="text-white font-bold text-lg">{stats.servicioPremium}</span>
                <span className="text-emerald-400 text-2xl font-bold">${stats.servicioPremiumPrecio.toLocaleString()}</span>
              </div>
              <div className="text-white/40 text-xs mt-2">💡 Servicio estrella</div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10">
            <div className="flex justify-between items-center mb-3">
              <span className="text-white/60 text-xs">🎯 Meta mensual</span>
              <span className="text-white/40 text-xs">{stats.metaProgress}% completado</span>
            </div>
            <div className="relative">
              <div className="w-full bg-white/10 rounded-full h-3">
                <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 h-3 rounded-full" style={{ width: `${stats.metaProgress}%` }}></div>
              </div>
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-white/40 text-xs">Ingresos actuales: <span>${stats.ingresosActuales.toLocaleString()}</span></span>
              <span className="text-white/40 text-xs">Meta: <span>$500.000</span></span>
            </div>
          </div>

          <div className="mt-4 text-center">
            <p className="text-white/30 text-[10px]">Última actualización: {new Date().toLocaleTimeString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}