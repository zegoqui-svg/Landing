'use client';

import { useState } from 'react';
import Link from 'next/link';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-brand-sand/95 backdrop-blur-sm shadow-sm">
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
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menú"
          >
            <svg className="w-6 h-6 text-brand-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-gray-200 mt-2">
            <div className="flex flex-col gap-4">
              <Link 
                href="/" 
                className="text-brand-dark hover:text-brand-terracotta transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Inicio
              </Link>
              <Link 
                href="/#servicios" 
                className="text-brand-dark hover:text-brand-terracotta transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Servicios
              </Link>
              <Link 
                href="/blog" 
                className="text-brand-dark hover:text-brand-terracotta transition-colors font-semibold"
                onClick={() => setIsMenuOpen(false)}
              >
                📝 Blog
              </Link>
              <Link 
                href="/#contacto" 
                className="text-brand-dark hover:text-brand-terracotta transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contacto
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
