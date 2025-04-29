import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.resumate.sbs'

  // Define all static routes
  const routes = [
    '/',
    '/about',
    '/auth/login',
    '/auth/register',
    '/resumes',
    '/billing',
    '/editor',
    '/cover-letters',
    '/job-board',
  ]

  // Create sitemap entries for each route
  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))
}
