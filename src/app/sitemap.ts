import { MetadataRoute } from 'next'
import { blogPosts } from '@/src/data/blog'

const BASE_URL = 'https://spa-landing-vert.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ['', '/blog'].map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Los articulos salen de la misma fuente que el indice del blog
  // (`src/data/blog.ts`). Antes el sitemap era una lista a mano con 2
  // entradas: una con un slug que no existia (`maderoterapia-beneficios`) y
  // sin ninguna de las otras 9 reales, que Google no podia indexar.
  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticRoutes, ...blogRoutes];
}
