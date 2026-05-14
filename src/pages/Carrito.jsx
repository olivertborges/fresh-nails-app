import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Carrito() {
  const [carrito, setCarrito] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const carritoGuardado = JSON.parse(localStorage.getItem('carrito') || '[]');
    setCarrito(carritoGuardado);
  }, []);

  const actualizarCantidad = (id, nuevaCantidad) => {
    if (nuevaCantidad < 1) return;
    const nuevoCarrito = carrito.map(item => 
      item.id === id ? { ...item, cantidad: nuevaCantidad } : item
    );
    setCarrito(nuevoCarrito);
    localStorage.setItem('carrito', JSON.stringify(nuevoCarrito));
  };

  const eliminarItem = (id) => {
    const nuevoCarrito = carrito.filter(item => item.id !== id);
    setCarrito(nuevoCarrito);
    localStorage.setItem('carrito', JSON.stringify(nuevoCarrito));
    toast.success('Producto eliminado');
  };

  const total = carrito.reduce((sum, item) => sum + (item.price * item.cantidad), 0);

  const finalizarCompra = () => {
    if (carrito.length === 0) {
      toast.error('El carrito está vacío');
      return;
    }
    toast.success(`Compra realizada por $${total.toLocaleString()}`);
    localStorage.removeItem('carrito');
    setCarrito([]);
    navigate('/tienda');
  };

  return (
    <div className="min-h-screen p-4" style={{ background: '#F2F2F2' }}>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl p-5 mb-5 shadow-sm">
          <h1 className="text-xl font-bold" style={{ color: '#8C5E35' }}>🛒 Mi Carrito</h1>
          <p className="text-sm text-gray-500">{carrito.length} productos</p>
        </div>

        {carrito.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center">
            <p className="text-gray-400 mb-4">Tu carrito está vacío</p>
            <button
              onClick={() => navigate('/tienda')}
              className="px-6 py-2 rounded-full font-semibold"
              style={{ background: '#D9AE79', color: '#8C5E35' }}
            >
              Ir a la tienda
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-3 mb-5">
              {carrito.map(item => (
                <div key={item.id} className="bg-white rounded-xl p-4 shadow-sm flex justify-between items-center">
                  <div>
                    <p className="font-semibold" style={{ color: '#8C5E35' }}>{item.name}</p>
                    <p className="text-sm text-gray-500">${item.price.toLocaleString()} c/u</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                        className="w-8 h-8 rounded-full bg-gray-200"
                      >-</button>
                      <span className="w-8 text-center">{item.cantidad}</span>
                      <button
                        onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                        className="w-8 h-8 rounded-full bg-gray-200"
                      >+</button>
                    </div>
                    <p className="font-bold w-24 text-right" style={{ color: '#D9AE79' }}>${(item.price * item.cantidad).toLocaleString()}</p>
                    <button onClick={() => eliminarItem(item.id)} className="text-red-500">🗑️</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm">
              <div className="flex justify-between mb-4">
                <span className="font-bold">Total</span>
                <span className="text-2xl font-bold" style={{ color: '#D9AE79' }}>${total.toLocaleString()}</span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => navigate('/tienda')}
                  className="flex-1 py-3 rounded-full bg-gray-200 font-semibold"
                >
                  Seguir comprando
                </button>
                <button
                  onClick={finalizarCompra}
                  className="flex-1 py-3 rounded-full font-semibold"
                  style={{ background: '#D9AE79', color: '#8C5E35' }}
                >
                  Finalizar compra
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}