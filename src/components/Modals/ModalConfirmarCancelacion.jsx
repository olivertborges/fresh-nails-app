import React from 'react';

export default function ModalConfirmarCancelacion({ isOpen, onClose, onConfirm, citaInfo }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{ display: 'flex' }}>
      <div className="modal-premium" style={{ maxWidth: '380px' }}>
        <div className="modal-header-premium" style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)', textAlign: 'center' }}>
          <div className="btn-close-modal" onClick={onClose}><i className="fas fa-times"></i></div>
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <i className="fas fa-exclamation-triangle text-white text-2xl"></i>
          </div>
          <h2 style={{ color: 'white', fontSize: '1.4rem' }}>Cancelar Cita</h2>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.85rem' }}>¿Estás segura de cancelar esta cita?</p>
        </div>
        <div className="modal-body-premium" style={{ textAlign: 'center', padding: '1.5rem' }}>
          <p className="text-gray-600 text-sm">Esta acción no se puede deshacer</p>
          {citaInfo && (
            <p className="text-xs text-gray-400 mt-2">
              {citaInfo.cliente}<br />
              {citaInfo.servicio}<br />
              {citaInfo.fecha} - {citaInfo.hora}
            </p>
          )}
        </div>
        <div className="modal-footer-premium" style={{ gap: '0.75rem', padding: '1rem 1.5rem 1.5rem' }}>
          <button type="button" className="btn-modal-secondary" onClick={onClose}>No, mantener</button>
          <button type="button" className="btn-modal-eliminar" onClick={onConfirm}>Sí, cancelar</button>
        </div>
      </div>
    </div>
  );
}