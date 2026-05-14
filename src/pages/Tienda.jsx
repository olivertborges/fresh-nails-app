import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';
import toast from 'react-hot-toast';

export default function Tienda() {
  const { db, loadData } = useAuth();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState(null);
  const [formData, setFormData] = useState({ name: '', price: '', stock: '' });
  const navigate = useNavigate();

  useEffect(() => {
    if (db) {
      setProductos(db.products || []);
      setLoading(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      toast.error('Nombre y precio son obligatorios');
      return;
    }

    let nuevosProductos;
    if (editando) {
      nuevosProductos = productos.map(p => 
        p.id === editando.id ? { ...p, ...formData, price: parseInt(formData.price), stock: parseInt(formData.stock) } : p
      );
    } else {
      const nuevoProducto = {
        id: Date.now(),
        ...formData,
        price: parseInt(formData.price),
        stock: parseInt(formData.stock) || 0,
        imagen: '💅'
      };
      nuevosProductos = [...productos, nuevoProducto];
    }

    try {
      const { data, error } = await supabase
        .from('nail_data')
        .select('content')
        .eq('id', 1)
        .single();
      
      if (error) throw error;
      
      const dbData = JSON.parse(data.content);
      dbData.products = nuevosProductos;
      
      await supabase
        .from('nail_data')
        .upsert({ id: 1, content: JSON.stringify(dbData), updated_at: new Date().toISOString() });
      
      setProductos(nuevosProductos);
      await loadData();
      toast.success(editando ? 'Producto actualizado' : 'Producto agregado');
      setModalOpen(false);
      setFormData({ name: '', price: '', stock: '' });
      setEditando(null);
    } catch (error) {
      toast.error('Error al guardar');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este producto?')) return;
    
    const nuevosProductos = productos.filter(p => p.id !== id);
    
    try {
      const { data, error } = await supabase
        .from('nail_data')
        .select('content')
        .eq('id', 1)
        .single();
      
      if (error) throw error;
      
      const dbData = JSON.parse(data.content);
      dbData.products = nuevosProductos;
      
      await supabase
        .from('nail_data')
        .upsert({ id: 1, content: JSON.stringify(dbData), updated_at: new Date().toISOString() });
      
      setProductos(nuevosProductos);
      await loadData();
      toast.success('Producto eliminado');
    } catch (error) {
      toast.error('Error al eliminar');
    }
  };

  const handleEdit = (producto) => {
    setEditando(producto);
    setFormData({ name: producto.name, price: producto.price, stock: producto.stock });
    setModalOpen(true);
  };

  if (loading) return <div className="p-8 text-center">Cargando...</div>;

  return (
    <div className="min-h-screen p-4" style={{ background: '#F2F2F2' }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-xl font-bold" style={{ color: '#8C5E35' }}>🛍️ Tienda</h1>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/carrito')}
              className="px-4 py-2 rounded-full text-sm font-semibold bg-white shadow"
              style={{ color: '#8C5E35' }}
            >
              🛒 Carrito ({JSON.parse(localStorage.getItem('carrito') || '[]').length})
            </button>
            <button
              onClick={() => { setEditando(null); setFormData({ name: '', price: '', stock: '' }); setModalOpen(true); }}
              className="px-4 py-2 rounded-full text-sm font-semibold"
              style={{ background: '#D9AE79', color: '#8C5E35' }}
            >
              + Agregar Producto
            </button>
          </div>
        </div>

        {productos.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center text-gray-400">No hay productos disponibles</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {productos.map(producto => (
              <div key={producto.id} className="bg-white rounded-xl p-4 shadow-sm text-center">
                <div className="text-4xl mb-2">💅</div>
                <p className="font-semibold" style={{ color: '#8C5E35' }}>{producto.name}</p>
                <p className="text-sm font-bold" style={{ color: '#D9AE79' }}>${producto.price.toLocaleString()}</p>
                <p className="text-xs text-gray-400">Stock: {producto.stock}</p>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => agregarAlCarrito(producto)}
                    className="flex-1 py-1 rounded-full text-xs font-semibold"
                    style={{ background: '#D9AE79', color: '#8C5E35' }}
                  >
                    Agregar
                  </button>
                  <button onClick={() => handleEdit(producto)} className="text-amber-600">✏️</button>
                  <button onClick={() => handleDelete(producto.id)} className="text-red-500">🗑️</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full">
              <h2 className="text-xl font-bold mb-4" style={{ color: '#8C5E35' }}>{editando ? 'Editar Producto' : 'Nuevo Producto'}</h2>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Nombre del producto *"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 border border-amber-200 rounded-xl mb-3"
                  required
                />
                <input
                  type="number"
                  placeholder="Precio *"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full p-3 border border-amber-200 rounded-xl mb-3"
                  required
                />
                <input
                  type="number"
                  placeholder="Stock"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="w-full p-3 border border-amber-200 rounded-xl mb-4"
                />
                <div className="flex gap-3">
                  <button type="button" onClick={() => { setModalOpen(false); setEditando(null); }} className="flex-1 py-2 rounded-full bg-gray-200">Cancelar</button>
                  <button type="submit" className="flex-1 py-2 rounded-full font-semibold" style={{ background: '#D9AE79', color: '#8C5E35' }}>Guardar</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}