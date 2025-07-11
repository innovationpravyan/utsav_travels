// src/app/page.tsx

import { getPackages, getPlaces } from "@/lib/data";
import { VideoClientWrapper } from "@/components/video-client-wrapper";
import { Suspense } from 'react';
import { Metadata } from 'next';
import {
    BUSINESS_CONFIG,
    COMPANY_INFO,
    DEFAULT_METADATA,
    SITE_CONFIG,
    SOCIAL_MEDIA
} from "@/utils/utils";
import Loading from "@/components/loading";

// Enhanced SEO metadata using constants
export const metadata: Metadata = {
    title: DEFAULT_METADATA.title,
    description: DEFAULT_METADATA.description,
    keywords: DEFAULT_METADATA.keywords,
    openGraph: {
        title: DEFAULT_METADATA.openGraph.title,
        description: DEFAULT_METADATA.openGraph.description,
    },
    twitter: {
        title: DEFAULT_METADATA.twitter.title,
        description: DEFAULT_METADATA.twitter.description,
    },
};

// Optimized data fetching with comprehensive error handling
async function getHomeData() {
    try {
        const [places, packages] = await Promise.all([
            getPlaces().catch((error) => {
                console.error('Failed to fetch places:', error);
                return [];
            }),
            getPackages().catch((error) => {
                console.error('Failed to fetch packages:', error);
                return [];
            })
        ]);

        // Safe data slicing with null checks
        const safePlaces = Array.isArray(places) ? places : [];
        const safePackages = Array.isArray(packages) ? packages : [];

        return {
            featuredPlaces: safePlaces.slice(0, 5),
            popularPackages: safePackages.slice(0, 3),
        };
    } catch (error) {
        console.error('Error loading home page data:', error);
        return {
            featuredPlaces: [],
            popularPackages: [],
        };
    }
}

// Enhanced loading component with video preloading
function EnhancedLoading() {
    return (
        <Loading
            message="Loading sacred destinations and experiences..."
            showProgress={true}
            variant="detailed"
            timeout={45000}
        />
    );
}

// Video cache provider wrapper
function VideoOptimizedHomePage({
                                    featuredPlaces,
                                    popularPackages
                                }: {
    featuredPlaces: any[];
    popularPackages: any[];
}) {
    return (
        <VideoClientWrapper
            featuredPlaces={featuredPlaces}
            popularPackages={popularPackages}
        />
    );
}

// Main home page component with video preloading
export default async function OptimizedHomePage() {
    const { featuredPlaces, popularPackages } = await getHomeData();

    return (
        <>
            {/* Video Preloading Screen */}
            <Suspense fallback={<EnhancedLoading />}>
                <VideoOptimizedHomePage
                    featuredPlaces={featuredPlaces}
                    popularPackages={popularPackages}
                />
            </Suspense>

            {/* Enhanced Schema markup for rich snippets */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "TourOperator",
                        "name": COMPANY_INFO.name,
                        "description": COMPANY_INFO.description,
                        "url": SITE_CONFIG.url,
                        "logo": `${SITE_CONFIG.url}/logo.png`,
                        "contactPoint": {
                            "@type": "ContactPoint",
                            "telephone": COMPANY_INFO.contact.phone,
                            "contactType": "Customer Service",
                            "availableLanguage": BUSINESS_CONFIG.languages,
                            "hoursAvailable": [{
                                "@type": "OpeningHoursSpecification",
                                "opens": "09:00",
                                "closes": "18:00",
                                "dayOfWeek": [
                                    "Monday", "Tuesday", "Wednesday",
                                    "Thursday", "Friday", "Saturday"
                                ]
                            }]
                        },
                        "areaServed": BUSINESS_CONFIG.cities.map(city => ({
                            "@type": "City",
                            "name": city,
                            "addressCountry": COMPANY_INFO.address.countryCode
                        })),
                        "hasOfferCatalog": {
                            "@type": "OfferCatalog",
                            "name": "Spiritual Tour Packages",
                            "description": "Curated spiritual tourism packages across India's sacred destinations",
                            "itemListElement": popularPackages?.map((pkg, index) => ({
                                "@type": "Offer",
                                "position": index + 1,
                                "name": pkg?.name || "Spiritual Tour Package",
                                "description": pkg?.tagline || "Discover spiritual destinations",
                                "price": pkg?.price || "Contact for pricing",
                                "priceCurrency": "INR",
                                "availability": "https://schema.org/InStock",
                                "validFrom": new Date().toISOString(),
                                "category": "Travel Package"
                            })) || []
                        },
                        "aggregateRating": {
                            "@type": "AggregateRating",
                            "ratingValue": "4.9",
                            "reviewCount": COMPANY_INFO.stats.reviewCount,
                            "bestRating": "5",
                            "worstRating": "1"
                        },
                        "priceRange": BUSINESS_CONFIG.priceRange,
                        "telephone": COMPANY_INFO.contact.phone,
                        "email": COMPANY_INFO.contact.email,
                        "address": {
                            "@type": "PostalAddress",
                            "addressLocality": COMPANY_INFO.address.city,
                            "addressRegion": COMPANY_INFO.address.state,
                            "addressCountry": COMPANY_INFO.address.countryCode,
                            "postalCode": COMPANY_INFO.address.postalCode
                        },
                        "foundingDate": COMPANY_INFO.stats.establishedYear,
                        "knowsAbout": BUSINESS_CONFIG.services,
                        "serviceArea": {
                            "@type": "GeoCircle",
                            "geoMidpoint": {
                                "@type": "GeoCoordinates",
                                "latitude": "25.3176",
                                "longitude": "82.9739"
                            },
                            "geoRadius": "1000"
                        },
                        "sameAs": [
                            SOCIAL_MEDIA.platforms.facebook,
                            SOCIAL_MEDIA.platforms.instagram,
                            SOCIAL_MEDIA.platforms.twitter,
                            SOCIAL_MEDIA.platforms.linkedin,
                            SOCIAL_MEDIA.platforms.youtube
                        ]
                    })
                }}
            />

            {/* Website Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebSite",
                        "name": COMPANY_INFO.name,
                        "url": SITE_CONFIG.url,
                        "description": COMPANY_INFO.description,
                        "potentialAction": {
                            "@type": "SearchAction",
                            "target": `${SITE_CONFIG.url}/search?q={search_term_string}`,
                            "query-input": "required name=search_term_string"
                        },
                        "publisher": {
                            "@type": "Organization",
                            "name": COMPANY_INFO.name,
                            "url": SITE_CONFIG.url,
                            "logo": `${SITE_CONFIG.url}/logo.png`,
                            "sameAs": Object.values(SOCIAL_MEDIA.platforms)
                        }
                    })
                }}
            />

            {/* LocalBusiness Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "LocalBusiness",
                        "name": COMPANY_INFO.name,
                        "description": COMPANY_INFO.description,
                        "url": SITE_CONFIG.url,
                        "telephone": COMPANY_INFO.contact.phone,
                        "email": COMPANY_INFO.contact.email,
                        "address": {
                            "@type": "PostalAddress",
                            "addressLocality": COMPANY_INFO.address.city,
                            "addressRegion": COMPANY_INFO.address.state,
                            "addressCountry": COMPANY_INFO.address.country,
                            "postalCode": COMPANY_INFO.address.postalCode
                        },
                        "geo": {
                            "@type": "GeoCoordinates",
                            "latitude": "25.3176",
                            "longitude": "82.9739"
                        },
                        "openingHoursSpecification": [{
                            "@type": "OpeningHoursSpecification",
                            "dayOfWeek": [
                                "Monday", "Tuesday", "Wednesday",
                                "Thursday", "Friday", "Saturday"
                            ],
                            "opens": "09:00",
                            "closes": "18:00"
                        }],
                        "aggregateRating": {
                            "@type": "AggregateRating",
                            "ratingValue": "4.9",
                            "reviewCount": COMPANY_INFO.stats.reviewCount
                        },
                        "priceRange": BUSINESS_CONFIG.priceRange,
                        "servesCuisine": "Indian",
                        "paymentAccepted": "Cash, Credit Card, UPI, Net Banking",
                        "currenciesAccepted": "INR"
                    })
                }}
            />
        </>
    );
}