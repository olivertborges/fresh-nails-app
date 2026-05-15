import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  User, 
  Scissors, 
  Filter,
  RefreshCw,
  X,
  Bell,
  CalendarDays,
  CalendarClock,
  Plus,
  Briefcase,
  Calendar as CalendarIcon,
  Heart,
  Sparkles,
  Star,
  Check
} from 'lucide-react';
import { supabase } from '../config/supabase';
import toast from 'react-hot-toast';

const serviceColors = {
  'Manicura': 'border-l-pink-400 bg-pink-50',
  'Pedicura': 'border-l-teal-400 bg-teal-50',
  'Esmaltado': 'border-l-amber-400 bg-amber-50',
  'default': 'border-l-[#FE5668] bg-rose-50'
};

export default function Agenda() {
  const { db, loadData } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [citas, setCitas] = useState([]);
  const [profesionales, setProfesionales] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [selectedCita, setSelectedCita] = useState(null);
  const [filterProfesional, setFilterProfesional] = useState('all');
  const [filterServicio, setFilterServicio] = useState('all');
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('week');
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formData, setFormData] = useState({
    clienteId: '',
    servicioId: '',
    staffId: '',
    fecha: '',
    hora: '',
    notas: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (db) {
      setCitas(db.appointments || []);
      setProfesionales(db.staff || []);
      setServicios(db.services || []);
      setClientes(db.clients || []);
      setLoading(false);
    }
  }, [db]);

  const getWeekDates = useCallback(() => {
    const week = [];
    const current = new Date(currentDate);
    const day = current.getDay();
    const diff = current.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(current.setDate(diff));
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      week.push(date);
    }
    return week;
  }, [currentDate]);

  const displayDates = view === 'week' ? getWeekDates() : [currentDate];
  const hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

  const getCitasForDayAndHour = (date, hour) => {
    const fechaStr = date.toISOString().split('T')[0];
    return citas.filter(cita => {
      if (!cita.date) return false;
      const citaFecha = cita.date.split('T')[0];
      if (citaFecha !== fechaStr) return false;
      const citaHora = new Date(cita.date).getHours();
      return citaHora === hour;
    });
  };

  const handleCellClick = (date, hour) => {
    setFormData({
      clienteId: '',
      servicioId: '',
      staffId: '',
      fecha: date.toISOString().split('T')[0],
      hora: `${hour}:00`,
      notas: ''
    });
    setShowModal(true);
  };

  const handleSubmitCita = async (e) => {
    e.preventDefault();
    if (!formData.clienteId || !formData.servicioId) {
      toast.error('Completa los campos obligatorios');
      return;
    }

    setSubmitting(true);

    try {
      const servicio = servicios.find(s => s.id === parseInt(formData.servicioId));
      const fechaHora = new Date(`${formData.fecha}T${formData.hora}:00`);
      
      const nuevaCita = {
        id: Date.now(),
        clientId: parseInt(formData.clienteId),
        serviceId: parseInt(formData.servicioId),
        staffId: formData.staffId ? parseInt(formData.staffId) : null,
        date: fechaHora.toISOString(),
        price: servicio?.price || 0,
        notes: formData.notas,
        status: 'pendiente'
      };

      const { data, error } = await supabase
        .from('nail_data')
        .select('content')
        .eq('id', 1)
        .single();

      if (error) throw error;

      const dbData = JSON.parse(data.content);
      dbData.appointments.push(nuevaCita);
      
      const cliente = dbData.clients.find(c => c.id === parseInt(formData.clienteId));
      if (cliente && servicio) {
        cliente.points = (cliente.points || 0) + Math.floor(servicio.price);
        cliente.totalSpent = (cliente.totalSpent || 0) + servicio.price;
      }

      await supabase
        .from('nail_data')
        .upsert({ id: 1, content: JSON.stringify(dbData), updated_at: new Date().toISOString() });

      await loadData();
      setShowModal(false);
      setShowSuccessModal(true);
      setTimeout(() => setShowSuccessModal(false), 3000);
      
    } catch (error) {
      console.error(error);
      toast.error('Error al agendar la cita');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendReminder = async (cita) => {
    const cliente = db?.clients?.find(c => c.id === cita.clientId);
    if (cliente?.email) {
      toast.success(`Recordatorio enviado a ${cliente.email}`);
    } else {
      toast.error('El cliente no tiene email registrado');
    }
    setSelectedCita(null);
  };

  const diasSemana = ['LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO', 'DOMINGO'];
  const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  const filteredCitas = (citasList) => {
    return citasList.filter(cita => {
      if (filterProfesional !== 'all' && cita.staffId !== parseInt(filterProfesional)) return false;
      if (filterServicio !== 'all' && cita.serviceId !== parseInt(filterServicio)) return false;
      return true;
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="w-12 h-12 border-4 border-[#FE5668] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500">Cargando agenda...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Agenda Inteligente</h1>
            <p className="text-gray-500 mt-1">Gestiona tus citas de forma profesional</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button onClick={() => setCurrentDate(new Date())} className="px-4 py-2 bg-white border rounded-lg text-gray-700 hover:border-[#FE5668] transition-all text-sm">
              <CalendarIcon size={16} className="inline mr-1" /> Hoy
            </button>
            <button onClick={() => setView(view === 'week' ? 'day' : 'week')} className="px-4 py-2 bg-white border rounded-lg text-gray-700 hover:border-[#FE5668] transition-all text-sm">
              {view === 'week' ? <CalendarDays size={16} className="inline mr-1" /> : <CalendarClock size={16} className="inline mr-1" />}
              {view === 'week' ? 'Vista Día' : 'Vista Semana'}
            </button>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border">
            <Filter size={16} className="text-[#FE5668]" />
            <select value={filterProfesional} onChange={(e) => setFilterProfesional(e.target.value)} className="bg-transparent text-sm focus:outline-none">
              <option value="all">Todos los profesionales</option>
              {profesionales.map(prof => <option key={prof.id} value={prof.id}>{prof.name}</option>)}
            </select>
          </div>
          
          <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border">
            <Scissors size={16} className="text-[#FE5668]" />
            <select value={filterServicio} onChange={(e) => setFilterServicio(e.target.value)} className="bg-transparent text-sm focus:outline-none">
              <option value="all">Todos los servicios</option>
              {servicios.map(serv => <option key={serv.id} value={serv.id}>{serv.name}</option>)}
            </select>
          </div>
          
          <button onClick={() => { setFilterProfesional('all'); setFilterServicio('all'); }} className="px-3 py-2 text-gray-500 hover:text-[#FE5668]">
            <RefreshCw size={16} />
          </button>
        </div>

        {/* Navegación */}
        <div className="flex items-center justify-between bg-white rounded-xl p-3 shadow-sm">
          <button onClick={() => { const d = new Date(currentDate); d.setDate(currentDate.getDate() - (view === 'week' ? 7 : 1)); setCurrentDate(d); }} className="p-2 rounded-lg hover:bg-gray-100">
            <ChevronLeft size={20} />
          </button>
          <div className="text-center">
            <p className="text-sm text-gray-500">{meses[currentDate.getMonth()]}</p>
            <p className="text-lg font-semibold">
              {view === 'week' 
                ? `${displayDates[0]?.getDate()} - ${displayDates[6]?.getDate()}, ${currentDate.getFullYear()}`
                : `${currentDate.getDate()} de ${meses[currentDate.getMonth()]}, ${currentDate.getFullYear()}`
              }
            </p>
          </div>
          <button onClick={() => { const d = new Date(currentDate); d.setDate(currentDate.getDate() + (view === 'week' ? 7 : 1)); setCurrentDate(d); }} className="p-2 rounded-lg hover:bg-gray-100">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Calendario */}
      <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Cabecera */}
          <div className="grid border-b" style={{ gridTemplateColumns: `80px repeat(${displayDates.length}, 1fr)` }}>
            <div className="p-3 border-r bg-gray-50 font-semibold text-gray-500 text-center text-sm">Hora</div>
            {displayDates.map((date, idx) => (
              <div key={idx} className={`p-3 text-center border-r ${date.toDateString() === new Date().toDateString() ? 'bg-[#FE5668]/5' : ''}`}>
                <p className="text-xs text-gray-400">{view === 'week' ? diasSemana[idx] : ''}</p>
                <p className={`text-xl font-bold ${date.toDateString() === new Date().toDateString() ? 'text-[#FE5668]' : 'text-gray-700'}`}>{date.getDate()}</p>
              </div>
            ))}
          </div>

          {/* Horas */}
          {hours.map((hora) => {
            const horaStr = `${hora}:00`;
            return (
              <div key={hora} className="grid border-b hover:bg-gray-50" style={{ gridTemplateColumns: `80px repeat(${displayDates.length}, 1fr)` }}>
                <div className="p-3 border-r bg-gray-50 text-center">
                  <p className="text-sm font-medium text-gray-600">{horaStr}</p>
                  <p className="text-[10px] text-gray-400">{hora === 12 ? 'M' : hora < 12 ? 'AM' : 'PM'}</p>
                </div>
                {displayDates.map((date, colIdx) => {
                  const citasEnHora = getCitasForDayAndHour(date, hora);
                  const citasFiltradas = filteredCitas(citasEnHora);
                  const isAvailable = citasFiltradas.length === 0;
                  return (
                    <div 
                      key={colIdx} 
                      className={`p-1 min-h-[80px] border-r cursor-pointer transition ${isAvailable ? 'hover:bg-green-50' : ''}`}
                      onClick={() => handleCellClick(date, hora)}
                    >
                      {isAvailable && (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                          <Plus size={20} className="text-gray-300 group-hover:text-green-500" />
                          <span className="text-[10px] text-gray-400">Agendar</span>
                        </div>
                      )}
                      {citasFiltradas.map((cita) => {
                        const servicio = servicios.find(s => s.id === cita.serviceId);
                        const cliente = db?.clients?.find(c => c.id === cita.clientId);
                        return (
                          <div
                            key={cita.id}
                            onClick={(e) => { e.stopPropagation(); setSelectedCita(cita); }}
                            className={`rounded-lg p-2 mb-1 cursor-pointer hover:shadow-md transition ${serviceColors[servicio?.category] || serviceColors.default} border-l-4`}
                          >
                            <p className="text-xs font-semibold text-gray-800 truncate">{cliente?.name || 'Cliente'}</p>
                            <p className="text-xs text-gray-500 truncate">{servicio?.name}</p>
                            <p className="text-[10px] text-gray-400">{new Date(cita.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal Agendar */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h3 className="text-lg font-bold">Nueva cita</h3>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-full hover:bg-gray-100"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmitCita} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Cliente *</label>
                <select value={formData.clienteId} onChange={(e) => setFormData({ ...formData, clienteId: e.target.value })} className="w-full border rounded-lg px-3 py-2" required>
                  <option value="">Seleccionar cliente</option>
                  {clientes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Servicio *</label>
                <select value={formData.servicioId} onChange={(e) => setFormData({ ...formData, servicioId: e.target.value })} className="w-full border rounded-lg px-3 py-2" required>
                  <option value="">Seleccionar servicio</option>
                  {servicios.map(s => <option key={s.id} value={s.id}>{s.name} - ${s.price.toLocaleString()}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Profesional</label>
                <select value={formData.staffId} onChange={(e) => setFormData({ ...formData, staffId: e.target.value })} className="w-full border rounded-lg px-3 py-2">
                  <option value="">Cualquier profesional</option>
                  {profesionales.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Fecha *</label>
                  <input type="date" value={formData.fecha} onChange={(e) => setFormData({ ...formData, fecha: e.target.value })} className="w-full border rounded-lg px-3 py-2" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Hora *</label>
                  <input type="time" value={formData.hora} onChange={(e) => setFormData({ ...formData, hora: e.target.value })} className="w-full border rounded-lg px-3 py-2" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Notas</label>
                <textarea value={formData.notas} onChange={(e) => setFormData({ ...formData, notas: e.target.value })} rows={2} className="w-full border rounded-lg px-3 py-2" placeholder="Alergias, observaciones..." />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2 border rounded-lg hover:bg-gray-50">Cancelar</button>
                <button type="submit" disabled={submitting} className="flex-1 py-2 bg-[#FE5668] text-white rounded-lg hover:bg-[#e04a5a] disabled:opacity-50">
                  {submitting ? 'Agendando...' : 'Agendar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal éxito */}
      {showSuccessModal && (
        <div className="fixed bottom-4 right-4 z-50 bg-green-500 text-white rounded-lg px-4 py-3 shadow-lg flex items-center gap-2 animate-fadeIn">
          <Check size={18} />
          <span>¡Cita agendada!</span>
        </div>
      )}

      {/* Modal Detalles */}
      {selectedCita && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedCita(null)}>
          <div className="bg-white rounded-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="border-b p-4 flex justify-between items-center">
              <h3 className="text-lg font-bold">Detalles de la cita</h3>
              <button onClick={() => setSelectedCita(null)} className="p-1 rounded-full hover:bg-gray-100"><X size={20} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#FE5668]/20 rounded-full flex items-center justify-center"><User size={18} className="text-[#FE5668]" /></div>
                <div><p className="text-xs text-gray-500">Cliente</p><p className="font-semibold">{db?.clients?.find(c => c.id === selectedCita.clientId)?.name || 'No encontrado'}</p></div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center"><Scissors size={18} className="text-teal-600" /></div>
                <div><p className="text-xs text-gray-500">Servicio</p><p className="font-semibold">{servicios.find(s => s.id === selectedCita.serviceId)?.name || 'No encontrado'}</p></div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center"><Clock size={18} className="text-amber-600" /></div>
                <div><p className="text-xs text-gray-500">Fecha y hora</p><p className="font-semibold">{new Date(selectedCita.date).toLocaleDateString()} - {new Date(selectedCita.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p></div>
              </div>
              {selectedCita.notes && <div className="bg-gray-50 rounded-lg p-3"><p className="text-sm text-gray-500 mb-1">Notas</p><p className="text-gray-700">{selectedCita.notes}</p></div>}
              <div className="flex gap-3 pt-2">
                <button onClick={() => handleSendReminder(selectedCita)} className="flex-1 py-2 bg-[#64A002] text-white rounded-lg hover:bg-[#4d8002]">Enviar recordatorio</button>
                <button onClick={() => setSelectedCita(null)} className="flex-1 py-2 border border-red-300 text-red-500 rounded-lg hover:bg-red-50">Cancelar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}