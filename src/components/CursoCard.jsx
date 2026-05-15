// src/components/CursoCard.jsx
import { motion } from 'framer-motion';
import { Star, Clock, Users, BookOpen, TrendingUp } from 'lucide-react';

export default function CursoCard({ curso, index, onComprar }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100"
    >
      {/* Imagen/Badge */}
      <div className="relative h-40 bg-gradient-to-br from-[#FE5668] to-[#FF8D8F] flex items-center justify-center">
        <span className="text-6xl">{curso.imagen}</span>
        {curso.precioOferta && (
          <div className="absolute top-3 right-3 bg-yellow-400 text-gray-800 text-xs font-bold px-2 py-1 rounded-full">
            -{Math.round((1 - curso.precioOferta / curso.precio) * 100)}%
          </div>
        )}
        {isHovered && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/50 flex items-center justify-center"
          >
            <button className="bg-white text-[#FE5668] px-4 py-2 rounded-full font-semibold text-sm">
              Ver detalles
            </button>
          </motion.div>
        )}
      </div>

      {/* Contenido */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{curso.categoria}</span>
          <div className="flex items-center gap-1">
            <Star size={12} className="fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-semibold">{curso.calificacion}</span>
          </div>
        </div>

        <h3 className="font-bold text-gray-800 text-lg mb-1">{curso.titulo}</h3>
        <p className="text-gray-500 text-xs mb-3">{curso.descripcion}</p>

        <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
          <div className="flex items-center gap-1"><Clock size={12} /> {curso.duracion}</div>
          <div className="flex items-center gap-1"><BookOpen size={12} /> {curso.lecciones} clases</div>
          <div className="flex items-center gap-1"><Users size={12} /> {curso.estudiantes}</div>
        </div>

        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
          <div>
            {curso.precioOferta ? (
              <>
                <span className="text-xs text-gray-400 line-through">${curso.precio.toLocaleString()}</span>
                <p className="text-xl font-bold text-[#FE5668]">${curso.precioOferta.toLocaleString()}</p>
              </>
            ) : (
              <p className="text-xl font-bold text-[#FE5668]">${curso.precio.toLocaleString()}</p>
            )}
          </div>
          <button
            onClick={() => onComprar(curso)}
            className="bg-gradient-to-r from-[#FE5668] to-[#FF8D8F] text-white px-4 py-2 rounded-full text-sm font-semibold hover:shadow-lg transition-all"
          >
            Comprar curso
          </button>
        </div>
      </div>
    </motion.div>
  );
}