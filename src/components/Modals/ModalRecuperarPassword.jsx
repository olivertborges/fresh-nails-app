import React, { useState } from 'react';
import { supabase } from '../../config/supabase';
import toast from 'react-hot-toast';

export default function ModalRecuperarPassword({ isOpen, onClose }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState('');
  const [nuevaPass, setNuevaPass] = useState('');
  const [confirmarPass, setConfirmarPass] = useState('');
  const [codigoEnviado, setCodigoEnviado] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEnviarCodigo = async () => {
    if (!email) {
      toast.error('Ingresa tu correo electrónico');
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
      const cliente = dbData.clients?.find(c => c.email === email);

      if (!cliente) {
        toast.error('No existe una cuenta con este correo');
        return;
      }

      const nuevoCodigo = Math.floor(100000 + Math.random() * 900000).toString();
      setCodigoEnviado(nuevoCodigo);
      
      // Simular envío de email (en producción usar EmailJS)
      alert(`🔐 Código de verificación: ${nuevoCodigo}\n\n(En producción se enviaría por email)`);
      
      setStep(2);
      toast.success('Código enviado');
      
    } catch (error) {
      toast.error('Error al enviar código');
    } finally {
      setLoading(false);
    }
  };

  const handleCambiarPassword = async () => {
    if (codigo !== codigoEnviado) {
      toast.error('Código incorrecto');
      return;
    }
    if (nuevaPass.length < 4) {
      toast.error('La contraseña debe tener al menos 4 caracteres');
      return;
    }
    if (nuevaPass !== confirmarPass) {
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
      const cliente = dbData.clients?.find(c => c.email === email);
      
      if (cliente) {
        const usuario = dbData.users?.find(u => u.name === cliente.name);
        if (usuario) {
          usuario.password = nuevaPass;
          await supabase
            .from('nail_data')
            .upsert({ id: 1, content: JSON.stringify(dbData), updated_at: new Date().toISOString() });
          
          toast.success('Contraseña actualizada');
          onClose();
          setStep(1);
          setEmail('');
          setCodigo('');
          setNuevaPass('');
          setConfirmarPass('');
        }
      }
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
          <div style={{ textAlign: 'center' }}>
            <i className="fas fa-key text-white text-3xl mb-2"></i>
            <h2 style={{ color: 'white', fontSize: '1.5rem', margin: 0 }}>Recuperar Contraseña</h2>
            <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.75rem' }}>Te enviaremos un código de verificación</p>
          </div>
        </div>
        <div className="modal-body-premium" style={{ padding: '1.5rem' }}>
          {step === 1 ? (
            <div>
              <div className="input-group-premium" style={{ marginBottom: '1rem', position: 'relative' }}>
                <i className="fas fa-envelope" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#D9AE79' }}></i>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Correo electrónico" style={{ paddingLeft: '2.5rem', width: '100%', padding: '0.85rem', borderRadius: '24px', border: '1.5px solid #fce7f3' }} />
              </div>
              <button onClick={handleEnviarCodigo} className="btn-modal-primary w-full" disabled={loading}>
                {loading ? 'Enviando...' : 'Enviar código'}
              </button>
            </div>
          ) : (
            <div>
              <div className="input-group-premium" style={{ marginBottom: '1rem', position: 'relative' }}>
                <i className="fas fa-code" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#D9AE79' }}></i>
                <input type="text" value={codigo} onChange={(e) => setCodigo(e.target.value)} placeholder="Código de verificación" style={{ paddingLeft: '2.5rem', width: '100%', padding: '0.85rem', borderRadius: '24px', border: '1.5px solid #fce7f3' }} />
              </div>
              <div className="input-group-premium" style={{ marginBottom: '1rem', position: 'relative' }}>
                <i className="fas fa-lock" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#D9AE79' }}></i>
                <input type="password" value={nuevaPass} onChange={(e) => setNuevaPass(e.target.value)} placeholder="Nueva contraseña" style={{ paddingLeft: '2.5rem', width: '100%', padding: '0.85rem', borderRadius: '24px', border: '1.5px solid #fce7f3' }} />
              </div>
              <div className="input-group-premium" style={{ marginBottom: '1rem', position: 'relative' }}>
                <i className="fas fa-lock" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#D9AE79' }}></i>
                <input type="password" value={confirmarPass} onChange={(e) => setConfirmarPass(e.target.value)} placeholder="Confirmar contraseña" style={{ paddingLeft: '2.5rem', width: '100%', padding: '0.85rem', borderRadius: '24px', border: '1.5px solid #fce7f3' }} />
              </div>
              <button onClick={handleCambiarPassword} className="btn-modal-primary w-full" disabled={loading}>
                {loading ? 'Cambiando...' : 'Cambiar contraseña'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}