'use client';

import { whatsappNumber, businessInfo } from '@/src/data';
import { Phone, Mail, MapPin, Instagram, Facebook, Clock, Sparkles } from 'lucide-react';

export function Footer() {
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=Hola%20SILUEL,%20me%20interesa%20agendar%20una%20cita`;

  return (
    <footer className="bg-brand-dark text-white relative overflow-hidden">
      {/* Premium touch: Gold top border */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-warm to-transparent opacity-50" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-16">

          {/* Brand Identity Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-8 h-8 text-brand-warm" />
              <h3 className="text-3xl font-serif font-medium tracking-tight">{businessInfo.name}</h3>
            </div>
            <p className="text-brand-warm uppercase tracking-widest text-xs font-bold mb-6">
              Centro de Terapia y Masaje Excellence
            </p>
            <p className="text-white/60 mb-8 max-w-sm leading-relaxed text-lg font-light">
              Dedicados al arte del bienestar integral. Especialistas en maderoterapia,
              post-operatorio y tratamientos que armonizan cuerpo y espíritu.
            </p>
            <div className="flex space-x-5">
              <a
                href={businessInfo.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center rounded-full hover:bg-brand-warm hover:text-brand-dark transition-all duration-300 transform hover:-translate-y-1"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href={businessInfo.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center rounded-full hover:bg-brand-warm hover:text-brand-dark transition-all duration-300 transform hover:-translate-y-1"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Luxury Links Column */}
          <div>
            <h4 className="text-brand-warm font-serif text-xl border-b border-white/5 pb-4 mb-6">Nuestros Enlaces</h4>
            <ul className="space-y-4">
              <li>
                <a href="#servicios" className="text-white/70 hover:text-brand-warm transition-colors flex items-center gap-2 group">
                  <div className="w-1.5 h-1.5 bg-brand-warm rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  Especialidades
                </a>
              </li>
              <li>
                <a href="#experta" className="text-white/70 hover:text-brand-warm transition-colors flex items-center gap-2 group">
                  <div className="w-1.5 h-1.5 bg-brand-warm rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  Nuestra Experta
                </a>
              </li>
              <li>
                <a href="#testimonios" className="text-white/70 hover:text-brand-warm transition-colors flex items-center gap-2 group">
                  <div className="w-1.5 h-1.5 bg-brand-warm rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  Experiencias
                </a>
              </li>
            </ul>
          </div>

          {/* Concierge Info Column */}
          <div>
            <h4 className="text-brand-warm font-serif text-xl border-b border-white/5 pb-4 mb-6">Información</h4>
            <ul className="space-y-5 text-white/70">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 mr-3 text-brand-warm flex-shrink-0 mt-1" />
                <span className="text-sm">
                  {businessInfo.address}<br />
                  {businessInfo.city}
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-3 text-brand-warm" />
                <a href={whatsappUrl} className="text-sm hover:text-white transition-colors">
                  {businessInfo.phone}
                </a>
              </li>
              <li className="flex items-center">
                <Clock className="w-5 h-5 mr-3 text-brand-warm" />
                <span className="text-sm">L-V: 9am - 8pm | S: 9am - 6pm</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Global Boutique Credit */}
        <div className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[11px] uppercase tracking-widest text-white/40">
          <p>
            &copy; 2026 {businessInfo.fullName}. Crafted for ultimate wellness.
          </p>
          <div className="flex space-x-8 mt-6 md:mt-0">
            <a href="#" className="hover:text-brand-warm transition-colors">Legal</a>
            <a href="#" className="hover:text-brand-warm transition-colors">Cookies</a>
            <a href="#" className="hover:text-brand-warm transition-colors">Privacidad</a>
          </div>
        </div>
      </div>
    </footer>
  );
}