'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Service, ServiceCategory } from '@/src/types';
import { services, serviceCategories } from '@/src/data';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Calendar, Sparkles, Heart, Sparkle, Flower2, ArrowRight } from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  Sparkles: Sparkles,
  Heart: Heart,
  Sparkle: Sparkle,
  Flower2: Flower2,
};

interface ServicesProps {
  onServiceSelect: (service: Service) => void;
}

export function Services({ onServiceSelect }: ServicesProps) {
  // Use 'corporal' as default, ensure it matches one of the valid ids
  const [activeCategory, setActiveCategory] = useState<string>('corporal');
  const tablistRef = useRef<HTMLDivElement>(null);

  const filteredServices = services.filter(s => s.category === activeCategory);
  const activeCategoryData = serviceCategories.find(c => c.id === activeCategory);

  /*
   * Navegación por flechas entre pestañas (WAI-ARIA APG, "Tabs").
   *
   * Con el `tabIndex` rotatorio (solo la pestaña activa es alcanzable con
   * Tab) las demás quedan fuera del recorrido del Tab, así que hay que
   * poder llegar a ellas con las flechas: sin esto, un usuario de teclado
   * que no use el ratón se quedaría atrapado en la primera categoría.
   *
   * Flechas ←/→: pestaña anterior / siguiente (con vuelta al inicio).
   * Inicio / Fin: primera / última pestaña. La pestaña destino recibe el
   * foco Y se activa (activación automática del APG).
   */
  const handleTablistKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End'];
    if (!keys.includes(event.key)) return;

    const currentIndex = serviceCategories.findIndex(c => c.id === activeCategory);
    if (currentIndex < 0) return;

    let nextIndex = currentIndex;
    if (event.key === 'ArrowLeft') {
      nextIndex = (currentIndex - 1 + serviceCategories.length) % serviceCategories.length;
    } else if (event.key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % serviceCategories.length;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else {
      nextIndex = serviceCategories.length - 1;
    }

    event.preventDefault();
    const nextCategory = serviceCategories[nextIndex];
    setActiveCategory(nextCategory.id);

    // Mueve el foco a la pestaña destino. El nodo se busca por su id
    // porque React todavía no ha re-renderizado el `tabIndex` rotatorio.
    const nextTab = tablistRef.current?.querySelector<HTMLButtonElement>(
      `#services-tab-${CSS.escape(nextCategory.id)}`
    );
    nextTab?.focus();
  };

  return (
    <section id="servicios" className="scroll-mt-20 pt-32 pb-28 bg-brand-light relative">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-warm/5 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-brand-warm font-medium uppercase tracking-widest text-sm">Nuestros Servicios</span>
          <h2 className="text-4xl sm:text-5xl font-serif font-medium text-brand-dark leading-[1.1] tracking-[-0.015em] mt-4 mb-6">
            Tratamientos Exclusivos
          </h2>
          <p className="text-brand-dark/70 max-w-2xl mx-auto text-lg font-light">
            Cada tratamiento es una ceremonia personalizada de bienestar,
            diseñada para armonizar tu cuerpo y mente.
          </p>
        </motion.div>

        {/*
          Category Tabs.
          Este control filtra el contenido de abajo, así que es una PESTAÑA,
          no un botón conmutado: lo que cambia al activarla es el contenido
          del panel, no un estado del propio botón. Antes eran
          `<button aria-pressed>` sueltos: el lector de pantalla anunciaba
          "botón, presionado", pero el contenido se cambiaba sin que nada lo
          anunciara y sin ninguna relación entre la pestaña y lo que muestra.

          Patrón de pestañas (WAI-ARIA APG, "Tabs"):
            - `role="tablist"` + nombre: el grupo se anuncia como tal, con
              su contexto ("Categorías de servicios").
            - `role="tab"` + `aria-selected`: la pestaña activa es la
              seleccionada, no una tecla presionada (WCAG 4.1.2).
            - `aria-controls` / `aria-labelledby`: cada pestaña apunta a su
              panel y el panel a la pestaña activa (WCAG 1.3.1).
            - `tabIndex` rotatorio: solo la pestaña activa es alcanzable con
              Tab; las demás se recorren con las flechas (ver abajo).
        */}
        <div
          ref={tablistRef}
          role="tablist"
          aria-label="Categorías de servicios"
          onKeyDown={handleTablistKeyDown}
          className="flex flex-wrap justify-center gap-6 mb-16"
        >
          {serviceCategories.map((category) => {
            const Icon = iconMap[category.icon] || Sparkles;
            const isActive = activeCategory === category.id;
            return (
              <button
                key={category.id}
                type="button"
                role="tab"
                id={`services-tab-${category.id}`}
                aria-selected={isActive}
                aria-controls="services-panel"
                tabIndex={isActive ? 0 : -1}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-3 px-8 py-4 rounded-full text-sm font-medium transition-all duration-300 border group ${isActive
                  ? 'bg-brand-dark text-white border-brand-dark shadow-xl scale-105'
                  : 'bg-white text-brand-dark/70 border-brand-dark/5 hover:border-brand-dark/20 hover:bg-white hover:text-brand-dark hover:shadow-md'
                  }`}
              >
                <Icon
                  aria-hidden="true"
                  className={`w-5 h-5 ${isActive ? 'text-brand-warm' : 'text-brand-muted group-hover:text-brand-dark'}`}
                />
                <span className="tracking-wide">{category.title.replace(/[\u{1F300}-\u{1F9FF}]/gu, '')}</span>
              </button>
            );
          })}
        </div>

        {/*
          Panel de las pestañas: descripción de la categoría + rejilla de
          servicios. Es una sola región que se sustituye al cambiar de
          pestaña, de modo que el `role="tabpanel"` cubre TODO lo que la
          pestaña activa muestra. `aria-labelledby` lo ancla a la pestaña
          activa para que se anuncie con su nombre.
        */}
        <div
          role="tabpanel"
          id="services-panel"
          aria-labelledby={`services-tab-${activeCategory}`}
          tabIndex={0}
        >
          {/* Category Description */}
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center mb-12 max-w-3xl mx-auto"
          >
            <h3 className="text-2xl font-serif text-brand-dark mb-3">
              {activeCategoryData?.title}
            </h3>
            <p className="text-brand-dark/60 italic font-serif text-lg">"{activeCategoryData?.description}"</p>
          </motion.div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card variant="elevated" className="h-full flex flex-col group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500">
                  {/* Image */}
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                    <Image
                      src={service.image}
                      alt={service.name}
                      width={640}
                      height={480}
                      sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 384px"
                      loading="lazy"
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute bottom-4 left-4 z-20 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                      <span className="inline-flex items-center text-white text-sm font-medium">
                        Ver detalles <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8 flex-1 flex flex-col bg-white relative z-20">
                    <h4 className="text-xl font-serif font-bold text-brand-dark mb-3 group-hover:text-brand-warm transition-colors">
                      {service.name}
                    </h4>
                    <p className="text-brand-dark/60 text-sm mb-6 line-clamp-3 leading-relaxed flex-1">
                      {service.description}
                    </p>

                    {/* CTA */}
                    <Button
                      onClick={() => onServiceSelect(service)}
                      fullWidth
                      size="md"
                      variant="accent"
                      className="mt-auto group-hover:scale-[1.02] transition-transform duration-300"
                    >
                      <Calendar className="w-4 h-4 mr-2" aria-hidden="true" />
                      Reservar Cita
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}