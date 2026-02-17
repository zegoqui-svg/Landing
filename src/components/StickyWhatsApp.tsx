'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import { whatsappNumber } from '@/src/data';

export function StickyWhatsApp() {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

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
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-6 right-6 z-40"
        >
          {/* Expanded message */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: 20 }}
                className="absolute bottom-16 right-0 bg-brand-white rounded-xl shadow-2xl p-4 mb-2 w-64 border border-brand-dark/10"
              >
                <button
                  onClick={() => setIsExpanded(false)}
                  className="absolute top-2 right-2 p-1 hover:bg-brand-light rounded-full"
                >
                  <X className="w-4 h-4 text-brand-dark/40" />
                </button>
                <p className="text-sm text-brand-dark/70 pr-6">
                  Hola! Tienes alguna pregunta? Escribenos por WhatsApp y te ayudamos a agendar tu cita.
                </p>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center justify-center w-full bg-brand-dark text-white text-sm font-medium py-2 rounded-lg hover:bg-brand-muted transition-colors"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Chatear ahora
                </a>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-14 h-14 bg-brand-dark rounded-full shadow-2xl flex items-center justify-center text-white hover:bg-brand-muted transition-colors relative"
          >
            <MessageCircle className="w-7 h-7" />
            {/* Pulse animation */}
            <span className="absolute w-full h-full bg-brand-dark rounded-full animate-ping opacity-20" />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}