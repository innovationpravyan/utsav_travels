import type { Metadata, Viewport } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Toaster } from '@/components/ui/toaster';
import { WhatsappButton } from '@/components/whatsapp-button';
import { Guide } from '@/components/guide';
import { Suspense } from 'react';
import {AnimatedGuide} from "@/components/animated-guide";

// Optimized font loading configuration
// Enhanced metadata configuration
export const metadata: Metadata = {
    title: {
        default: 'Utsav Travels - Sacred India Tours & Spiritual Journeys',
        template: '%s | Utsav Travels - Sacred India Tours'
    },
    description: 'Discover India\'s spiritual heritage with Utsav Travels. Expert-guided tours to Varanasi, Ayodhya, Rishikesh, Kedarnath and sacred destinations across India.',
    keywords: [
        'spiritual tourism India',
        'Varanasi tours',
        'Ayodhya travel',
        'Rishikesh packages',
        'Kedarnath pilgrimage',
        'sacred destinations India',
        'Hindu pilgrimage tours',
        'spiritual travel packages',
        'India heritage tours',
        'temple tours India'
    ].join(', '),
    authors: [{ name: 'Utsav Travels', url: 'https://utsavtravels.com' }],
    creator: 'Utsav Travels',
    publisher: 'Utsav Travels',
    category: 'Travel & Tourism',
    classification: 'Spiritual Tourism',
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://utsavtravels.com'),
    alternates: {
        canonical: '/',
        languages: {
            'en-IN': '/en',
            'hi-IN': '/hi'
        }
    },
    openGraph: {
        type: 'website',
        locale: 'en_IN',
        alternateLocale: ['hi_IN'],
        title: 'Utsav Travels - Sacred India Tours & Spiritual Journeys',
        description: 'Discover India\'s spiritual heritage with expert-guided tours to sacred destinations',
        url: 'https://utsavtravels.com',
        siteName: 'Utsav Travels',
        images: [
            {
                url: '/images/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'Utsav Travels - Spiritual Tourism India',
                type: 'image/jpeg'
            },
            {
                url: '/images/og-square.jpg',
                width: 1200,
                height: 1200,
                alt: 'Utsav Travels Square Logo',
                type: 'image/jpeg'
            }
        ],
    },
    twitter: {
        card: 'summary_large_image',
        site: '@utsavtravels',
        creator: '@utsavtravels',
        title: 'Utsav Travels - Sacred India Tours',
        description: 'Discover India\'s spiritual heritage with expert-guided tours',
        images: ['/images/twitter-image.jpg'],
    },
    robots: {
        index: true,
        follow: true,
        nocache: false,
        googleBot: {
            index: true,
            follow: true,
            noimageindex: false,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    verification: {
        google: process.env.GOOGLE_VERIFICATION,
        yandex: process.env.YANDEX_VERIFICATION,
        other: {
            'msvalidate.01': process.env.BING_VERIFICATION || '',
        }
    },
    appleWebApp: {
        capable: true,
        statusBarStyle: 'black-translucent',
        title: 'Utsav Travels'
    },
    applicationName: 'Utsav Travels',
    generator: 'Next.js',
    referrer: 'origin-when-cross-origin',
    other: {
        'mobile-web-app-capable': 'yes',
        'apple-mobile-web-app-capable': 'yes',
        'apple-mobile-web-app-status-bar-style': 'black-translucent'
    }
};

// Optimized viewport configuration
export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: '#f59e0b' },
        { media: '(prefers-color-scheme: dark)', color: '#0f172a' }
    ],
    colorScheme: 'dark light',
    viewportFit: 'cover'
};

// Loading component for suspense boundaries
function GlobalLoading() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-white text-sm">Loading...</p>
            </div>
        </div>
    );
}

// Error boundary component
function ErrorFallback({ error }: { error: Error }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-4">
            <div className="text-center max-w-md">
                <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
                <p className="text-muted-foreground mb-6">
                    We apologize for the inconvenience. Please refresh the page or try again later.
                </p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                    Refresh Page
                </button>
            </div>
        </div>
    );
}

// Main layout component
export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark" suppressHydrationWarning>
        <head>
            {/* Critical resource hints */}
            <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link rel="preconnect" href="https://images.pexels.com" />
            <link rel="dns-prefetch" href="//www.google-analytics.com" />

            {/* Optimized font loading */}
            <link
                href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap"
                rel="stylesheet"
            />

            {/* Critical resources preload */}
            <link rel="preload" href="/videos/home-hero.webm" as="video" type="video/webm" />
            <link rel="preload" href="/images/logo.webp" as="image" type="image/webp" />

            {/* Security headers */}
            <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
            <meta httpEquiv="X-Frame-Options" content="DENY" />
            <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
            <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
            <meta httpEquiv="Permissions-Policy" content="camera=(), microphone=(), geolocation=()" />

            {/* Performance hints */}
            <meta httpEquiv="Accept-CH" content="DPR, Viewport-Width, Width" />

            {/* Structured data for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "TravelAgency",
                        "name": "Utsav Travels",
                        "description": "Premier spiritual heritage tours across India",
                        "url": "https://utsavtravels.com",
                        "logo": {
                            "@type": "ImageObject",
                            "url": "https://utsavtravels.com/images/logo.png",
                            "width": 300,
                            "height": 100
                        },
                        "contactPoint": {
                            "@type": "ContactPoint",
                            "telephone": "+91-98765-43210",
                            "contactType": "Customer Service",
                            "availableLanguage": ["Hindi", "English"],
                            "areaServed": "IN"
                        },
                        "address": {
                            "@type": "PostalAddress",
                            "addressLocality": "Varanasi",
                            "addressRegion": "Uttar Pradesh",
                            "addressCountry": "IN",
                            "postalCode": "221001"
                        },
                        "sameAs": [
                            "https://facebook.com/utsavtravels",
                            "https://instagram.com/utsavtravels",
                            "https://twitter.com/utsavtravels",
                            "https://linkedin.com/company/utsavtravels"
                        ],
                        "aggregateRating": {
                            "@type": "AggregateRating",
                            "ratingValue": "4.9",
                            "reviewCount": "2847",
                            "bestRating": "5",
                            "worstRating": "1"
                        },
                        "priceRange": "₹₹",
                        "knowsAbout": [
                            "Spiritual Tourism",
                            "Heritage Sites",
                            "Cultural Tours",
                            "Pilgrimage Tours",
                            "Temple Tours",
                            "Yoga Retreats"
                        ],
                        "areaServed": [
                            {
                                "@type": "State",
                                "name": "Uttar Pradesh"
                            },
                            {
                                "@type": "State",
                                "name": "Uttarakhand"
                            },
                            {
                                "@type": "State",
                                "name": "Bihar"
                            },
                            {
                                "@type": "State",
                                "name": "West Bengal"
                            }
                        ],
                        "hasOfferCatalog": {
                            "@type": "OfferCatalog",
                            "name": "Spiritual Tour Packages",
                            "itemListElement": [
                                {
                                    "@type": "Offer",
                                    "itemOffered": {
                                        "@type": "Trip",
                                        "name": "Varanasi Sacred Tour"
                                    }
                                },
                                {
                                    "@type": "Offer",
                                    "itemOffered": {
                                        "@type": "Trip",
                                        "name": "Kedarnath Pilgrimage"
                                    }
                                }
                            ]
                        }
                    })
                }}
            />
        </head>

        <body className={cn(
            'min-h-screen flex flex-col bg-background font-sans antialiased',
            'selection:bg-primary/20 selection:text-primary-foreground',
            'scroll-smooth'
        )}>
        {/* Skip navigation for accessibility */}
        <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-[100] focus:z-[100]"
        >
            Skip to main content
        </a>

        {/* Header with error boundary */}
        <Suspense fallback={<div className="h-16 bg-background/80" />}>
            <Header />
        </Suspense>

        {/* Main content area */}
        <main id="main-content" className="flex-1 relative">
            <Suspense fallback={<GlobalLoading />}>
                {children}
            </Suspense>
        </main>

        {/* Footer with error boundary */}
        <Suspense fallback={<div className="h-64 bg-background" />}>
            <Footer />
        </Suspense>

        {/* Floating UI components - lazy loaded */}
        <Suspense>
            <WhatsappButton />
        </Suspense>

        <Suspense>
            <AnimatedGuide />
        </Suspense>

        <Suspense>
            <Guide />
        </Suspense>

        {/* Toast notifications */}
        <Toaster />

        {/* Performance monitoring in development */}
        {process.env.NODE_ENV === 'development' && (
            <div className="fixed bottom-4 left-4 bg-black/80 text-white text-xs p-2 rounded-md z-50 pointer-events-none">
                <div>Build: {process.env.NEXT_PUBLIC_BUILD_TIME || 'dev'}</div>
                <div>Env: {process.env.NODE_ENV}</div>
            </div>
        )}

        {/* Service worker registration */}
        {process.env.NODE_ENV === 'production' && (
            <script
                dangerouslySetInnerHTML={{
                    __html: `
                if ('serviceWorker' in navigator) {
                  window.addEventListener('load', function() {
                    navigator.serviceWorker.register('/sw.js')
                      .then(function(registration) {
                        console.log('SW registered: ', registration);
                      })
                      .catch(function(registrationError) {
                        console.log('SW registration failed: ', registrationError);
                      });
                  });
                }
              `,
                }}
            />
        )}
        </body>
        </html>
    );
}