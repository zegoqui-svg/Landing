'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { SPRING_UI, SPRING_SNAP } from '@/src/lib/motion';
import { MessageCircle, X } from 'lucide-react';
import { whatsappNumber } from '@/src/data';

export function StickyWhatsApp() {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  // §14: con movimiento reducido, solo cross-fade (sin desplazamiento ni escala)
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=Hola%20SILUEL,%20me%20interesa%20agendar%20una%20cita`;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: reduceMotion ? 0 : 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reduceMotion ? 0 : 50 }}
          transition={reduceMotion ? { duration: 0.15 } : SPRING_UI}
          className="fixed bottom-6 right-6 z-40"
        >
          {/* Expanded message */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.8, x: reduceMotion ? 0 : 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.8, x: reduceMotion ? 0 : 20 }}
                transition={reduceMotion ? { duration: 0.15 } : SPRING_SNAP}
                style={{ transformOrigin: 'bottom right' }}
                className="absolute bottom-16 right-0 bg-brand-white rounded-xl shadow-2xl p-4 mb-2 w-64 border border-brand-dark/10"
              >
                <button
                  type="button"
                  onClick={() => setIsExpanded(false)}
                  aria-label="Cerrar mensaje"
                  className="absolute top-0 right-0 p-1 min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-brand-light rounded-full"
                >
                  <X className="w-4 h-4 text-brand-dark/40" aria-hidden="true" />
                </button>
                <p className="text-sm text-brand-dark/70 pr-6">
                  Hola! Tienes alguna pregunta? Escribenos por WhatsApp y te ayudamos a agendar tu cita.
                </p>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center justify-center w-full bg-brand-dark text-white text-sm font-medium py-2 min-h-[44px] rounded-lg hover:bg-brand-muted transition-[transform,background-color] duration-300 ease-spring active:scale-[0.97] active:duration-75 motion-reduce:active:scale-100"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Chatear ahora
                </a>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main button */}
          <motion.button
            type="button"
            whileHover={reduceMotion ? undefined : { scale: 1.1 }}
            whileTap={reduceMotion ? undefined : { scale: 0.95 }}
            onClick={() => setIsExpanded(!isExpanded)}
            aria-expanded={isExpanded}
            aria-label={isExpanded ? 'Cerrar chat de WhatsApp' : 'Abrir chat de WhatsApp'}
            className="w-14 h-14 bg-brand-dark rounded-full shadow-2xl flex items-center justify-center text-white hover:bg-brand-muted transition-colors relative"
          >
            <MessageCircle className="w-7 h-7" aria-hidden="true" />
            {/* Pulse animation */}
            <span className="absolute w-full h-full bg-brand-dark rounded-full pulse-ring" aria-hidden="true" />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}