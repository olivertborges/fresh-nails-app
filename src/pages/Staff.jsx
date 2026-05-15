import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../config/supabase';
import toast from 'react-hot-toast';

export default function Staff() {
  const { db, loadData } = useAuth();
  const [staff, setStaff] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState(null);
  const [formData, setFormData] = useState({ name: '', specialty: '', commission: '' });

  useEffect(() => {
    if (db) {
      setStaff(db.staff || []);
    }
  }, [db]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error('El nombre es obligatorio');
      return;
    }

    let nuevoStaff;
    if (editando) {
      nuevoStaff = staff.map(s => s.id === editando.id ? { ...s, ...formData, commission: parseInt(formData.commission) || 0 } : s);
    } else {
      nuevoStaff = [...staff, { id: Date.now(), ...formData, commission: parseInt(formData.commission) || 0 }];
    }

    try {
      const { data, error } = await supabase.from('nail_data').select('content').eq('id', 1).single();
      if (error) throw error;
      const dbData = JSON.parse(data.content);
      dbData.staff = nuevoStaff;
      await supabase.from('nail_data').upsert({ id: 1, content: JSON.stringify(dbData), updated_at: new Date().toISOString() });
      setStaff(nuevoStaff);
      await loadData();
      toast.success(editando ? 'Profesional actualizado' : 'Profesional agregado');
      setModalOpen(false);
      setFormData({ name: '', specialty: '', commission: '' });
      setEditando(null);
    } catch (error) {
      toast.error('Error al guardar');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este profesional?')) return;
    const nuevoStaff = staff.filter(s => s.id !== id);
    try {
      const { data, error } = await supabase.from('nail_data').select('content').eq('id', 1).single();
      if (error) throw error;
      const dbData = JSON.parse(data.content);
      dbData.staff = nuevoStaff;
      await supabase.from('nail_data').upsert({ id: 1, content: JSON.stringify(dbData), updated_at: new Date().toISOString() });
      setStaff(nuevoStaff);
      await loadData();
      toast.success('Profesional eliminado');
    } catch (error) {
      toast.error('Error al eliminar');
    }
  };

  const handleEdit = (item) => {
    setEditando(item);
    setFormData({ name: item.name, specialty: item.specialty || '', commission: item.commission || '' });
    setModalOpen(true);
  };

  const colores = ['from-pink-500 to-rose-500', 'from-purple-500 to-indigo-500', 'from-blue-500 to-cyan-500', 'from-emerald-500 to-teal-500', 'from-amber-500 to-orange-500'];

  return (
    <div>
      <div className="glass-card p-4 mb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg flex items-center justify-center"><i className="fas fa-users text-white text-xs"></i></div>
            <div><h3 className="font-semibold text-gray-800 dark:text-white text-sm">Equipo de trabajo</h3><p className="text-xs text-gray-400">Gestiona tus profesionales</p></div>
          </div>
          <button onClick={() => { setEditando(null); setFormData({ name: '', specialty: '', commission: '' }); setModalOpen(true); }} className="bg-gradient-to-r from-pink-500 to-rose-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 hover:scale-105 transition-all"><i className="fas fa-user-plus text-xs"></i> Nuevo profesional</button>
        </div>
      </div>

      {staff.length === 0 ? (
        <div className="text-center text-gray-400 py-12">No hay profesionales registrados</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[calc(100vh-180px)] overflow-y-auto">
          {staff.map((s, idx) => (
            <div key={s.id} className="staff-card group bg-white rounded-xl p-4 shadow-sm">
              <div className="flex gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold bg-gradient-to-br ${colores[idx % colores.length]}`}>
                  {s.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-gray-800">{s.name}</h4>
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(s)} className="text-amber-500"><i className="fas fa-pencil-alt"></i></button>
                      <button onClick={() => handleDelete(s.id)} className="text-red-500"><i className="fas fa-trash-alt"></i></button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500"><i className="fas fa-brush"></i> {s.specialty || 'Sin especialidad'}</p>
                  <p className="text-xs text-pink-500">{s.commission || 0}% comisión</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="modal-overlay" style={{ display: 'flex' }}>
          <div className="modal-premium" style={{ maxWidth: '420px' }}>
            <div className="modal-header-premium">
              <div className="btn-close-modal" onClick={() => { setModalOpen(false); setEditando(null); }}><i className="fas fa-times"></i></div>
              <h2><i className="fas fa-user-plus mr-2"></i> {editando ? 'Editar Profesional' : 'Nuevo Profesional'}</h2>
              <p>{editando ? 'Actualiza los datos del profesional' : 'Registra un nuevo miembro del equipo'}</p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body-premium">
                <div className="input-group-premium"><i className="fas fa-user"></i><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Nombre completo" required style={{ paddingLeft: '2.75rem' }} /></div>
                <div className="input-group-premium"><i className="fas fa-brush"></i><input type="text" value={formData.specialty} onChange={(e) => setFormData({ ...formData, specialty: e.target.value })} placeholder="Especialidad (ej. Manicurista)" style={{ paddingLeft: '2.75rem' }} /></div>
                <div className="input-group-premium"><i className="fas fa-percent"></i><input type="number" value={formData.commission} onChange={(e) => setFormData({ ...formData, commission: e.target.value })} placeholder="Comisión (%)" style={{ paddingLeft: '2.75rem' }} /></div>
              </div>
              <div className="modal-footer-premium">
                <button type="button" className="btn-modal-secondary" onClick={() => { setModalOpen(false); setEditando(null); }}>Cancelar</button>
                <button type="submit" className="btn-modal-primary">Guardar profesional</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}