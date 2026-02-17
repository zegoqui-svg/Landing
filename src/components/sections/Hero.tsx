'use client';

import { Button } from '../ui/Button';
import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';
import { heroImage } from '@/src/data';

interface HeroProps {
  onBookClick: () => void;
}

export function Hero({ onBookClick }: HeroProps) {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-brand-light">
      {/* Background Image / Gradient */}
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full bg-cover bg-center bg-no-repeat opacity-20 lg:opacity-100"
          style={{
            backgroundImage: `url(${heroImage})`,
          }}
        >
          {/* Overlay gradient for readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-brand-light via-brand-light/90 to-brand-light/20 lg:to-transparent" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col lg:flex-row items-center gap-12">

        {/* Text Column */}
        <div className="flex-1 max-w-2xl text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-warm/10 text-brand-dark rounded-full text-sm font-medium mb-8 border border-brand-warm/20">
              <Star className="w-4 h-4 text-brand-warm fill-brand-warm" />
              <span>Centro Premium de Terapia y Masaje</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-medium text-brand-dark leading-[1.1] mb-8">
              Elige sentirte bien, <br />
              <span className="text-brand-warm italic relative inline-block">
                por dentro
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-brand-muted/30" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="2" fill="none" />
                </svg>
              </span> y por fuera
            </h1>

            <p className="text-lg sm:text-xl text-brand-dark/80 mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0 font-light">
              Descubre la experiencia SILUEL: maderoterapia, tratamientos reductivos,
              masajes terapeuticos y faciales personalizados.
              Relajacion profunda y resultados visibles.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button onClick={onBookClick} size="lg" className="bg-brand-dark hover:bg-brand-primary text-white px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                Agenda tu Cita
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => document.getElementById('servicios')?.scrollIntoView({ behavior: 'smooth' })}
                className="border-brand-dark/20 text-brand-dark hover:bg-brand-dark/5 rounded-full px-8"
              >
                Ver Servicios
              </Button>
            </div>

            {/* Trust Badges - Redesigned */}
            <div className="mt-16 pt-8 border-t border-brand-dark/10 flex flex-wrap justify-center lg:justify-start gap-12 text-center lg:text-left">
              <div>
                <p className="text-4xl font-serif text-brand-warm mb-1">10+</p>
                <p className="text-xs uppercase tracking-wider text-brand-dark/60 font-medium">Anos de<br />Experiencia</p>
              </div>
              <div>
                <p className="text-4xl font-serif text-brand-warm mb-1">9</p>
                <p className="text-xs uppercase tracking-wider text-brand-dark/60 font-medium">Servicios<br />Especializados</p>
              </div>
              <div>
                <p className="text-4xl font-serif text-brand-warm mb-1">100%</p>
                <p className="text-xs uppercase tracking-wider text-brand-dark/60 font-medium">Atencion<br />Personalizada</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Visual Column (hidden on mobile layout due to bg image, visible on lg as separate element if desired, or kept as bg) */}
        {/* We keep the background image approach for responsiveness but refined the overlay */}
        <div className="hidden lg:block flex-1 h-[600px] relative">
          {/* This space is intentionally left empty to reveal the background image on desktop */}
          {/* Alternatively, we could place a floating interactive element here */}
        </div>
      </div>
    </section>
  );
}