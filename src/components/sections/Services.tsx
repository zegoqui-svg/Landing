'use client';

import { useState } from 'react';
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

  const filteredServices = services.filter(s => s.category === activeCategory);
  const activeCategoryData = serviceCategories.find(c => c.id === activeCategory);

  return (
    <section id="servicios" className="py-24 bg-brand-light relative">
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
          <h2 className="text-4xl sm:text-5xl font-serif font-medium text-brand-dark mt-4 mb-6">
            Tratamientos Exclusivos
          </h2>
          <p className="text-brand-dark/70 max-w-2xl mx-auto text-lg font-light">
            Cada tratamiento es una ceremonia personalizada de bienestar,
            diseñada para armonizar tu cuerpo y mente.
          </p>
        </motion.div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-6 mb-16">
          {serviceCategories.map((category) => {
            const Icon = iconMap[category.icon] || Sparkles;
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-3 px-8 py-4 rounded-full text-sm font-medium transition-all duration-300 border group ${activeCategory === category.id
                  ? 'bg-brand-dark text-white border-brand-dark shadow-xl scale-105'
                  : 'bg-white text-brand-dark/70 border-brand-dark/5 hover:border-brand-dark/20 hover:bg-white hover:text-brand-dark hover:shadow-md'
                  }`}
              >
                <Icon className={`w-5 h-5 ${activeCategory === category.id ? 'text-brand-warm' : 'text-brand-muted group-hover:text-brand-dark'}`} />
                <span className="tracking-wide">{category.title.replace(/[\u{1F300}-\u{1F9FF}]/gu, '')}</span>
              </button>
            );
          })}
        </div>

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
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute bottom-4 left-4 z-20 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                    <span className="inline-flex items-center text-white text-sm font-medium">
                      Ver detalles <ArrowRight className="w-4 h-4 ml-2" />
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
                    <Calendar className="w-4 h-4 mr-2" />
                    Reservar Cita
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}