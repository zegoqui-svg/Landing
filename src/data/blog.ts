/**
 * Fuente unica de verdad del blog.
 *
 * Antes este listado vivia duplicado: `src/app/blog/page.tsx` tenia los 11
 * articulos (con titulo, excerpt, imagen, fecha y categoria) y
 * `src/app/blog/[slug]/page.tsx` tenia solo 4 (los unicos con cuerpo de
 * articulo). Resultado: 7 de los 11 "Leer mas" del indice lead to a 404,
 * y el sitemap anunciaba un slug que no existia.
 *
 * Aqui viven los 11, con su metadata real (publicada), y `content` solo para
 * los que tienen cuerpo de articulo. Los que no lo tienen se renderizan a
 * partir de su propio `excerpt` mas los servicios y categorias ya
 * publicados en `src/data/index.ts`. No se inventa copy.
 */

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  category: string;
  readTime: string;
  /** Cuerpo en markdown-ish. Vacio = el articulo se arma con el excerpt. */
  content?: string;
  /** Slugs de `services` de `src/data/index.ts` que el articulo menciona. */
  relatedServices?: string[];
  /** Id de `serviceCategories` de `src/data/index.ts` que el articulo menciona. */
  relatedCategory?: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'beneficios-maderoterapia',
    title: 'Beneficios de la Maderoterapia para tu Cuerpo',
    excerpt:
      'Descubre cómo esta técnica ancestral puede transformar tu silueta, reducir medidas y eliminar celulitis de forma natural.',
    image: '/images/maderoterapia.jpg',
    date: '2026-03-19',
    category: 'Tratamientos',
    readTime: '5 min',
    relatedServices: ['maderoterapia'],
    relatedCategory: 'corporal',
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
    `,
  },
  {
    slug: 'drenaje-linfatico-post-cirugia',
    title: 'Por qué el Drenaje Linfático es Esencial después de una Cirugía',
    excerpt:
      'Aprende sobre la importancia del drenaje linfático en la recuperación post-operatoria y cómo acelera tu curación.',
    image: '/images/post-operatorio.jpg',
    date: '2026-03-15',
    category: 'Recuperación',
    readTime: '4 min',
    relatedServices: ['drenaje-linfatico', 'post-operatorio'],
    relatedCategory: 'recovery',
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
    `,
  },
  {
    slug: 'cuantas-sesiones-maderoterapia',
    title: 'Cuántas Sesiones de Maderoterapia Necesitas para Ver Resultados',
    excerpt:
      'Te explicamos cuántas sesiones necesitas según tus objetivos: reducción de medidas, celulitis o mantenimiento.',
    image: '/images/maderoterapia.png',
    date: '2026-03-20',
    category: 'Tratamientos',
    readTime: '5 min',
    relatedServices: ['maderoterapia'],
    relatedCategory: 'corporal',
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
    `,
  },
  {
    slug: 'reduccion-medidas-guadalajara',
    title: 'Reducción de Medidas en Guadalajara: Tratamientos más Efectivos',
    excerpt:
      'Descubre los tratamientos más efectivos para reducir medidas en Guadalajara. Maderoterapia, vacumterapia y más.',
    image: '/images/corporales.jpg',
    date: '2026-03-18',
    category: 'Tratamientos',
    readTime: '6 min',
    relatedServices: ['maderoterapia', 'reductivos', 'levantamiento-gluteos', 'tecnicas-colombianas'],
    relatedCategory: 'corporal',
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
    `,
  },
  {
    slug: 'celulitis-causas-tratamientos',
    title: 'Celulitis: Causas y Tratamientos Efectivos',
    excerpt:
      'Understanding cellulit and los mejores tratamientos para reducir su apariencia de forma duradera.',
    image: '/images/corporales.jpg',
    date: '2026-02-28',
    category: 'Tratamientos',
    readTime: '4 min',
    relatedServices: ['maderoterapia', 'reductivos'],
    relatedCategory: 'corporal',
  },
  {
    slug: 'costo-maderoterapia',
    title: 'Cuánto Cuesta la Maderoterapia en Guadalajara',
    excerpt:
      'Todo sobre precios y costos de la maderoterapia en Guadalajara. Qué esperar y qué incluye el tratamiento.',
    image: '/images/masajes.jpg',
    date: '2026-03-14',
    category: 'Información',
    readTime: '3 min',
    relatedServices: ['maderoterapia'],
    relatedCategory: 'corporal',
  },
  {
    slug: 'cuidado-facial-casa',
    title: '5 Tips para Cuidar tu Rostro entre Sesiones',
    excerpt:
      'Mantén los resultados de tu facial con estos simples consejos que puedes aplicar en casa.',
    image: '/images/facial.jpg',
    date: '2026-03-10',
    category: 'Cuidado Personal',
    readTime: '3 min',
    relatedServices: ['faciales'],
    relatedCategory: 'facial',
  },
  {
    slug: 'levantamiento-gluteos-sin-cirugia',
    title: 'Levantamiento de Glúteos sin Cirugía: Opciones Disponibles',
    excerpt:
      'Logra glúteos más firmes y levantados sin necesidad de cirugía. Conoce las técnicas más efectivas.',
    image: '/images/levantamiento-gluteos.jpg',
    date: '2026-03-12',
    category: 'Tratamientos',
    readTime: '4 min',
    relatedServices: ['levantamiento-gluteos'],
    relatedCategory: 'corporal',
  },
  {
    slug: 'masajes-reductor-vs-relajante',
    title: 'Diferencias entre Masaje Reductor y Masaje Relajante',
    excerpt:
      'Conoce cuál es el tratamiento ideal para tus objetivos: modela tu cuerpo o aliviar el estrés.',
    image: '/images/masajes.jpg',
    date: '2026-03-05',
    category: 'Tratamientos',
    readTime: '4 min',
    relatedServices: ['reductivos', 'masaje-relajante', 'masaje-descontracturante'],
    relatedCategory: 'masajes',
  },
  {
    slug: 'mejor-spa-guadalajara',
    title: 'Cómo Elegir el Mejor Spa en Guadalajara',
    excerpt:
      'Guía completa para elegir el mejor spa y centro de estética en Guadalajara. Tips y recomendaciones.',
    image: '/images/hero.png',
    date: '2026-03-16',
    category: 'Consejos',
    readTime: '5 min',
    relatedServices: ['maderoterapia', 'post-operatorio', 'faciales'],
    relatedCategory: 'recovery',
  },
  {
    slug: 'post-operatorio-que-esperar',
    title: 'Qué Esperar en tu Primera Sesión Post-Operatoria',
    excerpt:
      'Una guía completa sobre qué es normal y qué no después de tu cirugía estética.',
    image: '/images/recovery.jpg',
    date: '2026-02-20',
    category: 'Recuperación',
    readTime: '4 min',
    relatedServices: ['post-operatorio', 'drenaje-linfatico'],
    relatedCategory: 'recovery',
  },
];

export const blogPostBySlug = blogPosts.reduce<Record<string, BlogPost>>(
  (acc, post) => {
    acc[post.slug] = post;
    return acc;
  },
  {}
);
