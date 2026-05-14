import React, { useState } from 'react';
import { supabase } from '../../config/supabase';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function ModalCambiarPassword({ isOpen, onClose }) {
  const { user, loadData } = useAuth();
  const [passActual, setPassActual] = useState('');
  const [passNueva, setPassNueva] = useState('');
  const [passConfirmar, setPassConfirmar] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!passActual || !passNueva || !passConfirmar) {
      toast.error('Completa todos los campos');
      return;
    }
    if (passNueva.length < 4) {
      toast.error('La contraseña debe tener al menos 4 caracteres');
      return;
    }
    if (passNueva !== passConfirmar) {
      toast.error('Las contraseñas no coinciden');
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
      const usuario = dbData.users?.find(u => u.name === user.name);

      if (!usuario) {
        toast.error('Usuario no encontrado');
        return;
      }

      if (usuario.password !== passActual) {
        toast.error('Contraseña actual incorrecta');
        return;
      }

      usuario.password = passNueva;

      await supabase
        .from('nail_data')
        .upsert({ id: 1, content: JSON.stringify(dbData), updated_at: new Date().toISOString() });

      await loadData();
      toast.success('Contraseña actualizada');
      onClose();
      setPassActual('');
      setPassNueva('');
      setPassConfirmar('');

    } catch (error) {
      toast.error('Error al cambiar contraseña');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{ display: 'flex' }}>
      <div className="modal-premium" style={{ maxWidth: '400px' }}>
        <div className="modal-header-premium" style={{ background: 'linear-gradient(135deg, #D9AE79, #c49a5e)' }}>
          <div className="btn-close-modal" onClick={onClose}><i className="fas fa-times"></i></div>
          <h2 style={{ color: 'white' }}><i className="fas fa-key"></i> Cambiar Contraseña</h2>
        </div>
        <div className="modal-body-premium" style={{ padding: '1.5rem' }}>
          <div className="input-group-premium" style={{ marginBottom: '1rem', position: 'relative' }}>
            <i className="fas fa-lock" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#D9AE79' }}></i>
            <input type="password" value={passActual} onChange={(e) => setPassActual(e.target.value)} placeholder="Contraseña actual" style={{ paddingLeft: '2.5rem', width: '100%', padding: '0.85rem', borderRadius: '24px', border: '1.5px solid #fce7f3' }} />
          </div>
          <div className="input-group-premium" style={{ marginBottom: '1rem', position: 'relative' }}>
            <i className="fas fa-lock" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#D9AE79' }}></i>
            <input type="password" value={passNueva} onChange={(e) => setPassNueva(e.target.value)} placeholder="Nueva contraseña" style={{ paddingLeft: '2.5rem', width: '100%', padding: '0.85rem', borderRadius: '24px', border: '1.5px solid #fce7f3' }} />
          </div>
          <div className="input-group-premium" style={{ position: 'relative' }}>
            <i className="fas fa-lock" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#D9AE79' }}></i>
            <input type="password" value={passConfirmar} onChange={(e) => setPassConfirmar(e.target.value)} placeholder="Confirmar nueva contraseña" style={{ paddingLeft: '2.5rem', width: '100%', padding: '0.85rem', borderRadius: '24px', border: '1.5px solid #fce7f3' }} />
          </div>
        </div>
        <div className="modal-footer-premium">
          <button className="btn-modal-secondary" onClick={onClose}>Cancelar</button>
          <button className="btn-modal-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Cambiando...' : 'Cambiar'}
          </button>
        </div>
      </div>
    </div>
  );
}