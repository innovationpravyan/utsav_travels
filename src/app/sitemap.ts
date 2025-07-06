import { MetadataRoute } from 'next';
import { getPlaces, getPackages } from '@/lib/data';

/**
 * Dynamic Sitemap Generation
 * 
 * This file generates a comprehensive sitemap for better SEO.
 * It includes all static pages and dynamically generated content.
 * 
 * Features:
 * - Dynamic place and package URLs
 * - Proper priority and change frequency
 * - Last modification dates
 * - Mobile-friendly URLs
 */

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://utsavtravels.com';
  const currentDate = new Date();
  
  // Static pages with their priorities and change frequencies
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/places`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/packages`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ];

  try {
    // Fetch dynamic content
    const [places, packages] = await Promise.all([
      getPlaces(),
      getPackages(),
    ]);

    // Generate place URLs
    const placePages: MetadataRoute.Sitemap = places.map((place) => ({
      url: `${baseUrl}/places/${place.id}`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }));

    // Generate package URLs
    const packagePages: MetadataRoute.Sitemap = packages.map((pkg) => ({
      url: `${baseUrl}/packages/${pkg.id}`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    // Combine all pages
    return [
      ...staticPages,
      ...placePages,
      ...packagePages,
    ];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // Return static pages only if dynamic content fails
    return staticPages;
  }
}

/**
 * Generate additional sitemaps for better organization
 * These can be called separately if needed
 */

// Places sitemap
export async function generatePlacesSitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://utsavtravels.com';
  const currentDate = new Date();
  
  try {
    const places = await getPlaces();
    
    return places.map((place) => ({
      url: `${baseUrl}/places/${place.id}`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
      images: place.images,
    }));
  } catch (error) {
    console.error('Error generating places sitemap:', error);
    return [];
  }
}

// Packages sitemap
export async function generatePackagesSitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://utsavtravels.com';
  const currentDate = new Date();
  
  try {
    const packages = await getPackages();
    
    return packages.map((pkg) => ({
      url: `${baseUrl}/packages/${pkg.id}`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
      images: pkg.images,
    }));
  } catch (error) {
    console.error('Error generating packages sitemap:', error);
    return [];
  }
}

// City-based sitemap organization
export async function generateCitySitemaps(): Promise<Record<string, MetadataRoute.Sitemap>> {
  const baseUrl = 'https://utsavtravels.com';
  const currentDate = new Date();
  
  try {
    const places = await getPlaces();
    const citySitemaps: Record<string, MetadataRoute.Sitemap> = {};
    
    // Group places by city
    const placesByCity = places.reduce((acc, place) => {
      if (!acc[place.city]) {
        acc[place.city] = [];
      }
      acc[place.city].push(place);
      return acc;
    }, {} as Record<string, typeof places>);
    
    // Create sitemap for each city
    Object.entries(placesByCity).forEach(([city, cityPlaces]) => {
      citySitemaps[city.toLowerCase()] = cityPlaces.map((place) => ({
        url: `${baseUrl}/places/${place.id}`,
        lastModified: currentDate,
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      }));
    });
    
    return citySitemaps;
  } catch (error) {
    console.error('Error generating city sitemaps:', error);
    return {};
  }
}