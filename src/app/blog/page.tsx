/* eslint-disable */
import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
// El listado vive en `src/data/blog.ts` (fuente unica compartida con
// `src/app/blog/[slug]/page.tsx`). Antes estaba duplicado aqui y alli, y el
// desfase hacia que 7 de los 11 enlaces "Leer mas" dieran 404.
import { blogPosts } from '@/src/data/blog';

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
