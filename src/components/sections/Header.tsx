'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { SPRING_UI } from '@/src/lib/motion';

interface HeaderProps {
  onBookClick?: () => void;
}

export function Header({ onBookClick }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  /*
   * §14 Reduced motion: con movimiento reducido no hay muelle, la
   * transición es un cross-fade corto (sólo opacidad). Framer Motion
   * avisa de la preferencia del sistema con `useReducedMotion`.
   */
  const reduceMotion = useReducedMotion();
  const menuTransition = reduceMotion ? { duration: 0.15 } : SPRING_UI;

  /*
   * §1 Response: el botón se marca al pointer-DOWN (`:active`), no al
   * soltar. Entra en 75 ms y vuelve con la curva de muelle (300 ms):
   * respuesta inmediata al toque, retorno más suave.
   */
  const bookClasses =
    'inline-flex items-center justify-center rounded-full bg-brand-dark text-white text-sm font-medium px-5 py-2 min-h-[44px] hover:bg-brand-primary transition-[transform,background-color,color] duration-300 ease-spring active:scale-[0.97] active:duration-75 motion-reduce:active:scale-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-dark';

  const handleBook = () => {
    setIsMenuOpen(false);
    onBookClick?.();
  };
  const renderBook = (extra = '') =>
    onBookClick ? (
      <button type="button" onClick={handleBook} className={`${bookClasses} ${extra}`}>
        Reservar
      </button>
    ) : (
      <Link href="/#contacto" onClick={() => setIsMenuOpen(false)} className={`${bookClasses} ${extra}`}>
        Reservar
      </Link>
    );

  return (
    /*
     * §12 Materials: la cabecera es una capa translúcida con
     * backdrop-filter, no una barra opaca. El contenido pasa por debajo
     * y el borde superior claro es la luz que queda en el material.
     */
    <header className="fixed top-0 left-0 right-0 z-50 material-bar">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-serif font-bold text-brand-terracotta">SILUEL</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-brand-dark hover:text-brand-terracotta transition-colors">
              Inicio
            </Link>
            <Link href="/#servicios" className="text-brand-dark hover:text-brand-terracotta transition-colors">
              Servicios
            </Link>
            <Link href="/blog" className="text-brand-dark hover:text-brand-terracotta transition-colors">
              Blog
            </Link>
            <Link href="/#contacto" className="text-brand-dark hover:text-brand-terracotta transition-colors">
              Contacto
            </Link>
            {renderBook()}
          </nav>

          {/* Mobile: Reservar siempre visible + menú */}
          <div className="md:hidden flex items-center gap-2">
            {renderBook()}
            <button
              type="button"
              className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full transition-[transform] duration-300 ease-spring active:scale-[0.92] active:duration-75 motion-reduce:active:scale-100"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={isMenuOpen}
            >
              <svg className="w-6 h-6 text-brand-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/*
         * §7 Spatial consistency: el menú entra y sale por el MISMO
         * eje (desliza desde arriba, el mismo recorrido que al
         * cerrarse) y nace anclado a su disparador, el botón del
         * menú. `AnimatePresence` mantiene el nodo montado durante la
         * salida, que es lo que permite que el cierre se anime.
         */}
        <AnimatePresence initial={false}>
          {isMenuOpen && (
            <motion.nav
              key="menu-movil"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={menuTransition}
              className="md:hidden py-4 border-t border-gray-200 mt-2"
            >
              <div className="flex flex-col gap-2">
                <Link 
                  href="/" 
                  className="flex items-center min-h-[44px] text-brand-dark hover:text-brand-terracotta transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Inicio
                </Link>
                <Link 
                  href="/#servicios" 
                  className="flex items-center min-h-[44px] text-brand-dark hover:text-brand-terracotta transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Servicios
                </Link>
                <Link 
                  href="/blog" 
                  className="flex items-center min-h-[44px] text-brand-dark hover:text-brand-terracotta transition-colors font-semibold"
                  onClick={() => setIsMenuOpen(false)}
                >
                  📝 Blog
                </Link>
                <Link 
                  href="/#contacto" 
                  className="flex items-center min-h-[44px] text-brand-dark hover:text-brand-terracotta transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contacto
                </Link>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
