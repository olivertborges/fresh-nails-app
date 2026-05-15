// src/pages/Cursos.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, ShoppingCart, Award, TrendingUp, Star, Crown } from 'lucide-react';
import CursoCard from '../components/CursoCard';
import toast from 'react-hot-toast';

const categorias = ['Todos', 'Uñas', 'Pies', 'Esmaltado', 'Acrílico', 'Nail Art', 'Negocios'];
const niveles = ['Todos', 'Principiante', 'Intermedio', 'Avanzado'];

const cursos = [
  {
    id: 1,
    titulo: "Manicura Profesional",
    descripcion: "Aprende técnicas avanzadas de manicura profesional",
    duracion: "2 horas",
    nivel: "Intermedio",
    precio: 25000,
    precioOferta: 19900,
    imagen: "💅",
    instructor: "Ana García",
    lecciones: 12,
    estudiantes: 156,
    calificacion: 4.8,
    categoria: "Uñas",
    certificado: true
  },
  {
    id: 2,
    titulo: "Pedicura de Lujo",
    descripcion: "Tratamientos completos para pies",
    duracion: "1.5 horas",
    nivel: "Principiante",
    precio: 20000,
    precioOferta: 15900,
    imagen: "🦶",
    instructor: "María López",
    lecciones: 8,
    estudiantes: 89,
    calificacion: 4.9,
    categoria: "Pies",
    certificado: false
  },
  {
    id: 3,
    titulo: "Esmaltado Semipermanente",
    descripcion: "Domina la técnica del esmaltado duradero",
    duracion: "1 hora",
    nivel: "Principiante",
    precio: 15000,
    precioOferta: 12900,
    imagen: "🎨",
    instructor: "Laura Martínez",
    lecciones: 6,
    estudiantes: 234,
    calificacion: 4.7,
    categoria: "Esmaltado",
    certificado: true
  },
  {
    id: 4,
    titulo: "Capping Acrílico",
    descripcion: "Aprende a hacer uñas acrílicas perfectas",
    duracion: "3 horas",
    nivel: "Avanzado",
    precio: 45000,
    precioOferta: 39900,
    imagen: "💎",
    instructor: "Sofía Rodríguez",
    lecciones: 15,
    estudiantes: 67,
    calificacion: 4.9,
    categoria: "Acrílico",
    certificado: true
  },
  {
    id: 5,
    titulo: "Nail Art Básico",
    descripcion: "Diseños sencillos para principiantes",
    duracion: "2 horas",
    nivel: "Principiante",
    precio: 18000,
    precioOferta: 14900,
    imagen: "🎨",
    instructor: "Valentina Pérez",
    lecciones: 10,
    estudiantes: 312,
    calificacion: 4.8,
    categoria: "Nail Art",
    certificado: false
  },
  {
    id: 6,
    titulo: "Gestión de Salón",
    descripcion: "Administra tu propio negocio de belleza",
    duracion: "4 horas",
    nivel: "Avanzado",
    precio: 60000,
    precioOferta: 49900,
    imagen: "📊",
    instructor: "Carolina Gómez",
    lecciones: 20,
    estudiantes: 45,
    calificacion: 4.9,
    categoria: "Negocios",
    certificado: true
  },
  {
    id: 7,
    titulo: "Extensiones de Pestañas",
    descripcion: "Curso completo de extensiones de pestañas",
    duracion: "5 horas",
    nivel: "Avanzado",
    precio: 80000,
    precioOferta: 69900,
    imagen: "👁️",
    instructor: "Daniela Ríos",
    lecciones: 25,
    estudiantes: 32,
    calificacion: 4.9,
    categoria: "Pestañas",
    certificado: true
  },
  {
    id: 8,
    titulo: "Maquillaje Profesional",
    descripcion: "Técnicas de maquillaje para eventos",
    duracion: "3 horas",
    nivel: "Intermedio",
    precio: 35000,
    precioOferta: 29900,
    imagen: "💄",
    instructor: "Camila Torres",
    lecciones: 14,
    estudiantes: 98,
    calificacion: 4.8,
    categoria: "Maquillaje",
    certificado: true
  }
];

export default function Cursos() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoriaSelected, setCategoriaSelected] = useState('Todos');
  const [nivelSelected, setNivelSelected] = useState('Todos');
  const [showFilters, setShowFilters] = useState(false);
  const [misCursos, setMisCursos] = useState([]);
  const [carrito, setCarrito] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('misCursos');
    if (saved) setMisCursos(JSON.parse(saved));
    
    const carritoGuardado = localStorage.getItem('carritoCursos');
    if (carritoGuardado) setCarrito(JSON.parse(carritoGuardado));
  }, []);

  const filtrarCursos = () => {
    return cursos.filter(curso => {
      const matchesSearch = curso.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           curso.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           curso.instructor.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategoria = categoriaSelected === 'Todos' || curso.categoria === categoriaSelected;
      const matchesNivel = nivelSelected === 'Todos' || curso.nivel === nivelSelected;
      return matchesSearch && matchesCategoria && matchesNivel;
    });
  };

  const handleComprar = (curso) => {
    if (misCursos.some(c => c.id === curso.id)) {
      toast.success(`Ya tienes acceso a ${curso.titulo}`);
      return;
    }
    
    const nuevoCarrito = [...carrito, curso];
    setCarrito(nuevoCarrito);
    localStorage.setItem('carritoCursos', JSON.stringify(nuevoCarrito));
    toast.success(`${curso.titulo} agregado al carrito`);
  };

  const cursosFiltrados = filtrarCursos();
  const cursosDestacados = cursos.filter(c => c.calificacion >= 4.8).slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-pink-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#FE5668] to-[#FF8D8F] text-white px-5 pt-8 pb-12 rounded-b-3xl">
        <h1 className="text-3xl font-bold">🎓 Cursos Fresh Nails</h1>
        <p className="text-white/90 mt-1">Aprende y especialízate en belleza</p>
        
        {/* Search Bar */}
        <div className="mt-5 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar curso..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white rounded-xl py-3 pl-10 pr-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50"
          />
        </div>
      </div>

      {/* Stats destacados */}
      <div className="px-4 -mt-6 mb-6">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-xl p-3 text-center shadow-sm">
            <Award size={20} className="text-[#FE5668] mx-auto mb-1" />
            <p className="text-xs text-gray-500">Cursos</p>
            <p className="font-bold text-gray-800">{cursos.length}</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center shadow-sm">
            <Users size={20} className="text-[#64A002] mx-auto mb-1" />
            <p className="text-xs text-gray-500">Estudiantes</p>
            <p className="font-bold text-gray-800">{cursos.reduce((sum, c) => sum + c.estudiantes, 0)}+</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center shadow-sm">
            <TrendingUp size={20} className="text-amber-500 mx-auto mb-1" />
            <p className="text-xs text-gray-500">Certificados</p>
            <p className="font-bold text-gray-800">{cursos.filter(c => c.certificado).length}</p>
          </div>
        </div>
      </div>

      {/* Cursos destacados */}
      <div className="px-4 mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-bold text-gray-800">⭐ Cursos destacados</h2>
          <button className="text-xs text-[#FE5668]">Ver todos</button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {cursosDestacados.map((curso, idx) => (
            <div key={curso.id} className="min-w-[200px] bg-white rounded-xl p-3 shadow-sm">
              <div className="text-3xl mb-2">{curso.imagen}</div>
              <p className="font-semibold text-gray-800 text-sm">{curso.titulo}</p>
              <div className="flex items-center gap-1 mt-1">
                <Star size={12} className="fill-yellow-400 text-yellow-400" />
                <span className="text-xs">{curso.calificacion}</span>
              </div>
              <button onClick={() => handleComprar(curso)} className="mt-2 w-full bg-[#FE5668] text-white py-1.5 rounded-full text-xs font-medium">
                ${curso.precioOferta.toLocaleString()}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Filtros */}
      <div className="px-4 mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-sm text-gray-600 mb-2"
        >
          <Filter size={14} /> Filtrar cursos
        </button>
        
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap gap-2 mb-3">
                {categorias.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategoriaSelected(cat)}
                    className={`px-3 py-1 rounded-full text-xs transition-all ${
                      categoriaSelected === cat 
                        ? 'bg-[#FE5668] text-white' 
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {niveles.map(niv => (
                  <button
                    key={niv}
                    onClick={() => setNivelSelected(niv)}
                    className={`px-3 py-1 rounded-full text-xs transition-all ${
                      nivelSelected === niv 
                        ? 'bg-[#64A002] text-white' 
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {niv}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Lista de cursos */}
      <div className="px-4 pb-20">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-bold text-gray-800">📚 Todos los cursos</h2>
          <p className="text-xs text-gray-400">{cursosFiltrados.length} cursos</p>
        </div>
        
        {cursosFiltrados.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">No se encontraron cursos</p>
          </div>
        ) : (
          <div className="space-y-4">
            {cursosFiltrados.map((curso, idx) => (
              <CursoCard key={curso.id} curso={curso} index={idx} onComprar={handleComprar} />
            ))}
          </div>
        )}
      </div>

      {/* Carrito flotante */}
      {carrito.length > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <button
            onClick={() => {/* abrir modal de carrito */}}
            className="w-14 h-14 bg-gradient-to-r from-[#FE5668] to-[#FF8D8F] rounded-full shadow-2xl flex items-center justify-center relative"
          >
            <ShoppingCart size={24} className="text-white" />
            {carrito.length > 0 && (
              <span className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 text-gray-800 text-xs font-bold rounded-full flex items-center justify-center">
                {carrito.length}
              </span>
            )}
          </button>
        </motion.div>
      )}
    </div>
  );
}