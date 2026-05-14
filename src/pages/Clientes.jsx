import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ModalAgregarCliente from '../components/Modals/ModalAgregarCliente';

export default function Clientes() {
  const { db } = useAuth();
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [clienteToEdit, setClienteToEdit] = useState(null);

  useEffect(() => {
    if (db) {
      setClientes(db.clients || []);
      setLoading(false);
    }
  }, [db]);

  const handleEdit = (cliente) => {
    setClienteToEdit(cliente);
    setModalOpen(true);
  };

  const handleRefresh = () => {
    setClientes(db?.clients || []);
  };

  if (loading) return <div className="p-8 text-center">Cargando...</div>;

  return (
    <div>
      <div className="glass-card rounded-2xl p-5 mb-5">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-bold text-gray-800"><i className="fas fa-user-plus text-pink-500 mr-2"></i>Gestión de clientas</h3>
            <p className="text-sm text-gray-400">Registra y administra tus clientas</p>
          </div>
          <button onClick={() => { setClienteToEdit(null); setModalOpen(true); }} className="btn-primary text-white py-3 px-6 rounded-xl font-semibold flex items-center gap-2">
            <i className="fas fa-plus-circle"></i> Nueva clienta
          </button>
        </div>
      </div>

      {clientes.length === 0 ? (
        <div className="text-center text-gray-400 py-12">No hay clientas registradas</div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {clientes.map(cliente => (
            <div key={cliente.id} className="cliente-card group flex justify-between items-center p-4 bg-white rounded-xl shadow-sm">
              <div>
                <h4 className="font-semibold text-gray-800">{cliente.name}</h4>
                <p className="text-xs text-gray-500">{cliente.phone || 'Sin teléfono'} | {cliente.email || 'Sin email'}</p>
                <p className="text-xs text-pink-500">{cliente.points || 0} pts</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(cliente)} className="accion-btn editar text-green-500"><i className="fas fa-pencil-alt"></i></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ModalAgregarCliente
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setClienteToEdit(null); }}
        clienteToEdit={clienteToEdit}
        onSaved={handleRefresh}
      />
    </div>
  );
}