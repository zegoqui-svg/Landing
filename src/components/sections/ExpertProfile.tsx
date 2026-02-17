'use client';

import { motion } from 'framer-motion';
import { expertInfo } from '@/src/data';
import { Quote, Award, CheckCircle } from 'lucide-react';

export function ExpertProfile() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-brand-warm/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-muted/5 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Image Column */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative z-10 aspect-[4/5] rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] border-8 border-white">
              <img
                src={expertInfo.image}
                alt={expertInfo.name}
                className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700 hover:scale-105"
              />
            </div>

            {/* Elegant floating badge */}
            <div className="absolute -bottom-6 -left-6 z-20 bg-brand-dark text-white p-6 rounded-2xl shadow-xl border border-brand-warm/20 flex flex-col items-center">
              <Award className="w-8 h-8 text-brand-warm mb-2" />
              <span className="text-2xl font-serif font-bold leading-none">10+</span>
              <span className="text-[10px] uppercase tracking-widest font-medium opacity-80 mt-1">Años Exp.</span>
            </div>

            {/* Decorative frames */}
            <div className="absolute -top-10 -right-10 w-40 h-40 border-t-2 border-r-2 border-brand-warm/30 rounded-tr-[40px] -z-10" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 border-b-2 border-l-2 border-brand-warm/30 rounded-bl-[40px] -z-10" />
          </motion.div>

          {/* Content Column */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-block px-4 py-1.5 bg-brand-warm/10 text-brand-warm rounded-full text-sm font-medium tracking-wide mb-6">
              Nuestra Fundadora
            </div>

            <h2 className="text-4xl sm:text-5xl font-serif font-medium text-brand-dark mb-4 leading-tight">
              La visión detrás de <span className="text-brand-warm italic">Siluel</span>
            </h2>

            <p className="text-xl text-brand-warm font-serif italic mb-8 border-l-4 border-brand-warm pl-6 py-2">
              "{expertInfo.name} — {expertInfo.title}"
            </p>

            <div className="space-y-6 text-brand-dark/80 leading-relaxed text-lg font-light mb-10">
              <p>{expertInfo.bio}</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-10">
              {[
                "Tratamientos personalizados",
                "Técnicas certificadas",
                "Certificación Internacional",
                "Ambiente exclusivo"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-brand-dark/90">
                  <CheckCircle className="w-5 h-5 text-brand-warm" />
                  <span className="text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>

            <div className="bg-brand-light/50 backdrop-blur-sm rounded-2xl p-8 relative border border-brand-warm/10 shadow-inner">
              <Quote className="w-10 h-10 text-brand-warm/20 absolute -top-4 -left-4" />
              <p className="text-brand-dark/70 italic text-lg leading-relaxed font-serif relative z-10">
                {expertInfo.philosophy}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}