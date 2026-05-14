import React, { useState, useEffect } from 'react';
import { supabase } from '../../config/supabase';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function ModalAgendarCita({ isOpen, onClose, onSaved, clienteId }) {
  const { db, loadData } = useAuth();
  const [clientes, setClientes] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [staff, setStaff] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(clienteId || '');
  const [servicioSeleccionado, setServicioSeleccionado] = useState('');
  const [staffSeleccionado, setStaffSeleccionado] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [notas, setNotas] = useState('');
  const [loading, setLoading] = useState(false);
  const [resumen, setResumen] = useState('');

  useEffect(() => {
    if (db) {
      setClientes(db.clients || []);
      setServicios(db.services || []);
      setStaff(db.staff || []);
    }
    // Fecha por defecto: mañana
    const manana = new Date();
    manana.setDate(manana.getDate() + 1);
    setFecha(manana.toISOString().split('T')[0]);
    setHora('10:00');
  }, [db]);

  useEffect(() => {
    if (clienteSeleccionado && servicioSeleccionado) {
      const cliente = clientes.find(c => c.id === parseInt(clienteSeleccionado));
      const servicio = servicios.find(s => s.id === parseInt(servicioSeleccionado));
      if (cliente && servicio) {
        setResumen(`${cliente.name} · ${servicio.name} · $${servicio.price.toLocaleString()}`);
      }
    } else {
      setResumen('');
    }
  }, [clienteSeleccionado, servicioSeleccionado, clientes, servicios]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!clienteSeleccionado || !servicioSeleccionado || !fecha || !hora) {
      toast.error('Completa todos los campos');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('nail_data')
        .select('content')
        .eq('id', 1)
        .single();

      if (error) throw error;

      const dbData = JSON.parse(data.content);
      const servicio = servicios.find(s => s.id === parseInt(servicioSeleccionado));
      const cliente = clientes.find(c => c.id === parseInt(clienteSeleccionado));

      const nuevaCita = {
        id: Date.now(),
        clientId: parseInt(clienteSeleccionado),
        serviceId: parseInt(servicioSeleccionado),
        staffId: staffSeleccionado ? parseInt(staffSeleccionado) : null,
        date: new Date(`${fecha}T${hora}:00`).toISOString(),
        price: servicio.price,
        notes: notas,
        status: 'pendiente'
      };

      dbData.appointments.push(nuevaCita);
      
      // Sumar puntos al cliente
      if (cliente) {
        cliente.points = (cliente.points || 0) + Math.floor(servicio.price);
        cliente.totalSpent = (cliente.totalSpent || 0) + servicio.price;
      }

      await supabase
        .from('nail_data')
        .upsert({ id: 1, content: JSON.stringify(dbData), updated_at: new Date().toISOString() });

      await loadData();
      toast.success(`✅ Cita agendada para ${cliente?.name}`);
      onSaved?.();
      onClose();
      
    } catch (error) {
      console.error(error);
      toast.error('Error al agendar cita');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{ display: 'flex' }}>
      <div className="modal-premium" style={{ maxWidth: '520px' }}>
        <div className="modal-header-premium" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <div className="btn-close-modal" onClick={onClose}><i className="fas fa-times"></i></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '48px', height: '48px', background: 'rgba(255,255,255,0.2)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="fas fa-calendar-check text-white text-2xl"></i>
            </div>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white', margin: 0 }}>Agendar Cita</h2>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.75rem', margin: '4px 0 0' }}>Completa los datos para reservar</p>
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body-premium" style={{ padding: '1.5rem' }}>
            <div className="input-group-premium" style={{ marginBottom: '1rem', position: 'relative' }}>
              <i className="fas fa-user-friends" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#ec4899' }}></i>
              <select value={clienteSeleccionado} onChange={(e) => setClienteSeleccionado(e.target.value)} required style={{ paddingLeft: '2.75rem', width: '100%', padding: '0.85rem', borderRadius: '24px', border: '1.5px solid #fce7f3' }}>
                <option value="">Seleccionar clienta</option>
                {clientes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="input-group-premium" style={{ marginBottom: '1rem', position: 'relative' }}>
              <i className="fas fa-spa" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#ec4899' }}></i>
              <select value={servicioSeleccionado} onChange={(e) => setServicioSeleccionado(e.target.value)} required style={{ paddingLeft: '2.75rem', width: '100%', padding: '0.85rem', borderRadius: '24px', border: '1.5px solid #fce7f3' }}>
                <option value="">Seleccionar servicio</option>
                {servicios.map(s => <option key={s.id} value={s.id}>{s.name} - ${s.price.toLocaleString()}</option>)}
              </select>
            </div>
            <div className="input-group-premium" style={{ marginBottom: '1rem', position: 'relative' }}>
              <i className="fas fa-user-md" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#ec4899' }}></i>
              <select value={staffSeleccionado} onChange={(e) => setStaffSeleccionado(e.target.value)} style={{ paddingLeft: '2.75rem', width: '100%', padding: '0.85rem', borderRadius: '24px', border: '1.5px solid #fce7f3' }}>
                <option value="">👩‍⚕️ Cualquier profesional (recomendado)</option>
                {staff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="input-group-premium" style={{ position: 'relative' }}>
                <i className="fas fa-calendar-alt" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#ec4899' }}></i>
                <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} required style={{ paddingLeft: '2.75rem', width: '100%', padding: '0.85rem', borderRadius: '24px', border: '1.5px solid #fce7f3' }} />
              </div>
              <div className="input-group-premium" style={{ position: 'relative' }}>
                <i className="fas fa-clock" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#ec4899' }}></i>
                <input type="time" value={hora} onChange={(e) => setHora(e.target.value)} required style={{ paddingLeft: '2.75rem', width: '100%', padding: '0.85rem', borderRadius: '24px', border: '1.5px solid #fce7f3' }} />
              </div>
            </div>
            <div className="input-group-premium" style={{ marginTop: '1rem', position: 'relative' }}>
              <i className="fas fa-pen-fancy" style={{ position: 'absolute', left: '1rem', top: '1rem', color: '#ec4899' }}></i>
              <textarea value={notas} onChange={(e) => setNotas(e.target.value)} rows="2" placeholder="Notas adicionales (opcional)..." style={{ paddingLeft: '2.75rem', width: '100%', padding: '0.85rem', borderRadius: '24px', border: '1.5px solid #fce7f3' }}></textarea>
            </div>
            {resumen && (
              <div className="mt-3 p-3 bg-pink-50 rounded-xl text-xs">
                <div className="flex items-center gap-2 text-pink-600">
                  <i className="fas fa-info-circle"></i>
                  <span>{resumen}</span>
                </div>
              </div>
            )}
          </div>
          <div className="modal-footer-premium" style={{ padding: '1rem 1.5rem 1.5rem', gap: '1rem' }}>
            <button type="button" className="btn-modal-secondary" onClick={onClose}><i className="fas fa-times"></i> Cancelar</button>
            <button type="submit" className="btn-modal-primary" disabled={loading}>
              <i className="fas fa-check-circle"></i> {loading ? 'Agendando...' : 'Confirmar cita'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}