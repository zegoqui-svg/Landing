'use client';

import { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { Service } from '@/src/types';
import { whatsappNumber } from '@/src/data';
import { Check, Calendar, Clock, MessageCircle } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedService: Service | null;
}

const BUSINESS_HOURS = [
  '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM',
  '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM',
  '6:00 PM', '7:00 PM'
];

export function BookingModal({ isOpen, onClose, selectedService }: BookingModalProps) {
  const [step, setStep] = useState<'service' | 'calendar'>('service');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const handleClose = () => {
    setStep('service');
    setDate('');
    setTime('');
    onClose();
  };

  const handleWhatsAppBooking = () => {
    if (!selectedService || !date || !time) return;

    // Format date for better readability in WhatsApp
    const formattedDate = new Date(date).toLocaleDateString('es-MX', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });

    const message = `Hola SILUEL, me gustaría agendar una cita para *${selectedService.name}* el día *${formattedDate}* a las *${time}*.`;
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    window.open(url, '_blank');
    handleClose();
  };

  if (!selectedService) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="xl">
      <div className="bg-brand-light">
        <div className="px-6 py-4 bg-brand-white border-b border-brand-dark/10">
          <div className="flex items-center justify-center space-x-4">
            <div className={`flex items-center ${step === 'service' ? 'text-brand-dark font-semibold' : 'text-brand-muted'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${step === 'service' ? 'bg-brand-dark text-white' : 'bg-brand-muted/20'}`}>
                {step === 'service' ? '1' : <Check className="w-5 h-5" />}
              </div>
              <span className="hidden sm:inline">Servicio</span>
            </div>
            <div className="w-8 h-0.5 bg-brand-dark/20" />
            <div className={`flex items-center ${step === 'calendar' ? 'text-brand-dark font-semibold' : 'text-brand-dark/40'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${step === 'calendar' ? 'bg-brand-dark text-white' : 'bg-brand-dark/20'}`}>
                2
              </div>
              <span className="hidden sm:inline">Agendar</span>
            </div>
          </div>
        </div>

        <div className="p-6">
          {step === 'service' && (
            <div className="space-y-6">
              <div className="bg-brand-white rounded-xl p-6 shadow-sm">
                <div className="flex items-start space-x-4">
                  <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={selectedService.image} alt={selectedService.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-semibold text-brand-dark font-serif mb-1">{selectedService.name}</h4>
                    <p className="text-brand-dark/60 text-sm">{selectedService.description}</p>
                  </div>
                </div>
              </div>

              <div className="bg-brand-white rounded-xl p-6 shadow-sm">
                <h5 className="font-semibold text-brand-dark mb-4">Que incluye</h5>
                <ul className="space-y-2">
                  {['Evaluación inicial personalizada', 'Tratamiento completo del servicio', 'Aromaterapia personalizada', 'Bebida de bienvenida', 'Consejos post-tratamiento'].map((item, index) => (
                    <li key={index} className="flex items-center text-brand-dark/60">
                      <Check className="w-4 h-4 text-brand-muted mr-2 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <Button onClick={() => setStep('calendar')} fullWidth size="lg">
                <Calendar className="w-5 h-5 mr-2" />
                Continuar a Fecha y Hora
              </Button>
            </div>
          )}

          {step === 'calendar' && (
            <div className="space-y-6">
              <div className="bg-brand-white rounded-xl p-6 shadow-sm space-y-6">
                <h5 className="font-semibold text-brand-dark text-lg mb-2">Selecciona tu disponibilidad</h5>

                <div className="space-y-4">
                  {/* Date Picker */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-brand-dark/80 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-brand-warm" /> 1. Elige el día
                    </label>
                    <input
                      type="date"
                      value={date}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full p-3 bg-brand-light/50 border border-brand-dark/10 rounded-lg focus:ring-2 focus:ring-brand-warm focus:border-transparent outline-none transition-all"
                    />
                  </div>

                  {/* Time Grid */}
                  <div className="space-y-4">
                    <label className="text-sm font-medium text-brand-dark/80 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-brand-warm" /> 2. Elige la hora
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                      {BUSINESS_HOURS.map((hour) => (
                        <button
                          key={hour}
                          onClick={() => setTime(hour)}
                          className={`py-2 px-3 text-sm font-medium rounded-lg border transition-all duration-200 ${time === hour
                              ? 'bg-brand-dark text-white border-brand-dark shadow-md scale-[1.02]'
                              : 'bg-white text-brand-dark/70 border-brand-dark/10 hover:border-brand-warm/40 hover:bg-brand-warm/5'
                            }`}
                        >
                          {hour}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-brand-warm/10 p-4 rounded-lg mt-4">
                  <p className="text-sm text-brand-dark/80 flex items-start gap-2">
                    <MessageCircle className="w-4 h-4 mt-0.5 text-brand-warm flex-shrink-0" />
                    <span>Confirmaremos la disponibilidad exacta de tu cita una vez envíes el mensaje.</span>
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={() => setStep('service')} className="flex-1">
                  Atrás
                </Button>
                <Button
                  onClick={handleWhatsAppBooking}
                  fullWidth
                  size="lg"
                  variant="accent"
                  className={`flex-[2] transition-all duration-300 ${(!date || !time) ? 'opacity-50 grayscale cursor-not-allowed' : 'hover:scale-[1.02]'}`}
                  disabled={!date || !time}
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Confirmar cita
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}