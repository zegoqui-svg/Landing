import { MetadataRoute } from 'next';

const BASE_URL = 'https://spa-landing-vert.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '',
    '/blog',
  ];

  const staticRoutes = routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Blog posts would be added dynamically from your blog data
  // For now, we keep it simple
  const blogRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/blog/maderoterapia-beneficios`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/blog/drenaje-linfatico-post-cirugia`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  return [...staticRoutes, ...blogRoutes];
}
