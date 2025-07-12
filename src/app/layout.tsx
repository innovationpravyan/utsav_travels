import type { Metadata, Viewport } from 'next';
import './globals.css';
import { cn } from '@/utils/utils';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Toaster } from '@/components/ui/toaster';
import { WhatsappButton } from '@/components/whatsapp-button';
import { Guide } from '@/components/guide';
import { Suspense } from 'react';
import { AnimatedGuide } from "@/components/animated-guide";
import {
    COMPANY_INFO,
    SEO_CONFIG,
    SITE_CONFIG,
    ANALYTICS_CONFIG,
    SOCIAL_MEDIA,
    BUSINESS_CONFIG
} from '@/utils/utils';

// Enhanced metadata configuration
export const metadata: Metadata = {
    title: {
        default: SEO_CONFIG.defaultTitle,
        template: SEO_CONFIG.titleTemplate
    },
    description: COMPANY_INFO.description,
    keywords: SEO_CONFIG.keywords.join(', '),
    authors: [{ name: COMPANY_INFO.name, url: SITE_CONFIG.url }],
    creator: COMPANY_INFO.name,
    publisher: COMPANY_INFO.name,
    category: 'Travel & Tourism',
    classification: 'Spiritual Tourism',
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    metadataBase: new URL(SITE_CONFIG.url),
    alternates: {
        canonical: '/',
        languages: {
            'en-IN': '/en',
            'hi-IN': '/hi'
        }
    },
    openGraph: {
        type: SEO_CONFIG.openGraph.type,
        locale: SEO_CONFIG.openGraph.locale,
        title: SEO_CONFIG.defaultTitle,
        description: COMPANY_INFO.shortDescription,
        url: SITE_CONFIG.url,
        siteName: SEO_CONFIG.openGraph.siteName,
        images: [
            {
                url: SEO_CONFIG.openGraph.images.default,
                width: 1200,
                height: 630,
                alt: `${COMPANY_INFO.name} - Spiritual Tourism India`,
                type: 'image/jpeg'
            },
            {
                url: SEO_CONFIG.openGraph.images.square,
                width: 1200,
                height: 1200,
                alt: `${COMPANY_INFO.name} Square Logo`,
                type: 'image/jpeg'
            }
        ],
    },
    twitter: {
        card: 'summary_large_image',
        site: '@utsavtravels',
        creator: '@utsavtravels',
        title: `${COMPANY_INFO.name} - Sacred India Tours`,
        description: COMPANY_INFO.shortDescription,
        images: [SEO_CONFIG.openGraph.images.twitter],
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
        google: ANALYTICS_CONFIG.verification.google,
        yandex: ANALYTICS_CONFIG.verification.yandex,
        other: {
            'msvalidate.01': ANALYTICS_CONFIG.verification.bing,
        }
    },
    appleWebApp: {
        capable: true,
        statusBarStyle: 'black-translucent',
        title: COMPANY_INFO.name
    },
    applicationName: COMPANY_INFO.name,
    generator: 'Next.js',
    referrer: 'origin-when-cross-origin',
    other: {
        'mobile-web-app-capable': 'yes',
        'apple-mobile-web-app-capable': 'yes',
        'apple-mobile-web-app-status-bar-style': 'black-translucent'
    }
};

// Optimized viewport configuration with luxury theme colors
export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: 'hsl(var(--thistle-500))' },
        { media: '(prefers-color-scheme: dark)', color: 'hsl(var(--thistle-900))' }
    ],
    colorScheme: 'dark light',
    viewportFit: 'cover'
};

// Loading component for suspense boundaries
function GlobalLoading() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-thistle-900/90 via-fairy-900/90 to-carnation-900/90 backdrop-blur-md">
            <div className="flex flex-col items-center gap-6">
                {/* Luxury loading animation */}
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-thistle-200/30 rounded-full" />
                    <div className="w-16 h-16 border-4 border-t-thistle-500 border-r-fairy-500 border-b-carnation-500 border-l-uranian-500 rounded-full animate-spin absolute top-0 left-0" />
                </div>
                <div className="text-center">
                    <p className="text-white text-lg font-heading mb-2">Loading Luxury Experience...</p>
                    <div className="flex gap-1 justify-center">
                        <div className="w-2 h-2 bg-thistle-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-fairy-400 rounded-full animate-bounce delay-100" />
                        <div className="w-2 h-2 bg-carnation-400 rounded-full animate-bounce delay-200" />
                    </div>
                </div>
            </div>
        </div>
    );
}

// Error boundary component
function ErrorFallback({ error }: { error: Error }) {
    return (
        <div className="min-h-screen flex items-center justify-center section-luxury text-thistle-900 p-4">
            <div className="text-center max-w-md">
                <div className="card-luxury p-8">
                    <div className="w-16 h-16 bg-carnation-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8 text-carnation-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-heading font-bold mb-4 text-thistle-800">Something went wrong</h2>
                    <p className="text-thistle-600 mb-6 text-body">
                        We apologize for the inconvenience. Please refresh the page or try again later.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="btn-primary"
                    >
                        Refresh Page
                    </button>
                </div>
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
        <html lang="en" className="scroll-smooth" suppressHydrationWarning>
        <head>
            {/* Critical resource hints */}
            <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link rel="preconnect" href="https://images.pexels.com" />
            <link rel="dns-prefetch" href="//www.google-analytics.com" />

            {/* Optimized font loading */}
            <link
                href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700;800&display=swap"
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
                        ...SEO_CONFIG.structuredData,
                        logo: {
                            "@type": "ImageObject",
                            "url": `${SITE_CONFIG.url}/images/logo.png`,
                            "width": 300,
                            "height": 100
                        },
                        contactPoint: {
                            "@type": "ContactPoint",
                            "telephone": COMPANY_INFO.contact.phone,
                            "contactType": "Customer Service",
                            "availableLanguage": BUSINESS_CONFIG.languages,
                            "areaServed": "IN"
                        },
                        address: {
                            "@type": "PostalAddress",
                            "addressLocality": COMPANY_INFO.address.city,
                            "addressRegion": COMPANY_INFO.address.state,
                            "addressCountry": COMPANY_INFO.address.countryCode,
                            "postalCode": COMPANY_INFO.address.postalCode
                        },
                        sameAs: Object.values(SOCIAL_MEDIA.platforms),
                        aggregateRating: SEO_CONFIG.structuredData.aggregateRating,
                        priceRange: BUSINESS_CONFIG.priceRange,
                        knowsAbout: BUSINESS_CONFIG.services,
                        areaServed: [
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
                        ]
                    })
                }}
            />
        </head>

        <body className={cn(
            'min-h-screen flex flex-col bg-background font-sans antialiased overflow-x-hidden',
            'selection:bg-carnation-200 selection:text-thistle-900',
            'scroll-smooth'
        )}>
        {/* Skip navigation for accessibility */}
        <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-[100] focus:z-[100] focus-luxury"
        >
            Skip to main content
        </a>

        {/* Header with error boundary */}
        <Suspense fallback={
            <div className="h-16 bg-gradient-to-r from-thistle-50 to-fairy-50 animate-pulse" />
        }>
            <Header />
        </Suspense>

        {/* Main content area */}
        <main id="main-content" className="flex-1 relative">
            <Suspense fallback={<GlobalLoading />}>
                {children}
            </Suspense>
        </main>

        {/* Footer with error boundary */}
        <Suspense fallback={
            <div className="h-64 bg-gradient-to-r from-thistle-100 to-fairy-100 animate-pulse" />
        }>
            <Footer />
        </Suspense>

        {/* Floating UI components - lazy loaded */}
        <Suspense>
            <WhatsappButton />
        </Suspense>

        <Suspense>
            <Guide />
        </Suspense>

        {/* Toast notifications */}
        <Toaster />

        {/* Performance monitoring in development */}
        {process.env.NODE_ENV === 'development' && (
            <div className="fixed bottom-4 left-4 bg-thistle-900/90 text-white text-xs p-3 rounded-xl z-50 pointer-events-none backdrop-blur-sm border border-thistle-700">
                <div className="font-medium">Build: {process.env.NEXT_PUBLIC_BUILD_TIME || 'dev'}</div>
                <div className="text-thistle-300">Env: {process.env.NODE_ENV}</div>
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