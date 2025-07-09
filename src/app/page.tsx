// src/app/page.tsx

import { getPlaces, getPackages } from "@/lib/data";
import { OptimizedHomeClient } from "@/components/optimized-home-client";
import { HomeVideoHero } from "@/components/optimized-video-hero";
import { Suspense } from 'react';
import { Metadata } from 'next';

// Enhanced SEO metadata
export const metadata: Metadata = {
    title: 'Utsav Travels - Discover Sacred India | Spiritual Heritage Tours',
    description: 'Embark on transformative spiritual journeys through Varanasi, Ayodhya, Rishikesh, and Kedarnath. Expert-guided tours, authentic experiences, and unforgettable memories await.',
    keywords: 'spiritual tours India, Varanasi pilgrimage, Ayodhya tours, Rishikesh yoga retreat, Kedarnath trek, sacred destinations, heritage tourism, spiritual travel packages',
    openGraph: {
        title: 'Utsav Travels - Discover Sacred India',
        description: 'Embark on transformative spiritual journeys through India\'s most sacred destinations',
        images: [
            {
                url: '/images/home-og.jpg',
                width: 1200,
                height: 630,
                alt: 'Spiritual destinations in India',
            },
        ],
    },
    twitter: {
        title: 'Utsav Travels - Discover Sacred India',
        description: 'Embark on transformative spiritual journeys through India\'s most sacred destinations',
        images: ['/images/home-twitter.jpg'],
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

// Optimized loading component for better UX
function HomeLoadingFallback() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <div className="h-screen w-full flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <div className="text-white text-xl animate-pulse">Loading your spiritual journey...</div>
                </div>
            </div>
        </div>
    );
}

// Main home page component with error boundaries
export default async function OptimizedHomePage() {
    const { featuredPlaces, popularPackages } = await getHomeData();

    return (
        <div className="relative">
            {/* Video Hero Banner */}
            <Suspense fallback={<HomeLoadingFallback />}>
                <HomeVideoHero
                    videoSrc="/videos/home-hero.webm"
                    fallbackImage="https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
                    title="Discover the Spiritual Heritage"
                    subtitle="of Varanasi, Ayodhya, Rishikesh, Kedarnath"
                    description="Embark on transformative journeys through India's most sacred destinations"
                />
            </Suspense>

            {/* Main Content */}
            <Suspense fallback={
                <div className="min-h-screen bg-black">
                    <div className="container mx-auto px-4 py-16 text-center">
                        <div className="text-white animate-pulse">Loading content...</div>
                    </div>
                </div>
            }>
                <OptimizedHomeClient
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
                        "name": "Utsav Travels",
                        "description": "Premier spiritual heritage tours across India's sacred destinations",
                        "url": "https://utsavtravels.com",
                        "logo": "https://utsavtravels.com/logo.png",
                        "contactPoint": {
                            "@type": "ContactPoint",
                            "telephone": "+91-98765-43210",
                            "contactType": "Customer Service",
                            "availableLanguage": ["Hindi", "English"]
                        },
                        "areaServed": [
                            {
                                "@type": "City",
                                "name": "Varanasi"
                            },
                            {
                                "@type": "City",
                                "name": "Ayodhya"
                            },
                            {
                                "@type": "City",
                                "name": "Rishikesh"
                            },
                            {
                                "@type": "City",
                                "name": "Kedarnath"
                            }
                        ],
                        "hasOfferCatalog": {
                            "@type": "OfferCatalog",
                            "name": "Spiritual Tour Packages",
                            "itemListElement": popularPackages?.map((pkg, index) => ({
                                "@type": "Offer",
                                "position": index + 1,
                                "name": pkg?.name || "Spiritual Tour",
                                "description": pkg?.tagline || "Discover spiritual destinations",
                                "price": pkg?.price || "Contact for pricing",
                                "priceCurrency": "INR",
                                "availability": "https://schema.org/InStock"
                            })) || []
                        },
                        "aggregateRating": {
                            "@type": "AggregateRating",
                            "ratingValue": "4.9",
                            "reviewCount": "10000"
                        },
                        "priceRange": "₹₹",
                        "telephone": "+91-98765-43210",
                        "email": "info@utsavtravels.com",
                        "address": {
                            "@type": "PostalAddress",
                            "addressLocality": "Varanasi",
                            "addressRegion": "Uttar Pradesh",
                            "addressCountry": "IN"
                        },
                        "sameAs": [
                            "https://facebook.com/utsavtravels",
                            "https://instagram.com/utsavtravels",
                            "https://twitter.com/utsavtravels"
                        ]
                    })
                }}
            />
        </div>
    );
}