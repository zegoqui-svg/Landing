import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { blogPostBySlug, blogPosts, type BlogPost } from '@/src/data/blog'
import { serviceCategories, services } from '@/src/data'

interface Props {
  params: Promise<{ slug: string }>
}

/**
 * Articulos que no tienen cuerpo propio en `src/data/blog.ts` (no hay copy
 * publicado para ellos). Para no inventar texto, el cuerpo se arma con la
 * ficha real del servicio publicado en `src/data/index.ts` mas el excerpt del
 * propio articulo, que si es contenido publicado.
 */
function buildBodyFromPublishedData(post: BlogPost): string {
  const related = services.filter((s) => post.relatedServices?.includes(s.id))
  const category = serviceCategories.find((c) => c.id === post.relatedCategory)

  const lines: string[] = []
  lines.push(post.excerpt)

  if (related.length > 0) {
    lines.push('')
    lines.push('## Tratamientos relacionados')
    for (const service of related) {
      lines.push('')
      lines.push(`### ${service.name}`)
      lines.push(service.description)
    }
  }

  if (category) {
    lines.push('')
    lines.push(`## ${category.title}`)
    lines.push(category.description)
  }

  lines.push('')
  lines.push('## Agenda tu cita')
  lines.push('')
  lines.push(
    'Agenda tu cita en SILUEL Centro de Terapia y Masaje y te asesoramos sobre el tratamiento más adecuado para ti.'
  )

  return lines.join('\n')
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = blogPostBySlug[slug]

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
  const post = blogPostBySlug[slug]

  if (!post) {
    notFound()
  }

  const body = post.content ?? buildBodyFromPublishedData(post)
  const paragraphs = body.split('\n').filter(Boolean)

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
