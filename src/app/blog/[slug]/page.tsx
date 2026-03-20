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

La maderoterapia es una técnica ancestral originaria de Asia que utiliza implementos de madera especialmente diseñados para modelar el cuerpo.

## Principales Beneficios

### 1. Reducción de Medidas
Los implementos de madera estimulan la circulación sanguínea y linfática, lo que ayuda a movilizar la grasa localizada.

### 2. Eliminación de Celulitis
La maderoterapia ayuda a romper los depósitos de celulitis y mejorar la apariencia de la piel.

### 3. Tonificación Muscular
Los movimientos específicos tonifican los músculos y mejoran la firmeza de la piel.

## ¿Cuántas Sesiones Necesitas?

Los resultados suelen ser visibles desde la primera sesión, pero se recomienda un tratamiento de 10 a 15 sesiones para obtener resultados duraderos.

## En SILUEL

En SILUEL Centro de Terapia y Masaje, la maderoterapia es uno de nuestros tratamientos más populares. Agenda tu cita hoy.
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

### 1. Reduce la Inflamación
La acumulación de líquidos es común después de cirugías. El drenaje linfático ayuda a eliminar estos líquidos más rápidamente.

### 2. Acelera la Recuperación
Al mejorar la circulación, los nutrientes llegan más rápido a los tejidos.

### 3. Reduce los Hematomas
Ayuda a eliminar la sangre acumulada bajo la piel.

## En SILUEL

Contamos con especialistas entrenadas en drenaje linfático post-operatorio.
    `
  },
  'cuantas-sesiones-maderoterapia': {
    title: 'Cuántas Sesiones de Maderoterapia Necesitas para Ver Resultados',
    excerpt: 'Te explicamos cuántas sesiones necesitas según tus objetivos: reducción de medidas, celulitis o mantenimiento.',
    image: '/images/maderoterapia.png',
    date: '2026-03-20',
    category: 'Tratamientos',
    readTime: '5 min',
    content: `
## ¿Cuántas Sesiones de Maderoterapia Necesitas?

La respuesta depende de tus objetivos específicos:

### Reducción de Medidas
10-15 sesiones para ver resultados significativos

### Eliminación de Celulitis
12-18 sesiones para notar mejoría visible

### Mantenimiento
1-2 sesiones al mes son suficientes

## Resultados Esperados

- **Primera sesión:** Sensación de piernas más ligeras
- **5 sesiones:** Reducción de 1-3 cm
- **10 sesiones:** Resultados significativos

## En SILUEL

Personalizamos cada tratamiento según tus necesidades. Agenda tu cita hoy.
    `
  },
  'reduccion-medidas-guadalajara': {
    title: 'Reducción de Medidas en Guadalajara: Tratamientos más Efectivos',
    excerpt: 'Descubre los tratamientos más efectivos para reducir medidas en Guadalajara.',
    image: '/images/corporales.jpg',
    date: '2026-03-18',
    category: 'Tratamientos',
    readTime: '6 min',
    content: `
## Mejores Tratamientos para Reducir Medidas en Guadalajara

En SILUEL ofrecemos los tratamientos más efectivos para reducir medidas:

### Maderoterapia
Técnica ancestral con implementos de madera que ayuda a movilizar la grasa localizada.

### Tratamientos Reductivos
Masajes especializados enfocados en reducir medidas y moldear la silueta.

### Vacumterapia
Técnica de succión que ayuda a romper la grasa localizada.

### Técnicas Colombianas
Métodos colombianos de moldeado corporal para resultados visibles y duraderos.

## ¿Cuál es el Mejor Tratamiento?

El mejor tratamiento depende de tus necesidades específicas. En SILUEL te asesoramos para elegir el más adecuado para ti.

## Agenda Tu Cita en Guadalajara

Visítanos en Plan de Ayala 1859, INT 28, Guadalajara.
    `
  },
}

export async function generateStaticParams() {
  return Object.keys(blogPosts).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = blogPosts[slug]
  
  if (!post) {
    return { title: 'Artículo no encontrado | SILUEL' }
  }
  
  return {
    title: `${post.title} | SILUEL Blog`,
    description: post.excerpt,
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = blogPosts[slug]
  
  if (!post) {
    notFound()
  }
  
  const paragraphs = post.content.split('\n').filter(Boolean)
  
  return (
    <div className="min-h-screen bg-brand-sand">
      <div className="relative h-[50vh]">
        <Image src={post.image} alt={post.title} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/70 to-transparent" />
      </div>
      
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <span className="bg-brand-terracotta text-white text-sm px-3 py-1 rounded-full">{post.category}</span>
        
        <h1 className="text-4xl font-serif text-brand-dark mt-4 mb-4">{post.title}</h1>
        
        <div className="flex gap-4 text-gray-500 mb-8">
          <span>{post.date}</span>
          <span>•</span>
          <span>{post.readTime}</span>
        </div>
        
        <div className="prose prose-lg">
          {paragraphs.map((paragraph, index) => {
            if (paragraph.startsWith('## ')) {
              return <h2 key={index} className="text-2xl font-serif text-brand-dark mt-8 mb-4">{paragraph.replace('## ', '')}</h2>
            }
            if (paragraph.startsWith('### ')) {
              return <h3 key={index} className="text-xl font-semibold text-brand-dark mt-6 mb-3">{paragraph.replace('### ', '')}</h3>
            }
            if (paragraph.startsWith('- ') || /^\d+\.\s/.test(paragraph)) {
              return <li key={index} className="text-gray-700 ml-4 mb-2">{paragraph.replace(/^-\s/, '').replace(/^\d+\.\s/, '')}</li>
            }
            if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
              return <p key={index} className="text-gray-700 mb-4 font-semibold">{paragraph.replace(/\*\*/g, '')}</p>
            }
            return <p key={index} className="text-gray-700 mb-4">{paragraph}</p>
          })}
        </div>
        
        <div className="mt-12 p-8 bg-white rounded-2xl shadow-lg">
          <h3 className="text-2xl font-serif text-brand-dark mb-4">¿Quieres experimentar estos beneficios?</h3>
          <p className="text-gray-600 mb-6">Agenda tu cita en SILUEL y descubre cómo podemos ayudarte.</p>
          <a href="https://wa.me/523339657478" className="inline-block bg-brand-terracotta text-white px-8 py-3 rounded-full font-semibold">
            Agendar por WhatsApp
          </a>
        </div>
        
        <Link href="/blog" className="block mt-8 text-brand-terracotta hover:underline">← Volver al Blog</Link>
      </div>
    </div>
  )
}
