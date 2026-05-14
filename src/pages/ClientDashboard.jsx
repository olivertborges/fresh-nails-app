import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function ClientDashboard() {
  const { user, db, logout, loadData } = useAuth();
  const [servicios, setServicios] = useState([]);
  const [citas, setCitas] = useState([]);
  const [puntos, setPuntos] = useState(0);
  const [referidos, setReferidos] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarDatos = async () => {
      if (db) {
        const cliente = db.clients?.find(c => c.name === user?.name);
        setServicios(db.services || []);
        if (cliente) {
          setCitas(db.appointments?.filter(c => c.clientId === cliente.id) || []);
          setPuntos(cliente.points || 0);
          setReferidos(db.clients?.filter(c => c.refBy === cliente.id)?.length || 0);
        }
        setLoading(false);
      }
    };
    cargarDatos();
  }, [db, user]);

  const citasProximas = citas.filter(c => new Date(c.date) > new Date()).sort((a, b) => new Date(a.date) - new Date(b.date));

  if (loading) return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;

  return (
    <div style={{ background: 'linear-gradient(135deg, #F9F3E6 0%, #fce7f3 100%)', minHeight: '100vh', padding: '20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '20px', overflow: 'hidden', background: 'white', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}>
              <div className="text-4xl flex items-center justify-center h-full">💅</div>
            </div>
            <div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800, background: 'linear-gradient(135deg, #D9AE79, #8C5E35)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', margin: 0 }}>Fresh Nails</h1>
              <p style={{ fontSize: '0.8rem', color: '#BFA084', margin: 0 }}>Bienvenida de vuelta, <span style={{ fontWeight: 600, color: '#D9AE79' }}>{user?.name}</span> ✨</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => navigate('/perfil')} style={{ background: 'rgba(217, 174, 121, 0.2)', border: 'none', width: '45px', height: '45px', borderRadius: '25px', cursor: 'pointer' }}>
              <i className="fas fa-user" style={{ color: '#8C5E35', fontSize: '1.2rem' }}></i>
            </button>
            <button onClick={logout} style={{ background: 'rgba(217, 174, 121, 0.2)', border: 'none', width: '45px', height: '45px', borderRadius: '25px', cursor: 'pointer' }}>
              <i className="fas fa-sign-out-alt" style={{ color: '#8C5E35', fontSize: '1.2rem' }}></i>
            </button>
          </div>
        </div>

        {/* TARJETA DE BIENVENIDA */}
        <div style={{ background: 'linear-gradient(135deg, #D9AE79, #c49a5e)', borderRadius: '30px', padding: '25px', marginBottom: '30px', color: '#8C5E35', boxShadow: '0 20px 35px -10px rgba(217, 174, 121, 0.4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
            <div>
              <p style={{ fontSize: '0.8rem', opacity: 0.9 }}>🎉 ¡Hoy es un gran día!</p>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '5px 0' }}>¿Qué servicio deseas hoy?</h2>
              <p style={{ fontSize: '0.85rem', opacity: 0.9 }}>Descubre nuestras promociones y servicios exclusivos</p>
            </div>
            <div style={{ fontSize: '4rem' }}>💅✨</div>
          </div>
        </div>

        {/* ESTADÍSTICAS RÁPIDAS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginBottom: '30px' }}>
          <div style={{ background: 'white', borderRadius: '24px', padding: '15px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: '2rem' }}>💇‍♀️</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#D9AE79' }}>{citas.length}</div>
            <div style={{ fontSize: '0.7rem', color: '#BFA084' }}>Citas realizadas</div>
          </div>
          <div style={{ background: 'white', borderRadius: '24px', padding: '15px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: '2rem' }}>⭐</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#D9AE79' }}>{puntos}</div>
            <div style={{ fontSize: '0.7rem', color: '#BFA084' }}>Puntos acumulados</div>
          </div>
          <div style={{ background: 'white', borderRadius: '24px', padding: '15px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: '2rem' }}>🎂</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#D9AE79' }}>-</div>
            <div style={{ fontSize: '0.7rem', color: '#BFA084' }}>Tu próximo cumpleaños</div>
          </div>
        </div>

        {/* PRÓXIMAS CITAS */}
        <div style={{ background: 'white', borderRadius: '28px', padding: '20px', marginBottom: '25px', boxShadow: '0 8px 20px rgba(0,0,0,0.05)', border: '1px solid rgba(217, 174, 121, 0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#8C5E35' }}><i className="fas fa-calendar-check" style={{ color: '#D9AE79', marginRight: '10px' }}></i>Próximas Citas</h3>
            <span style={{ background: '#F2DEC4', padding: '5px 12px', borderRadius: '20px', fontSize: '0.7rem', color: '#8C5E35' }}>Tus turnos</span>
          </div>
          {citasProximas.length === 0 ? (
            <div className="text-center text-gray-400 py-6">📅 No tienes citas próximas</div>
          ) : (
            citasProximas.map(cita => {
              const servicio = db.services?.find(s => s.id === cita.serviceId);
              const fecha = new Date(cita.date);
              const diffDias = Math.ceil((fecha - new Date()) / (1000 * 60 * 60 * 24));
              return (
                <div key={cita.id} className="bg-white rounded-xl p-3 mb-2 shadow-sm border border-amber-100">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-800">{servicio?.name}</p>
                      <p className="text-xs text-gray-400">{fecha.toLocaleDateString()} - {fecha.toLocaleTimeString()}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-green-500">{diffDias === 0 ? '🔥 HOY!' : `${diffDias} días`}</div>
                      <button onClick={() => navigate(`/cancelar-cita/${cita.id}`)} className="text-xs text-red-400">Cancelar</button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* SISTEMA DE PUNTOS */}
        <div style={{ background: 'linear-gradient(135deg, #2c241a, #1f1a14)', borderRadius: '28px', padding: '20px', marginBottom: '25px', color: 'white' }}>
          <div className="flex justify-between items-center mb-2">
            <div><p className="text-xs text-gray-400">Tus puntos</p><p className="text-3xl font-bold text-amber-400">{puntos}</p></div>
            <div className="text-right"><span className="bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold">Bronce</span></div>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 mb-2"><div className="bg-amber-500 h-2 rounded-full" style={{ width: `${(puntos % 1000) / 10}%` }}></div></div>
          <button onClick={() => alert('Canje de puntos')} className="mt-3 text-amber-400 text-sm font-semibold">🎁 Canjear puntos →</button>
        </div>

        {/* SERVICIOS */}
        <div style={{ background: 'white', borderRadius: '28px', padding: '20px', marginBottom: '25px', boxShadow: '0 8px 20px rgba(0,0,0,0.05)' }}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800"><i className="fas fa-spa text-amber-500 mr-2"></i>Nuestros Servicios</h3>
            <span className="bg-amber-100 px-3 py-1 rounded-full text-xs text-amber-700">Toca para agendar</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {servicios.slice(0, 4).map(serv => (
              <div key={serv.id} className="bg-white rounded-xl p-3 text-center shadow-sm border border-amber-100">
                <div className="text-3xl mb-1">💅</div>
                <p className="font-semibold text-sm text-gray-800">{serv.name}</p>
                <p className="text-xs font-bold text-amber-600">${serv.price.toLocaleString()}</p>
                <button className="mt-2 text-xs bg-amber-500 text-white px-3 py-1 rounded-full">Agendar</button>
              </div>
            ))}
          </div>
        </div>

        {/* REFERIDOS Y FAVORITOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-r from-teal-100 to-teal-50 rounded-xl p-4">
            <p className="font-bold text-gray-800">🎁 Invita y gana</p>
            <p className="text-xs text-gray-500">{referidos} amigas registradas | +{referidos * 500} pts</p>
            <button className="mt-2 bg-teal-500 text-white px-3 py-1 rounded-lg text-xs">Compartir código</button>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="font-bold text-gray-800 mb-2">❤️ Favoritos</p>
            <p className="text-xs text-gray-400">No tienes productos favoritos</p>
          </div>
        </div>

        {/* GALERÍA PERSONAL */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-3"><i className="fas fa-images text-amber-500 mr-2"></i>Tus Recuerdos</h3>
          <div className="text-center text-gray-400 py-6">📸 No tienes fotos aún</div>
        </div>

        {/* BOTONES FLOTANTES */}
        <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 100, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button onClick={() => navigate('/carrito')} style={{ width: '55px', height: '55px', background: 'linear-gradient(135deg, #8C5E35, #BFA084)', border: 'none', borderRadius: '50%', boxShadow: '0 8px 20px rgba(140,94,53,0.4)', cursor: 'pointer', position: 'relative' }}>
            <i className="fas fa-shopping-cart" style={{ color: 'white', fontSize: '1.3rem' }}></i>
          </button>
          <button onClick={() => navigate('/tienda')} style={{ width: '55px', height: '55px', background: 'linear-gradient(135deg, #D9AE79, #c49a5e)', border: 'none', borderRadius: '50%', boxShadow: '0 8px 20px rgba(217,174,121,0.4)', cursor: 'pointer' }}>
            <i className="fas fa-store" style={{ color: '#8C5E35', fontSize: '1.3rem' }}></i>
          </button>
        </div>
      </div>
    </div>
  );
}