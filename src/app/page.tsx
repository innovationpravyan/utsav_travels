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

// Debug component to show data loading status
function DebugInfo({ places, packages }: { places: any[], packages: any[] }) {
    if (process.env.NODE_ENV !== 'development') return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            right: 0,
            background: 'rgba(0,0,0,0.8)',
            color: 'white',
            padding: '10px',
            fontSize: '12px',
            zIndex: 9999,
            maxWidth: '300px'
        }}>
            <h4>Debug Info:</h4>
            <p>Places loaded: {places?.length || 0}</p>
            <p>Packages loaded: {packages?.length || 0}</p>
            {places?.length > 0 && (
                <details>
                    <summary>First Place:</summary>
                    <pre>{JSON.stringify(places[0], null, 2)}</pre>
                </details>
            )}
            {packages?.length > 0 && (
                <details>
                    <summary>First Package:</summary>
                    <pre>{JSON.stringify(packages[0], null, 2)}</pre>
                </details>
            )}
        </div>
    );
}

// Optimized data fetching with comprehensive error handling and logging
async function getHomeData() {
    console.log('🏠 Starting home page data fetch...');

    try {
        const startTime = Date.now();

        console.log('📍 Fetching places...');
        const placesPromise = getPlaces().catch((error) => {
            console.error('❌ Failed to fetch places:', error);
            // Return fallback places data
            return [
                {
                    id: 'fallback-1',
                    name: 'Kashi Vishwanath Temple',
                    city: 'Varanasi',
                    category: 'Temple',
                    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&h=800&fit=crop',
                    shortDescription: 'Sacred temple dedicated to Lord Shiva',
                    description: 'One of the most sacred temples in India',
                    history: 'Ancient temple with rich history',
                    highlights: ['Sacred atmosphere', 'Beautiful architecture'],
                    gallery: [],
                    tags: ['spiritual', 'temple'],
                    location: { lat: 25.3176, lng: 82.9739 }
                }
            ];
        });

        console.log('📦 Fetching packages...');
        const packagesPromise = getPackages().catch((error) => {
            console.error('❌ Failed to fetch packages:', error);
            // Return fallback packages data
            return [
                {
                    id: 'fallback-pkg-1',
                    name: 'Sacred Varanasi Experience',
                    description: 'Discover the spiritual heart of India',
                    duration: '3 Days / 2 Nights',
                    cities: ['Varanasi'],
                    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=800&fit=crop',
                    highlights: ['Ganga Aarti', 'Temple visits', 'Boat ride'],
                    itinerary: [],
                    inclusions: ['Accommodation', 'Meals', 'Transportation'],
                    gallery: [],
                    tags: ['spiritual', 'pilgrimage'],
                    tagline: 'A transformative spiritual journey',
                    price: '₹15,000'
                }
            ];
        });

        const [places, packages] = await Promise.all([placesPromise, packagesPromise]);

        const fetchTime = Date.now() - startTime;
        console.log(`⏱️ Data fetch completed in ${fetchTime}ms`);

        // Safe data processing with validation
        const safePlaces = Array.isArray(places) ? places.filter(place => place && place.id && place.name) : [];
        const safePackages = Array.isArray(packages) ? packages.filter(pkg => pkg && pkg.id && pkg.name) : [];

        console.log(`✅ Processed ${safePlaces.length} places and ${safePackages.length} packages`);

        const result = {
            featuredPlaces: safePlaces.slice(0, 5),
            popularPackages: safePackages.slice(0, 3),
        };

        // Log the data we're returning
        console.log('🔍 Featured places:', result.featuredPlaces.map(p => ({ id: p.id, name: p.name, image: p.image })));
        console.log('🔍 Popular packages:', result.popularPackages.map(p => ({ id: p.id, name: p.name, image: p.image })));

        return result;
    } catch (error) {
        console.error('💥 Critical error loading home page data:', error);

        // Return comprehensive fallback data
        return {
            featuredPlaces: [
                {
                    id: 'emergency-place-1',
                    name: 'Dashashwamedh Ghat',
                    city: 'Varanasi',
                    category: 'Ghat',
                    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=600&h=800&fit=crop',
                    shortDescription: 'Famous ghat for evening aarti',
                    description: 'The main ghat in Varanasi where the famous Ganga Aarti takes place every evening.',
                    history: 'One of the oldest and most important ghats in Varanasi',
                    highlights: ['Ganga Aarti', 'Boat rides', 'Spiritual atmosphere'],
                    gallery: [],
                    tags: ['spiritual', 'ghat', 'aarti'],
                    location: { lat: 25.3176, lng: 82.9739 }
                },
                {
                    id: 'emergency-place-2',
                    name: 'Sarnath',
                    city: 'Varanasi',
                    category: 'Archaeological Site',
                    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=800&fit=crop',
                    shortDescription: 'Where Buddha gave his first sermon',
                    description: 'Historic site where Lord Buddha delivered his first sermon after attaining enlightenment.',
                    history: 'Ancient Buddhist site with archaeological significance',
                    highlights: ['Buddhist heritage', 'Museum', 'Peaceful atmosphere'],
                    gallery: [],
                    tags: ['buddhist', 'historical', 'peaceful'],
                    location: { lat: 25.3767, lng: 83.0228 }
                }
            ],
            popularPackages: [
                {
                    id: 'emergency-pkg-1',
                    name: 'Divine Varanasi Tour',
                    description: 'Experience the spiritual essence of Varanasi with temple visits and Ganga aarti',
                    duration: '2 Days / 1 Night',
                    cities: ['Varanasi'],
                    image: 'https://images.unsplash.com/photo-1585146104475-4c7e5b25b1a8?w=600&h=800&fit=crop',
                    highlights: ['Temple visits', 'Ganga Aarti', 'Boat ride', 'Cultural experiences'],
                    itinerary: [],
                    inclusions: ['Hotel accommodation', 'Breakfast', 'Local transportation', 'Guide'],
                    gallery: [],
                    tags: ['spiritual', 'culture', 'heritage'],
                    tagline: 'Discover the eternal city',
                    price: '₹12,999'
                }
            ],
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

// Video cache provider wrapper with error boundary
function VideoOptimizedHomePage({
                                    featuredPlaces,
                                    popularPackages
                                }: {
    featuredPlaces: any[];
    popularPackages: any[];
}) {
    console.log('🎬 VideoOptimizedHomePage rendering with:', {
        places: featuredPlaces?.length || 0,
        packages: popularPackages?.length || 0
    });

    return (
        <>
            <DebugInfo places={featuredPlaces} packages={popularPackages} />
            <VideoClientWrapper
                featuredPlaces={featuredPlaces}
                popularPackages={popularPackages}
            />
        </>
    );
}

// Error boundary component
function ErrorFallback({ error, resetErrorBoundary }: { error: Error, resetErrorBoundary: () => void }) {
    return (
        <div style={{
            padding: '40px',
            textAlign: 'center',
            backgroundColor: '#fee2e2',
            color: '#dc2626',
            borderRadius: '8px',
            margin: '20px'
        }}>
            <h2>Something went wrong loading the page</h2>
            <details style={{ whiteSpace: 'pre-wrap', marginTop: '10px' }}>
                <summary>Error details</summary>
                {error.message}
            </details>
            <button
                onClick={resetErrorBoundary}
                style={{
                    marginTop: '10px',
                    padding: '10px 20px',
                    backgroundColor: '#dc2626',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                }}
            >
                Try again
            </button>
        </div>
    );
}

// Main home page component with enhanced error handling
export default async function OptimizedHomePage() {
    console.log('🚀 OptimizedHomePage component rendering...');

    let homeData;
    try {
        homeData = await getHomeData();
    } catch (error) {
        console.error('💥 Failed to get home data:', error);
        // Use emergency fallback
        homeData = {
            featuredPlaces: [],
            popularPackages: []
        };
    }

    const { featuredPlaces, popularPackages } = homeData;

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
                        "name": COMPANY_INFO?.name || "Spiritual Tours",
                        "description": COMPANY_INFO?.description || "Sacred destination tours",
                        "url": SITE_CONFIG?.url || "",
                        "logo": `${SITE_CONFIG?.url || ""}/logo.png`,
                        "contactPoint": {
                            "@type": "ContactPoint",
                            "telephone": COMPANY_INFO?.contact?.phone || "",
                            "contactType": "Customer Service",
                            "availableLanguage": BUSINESS_CONFIG?.languages || ["Hindi", "English"],
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
                        "areaServed": (BUSINESS_CONFIG?.cities || ["Varanasi"]).map(city => ({
                            "@type": "City",
                            "name": city,
                            "addressCountry": COMPANY_INFO?.address?.countryCode || "IN"
                        })),
                        "hasOfferCatalog": {
                            "@type": "OfferCatalog",
                            "name": "Spiritual Tour Packages",
                            "description": "Curated spiritual tourism packages across India's sacred destinations",
                            "itemListElement": popularPackages?.map((pkg, index) => ({
                                "@type": "Offer",
                                "position": index + 1,
                                "name": pkg?.name || "Spiritual Tour Package",
                                "description": pkg?.tagline || pkg?.description || "Discover spiritual destinations",
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
                            "reviewCount": COMPANY_INFO?.stats?.reviewCount || 100,
                            "bestRating": "5",
                            "worstRating": "1"
                        },
                        "priceRange": BUSINESS_CONFIG?.priceRange || "₹₹",
                        "telephone": COMPANY_INFO?.contact?.phone || "",
                        "email": COMPANY_INFO?.contact?.email || "",
                        "address": {
                            "@type": "PostalAddress",
                            "addressLocality": COMPANY_INFO?.address?.city || "Varanasi",
                            "addressRegion": COMPANY_INFO?.address?.state || "Uttar Pradesh",
                            "addressCountry": COMPANY_INFO?.address?.countryCode || "IN",
                            "postalCode": COMPANY_INFO?.address?.postalCode || "221001"
                        },
                        "foundingDate": COMPANY_INFO?.stats?.establishedYear || "2020",
                        "knowsAbout": BUSINESS_CONFIG?.services || ["Spiritual Tourism", "Pilgrimage Tours"],
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
                            SOCIAL_MEDIA?.platforms?.facebook,
                            SOCIAL_MEDIA?.platforms?.instagram,
                            SOCIAL_MEDIA?.platforms?.twitter,
                            SOCIAL_MEDIA?.platforms?.linkedin,
                            SOCIAL_MEDIA?.platforms?.youtube
                        ].filter(Boolean)
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
                        "name": COMPANY_INFO?.name || "Spiritual Tours",
                        "url": SITE_CONFIG?.url || "",
                        "description": COMPANY_INFO?.description || "Sacred destination tours",
                        "potentialAction": {
                            "@type": "SearchAction",
                            "target": `${SITE_CONFIG?.url || ""}/search?q={search_term_string}`,
                            "query-input": "required name=search_term_string"
                        },
                        "publisher": {
                            "@type": "Organization",
                            "name": COMPANY_INFO?.name || "Spiritual Tours",
                            "url": SITE_CONFIG?.url || "",
                            "logo": `${SITE_CONFIG?.url || ""}/logo.png`,
                            "sameAs": Object.values(SOCIAL_MEDIA?.platforms || {}).filter(Boolean)
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
                        "name": COMPANY_INFO?.name || "Spiritual Tours",
                        "description": COMPANY_INFO?.description || "Sacred destination tours",
                        "url": SITE_CONFIG?.url || "",
                        "telephone": COMPANY_INFO?.contact?.phone || "",
                        "email": COMPANY_INFO?.contact?.email || "",
                        "address": {
                            "@type": "PostalAddress",
                            "addressLocality": COMPANY_INFO?.address?.city || "Varanasi",
                            "addressRegion": COMPANY_INFO?.address?.state || "Uttar Pradesh",
                            "addressCountry": COMPANY_INFO?.address?.country || "India",
                            "postalCode": COMPANY_INFO?.address?.postalCode || "221001"
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
                            "reviewCount": COMPANY_INFO?.stats?.reviewCount || 100
                        },
                        "priceRange": BUSINESS_CONFIG?.priceRange || "₹₹",
                        "servesCuisine": "Indian",
                        "paymentAccepted": "Cash, Credit Card, UPI, Net Banking",
                        "currenciesAccepted": "INR"
                    })
                }}
            />
        </>
    );
}