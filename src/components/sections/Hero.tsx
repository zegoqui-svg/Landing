'use client';

import { Button } from '../ui/Button';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight, Star } from 'lucide-react';
import { heroImage } from '@/src/data';

interface HeroProps {
  onBookClick: () => void;
}

export function Hero({ onBookClick }: HeroProps) {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-brand-light">
      {/* Background Image with LCP Optimization */}
      <div className="absolute inset-0 z-0">
        <Image
          src={heroImage}
          alt="SILUEL Centro de Terapia y Masaje"
          fill
          priority // Critical for LCP - loads immediately
          sizes="100vw"
          className="object-cover object-center"
          quality={85}
        />
        {/* Overlay gradient for readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-light via-brand-light/90 to-brand-light/20 lg:to-transparent" />
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
              Cosmetóloga profesional con más de 10 años de experiencia.
              Maderoterapia, drenaje linfático y cuidado post-operatorio,
              con resultados visibles.
            </p>

            <div className="flex flex-col items-center lg:items-start gap-4">
              <Button onClick={onBookClick} size="lg" className="bg-brand-dark hover:bg-brand-primary text-white px-10 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                Reservar mi cita
                <ArrowRight className="w-5 h-5 ml-2" aria-hidden="true" />
              </Button>

              {/* Prueba social inmediata, pegada al CTA (solo cifras ya publicadas en el sitio) */}
              <p className="flex flex-wrap items-center justify-center lg:justify-start gap-x-2 gap-y-1 text-sm text-brand-dark/75">
                <span className="inline-flex items-center gap-1 font-semibold text-brand-dark">
                  <Star className="w-4 h-4 text-brand-warm fill-brand-warm" aria-hidden="true" />
                  4.9/5
                </span>
                <span aria-hidden="true">·</span>
                <span>500+ clientes</span>
                <span aria-hidden="true">·</span>
                <span>10+ años de experiencia</span>
              </p>

              <button
                type="button"
                onClick={() => document.getElementById('servicios')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-sm text-brand-dark/75 underline underline-offset-4 decoration-brand-dark/30 hover:text-brand-dark hover:decoration-brand-dark rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark inline-flex items-center min-h-[44px] px-1"
              >
                Ver servicios
              </button>
            </div>
          </motion.div>
        </div>

        {/* Visual Column - Hidden on desktop, image is background */}
        <div className="hidden lg:block flex-1 h-[600px] relative">
          {/* Space intentionally empty - background image shows through */}
        </div>
      </div>
    </section>
  );
}
