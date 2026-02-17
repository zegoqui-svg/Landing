'use client';

import { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { Service } from '@/src/types';
import { Check, Calendar } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedService: Service | null;
}

export function BookingModal({ isOpen, onClose, selectedService }: BookingModalProps) {
  const [step, setStep] = useState<'service' | 'calendar'>('service');

  const handleClose = () => {
    setStep('service');
    onClose();
  };

  if (!selectedService) return null;

  const koalendarUrl = 'https://koalendar.com/e/agenda-tu-cita-4';

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
                  {['Evaluacion inicial personalizada', 'Tratamiento completo del servicio', 'Aromaterapia personalizada', 'Bebida de bienvenida', 'Consejos post-tratamiento'].map((item, index) => (
                    <li key={index} className="flex items-center text-brand-dark/60">
                      <Check className="w-4 h-4 text-brand-muted mr-2 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <Button onClick={() => setStep('calendar')} fullWidth size="lg">
                <Calendar className="w-5 h-5 mr-2" />
                Continuar al Calendario
              </Button>
            </div>
          )}

          {step === 'calendar' && (
            <div className="space-y-4">
              <div className="bg-brand-muted/10 border border-brand-muted/30 rounded-lg p-4">
                <p className="text-sm text-brand-dark">
                  <strong>Selecciona tu fecha y hora:</strong> El calendario mostrara la disponibilidad en tiempo real.
                </p>
              </div>

              <div className="w-full h-[600px] bg-brand-white rounded-xl overflow-hidden shadow-inner">
                <iframe src={koalendarUrl} width="100%" height="100%" frameBorder="0" allowFullScreen title="Calendario SILUEL" className="w-full h-full" />
              </div>

              <p className="text-xs text-brand-dark/40 text-center">
                Powered by Koalendar - Se sincroniza automaticamente con el calendario
              </p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}