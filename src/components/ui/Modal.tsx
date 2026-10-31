'use client';

import { ReactNode, useEffect } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';
import { SPRING_UI } from '@/src/lib/motion';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Modal({ isOpen, onClose, children, title, size = 'lg' }: ModalProps) {
  /*
   * §14 Reduced motion: con movimiento reducido el modal no escala ni
   * se desplaza; aparece con un cross-fade corto (sólo opacidad).
   */
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
  };

  /*
   * §7 Spatial consistency: el panel entra desde el centro subiendo
   * unos píxeles y sale por el MISMO recorrido, con la curva de muelle
   * espejada. `AnimatePresence` mantiene el nodo montado mientras sale,
   * que es lo que permite animar la salida.
   *
   * Sólo se animan `opacity` y `transform` (§11).
   */
  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
        >
          {/* Overlay: §12 "dim to focus" */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={reduceMotion ? { duration: 0.15 } : { duration: 0.25 }}
          />

          {/* Modal Content */}
          <motion.div
            className={`relative w-full ${sizes[size]} bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden`}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 12 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: 8 }}
            transition={reduceMotion ? { duration: 0.15 } : SPRING_UI}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            {title && (
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h3 className="text-xl font-semibold text-gray-900 font-serif">{title}</h3>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Cerrar"
                  className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-gray-100 transition-[transform,background-color] duration-300 ease-spring active:scale-[0.92] active:duration-75 motion-reduce:active:scale-100"
                >
                  <X className="w-5 h-5 text-gray-500" aria-hidden="true" />
                </button>
              </div>
            )}

            {/* Body */}
            <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
              {children}
            </div>

            {/* Close button for modals without title */}
            {!title && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar"
                className="absolute top-4 right-4 p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-black/10 transition-[transform,background-color] duration-300 ease-spring active:scale-[0.92] active:duration-75 motion-reduce:active:scale-100 z-10 bg-white/50"
              >
                <X className="w-5 h-5 text-gray-700" aria-hidden="true" />
              </button>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
