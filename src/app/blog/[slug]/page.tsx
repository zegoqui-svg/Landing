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

/**
 * Convierte el cuerpo "markdown-ish" de `src/data/blog.ts` en bloques.
 *
 * Antes el cuerpo se renderizaba linea por linea y las vinetas `- ` se
 * emitian como `<li>` sueltos, sin un `<ul>`/`<ol>` padre: HTML invalido (el
 * `<li>` debe ser hijo de una lista) y las viñetas no se anunciaban como
 * lista. Ademas el `**` en linea (p. ej. `- **5 sesiones:**`) se imprimia
 * literal, porque solo se quitaba si el parrafo *entero* venia en negrita.
 */
type Block =
  | { kind: 'h2' | 'h3' | 'p'; text: string }
  | { kind: 'ul'; items: string[] }
  | { kind: 'ol'; items: string[] };

const H2_CLASS = 'text-2xl font-serif text-brand-dark mt-8 mb-4';
const H3_CLASS = 'text-xl font-semibold text-brand-dark mt-6 mb-3';
const P_CLASS = 'text-gray-700 mb-4';
const LIST_CLASS = 'list-disc pl-6 mb-4 space-y-2 text-gray-700';
const LI_CLASS = 'text-gray-700';

function parseBody(body: string): Block[] {
  const blocks: Block[] = [];

  for (const line of body.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith('## ')) {
      blocks.push({ kind: 'h2', text: trimmed.slice(3) });
      continue;
    }
    if (trimmed.startsWith('### ')) {
      blocks.push({ kind: 'h3', text: trimmed.slice(4) });
      continue;
    }

    const bullet = /^- /.test(trimmed);
    const numbered = /^\d+\.\s/.test(trimmed);
    if (bullet || numbered) {
      const kind: 'ul' | 'ol' = bullet ? 'ul' : 'ol';
      const item = bullet ? trimmed.slice(2) : trimmed.replace(/^\d+\.\s/, '');
      const last = blocks[blocks.length - 1];
      // Consecutivas del mismo tipo -> mismo bloque de lista.
      if (last && (last.kind === 'ul' || last.kind === 'ol') && last.kind === kind) {
        last.items.push(item);
      } else {
        blocks.push({ kind, items: [item] });
      }
      continue;
    }

    blocks.push({ kind: 'p', text: trimmed });
  }

  return blocks;
}

/** Resuelve el `**negrita**` en linea a <strong>. */
function renderInline(text: string, keyPrefix: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return (
        <strong key={`${keyPrefix}-b${i}`} className="font-semibold text-brand-dark">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
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

  const body = post.content ?? buildBodyFromPublishedData(post);
  const blocks = parseBody(body);

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

        <div>
          {blocks.map((block, index) => {
            const key = `b${index}`;
            if (block.kind === 'h2') {
              return <h2 key={key} className={H2_CLASS}>{renderInline(block.text, key)}</h2>;
            }
            if (block.kind === 'h3') {
              return <h3 key={key} className={H3_CLASS}>{renderInline(block.text, key)}</h3>;
            }
            if (block.kind === 'ul' || block.kind === 'ol') {
              const ListTag = block.kind;
              return (
                <ListTag key={key} className={LIST_CLASS}>
                  {block.items.map((item, i) => (
                    <li key={`${key}-i${i}`} className={LI_CLASS}>
                      {renderInline(item, `${key}-i${i}`)}
                    </li>
                  ))}
                </ListTag>
              );
            }
            return <p key={key} className={P_CLASS}>{renderInline(block.text, key)}</p>;
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
