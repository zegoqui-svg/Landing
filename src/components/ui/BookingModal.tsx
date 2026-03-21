'use client';

import { useState, useMemo } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { Service } from '@/src/types';
import { whatsappNumber } from '@/src/data';
import { Check, Calendar, Clock, MessageCircle, Loader2, AlertCircle } from 'lucide-react';

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

type Step = 'service' | 'calendar' | 'submitting' | 'success' | 'error';

export function BookingModal({ isOpen, onClose, selectedService }: BookingModalProps) {
  const [step, setStep] = useState<Step>('service');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const upcomingDays = useMemo(() => {
    const days = [];
    const today = new Date();
    let dCount = 0;
    let daysFound = 0;

    while (daysFound < 7) {
      const d = new Date();
      d.setDate(today.getDate() + dCount);

      if (d.getDay() !== 0) {
        days.push({
          fullDate: d.toISOString().split('T')[0],
          dayName: d.toLocaleDateString('es-MX', { weekday: 'short' }).replace('.', ''),
          dayNumber: d.getDate(),
          monthName: d.toLocaleDateString('es-MX', { month: 'short' }).replace('.', ''),
        });
        daysFound++;
      }
      dCount++;
    }
    return days;
  }, []);

  const handleClose = () => {
    setStep('service');
    setDate('');
    setTime('');
    setName('');
    setPhone('');
    setEmail('');
    setErrorMessage('');
    onClose();
  };

  const validateForm = (): boolean => {
    if (!name.trim() || name.length < 2) {
      setErrorMessage('Ingresa tu nombre completo');
      return false;
    }
    if (!phone.trim() || phone.length < 10) {
      setErrorMessage('Ingresa un teléfono válido (10 dígitos)');
      return false;
    }
    return true;
  };

  // Track lead conversion events
  const trackLeadConversion = (serviceName: string, leadData: { name: string; phone: string; email: string; service: string }) => {
    // Google Tag Manager / dataLayer
    const w = window as Window & { dataLayer?: unknown[]; fbq?: Function };
    if (typeof window !== 'undefined' && w.dataLayer) {
      w.dataLayer.push({
        event: 'lead_captured',
        lead_source: 'booking_modal',
        service_interested: serviceName,
        lead_name: leadData.name,
        lead_phone: leadData.phone,
        lead_email: leadData.email || 'not_provided',
      });
    }

    // Facebook Pixel
    if (typeof window !== 'undefined' && w.fbq) {
      w.fbq('track', 'Lead', {
        content_name: serviceName,
        content_category: 'Booking',
        value: 0,
        currency: 'MXN',
      });
    }

    console.log('[TRACK] Lead captured:', { serviceName, leadData });
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setStep('error');
      return;
    }

    if (!selectedService) return;

    setStep('submitting');

    try {
      // 1. Send lead data to API
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          service: selectedService.id,
          preferredDate: date,
          preferredTime: time,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Error al guardar los datos');
      }

      // Track lead conversion after successful API call
      trackLeadConversion(selectedService?.name || 'unknown', { name, phone, email, service: selectedService?.id });

      setStep('success');

      // 2. Small delay to show success state
      await new Promise(resolve => setTimeout(resolve, 800));

      // 3. Redirect to WhatsApp
      const formattedDate = date 
        ? new Date(date + 'T12:00:00').toLocaleDateString('es-MX', {
            weekday: 'long',
            day: 'numeric',
            month: 'long'
          })
        : null;

      let message = `Hola SILUEL, me gustaría agendar una cita`;
      
      if (selectedService) {
        message += ` para *${selectedService.name}*`;
      }
      
      if (formattedDate) {
        message += ` el día *${formattedDate}*`;
      }
      
      if (time) {
        message += ` a las *${time}*`;
      }
      
      message += `.\n\nMis datos:\n📞: ${phone}`;
      
      if (name) {
        message += `\n👤: ${name}`;
      }

      const encodedMessage = encodeURIComponent(message);
      const url = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

      window.open(url, '_blank');
      handleClose();

    } catch (error) {
      console.error('[Booking Error]', error);
      setErrorMessage(error instanceof Error ? error.message : 'Error al procesar tu solicitud');
      setStep('error');
    }
  };

  if (!selectedService) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="xl">
      <div className="bg-brand-light">
        <div className="px-6 py-4 bg-brand-white border-b border-brand-dark/10">
          <div className="flex items-center justify-center space-x-4">
            {['Servicio', 'Tus Datos', 'Confirmar'].map((label, idx) => {
              const stepNumber = idx + 1;
              const isActive = step === 'service' && idx === 0 ||
                              step === 'calendar' && idx === 1 ||
                              (step === 'submitting' || step === 'success' || step === 'error') && idx === 2;
              const isCompleted = step === 'calendar' && idx === 0 ||
                                  (step === 'submitting' || step === 'success' || step === 'error') && idx <= 1;

              return (
                <div key={label} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                    isActive ? 'bg-brand-dark text-white' :
                    isCompleted ? 'bg-brand-muted text-white' :
                    'bg-brand-muted/20 text-brand-muted'
                  }`}>
                    {isCompleted && step !== 'submitting' ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      stepNumber
                    )}
                  </div>
                  <span className={`hidden sm:inline text-sm ${
                    isActive ? 'font-semibold text-brand-dark' : 'text-brand-muted'
                  }`}>{label}</span>
                  {idx < 2 && <div className="w-8 h-0.5 bg-brand-dark/20 mx-2" />}
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-6">
          {/* STEP 1: Service Confirmation */}
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
                <h5 className="font-semibold text-brand-dark mb-4">Qué incluye</h5>
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
                Continuar
                <Calendar className="w-5 h-5 ml-2" />
              </Button>
            </div>
          )}

          {/* STEP 2: User Data + Date/Time */}
          {step === 'calendar' && (
            <div className="space-y-6">
              {/* Contact Form */}
              <div className="bg-brand-white rounded-xl p-6 shadow-sm space-y-4">
                <h5 className="font-semibold text-brand-dark text-lg">Tus datos de contacto</h5>
                
                <div>
                  <label className="block text-sm font-medium text-brand-dark/80 mb-1">Nombre completo *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej: María García"
                    className="w-full px-4 py-3 rounded-lg border border-brand-dark/10 focus:border-brand-warm focus:ring-2 focus:ring-brand-warm/20 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-dark/80 mb-1">Teléfono *</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ej: 33 1234 5678"
                    className="w-full px-4 py-3 rounded-lg border border-brand-dark/10 focus:border-brand-warm focus:ring-2 focus:ring-brand-warm/20 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-dark/80 mb-1">Email (opcional)</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Ej: maria@email.com"
                    className="w-full px-4 py-3 rounded-lg border border-brand-dark/10 focus:border-brand-warm focus:ring-2 focus:ring-brand-warm/20 outline-none transition"
                  />
                </div>
              </div>

              {/* Date & Time */}
              <div className="bg-brand-white rounded-xl p-6 shadow-sm space-y-6">
                <h5 className="font-semibold text-brand-dark text-lg">Selecciona tu disponibilidad</h5>

                {/* Date Selector */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-brand-dark/80 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-brand-warm" /> 1. Elige el día
                  </label>
                  <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 custom-scrollbar">
                    {upcomingDays.map((d) => (
                      <button
                        key={d.fullDate}
                        onClick={() => setDate(d.fullDate)}
                        className={`flex-shrink-0 w-16 h-20 flex flex-col items-center justify-center rounded-xl border transition-all duration-200 ${
                          date === d.fullDate
                            ? 'bg-brand-dark text-white border-brand-dark shadow-md scale-[1.02]'
                            : 'bg-white text-brand-dark/70 border-brand-dark/10 hover:border-brand-warm/30'
                        }`}
                      >
                        <span className="text-[10px] uppercase font-bold tracking-tighter opacity-70 mb-1">{d.dayName}</span>
                        <span className="text-2xl font-serif font-bold leading-none">{d.dayNumber}</span>
                        <span className="text-[10px] uppercase font-medium mt-1">{d.monthName}</span>
                      </button>
                    ))}
                    <div className="flex-shrink-0 relative">
                      <input
                        type="date"
                        value={date}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setDate(e.target.value)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className={`w-16 h-20 flex flex-col items-center justify-center rounded-xl border border-dashed transition-all ${
                        date && !upcomingDays.find(d => d.fullDate === date)
                          ? 'bg-brand-dark text-white border-brand-dark shadow-md'
                          : 'border-brand-dark/20 bg-brand-dark/5 text-brand-dark/40'
                      }`}>
                        <Calendar className="w-5 h-5 mb-1" />
                        <span className="text-[8px] uppercase font-bold text-center leading-none">Otro<br />día</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Time Grid */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-brand-dark/80 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-brand-warm" /> 2. Elige la hora
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {BUSINESS_HOURS.map((hour) => (
                      <button
                        key={hour}
                        onClick={() => setTime(hour)}
                        className={`py-3 text-xs font-semibold rounded-lg border transition-all duration-200 ${
                          time === hour
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

              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={() => setStep('service')} className="flex-1">
                  Atrás
                </Button>
                <Button
                  onClick={handleSubmit}
                  fullWidth
                  size="lg"
                  variant="accent"
                  className="flex-[2]"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Reservar por WhatsApp
                </Button>
              </div>
            </div>
          )}

          {/* SUBMITTING STATE */}
          {step === 'submitting' && (
            <div className="py-12 flex flex-col items-center justify-center space-y-4">
              <Loader2 className="w-12 h-12 text-brand-warm animate-spin" />
              <p className="text-brand-dark/80">Guardando tu información...</p>
            </div>
          )}

          {/* SUCCESS STATE */}
          {step === 'success' && (
            <div className="py-12 flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 bg-brand-muted/20 rounded-full flex items-center justify-center">
                <Check className="w-8 h-8 text-brand-muted" />
              </div>
              <p className="text-brand-dark/80">¡Datos guardados! Abriendo WhatsApp...</p>
            </div>
          )}

          {/* ERROR STATE */}
          {step === 'error' && (
            <div className="py-12 flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <p className="text-red-500 text-center">{errorMessage}</p>
              <Button onClick={() => setStep('calendar')} variant="outline">
                Volver e intentar de nuevo
              </Button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
