'use client';

import { useState } from 'react';
import { Header } from '@/src/components/sections/Header';
import { Hero } from '@/src/components/sections/Hero';
import { ExpertProfile } from '@/src/components/sections/ExpertProfile';
import { Services } from '@/src/components/sections/Services';
import { Testimonials } from '@/src/components/sections/Testimonials';
import { Footer } from '@/src/components/sections/Footer';
import { StickyWhatsApp } from '@/src/components/StickyWhatsApp';
import { BookingModal } from '@/src/components/ui/BookingModal';
import { Service } from '@/src/types';

export default function Home() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const openBooking = (service: Service | null = null) => {
    setSelectedService(service);
    setIsBookingOpen(true);
  };

  const handleServiceSelect = (service: Service) => openBooking(service);
  const handleBookClick = () => openBooking();

  return (
    /*
     * El `main` de la pagina vive en `src/app/layout.tsx` (envuelve a
     * `{children}`), para que el enlace de salto "Saltar al contenido"
     * tenga el mismo destino en las 4 rutas del sitio. Aqui solo va un
     * `div` con el mismo estilo: dos `main` en un mismo documento es HTML
     * invalido y el lector de pantalla anunciaria dos "main" sin relacion.
     */
    <div className="min-h-screen pt-16">
      <Header onBookClick={handleBookClick} />
      <Hero onBookClick={handleBookClick} />
      <ExpertProfile />
      <Services onServiceSelect={handleServiceSelect} />
      <Testimonials />
      <Footer />
      
      <StickyWhatsApp />
      
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        selectedService={selectedService}
      />
    </div>
  )
}
