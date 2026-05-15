import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Tienda() {
  const { db, loadData } = useAuth();
  const [productos, setProductos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', price: '', stock: '' });
  const navigate = useNavigate();

  useEffect(() => {
    if (db) {
      setProductos(db.products || []);
    }
  }, [db]);

  const agregarAlCarrito = (producto) => {
    const carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
    const existente = carrito.find(p => p.id === producto.id);
    if (existente) {
      existente.cantidad++;
    } else {
      carrito.push({ ...producto, cantidad: 1 });
    }
    localStorage.setItem('carrito', JSON.stringify(carrito));
    toast.success(`${producto.name} agregado al carrito`);
  };

  return (
    <div className="min-h-screen p-4" style={{ background: '#F2F2F2' }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-xl font-bold text-gray-800">🛍️ Tienda</h1>
          <button onClick={() => navigate('/carrito')} className="px-4 py-2 rounded-full bg-white shadow">🛒 Carrito ({JSON.parse(localStorage.getItem('carrito') || '[]').length})</button>
        </div>
        {productos.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center text-gray-400">No hay productos disponibles</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {productos.map(p => (
              <div key={p.id} className="bg-white rounded-xl p-4 text-center shadow-sm">
                <div className="text-4xl mb-2">💅</div>
                <p className="font-semibold">{p.name}</p>
                <p className="text-sm font-bold text-amber-600">${p.price.toLocaleString()}</p>
                <button onClick={() => agregarAlCarrito(p)} className="mt-2 w-full bg-amber-500 text-white py-1 rounded-full text-sm">Agregar</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}