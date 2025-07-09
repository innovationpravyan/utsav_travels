import {MetadataRoute} from 'next';

/**
 * Production-ready Dynamic Sitemap Generation
 * Optimized for SEO, performance, and maintainability
 */

// Types for better type safety
interface SitemapEntry {
    url: string;
    lastModified: Date;
    changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
    priority: number;
    images?: string[];
}

interface Place {
    id: string;
    name: string;
    city: string;
    thumbnail?: string;
    images?: string[];
    updatedAt?: string;
}

interface Package {
    id: string;
    name: string;
    thumbnail?: string;
    images?: string[];
    updatedAt?: string;
}

// Safe data fetching with fallbacks
async function safeGetPlaces(): Promise<Place[]> {
    try {
        // Dynamic import to avoid build issues
        const {getPlaces} = await import('@/lib/data');
        const places = await getPlaces();
        return Array.isArray(places) ? places : [];
    } catch (error) {
        console.warn('Failed to fetch places for sitemap:', error);
        return [];
    }
}

async function safeGetPackages(): Promise<Package[]> {
    try {
        const {getPackages} = await import('@/lib/data');
        const packages = await getPackages();
        return Array.isArray(packages) ? packages : [];
    } catch (error) {
        console.warn('Failed to fetch packages for sitemap:', error);
        return [];
    }
}

// Generate sitemap with error handling
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://utsavtravels.com';
    const currentDate = new Date();

    // Static pages with SEO priorities
    const staticPages: SitemapEntry[] = [
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
        {
            url: `${baseUrl}/destinations`,
            lastModified: currentDate,
            changeFrequency: 'weekly',
            priority: 0.85,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: currentDate,
            changeFrequency: 'weekly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/privacy-policy`,
            lastModified: currentDate,
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/terms-of-service`,
            lastModified: currentDate,
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/sitemap.xml`,
            lastModified: currentDate,
            changeFrequency: 'daily',
            priority: 0.2,
        }
    ];

    try {
        // Fetch dynamic content with timeout
        const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('Timeout')), 5000)
        );

        const [places, packages] = await Promise.race([
            Promise.all([safeGetPlaces(), safeGetPackages()]),
            timeoutPromise
        ]);

        // Generate place URLs with images
        const placePages: SitemapEntry[] = places.map((place) => {
            const images = [];
            if (place.thumbnail) images.push(place.thumbnail);
            if (place.images) images.push(...place.images.slice(0, 5)); // Limit to 5 images

            return {
                url: `${baseUrl}/places/${place.id}`,
                lastModified: place.updatedAt ? new Date(place.updatedAt) : currentDate,
                changeFrequency: 'monthly' as const,
                priority: 0.8,
                images: images.filter(Boolean)
            };
        });

        // Generate package URLs with images
        const packagePages: SitemapEntry[] = packages.map((pkg) => {
            const images = [];
            if (pkg.thumbnail) images.push(pkg.thumbnail);
            if (pkg.images) images.push(...pkg.images.slice(0, 5));

            return {
                url: `${baseUrl}/packages/${pkg.id}`,
                lastModified: pkg.updatedAt ? new Date(pkg.updatedAt) : currentDate,
                changeFrequency: 'weekly' as const,
                priority: 0.8,
                images: images.filter(Boolean)
            };
        });

        // Generate city-specific pages
        const cities = [...new Set(places.map(place => place.city).filter(Boolean))];
        const cityPages: SitemapEntry[] = cities.map(city => ({
            url: `${baseUrl}/places/city/${encodeURIComponent(city.toLowerCase())}`,
            lastModified: currentDate,
            changeFrequency: 'monthly' as const,
            priority: 0.6,
        }));

        // Generate category pages
        const categories = [
            'temples',
            'pilgrimage-sites',
            'yoga-retreats',
            'spiritual-tours',
            'heritage-sites',
            'meditation-centers'
        ];

        const categoryPages: SitemapEntry[] = categories.map(category => ({
            url: `${baseUrl}/category/${category}`,
            lastModified: currentDate,
            changeFrequency: 'weekly' as const,
            priority: 0.6,
        }));

        // Combine all pages
        const allPages = [
            ...staticPages,
            ...placePages,
            ...packagePages,
            ...cityPages,
            ...categoryPages
        ];

        // Convert to MetadataRoute.Sitemap format
        return allPages.map(page => ({
            url: page.url,
            lastModified: page.lastModified,
            changeFrequency: page.changeFrequency,
            priority: page.priority,
            ...(page.images && page.images.length > 0 && {images: page.images})
        }));

    } catch (error) {
        console.error('Error generating dynamic sitemap:', error);

        // Return static pages only if dynamic content fails
        return staticPages.map(page => ({
            url: page.url,
            lastModified: page.lastModified,
            changeFrequency: page.changeFrequency,
            priority: page.priority
        }));
    }
}