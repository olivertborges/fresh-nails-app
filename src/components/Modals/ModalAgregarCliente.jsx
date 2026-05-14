import React, { useState } from 'react';
import { supabase } from '../../config/supabase';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function ModalAgregarCliente({ isOpen, onClose, clienteToEdit, onSaved }) {
  const { loadData } = useAuth();
  const [nombre, setNombre] = useState(clienteToEdit?.name || '');
  const [telefono, setTelefono] = useState(clienteToEdit?.phone || '');
  const [email, setEmail] = useState(clienteToEdit?.email || '');
  const [alergias, setAlergias] = useState(clienteToEdit?.allergies || '');
  const [notas, setNotas] = useState(clienteToEdit?.notes || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre) {
      toast.error('El nombre es obligatorio');
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
      
      if (clienteToEdit) {
        // Editar cliente existente
        const index = dbData.clients.findIndex(c => c.id === clienteToEdit.id);
        if (index !== -1) {
          dbData.clients[index] = {
            ...dbData.clients[index],
            name: nombre,
            phone: telefono,
            email: email,
            allergies: alergias,
            notes: notas,
          };
          toast.success('Cliente actualizado');
        }
      } else {
        // Nuevo cliente
        const nuevoId = Date.now();
        const nuevoCliente = {
          id: nuevoId,
          name: nombre,
          phone: telefono,
          email: email,
          allergies: alergias,
          notes: notas,
          points: 0,
          totalSpent: 0,
          fechaRegistro: new Date().toISOString(),
          codigoReferido: `FRESH${nombre.substring(0, 3).toUpperCase()}${nuevoId.toString().slice(-4)}`
        };
        dbData.clients.push(nuevoCliente);
        toast.success('Cliente registrado');
      }

      await supabase
        .from('nail_data')
        .upsert({ id: 1, content: JSON.stringify(dbData), updated_at: new Date().toISOString() });

      await loadData();
      onSaved?.();
      onClose();
      
    } catch (error) {
      console.error(error);
      toast.error('Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{ display: 'flex' }}>
      <div className="modal-premium" style={{ maxWidth: '500px' }}>
        <div className="modal-header-premium" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <div className="btn-close-modal" onClick={onClose}><i className="fas fa-times"></i></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '48px', height: '48px', background: 'rgba(255,255,255,0.2)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="fas fa-user-plus text-white text-2xl"></i>
            </div>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white', margin: 0 }}>{clienteToEdit ? 'Editar Clienta' : 'Nueva Clienta'}</h2>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.75rem', margin: '4px 0 0' }}>
                {clienteToEdit ? 'Actualiza los datos de la clienta' : 'Registra una nueva clienta en tu salón'}
              </p>
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body-premium" style={{ padding: '1.5rem' }}>
            <div className="input-group-premium" style={{ marginBottom: '1rem', position: 'relative' }}>
              <i className="fas fa-user-circle" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#ec4899' }}></i>
              <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre completo *" required style={{ paddingLeft: '2.75rem', width: '100%', padding: '0.85rem', borderRadius: '24px', border: '1.5px solid #fce7f3' }} />
            </div>
            <div className="input-group-premium" style={{ marginBottom: '1rem', position: 'relative' }}>
              <i className="fas fa-phone-alt" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#ec4899' }}></i>
              <input type="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="Teléfono" style={{ paddingLeft: '2.75rem', width: '100%', padding: '0.85rem', borderRadius: '24px', border: '1.5px solid #fce7f3' }} />
            </div>
            <div className="input-group-premium" style={{ marginBottom: '1rem', position: 'relative' }}>
              <i className="fas fa-envelope" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#ec4899' }}></i>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Correo electrónico" style={{ paddingLeft: '2.75rem', width: '100%', padding: '0.85rem', borderRadius: '24px', border: '1.5px solid #fce7f3' }} />
            </div>
            <div className="input-group-premium" style={{ marginBottom: '1rem', position: 'relative' }}>
              <i className="fas fa-exclamation-triangle" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#ec4899' }}></i>
              <input type="text" value={alergias} onChange={(e) => setAlergias(e.target.value)} placeholder="Alergias (opcional)" style={{ paddingLeft: '2.75rem', width: '100%', padding: '0.85rem', borderRadius: '24px', border: '1.5px solid #fce7f3' }} />
            </div>
            <div className="input-group-premium" style={{ position: 'relative' }}>
              <i className="fas fa-pen-fancy" style={{ position: 'absolute', left: '1rem', top: '1rem', color: '#ec4899' }}></i>
              <textarea value={notas} onChange={(e) => setNotas(e.target.value)} rows="3" placeholder="Notas adicionales / Preferencias" style={{ paddingLeft: '2.75rem', width: '100%', padding: '0.85rem', borderRadius: '24px', border: '1.5px solid #fce7f3' }}></textarea>
            </div>
            <div className="mt-3 p-3 bg-pink-50 rounded-xl text-xs">
              <div className="flex items-center gap-2 text-pink-600"><i className="fas fa-shield-alt"></i><span>Los datos se guardan de forma segura</span></div>
            </div>
          </div>
          <div className="modal-footer-premium" style={{ padding: '1rem 1.5rem 1.5rem', gap: '1rem' }}>
            <button type="button" className="btn-modal-secondary" onClick={onClose}><i className="fas fa-times"></i> Cancelar</button>
            <button type="submit" className="btn-modal-primary" disabled={loading}>
              <i className="fas fa-save"></i> {loading ? 'Guardando...' : (clienteToEdit ? 'Actualizar' : 'Guardar clienta')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}