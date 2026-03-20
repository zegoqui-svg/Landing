import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ slug: string }>
}

const blogPosts: Record<string, {
  title: string
  excerpt: string
  content: string
  image: string
  date: string
  category: string
  readTime: string
}> = {
  'beneficios-maderoterapia': {
    title: 'Beneficios de la Maderoterapia para tu Cuerpo',
    excerpt: 'Descubre cómo esta técnica ancestral puede transformar tu silueta, reducir medidas y eliminar celulitis de forma natural.',
    image: '/images/maderoterapia.jpg',
    date: '2026-03-19',
    category: 'Tratamientos',
    readTime: '5 min',
    content: `
## ¿Qué es la Maderoterapia?

La maderoterapia es una técnica ancestral originaria de Asia que utiliza implementos de madera especialmente diseñados para modelar el cuerpo. Esta práctica milenaria ha ganado popularidad en todo el mundo por sus resultados visibles y duraderos.

## Principales Beneficios

### 1. Reducción de Medidas
Los implementos de madera estimulan la circulación sanguínea y linfática, lo que ayuda a movilizar la grasa localizada y reducir medidas de forma natural.

### 2. Eliminación de Celulitis
La celulitis se produce cuando las células de grasa se acumulan bajo la piel. La maderoterapia ayuda a romper estos depósitos y mejorar la apariencia de la piel.

### 3. Tonificación Muscular
Los movimientos específicos con los implementos de madera tonifican los músculos y mejoran la firmeza de la piel.

### 4. Relajación Profunda
A diferencia de otros tratamientos más agresivos, la maderoterapia proporciona una experiencia relajante mientras trabajas en tu cuerpo.

## ¿Cuántas Sesiones Necesitas?

Los resultados suelen ser visibles desde la primera sesión, pero se recomienda un tratamiento de 10 a 15 sesiones para obtener resultados duraderos. El número exacto depende de tus objetivos personales y del estado inicial de tu cuerpo.

## En SILUEL

En SILUEL Centro de Terapia y Masaje, la maderoterapia es uno de nuestros tratamientos más populares. Nuestra especialista Elsa Gómez tiene más de 10 años de experiencia en esta técnica ypersonaliza cada sesión según tus necesidades específicas.

Agenda tu cita hoy y descubre los beneficios de la maderoterapia para ti.
    `
  },
  'drenaje-linfatico-post-cirugia': {
    title: 'Por qué el Drenaje Linfático es Esencial después de una Cirugía',
    excerpt: 'Aprende sobre la importancia del drenaje linfático en la recuperación post-operatoria y cómo acelera tu curación.',
    image: '/images/post-operatorio.jpg',
    date: '2026-03-15',
    category: 'Recuperación',
    readTime: '4 min',
    content: `
## ¿Por qué es importante el Drenaje Linfático después de una Cirugía?

Después de una cirugía estética, el cuerpo necesita recuperarse correctamente. El drenaje linfático manual es uno de los tratamientos más importantes en esta etapa.

## Beneficios del Drenaje Linfático Post-Operatorio

### 1. Reduce laInflamación
La acumulación de líquidos es común después de cirugías. El drenaje linfático ayuda a eliminar estos líquidos más rápidamente.

### 2. Acelera la Recuperación
Al mejorar la circulación, los nutrientes llegan más rápido a los tejidos, acelera la curación.

### 3. Reduce los Hematomas
Ayuda a eliminar la sangre acumulada bajo la piel, reduciendo la apariencia de moretones.

### 4. Mejora los Resultados
Una buena recuperación significa mejores resultados finales de tu cirugía.

## ¿Cuándo Empezar?

Generalmente, el drenaje linfático puede comenzar de 5 a 7 días después de la cirugía, dependiendo del tipo de intervención. Siempre consulta con tu cirujano antes de iniciar cualquier tratamiento.

## En SILUEL

Contamos con especialistas entrenadas en drenaje linfático post-operatorio. Nuestro enfoque suave y efectivo garantiza una recuperación cómoda y resultados óptimos.
    `
  }
}

// Generate static params for all blog posts
export async function generateStaticParams() {
  return Object.keys(blogPosts).map((slug) => ({
    slug,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = blogPosts[slug]
  
  if (!post) {
    return {
      title: 'Artículo no encontrado | SILUEL',
    }
  }
  
  return {
    title: `${post.title} | SILUEL Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      url: `https://spa-landing-vert.vercel.app/blog/${slug}`,
      images: [
        {
          url: `https://spa-landing-vert.vercel.app${post.image}`,
          alt: post.title,
        }
      ],
      publishedTime: post.date,
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = blogPosts[slug]
  
  if (!post) {
    notFound()
  }
  
  const content = post.content.split('\n').filter(Boolean)
  
  return (
    <div className="min-h-screen bg-brand-sand">
      {/* Hero Image */}
      <div className="relative h-[50vh]">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <span className="bg-brand-terracotta text-white text-sm px-3 py-1 rounded-full">
              {post.category}
            </span>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <article className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif text-brand-dark mb-4">
            {post.title}
          </h1>
          
          <div className="flex items-center gap-4 text-gray-500 mb-8">
            <span>{new Date(post.date).toLocaleDateString('es-MX', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</span>
            <span>•</span>
            <span>{post.readTime} de lectura</span>
          </div>
          
          <div className="prose prose-lg max-w-none">
            {content.map((paragraph, index) => {
              if (paragraph.startsWith('## ')) {
                return (
                  <h2 key={index} className="text-2xl font-serif text-brand-dark mt-8 mb-4">
                    {paragraph.replace('## ', '')}
                  </h2>
                )
              }
              if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={index} className="text-xl font-semibold text-brand-dark mt-6 mb-3">
                    {paragraph.replace('### ', '')}
                  </h3>
                )
              }
              if (paragraph.startsWith('- ')) {
                return (
                  <li key={index} className="text-gray-700 ml-4">
                    {paragraph.replace('- ', '')}
                  </li>
                )
              }
              if (/^\d+\.\s/.test(paragraph)) {
                return (
                  <li key={index} className="text-gray-700 ml-4">
                    {paragraph}
                  </li>
                )
              }
              return (
                <p key={index} className="text-gray-700 mb-4">
                  {paragraph}
                </p>
              )
            })}
          </div>
          
          {/* CTA */}
          <div className="mt-12 p-8 bg-white rounded-2xl shadow-lg">
            <h3 className="text-2xl font-serif text-brand-dark mb-4">
              ¿Quieres experimentar estos beneficios?
            </h3>
            <p className="text-gray-600 mb-6">
              Agenda tu cita en SILUEL y descubre cómo podemos ayudarte a sentirte mejor.
            </p>
            <a
              href="https://wa.me/523339657478"
              className="inline-block bg-brand-terracotta text-white px-8 py-3 rounded-full font-semibold hover:bg-brand-sage transition-colors"
            >
              Agendar por WhatsApp
            </a>
          </div>
        </article>
        
        {/* Back to Blog */}
        <div className="mt-12 text-center">
          <Link
            href="/blog"
            className="text-brand-terracotta hover:underline"
          >
            ← Volver al Blog
          </Link>
        </div>
      </div>
    </div>
  )
}
