'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Modal } from './Modal';
import { Button } from './Button';
import { Service } from '@/src/types';
import { services, serviceCategories, whatsappNumber, businessHours, businessHoursSummary } from '@/src/data';
import { Check, Calendar, Clock, MessageCircle, Loader2, AlertCircle } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedService: Service | null;
}

/** "09:00" -> "9:00 AM" (mismo formato que usaba la lista anterior). */
function formatSlot(hour: string): string {
  const [h, m] = hour.split(':').map(Number);
  return `${h % 12 === 0 ? 12 : h % 12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
}

// Horarios de inicio segun el horario publicado (`businessHours`). El ultimo
// inicio es una hora antes del cierre: no se ofrece una cita que empieza
// cuando el centro ya cerro. `day` = dia de la semana (0 domingo).
function getSlotsForDay(day: number): string[] | null {
  const hours = businessHours[day];
  if (!hours) return null;
  const [openH, openM] = hours.open.split(':').map(Number);
  const [closeH, closeM] = hours.close.split(':').map(Number);
  const slots: string[] = [];
  for (let t = openH * 60 + openM; t <= closeH * 60 + closeM - 60; t += 60) {
    slots.push(formatSlot(`${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`));
  }
  return slots;
}

/** Dia de la semana (0 = domingo) de una fecha ISO, en hora local. */
function weekdayOf(isoDate: string): number {
  return new Date(`${isoDate}T12:00:00`).getDay();
}

type Step = 'service' | 'calendar' | 'submitting' | 'success' | 'error';

export function BookingModal({ isOpen, onClose, selectedService }: BookingModalProps) {
  const [step, setStep] = useState<Step>('service');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  // Servicio elegido dentro del modal. Arranca en el servicio preseleccionado
  // (flujo de Servicios) o en null (CTA "Reservar" del header y del hero).
  // Cuando es null el paso 1 muestra el selector de servicios, de modo que el
  // CTA principal del sitio tiene un camino de reserva completo.
  const [chosenService, setChosenService] = useState<Service | null>(selectedService);
  // Sin servicio elegido -> el paso 1 es el selector. Se deriva del estado, sin
  // efectos, para que el primer render (SSR e hidratación) ya sea el correcto.
  const isPicking = chosenService === null;
  // Categoria publicada del servicio elegido (`src/data/index.ts`), para el
  // bloque "En que consiste tu tratamiento". Se deriva, no se fija en estado.
  const chosenCategory = chosenService
    ? serviceCategories.find(c => c.id === chosenService.category)
    : undefined;

  /*
   * Foco al cambiar de paso (WCAG 2.1 §2.4.3 "Orden del foco" y §3.2.1).
   *
   * Antes este archivo NO tenia ni una llamada a `focus()`. Al pulsar
   * "Continuar", React desmontaba el boton que tenia el foco y el foco caia
   * a `<body>`: FUERA del `role="dialog"` con `aria-modal="true"`. Con
   * teclado, el siguiente Tab se iba al principio de la pagina y no al
   * formulario del paso 2; con lector de pantalla, el cursor virtual
   * aparecia fuera del dialogo, en silencio. El mismo fallo pasaba al
   * volver al selector y al entrar en los estados de guardado / error.
   *
   * La apertura y el cierre los sigue gestionando el `Modal` (que enfoca el
   * primer control al abrir y devuelve el foco al CTA al cerrar): aqui solo
   * se actúa cuando el paso cambia de verdad, para no competir con esa
   * logica.
   */
  const stepPanelRef = useRef<HTMLDivElement>(null);
  // Paso anterior, para detectar un cambio real de paso (y no la simple
  // apertura o cierre del modal).
  const prevStepRef = useRef<Step | null>(null);

  useEffect(() => {
    // La apertura y el cierre los gestiona el `Modal` (enfoca el primer
    // control al abrir y devuelve el foco al CTA al cerrar). Aqui solo se
    // actúa cuando el paso cambia de verdad, es decir, dentro del modal.
    if (!isOpen) {
      prevStepRef.current = null;
      return;
    }
    const prevStep = prevStepRef.current;
    prevStepRef.current = step;
    // Primer render con el modal abierto: el `Modal` ya enfoca el primer
    // control, asi que aqui no se toca el foco (evita competir con el).
    if (prevStep === null || prevStep === step) return;
    const panel = stepPanelRef.current;
    if (!panel) return;
    // Se busca el primer control enfocable del panel nuevo. Si el paso no
    // tiene ninguno (estados de guardado / exito), el foco cae en el panel
    // mismo, que es tabbable por `tabIndex={-1}`.
    const focusable = panel.querySelector<HTMLElement>(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    (focusable ?? panel).focus();
  }, [step, isOpen]);

  // Horarios de inicio del dia elegido, derivados del horario publicado
  // (`businessHours`). Antes el modal usaba una lista fija que ofrecia 7:00 PM
  // los sabados (cuando el centro cierra a las 6:00 PM) y ocultaba la apertura
  // de las 9:00 AM. Sin dia elegido se usa la jornada de L-V (la mas amplia).
  const availableSlots = date ? getSlotsForDay(weekdayOf(date)) : getSlotsForDay(1);

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
    setChosenService(null);
    onClose();
  };

  /*
   * Nombre accesible del diálogo (WCAG 4.1.2): describe lo que el modal
   * muestra AHORA. Antes el `Modal` usaba un texto fijo ("Reservar cita")
   * en los cuatro estados —selector de servicio, datos, guardando y
   * error—, así que el lector de pantalla anunciaba siempre lo mismo.
   */
  const dialogLabel = (() => {
    switch (step) {
      case 'service':
        return isPicking
          ? 'Reservar cita: elige el tratamiento'
          : `Reservar cita: ${chosenService?.name ?? 'confirma el tratamiento'}`;
      case 'calendar':
        return 'Reservar cita: tus datos y disponibilidad';
      case 'submitting':
        return 'Reservar cita: guardando tus datos';
      case 'success':
        return 'Reservar cita: datos guardados';
      case 'error':
        return 'Reservar cita: no se pudo guardar';
      default:
        return 'Reservar cita';
    }
  })();

  /*
   * Nombre del paso activo, que etiqueta el panel de contenido.
   *
   * El indicador de pasos (1/2/3) ya anuncia el paso —con `aria-current="step"`
   * y el `sr-only sm:hidden`— pero el CONTENIDO de cada paso no estaba
   * etiquetado por su paso: al entrar en el formulario del paso 2, el lector
   * de pantalla anuncia el nombre del diálogo ("Reservar cita: tus datos y
   * disponibilidad") pero no dice que ese es el "Paso 2 de 3". Este rótulo
   * cierra esa relación (WCAG 1.3.1).
   */
  const activeStepLabel = (() => {
    switch (step) {
      case 'service':
        return isPicking
          ? 'Paso 1 de 3: Servicio — elige el tratamiento'
          : 'Paso 1 de 3: Servicio — confirma el tratamiento';
      case 'calendar':
        return 'Paso 2 de 3: Tus Datos y disponibilidad';
      case 'submitting':
        return 'Paso 3 de 3: Confirmar — guardando tus datos';
      case 'success':
        return 'Paso 3 de 3: Confirmar — datos guardados';
      case 'error':
        return 'Paso 3 de 3: Confirmar — no se pudo guardar';
      default:
        return 'Paso 1 de 3: Servicio';
    }
  })();

  /*
   * Descripción del diálogo (WCAG 4.1.2, `aria-describedby`).
   *
   * El nombre (`activeStepLabel` / `dialogLabel`) dice QUÉ muestra el
   * modal; la descripción dice QUÉ HAY QUE HACER para completarlo. Antes
   * el diálogo solo tenía nombre, así que el lector de pantalla
   * anunciaba "Reservar cita: tus datos y disponibilidad" sin recordar
   * que había que elegir día y hora — y sin avisar de que el envío se
   * hace por WhatsApp, que es donde termina la cita.
   *
   * Es texto de INTERFAZ (qué hacer en cada paso), no una afirmación
   * sobre el negocio: no publica precios, credenciales ni horarios que
   * no estén en `src/data/index.ts`.
   *
   * El texto se renderiza en un `<p className="sr-only">` con `id`
   * estable dentro del modal, para que el `id` exista SIEMPRE que el
   * modal esté abierto (un `aria-describedby` que apunta a un id
   * inexistente se ignora en silencio).
   */
  const dialogDescription = (() => {
    switch (step) {
      case 'service':
        return isPicking
          ? 'Elige el tratamiento que quieres reservar y pulsa Continuar.'
          : 'Confirma el tratamiento elegido y pulsa Continuar para elegir el día y la hora.';
      case 'calendar':
        return 'Escribe tu nombre y tu teléfono, elige el día y la hora, y pulsa Reservar por WhatsApp para confirmar tu cita.';
      case 'submitting':
        return 'Estamos guardando tus datos.';
      case 'success':
        return 'Tus datos se guardaron. Se abrirá WhatsApp para confirmar tu cita.';
      case 'error':
        return 'No se pudo guardar tu cita. Corrige los datos e inténtalo de nuevo.';
      default:
        return '';
    }
  })();

  const validateForm = (): boolean => {
    if (!name.trim() || name.length < 2) {
      setErrorMessage('Ingresa tu nombre completo');
      return false;
    }
    if (!phone.trim() || phone.length < 10) {
      setErrorMessage('Ingresa un teléfono válido (10 dígitos)');
      return false;
    }
    // El modal pide dia y hora. Antes se podia enviar sin ninguno y el mensaje
    // de WhatsApp llegaba sin disponibilidad, dejando la cita a medias.
    if (!date || !time) {
      setErrorMessage('Elige el día y la hora de tu cita');
      return false;
    }
    // La hora debe ser una de las disponibles para ese dia (el horario cambia
    // el sabado y el domingo no hay horario).
    if (!availableSlots || !availableSlots.includes(time)) {
      setErrorMessage('Elige un horario disponible para ese día');
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

    if (!chosenService) {
      setErrorMessage('Elige un servicio para continuar');
      setStep('service');
      return;
    }

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
          service: chosenService.id,
          preferredDate: date,
          preferredTime: time,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Error al guardar los datos');
      }

      // Track lead conversion after successful API call
      trackLeadConversion(chosenService.name, { name, phone, email, service: chosenService.id });

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

      if (chosenService) {
        message += ` para *${chosenService.name}*`;
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="xl"
      ariaLabel={dialogLabel}
      ariaDescribedBy="booking-dialog-description"
    >
      {/* Descripción del diálogo (WCAG 4.1.2). Es `sr-only` porque la
          ayuda ya se ve en pantalla ("Elige el tratamiento para tu cita",
          "Selecciona tu disponibilidad"): repetirla en texto visible
          duplicaría el mensaje. Este párrafo existe para que el lector de
          pantalla la lea al abrir el diálogo, y su `id` es el destino de
          `aria-describedby`. */}
      <p id="booking-dialog-description" className="sr-only">{dialogDescription}</p>
      <div className="bg-brand-light">
        <div className="px-6 py-4 bg-brand-white border-b border-brand-dark/10">
          {/* Indicador de pasos (WCAG 4.1.2 / 1.3.1).
              Antes era PUREAMENTE visual: los rótulos ("Servicio", "Tus
              Datos", "Confirmar") son `hidden sm:inline`, así que en móvil
              no existían en el árbol de accesibilidad, y ningún elemento
              marcaba el paso activo. Ahora:
                - el grupo es una `role="group"` con nombre, para que el
                  contexto se anuncie al entrar;
                - el paso activo lleva `aria-current="step"`;
                - los pasos completados se anuncian por su icono `Check`;
                - cada rótulo tiene un `<span className="sr-only">` con el
                  nombre del paso, para que en móvil (donde el rótulo
                  visible está oculto) el nombre siga existiendo. */}
          <div
            role="group"
            aria-label="Pasos de la reserva"
            className="flex items-center justify-center space-x-4"
          >
            {['Servicio', 'Tus Datos', 'Confirmar'].map((label, idx) => {
              const stepNumber = idx + 1;
              const isActive = step === 'service' && idx === 0 ||
                              step === 'calendar' && idx === 1 ||
                              (step === 'submitting' || step === 'success' || step === 'error') && idx === 2;
              const isCompleted = step === 'calendar' && idx === 0 ||
                                  (step === 'submitting' || step === 'success' || step === 'error') && idx <= 1;

              return (
                <div key={label} className="flex items-center">
                  <div
                    aria-current={isActive ? 'step' : undefined}
                    className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                      isActive ? 'bg-brand-dark text-white' :
                      isCompleted ? 'bg-brand-muted text-white' :
                      'bg-brand-muted/20 text-brand-muted'
                    }`}
                  >
                    {isCompleted && step !== 'submitting' ? (
                      <Check className="w-5 h-5" aria-label={`Paso ${stepNumber} completado: ${label}`} />
                    ) : (
                      <span aria-hidden="true">{stepNumber}</span>
                    )}
                  </div>
                  {/* El rótulo visible se oculta en móvil (`hidden sm:inline`),
                      así que en ese viewport el nombre del paso solo existiría
                      para quien ve la pantalla. Este hermano `sr-only sm:hidden`
                      lo mantiene en el árbol de accesibilidad SOLO en móvil
                      (en escritorio el rótulo visible ya lo nombra, y así no se
                      lee dos veces). */}
                  <span className="sr-only sm:hidden">
                    {`Paso ${stepNumber} de 3: ${label}${isActive ? ', en curso' : ''}`}
                  </span>
                  <span className={`hidden sm:inline text-sm ${
                    isActive ? 'font-semibold text-brand-dark' : 'text-brand-muted'
                  }`}>{label}</span>
                  {idx < 2 && <div className="w-8 h-0.5 bg-brand-dark/20 mx-2" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Nombre del paso activo, SIEMPRE en el árbol de accesibilidad.
            Los rótulos del indicador de pasos no sirven como objetivo de
            `aria-labelledby`: el visible es `hidden sm:inline` (display:none
            en móvil) y el `sr-only sm:hidden` desaparece en escritorio. Este
            encabezado `sr-only` existe siempre, y con el `id` estable el
            panel queda etiquetado por el paso que muestra (WCAG 1.3.1). */}
        <h4 className="sr-only" id="booking-step-panel-label">{activeStepLabel}</h4>

        {/* Panel del paso activo.
            `ref` + `tabIndex={-1}`: al cambiar de paso el foco se mueve al
            primer control del panel nuevo (ver el `useEffect` de arriba). Si
            el paso no tiene control alguno ("Guardando", "datos guardados"),
            el foco cae en el panel, que por `tabIndex={-1}` NO añade un
            tabulador nuevo: solo sirve de destino del foco.
            `role="region"` + `aria-labelledby`: la region queda nombrada por
            el paso que muestra, de modo que el lector de pantalla la
            anuncia al entrar en ella. */}
        <div
          className="p-6"
          ref={stepPanelRef}
          tabIndex={-1}
          role="region"
          aria-labelledby="booking-step-panel-label"
        >
          {/* STEP 1a: selector de servicio (CTA "Reservar" sin servicio preseleccionado) */}
          {step === 'service' && isPicking && !chosenService && (
            <div className="space-y-6">
              <div className="bg-brand-white rounded-xl p-6 shadow-sm">
                <h4 className="text-xl font-semibold text-brand-dark font-serif mb-1">¿Qué te gustaría reservar?</h4>
                <p className="text-brand-dark/60 text-sm">Elige el tratamiento para tu cita.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {services.map((service) => (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => {
                      setChosenService(service);
                    }}
                    className="flex items-center gap-3 text-left bg-brand-white rounded-xl p-3 shadow-sm border border-brand-dark/10 hover:border-brand-warm/40 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-warm/20"
                  >
                    <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={service.image}
                        alt={service.name}
                        width={56}
                        height={56}
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <h5 className="font-semibold text-brand-dark text-sm leading-snug">{service.name}</h5>
                      <p className="text-brand-dark/60 text-xs line-clamp-2 mt-1">{service.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 1b: confirmación del servicio (con servicio preseleccionado o ya elegido) */}
          {step === 'service' && !(isPicking && !chosenService) && (
            <div className="space-y-6">
              {chosenService && (
                <div className="bg-brand-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-start space-x-4">
                    <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={chosenService.image}
                        alt={chosenService.name}
                        width={80}
                        height={80}
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-semibold text-brand-dark font-serif mb-1">{chosenService.name}</h4>
                      <p className="text-brand-dark/60 text-sm">{chosenService.description}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* En que consiste tu tratamiento.
                  Solo se publica lo que ya esta en `src/data/index.ts`: la categoria
                  del servicio (con su descripcion publicada). Antes este bloque
                  mostraba cinco promesas identicas para los 9 servicios
                  ("Aromaterapia personalizada", "Bebida de bienvenida", ...) que no
                  constan en ninguna fuente del repo: era contenido inventado
                  presentado como dato de cada tratamiento. */}
              {chosenService && chosenCategory && (
                <div className="bg-brand-white rounded-xl p-6 shadow-sm">
                  <h5 className="font-semibold text-brand-dark mb-4">En qué consiste tu tratamiento</h5>
                  <ul className="space-y-2">
                    <li className="flex items-start text-brand-dark/60">
                      <Check className="w-4 h-4 text-brand-muted mr-2 flex-shrink-0 mt-0.5" aria-hidden="true" />
                      <span>
                        <span className="font-medium text-brand-dark/80">{chosenCategory.title}</span>
                        {chosenCategory.description ? ` — ${chosenCategory.description}` : ''}
                      </span>
                    </li>
                  </ul>
                </div>
              )}

              <Button onClick={() => setStep('calendar')} fullWidth size="lg">
                Continuar
                <Calendar className="w-5 h-5 ml-2" aria-hidden="true" />
              </Button>

              <button
                type="button"
                onClick={() => {
                  setChosenService(null);
                }}
                className="w-full text-center text-sm text-brand-dark/70 hover:text-brand-dark underline underline-offset-4 min-h-[44px]"
              >
                Cambiar el servicio
              </button>
            </div>
          )}

          {/* STEP 2: User Data + Date/Time */}
          {step === 'calendar' && (
            <div className="space-y-6">
              {/* Contact Form */}
              <div className="bg-brand-white rounded-xl p-6 shadow-sm space-y-4">
                <h5 className="font-semibold text-brand-dark text-lg">Tus datos de contacto</h5>
                
                <div>
                  {/* `htmlFor` + `id`: sin esta pareja el lector de pantalla
                      anuncia el campo como "campo de texto" sin nombre
                      (WCAG 1.3.1 / 4.1.2). `autoComplete` permite al navegador
                      autocompletar nombre y telefono (WCAG 1.3.5, AA). */}
                  <label htmlFor="booking-name" className="block text-sm font-medium text-brand-dark/80 mb-1">Nombre completo *</label>
                  <input
                    id="booking-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej: María García"
                    className="w-full px-4 py-3 rounded-lg border border-brand-dark/10 focus:border-brand-warm focus:ring-2 focus:ring-brand-warm/20 outline-none transition"
                  />
                </div>

                <div>
                  <label htmlFor="booking-phone" className="block text-sm font-medium text-brand-dark/80 mb-1">Teléfono *</label>
                  <input
                    id="booking-phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ej: 33 1234 5678"
                    className="w-full px-4 py-3 rounded-lg border border-brand-dark/10 focus:border-brand-warm focus:ring-2 focus:ring-brand-warm/20 outline-none transition"
                  />
                </div>

                <div>
                  <label htmlFor="booking-email" className="block text-sm font-medium text-brand-dark/80 mb-1">Email (opcional)</label>
                  <input
                    id="booking-email"
                    name="email"
                    type="email"
                    autoComplete="email"
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
                  <div className="text-sm font-medium text-brand-dark/80 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-brand-warm" aria-hidden="true" /> 1. Elige el día
                  </div>
                  {/* `role="group"` + nombre: el grupo de botones de dia es una
                      lista de opciones y su contexto ("Elige el dia") se
                      anuncia al entrar en el grupo (WCAG 1.3.1 / 4.1.2). */}
                  <div
                    role="group"
                    aria-label="Días disponibles para reservar"
                    className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 custom-scrollbar"
                  >
                    {upcomingDays.map((d) => (
                      <button
                        key={d.fullDate}
                        type="button"
                        // `aria-pressed`: el dia elegido se distinguia SOLO por
                        // color, asi que el lector de pantalla anunciaba
                        // botones identicos sin decir cual estaba elegido
                        // (WCAG 4.1.2). Es el mismo patron que se corrigio en
                        // las pestanas de categoria de `Services.tsx`.
                        aria-pressed={date === d.fullDate}
                        onClick={() => {
                          setDate(d.fullDate);
                          setTime('');
                        }}
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
                      {/* El input nativo de fecha va encima del div con
                          estilo (opacity 0), asi que necesita nombre propio:
                          sin el se anunciaba como "campo de fecha, en blanco"
                          y no se sabia para que era (WCAG 1.3.1 / 4.1.2). */}
                      <input
                        type="date"
                        aria-label="Elegir otro día"
                        value={date}
                        min={new Date().toLocaleDateString('en-CA')}
                        onChange={(e) => {
                          const next = e.target.value;
                          // El centro no abre los domingos: el input nativo si
                          // los ofrece, asi que los descartamos.
                          setDate(next && weekdayOf(next) === 0 ? '' : next);
                          setTime('');
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      {/* El div con estilo es solo decoracion: el control real
                          es el input nativo que va encima (opacity 0). Por eso
                          aqui NO va `role="button"` — seria un control
                          fantasma. El estado del dia elegido lo anuncia el
                          `aria-pressed` de los botones de la lista. */}
                      <div className={`w-16 h-20 flex flex-col items-center justify-center rounded-xl border border-dashed transition-all ${
                        date && !upcomingDays.find(d => d.fullDate === date)
                          ? 'bg-brand-dark text-white border-brand-dark shadow-md'
                          : 'border-brand-dark/20 bg-brand-dark/5 text-brand-dark/40'
                      }`}>
                        <Calendar className="w-5 h-5 mb-1" aria-hidden="true" />
                        <span className="text-[8px] uppercase font-bold text-center leading-none">Otro<br />día</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Time Grid */}
                <div className="space-y-3">
                  <div className="text-sm font-medium text-brand-dark/80 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-brand-warm" aria-hidden="true" /> 2. Elige la hora
                  </div>
                  <p className="text-xs text-brand-dark/60">
                    Horario: {businessHoursSummary}
                  </p>
                  {availableSlots && availableSlots.length > 0 ? (
                    <div
                      role="group"
                      aria-label="Horarios disponibles para reservar"
                      className="grid grid-cols-2 sm:grid-cols-5 gap-2"
                    >
                      {availableSlots.map((hour) => (
                        <button
                          key={hour}
                          type="button"
                          // `aria-pressed`: la hora elegida se distinguia SOLO
                          // por color (WCAG 4.1.2). Mismo patron que las
                          // pestanas de categoria de `Services.tsx`.
                          aria-pressed={time === hour}
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
                  ) : (
                    <p className="text-sm text-brand-dark/70 bg-brand-dark/5 rounded-lg px-4 py-3">
                      Ese día no hay disponibilidad. El centro abre de lunes a sábado.
                    </p>
                  )}
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
                  <MessageCircle className="w-5 h-5 mr-2" aria-hidden="true" />
                  Reservar por WhatsApp
                </Button>
              </div>
            </div>
          )}

          {/* SUBMITTING STATE */}
          {step === 'submitting' && (
            <div className="py-12 flex flex-col items-center justify-center space-y-4">
              <Loader2 className="w-12 h-12 text-brand-warm animate-spin" role="img" aria-label="Guardando tu información" />
              <p className="text-brand-dark/80">Guardando tu información...</p>
            </div>
          )}

          {/* SUCCESS STATE */}
          {step === 'success' && (
            <div className="py-12 flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 bg-brand-muted/20 rounded-full flex items-center justify-center">
                <Check className="w-8 h-8 text-brand-muted" aria-hidden="true" />
              </div>
              <p className="text-brand-dark/80">¡Datos guardados! Abriendo WhatsApp...</p>
            </div>
          )}

          {/* ERROR STATE */}
          {step === 'error' && (
            <div className="py-12 flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-500" aria-hidden="true" />
              </div>
              {/* `role="alert"`: sin una region viva el lector de pantalla no
                  anuncia el motivo del fallo y el usuario no sabe que
                  corrigio nada (WCAG 4.1.3). */}
              <p role="alert" aria-live="assertive" className="text-red-500 text-center">{errorMessage}</p>
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
