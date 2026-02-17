'use client';

import { motion } from 'framer-motion';
import { testimonials } from '@/src/data';
import { Card } from '../ui/Card';
import { Star, Quote } from 'lucide-react';

export function Testimonials() {
  return (
    <section className="py-24 bg-brand-light relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(#1A3C34 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="text-brand-warm font-medium uppercase tracking-[0.2em] text-sm">Experiencias Reales</span>
          <h2 className="text-4xl sm:text-5xl font-serif font-medium text-brand-dark mt-4 mb-6">
            Confianza que se <span className="italic text-brand-warm underline decoration-brand-warm/30 underline-offset-8">siente</span>
          </h2>
          <p className="text-brand-dark/60 max-w-2xl mx-auto text-lg font-light leading-relaxed">
            Nuestros clientes son el reflejo de nuestra pasión.
            Descubre por qué Siluel es el centro preferido en Guadalajara.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-10">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
            >
              <Card variant="default" className="bg-white border-0 shadow-xl p-10 relative group">
                <Quote className="w-12 h-12 text-brand-warm/10 absolute top-8 right-10 group-hover:text-brand-warm/20 transition-colors" />

                <div className="flex flex-col h-full">
                  {/* Rating */}
                  <div className="flex gap-1 mb-8">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-brand-gold fill-brand-gold" />
                    ))}
                  </div>

                  {/* Comment */}
                  <blockquote className="text-brand-dark/80 text-xl font-serif italic leading-relaxed mb-10 flex-1">
                    "{testimonial.comment}"
                  </blockquote>

                  {/* Author */}
                  <div className="flex items-center pt-8 border-t border-brand-dark/5">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full overflow-hidden mr-4 ring-4 ring-brand-warm/10 ring-offset-2">
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
                        />
                      </div>
                      <div className="absolute -bottom-1 -right-1 bg-brand-warm text-white p-1 rounded-full border-2 border-white">
                        <CheckCircle className="w-3 h-3" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-lg text-brand-dark">{testimonial.name}</h4>
                      <p className="text-xs uppercase tracking-widest text-brand-warm font-semibold">Cliente Verificado</p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Global Stats - Premium Rebuild */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-24 py-12 px-8 bg-brand-dark rounded-[2.5rem] shadow-2xl relative overflow-hidden"
        >
          {/* Subtle gold glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-warm/20 blur-[100px] pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row justify-around items-center gap-12 text-white">
            <div className="text-center group">
              <div className="flex justify-center items-center gap-2 mb-2">
                <Star className="w-5 h-5 text-brand-warm fill-brand-warm animate-pulse" />
                <span className="text-4xl font-serif font-bold tracking-tight">4.9/5</span>
              </div>
              <p className="text-brand-warm/60 uppercase tracking-widest text-xs font-semibold">Valoración Media</p>
            </div>

            <div className="w-px h-16 bg-white/10 hidden md:block" />

            <div className="text-center">
              <p className="text-4xl font-serif font-bold mb-2 tracking-tight">500+</p>
              <p className="text-brand-warm/60 uppercase tracking-widest text-xs font-semibold">Clientes Felices</p>
            </div>

            <div className="w-px h-16 bg-white/10 hidden md:block" />

            <div className="text-center">
              <p className="text-4xl font-serif font-bold mb-2 tracking-tight">98%</p>
              <p className="text-brand-warm/60 uppercase tracking-widest text-xs font-semibold">Recomendaría Siluel</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Added missing import
import { CheckCircle } from 'lucide-react';