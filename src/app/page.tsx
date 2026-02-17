'use client';

import { useState } from 'react';
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

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setIsBookingOpen(true);
  };

  const handleBookClick = () => {
    setSelectedService(null);
    setIsBookingOpen(true);
  };

  return (
    <main className="min-h-screen">
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
    </main>
  )
}