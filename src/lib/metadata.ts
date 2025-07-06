import { Metadata } from 'next';
import { type Place, type Package } from '@/lib/data';

/**
 * SEO & Metadata Helper Functions
 * 
 * This module provides functions to generate optimized metadata for all pages.
 * Includes OpenGraph, Twitter cards, and structured data for better SEO.
 * 
 * Features:
 * - Dynamic metadata generation
 * - OpenGraph optimization
 * - Twitter card support
 * - Structured data for rich snippets
 * - Image optimization
 * - Canonical URLs
 */

// Base site configuration
export const siteConfig = {
  name: 'Utsav Travels',
  description: 'Explore the spiritual heritage of Varanasi, Ayodhya, Rishikesh, Kedarnath with authentic travel experiences and expert guidance.',
  url: 'https://utsavtravels.com',
  domain: 'utsavtravels.com',
  creator: '@utsavtravels',
  keywords: [
    'spiritual travel',
    'Varanasi tours',
    'Ayodhya pilgrimage',
    'Rishikesh yoga',
    'Kedarnath trek',
    'India spiritual journey',
    'heritage tourism',
    'sacred destinations',
    'temple tours',
    'spiritual experiences'
  ],
  authors: [
    {
      name: 'Utsav Travels',
      url: 'https://utsavtravels.com',
    }
  ],
  ogImage: '/images/og-default.jpg',
  twitterImage: '/images/twitter-default.jpg'
};

/**
 * Generate base metadata for the application
 */
export function generateBaseMetadata(): Metadata {
  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: siteConfig.name,
      template: `%s | ${siteConfig.name}`
    },
    description: siteConfig.description,
    keywords: siteConfig.keywords,
    authors: siteConfig.authors,
    creator: siteConfig.creator,
    
    // Robots and indexing
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    
    // OpenGraph
    openGraph: {
      type: 'website',
      locale: 'en_IN',
      url: siteConfig.url,
      title: siteConfig.name,
      description: siteConfig.description,
      siteName: siteConfig.name,
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: `${siteConfig.name} - Spiritual Travel Experiences`,
        }
      ],
    },
    
    // Twitter
    twitter: {
      card: 'summary_large_image',
      title: siteConfig.name,
      description: siteConfig.description,
      images: [siteConfig.twitterImage],
      creator: siteConfig.creator,
    },
    
    // Verification
    verification: {
      google: 'your-google-verification-code',
      yandex: 'your-yandex-verification-code',
    },
    
    // Additional meta tags
    other: {
      'theme-color': '#f59e0b', // Primary color
      'color-scheme': 'dark',
      'mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'black-translucent',
      'msapplication-TileColor': '#000000',
      'msapplication-config': '/browserconfig.xml',
    },
  };
}

/**
 * Generate metadata for place detail pages
 */
export function generatePlaceMetadata(place: Place): Metadata {
  const title = `${place.name} - ${place.city} | Sacred Destinations`;
  const description = `Discover ${place.name} in ${place.city}. ${place.description.substring(0, 140)}...`;
  const url = `${siteConfig.url}/places/${place.id}`;
  const image = place.images?.[0] || place.thumbnail || siteConfig.ogImage;
  
  return {
    title,
    description,
    
    // Canonical URL
    alternates: {
      canonical: url,
    },
    
    // OpenGraph
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      locale: 'en_IN',
      siteName: siteConfig.name,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `${place.name} - ${place.city}`,
        }
      ],
      article: {
        section: 'Destinations',
        tags: place.tags,
      },
    },
    
    // Twitter
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      creator: siteConfig.creator,
    },
    
    // Keywords
    keywords: [
      ...siteConfig.keywords,
      place.name.toLowerCase(),
      place.city.toLowerCase(),
      place.category.toLowerCase(),
      ...place.tags.map(tag => tag.toLowerCase()),
      `${place.name} temple`,
      `${place.name} tour`,
      `${place.city} tourism`,
      `${place.city} spiritual`,
    ],
    
    // Additional structured data
    other: {
      'article:section': 'Destinations',
      'article:tag': place.tags.join(', '),
      'geo.placename': `${place.name}, ${place.city}`,
      'geo.position': `${place.location?.lat || ''};${place.location?.lng || ''}`,
      'ICBM': `${place.location?.lat || ''}, ${place.location?.lng || ''}`,
    },
  };
}

/**
 * Generate metadata for package detail pages
 */
export function generatePackageMetadata(pkg: Package): Metadata {
  const title = `${pkg.name} - ${pkg.duration} | Travel Packages`;
  const description = `Experience ${pkg.name}. ${pkg.description.substring(0, 140)}... Starting from ${pkg.price}`;
  const url = `${siteConfig.url}/packages/${pkg.id}`;
  const image = pkg.images?.[0] || siteConfig.ogImage;
  
  return {
    title,
    description,
    
    // Canonical URL
    alternates: {
      canonical: url,
    },
    
    // OpenGraph
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      locale: 'en_IN',
      siteName: siteConfig.name,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `${pkg.name} - ${pkg.duration}`,
        }
      ],
      article: {
        section: 'Travel Packages',
        tags: pkg.tags,
      },
    },
    
    // Twitter
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      creator: siteConfig.creator,
    },
    
    // Keywords
    keywords: [
      ...siteConfig.keywords,
      pkg.name.toLowerCase(),
      ...pkg.cities.map(city => city.toLowerCase()),
      ...pkg.tags.map(tag => tag.toLowerCase()),
      `${pkg.duration} package`,
      'travel package',
      'spiritual tour',
      ...pkg.cities.map(city => `${city} tour`),
    ],
    
    // Additional structured data
    other: {
      'product:price:amount': pkg.price.replace(/[^\d]/g, ''),
      'product:price:currency': 'INR',
      'article:section': 'Travel Packages',
      'article:tag': pkg.tags.join(', '),
    },
  };
}

/**
 * Generate metadata for listing pages (places, packages)
 */
export function generateListingMetadata(
  type: 'places' | 'packages',
  count?: number
): Metadata {
  const isPlaces = type === 'places';
  const title = isPlaces 
    ? `Sacred Destinations in India | Spiritual Places to Visit`
    : `Spiritual Travel Packages | Guided Tours & Experiences`;
  
  const description = isPlaces
    ? `Explore ${count || 'sacred'} spiritual destinations across India. Discover temples, heritage sites, and holy places in Varanasi, Ayodhya, Rishikesh, and Kedarnath.`
    : `Choose from ${count || 'curated'} spiritual travel packages. Expert-guided tours covering India's most sacred destinations with authentic experiences.`;
  
  const url = `${siteConfig.url}/${type}`;
  
  return {
    title,
    description,
    
    // Canonical URL
    alternates: {
      canonical: url,
    },
    
    // OpenGraph
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      locale: 'en_IN',
      siteName: siteConfig.name,
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: title,
        }
      ],
    },
    
    // Twitter
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [siteConfig.twitterImage],
      creator: siteConfig.creator,
    },
    
    // Keywords
    keywords: [
      ...siteConfig.keywords,
      ...(isPlaces ? [
        'spiritual destinations India',
        'sacred places India',
        'temple tours',
        'pilgrimage sites',
        'heritage destinations',
      ] : [
        'spiritual travel packages',
        'India tour packages',
        'pilgrimage tours',
        'spiritual journey packages',
        'temple tour packages',
      ])
    ],
  };
}

/**
 * Generate structured data (JSON-LD) for places
 */
export function generatePlaceStructuredData(place: Place) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    name: place.name,
    description: place.description,
    image: place.images || [place.thumbnail],
    address: {
      '@type': 'PostalAddress',
      addressLocality: place.city,
      addressCountry: 'IN',
    },
    geo: place.location ? {
      '@type': 'GeoCoordinates',
      latitude: place.location.lat,
      longitude: place.location.lng,
    } : undefined,
    touristType: place.tags,
    isAccessibleForFree: true,
    publicAccess: true,
    keywords: place.tags.join(', '),
  };
}

/**
 * Generate structured data (JSON-LD) for packages
 */
export function generatePackageStructuredData(pkg: Package) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TourPackage',
    name: pkg.name,
    description: pkg.description,
    image: pkg.images,
    offers: {
      '@type': 'Offer',
      price: pkg.price.replace(/[^\d]/g, ''),
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
    },
    duration: pkg.duration,
    touristType: pkg.tags,
    itinerary: pkg.itinerary?.map((item, index) => ({
      '@type': 'Action',
      name: `Day ${item.day}: ${item.title}`,
      description: item.description,
      startTime: `Day ${item.day}`,
    })),
    provider: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
    },
    keywords: pkg.tags.join(', '),
  };
}

/**
 * Generate breadcrumb structured data
 */
export function generateBreadcrumbStructuredData(
  items: Array<{ name: string; url: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}