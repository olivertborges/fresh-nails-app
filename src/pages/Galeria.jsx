import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Galeria() {
  const { db } = useAuth();
  const [fotos, setFotos] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (db) {
      setFotos(db.photos || []);
    }
  }, [db]);

  return (
    <div className="min-h-screen p-4" style={{ background: '#F2F2F2' }}>
      <div className="max-w-6xl mx-auto">
        <div className="glass-card p-4 mb-4">
          <h3 className="font-semibold text-gray-800">📸 Galería de trabajos</h3>
        </div>
        {fotos.length === 0 ? (
          <div className="text-center text-gray-400 py-12">No hay fotos en la galería</div>
        ) : (
          <div className="galeria-grid">
            {fotos.map(foto => (
              <div key={foto.id} className="galeria-item cursor-pointer" onClick={() => setSelectedImage(foto.url)}>
                <img src={foto.url} alt="Trabajo" className="w-full h-48 object-cover" />
              </div>
            ))}
          </div>
        )}
        {selectedImage && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4" onClick={() => setSelectedImage(null)}>
            <img src={selectedImage} className="max-w-full max-h-full rounded-xl" alt="Ampliada" />
          </div>
        )}
      </div>
    </div>
  );
}