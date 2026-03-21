/* eslint-disable */
import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Blog | SILUEL Centro de Terapia y Masaje',
  description: 'Consejos sobre maderoterapia, tratamientos corporales, cuidado de la piel y bienestar. Aprende sobre los mejores tratamientos estéticos en Guadalajara.',
  keywords: 'blog belleza, consejos estética, maderoterapia, tratamientos corporales, drenaje linfático, bienestar, Guadalajara',
  openGraph: {
    title: 'Blog | SILUEL Centro de Terapia y Masaje',
    description: 'Consejos sobre maderoterapia, tratamientos corporales, cuidado de la piel y bienestar.',
    type: 'website',
    url: 'https://spa-landing-vert.vercel.app/blog',
  },
}

const blogPosts = [
  {
    slug: 'beneficios-maderoterapia',
    title: 'Beneficios de la Maderoterapia para tu Cuerpo',
    excerpt: 'Descubre cómo esta técnica ancestral puede transformar tu silueta, reducir medidas y eliminar celulitis de forma natural.',
    image: '/images/maderoterapia.jpg',
    date: '2026-03-19',
    category: 'Tratamientos',
  },
  {
    slug: 'drenaje-linfatico-post-cirugia',
    title: 'Por qué el Drenaje Linfático es Esencial después de una Cirugía',
    excerpt: 'Aprende sobre la importancia del drenaje linfático en la recuperación post-operatoria y cómo acelera tu curación.',
    image: '/images/post-operatorio.jpg',
    date: '2026-03-15',
    category: 'Recuperación',
  },
  {
    slug: 'cuidado-facial-casa',
    title: '5 Tips para Cuidar tu Rostro entre Sesiones',
    excerpt: 'Mantén los resultados de tu facial con estos simples consejos que puedes aplicar en casa.',
    image: '/images/facial.jpg',
    date: '2026-03-10',
    category: 'Cuidado Personal',
  },
  {
    slug: 'masajes-reductor-vs-relajante',
    title: 'Diferencias entre Masaje Reductor y Masaje Relajante',
    excerpt: "Conoce cuál es el tratamiento ideal para tus objetivos: modela tu cuerpo o aliviar el estrés.",
    image: '/images/masajes.jpg',
    date: '2026-03-05',
    category: 'Tratamientos',
  },
  {
    slug: 'celulitis-causas-tratamientos',
    title: 'Celulitis: Causas y Tratamientos Efectivos',
    excerpt: 'Understanding cellulit and los mejores tratamientos para reducir su apariencia de forma duradera.',
    image: '/images/corporales.jpg',
    date: '2026-02-28',
    category: 'Tratamientos',
  },
  {
    slug: 'post-operatorio-que-esperar',
    title: 'Qué Esperar en tu Primera Sesión Post-Operatoria',
    excerpt: 'Una guía completa sobre qué es normal y qué no después de tu cirugía estética.',
    image: '/images/recovery.jpg',
    date: '2026-02-20',
    category: 'Recuperación',
  },
  {
    slug: 'cuantas-sesiones-maderoterapia',
    title: 'Cuántas Sesiones de Maderoterapia Necesitas para Ver Resultados',
    excerpt: 'Te explicamos cuántas sesiones necesitas según tus objetivos: reducción de medidas, celulitis o mantenimiento.',
    image: '/images/maderoterapia.png',
    date: '2026-03-20',
    category: 'Tratamientos',
  },
  {
    slug: 'reduccion-medidas-guadalajara',
    title: 'Reducción de Medidas en Guadalajara: Tratamientos más Efectivos',
    excerpt: 'Descubre los tratamientos más efectivos para reducir medidas en Guadalajara. Maderoterapia, vacumterapia y más.',
    image: '/images/corporales.jpg',
    date: '2026-03-18',
    category: 'Tratamientos',
  },
  {
    slug: 'mejor-spa-guadalajara',
    title: 'Cómo Elegir el Mejor Spa en Guadalajara',
    excerpt: 'Guía completa para elegir el mejor spa y centro de estética en Guadalajara. Tips y recomendaciones.',
    image: '/images/hero.png',
    date: '2026-03-16',
    category: 'Consejos',
  },
  {
    slug: 'costo-maderoterapia',
    title: 'Cuánto Cuesta la Maderoterapia en Guadalajara',
    excerpt: 'Todo sobre precios y costos de la maderoterapia en Guadalajara. Qué esperar y qué incluye el tratamiento.',
    image: '/images/masajes.jpg',
    date: '2026-03-14',
    category: 'Información',
  },
  {
    slug: 'levantamiento-gluteos-sin-cirugia',
    title: 'Levantamiento de Glúteos sin Cirugía: Opciones Disponibles',
    excerpt: 'Logra glúteos más firmes y levantados sin necesidad de cirugía. Conoce las técnicas más efectivas.',
    image: '/images/levantamiento-gluteos.jpg',
    date: '2026-03-12',
    category: 'Tratamientos',
  },
]

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-brand-sand">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-brand-terracotta to-brand-sage py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">
            Blog de Belleza y Bienestar
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Consejos, tips y información sobre los mejores tratamientos estéticos para cuidarte
          </p>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <article 
                key={post.slug}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative h-48">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                  <span className="absolute top-4 left-4 bg-brand-terracotta text-white text-xs px-3 py-1 rounded-full">
                    {post.category}
                  </span>
                </div>
                <div className="p-6">
                  <p className="text-sm text-gray-500 mb-2">
                    {new Date(post.date).toLocaleDateString('es-MX', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <h2 className="text-xl font-semibold text-brand-dark mb-3 line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <Link 
                    href={`/blog/${post.slug}`}
                    className="text-brand-terracotta font-semibold hover:underline"
                  >
                    Leer más →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-brand-dark">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-serif text-white mb-4">
            ¿Lista para tu Primera Sesión?
          </h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            Agenda tu cita hoy y descubre los beneficios de nuestros tratamientos especializados
          </p>
          <a
            href="https://wa.me/523339657478"
            className="inline-block bg-brand-terracotta text-white px-8 py-3 rounded-full font-semibold hover:bg-brand-sage transition-colors"
          >
            Agendar por WhatsApp
          </a>
        </div>
      </section>
    </div>
  )
}
