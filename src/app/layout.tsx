import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Toaster } from '@/components/ui/toaster';
import { WhatsappButton } from '@/components/whatsapp-button';
import { AnimatedGuide } from '@/components/animated-guide';
import { Guide } from '@/components/guide';
import React from "react";

export const metadata: Metadata = {
    title: 'Utsav Travels - Spiritual Heritage Tours',
    description: 'Explore the spiritual heritage of Varanasi, Ayodhya, Rishikesh, Kedarnath with expert guided tours',
    keywords: 'spiritual tourism, Varanasi tours, Ayodhya travel, Rishikesh packages, Kedarnath pilgrimage',
    authors: [{ name: 'Utsav Travels' }],
    creator: 'Utsav Travels',
    publisher: 'Utsav Travels',
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    metadataBase: new URL('https://utsavtravels.com'),
    alternates: {
        canonical: '/',
    },
    openGraph: {
        title: 'Utsav Travels - Spiritual Heritage Tours',
        description: 'Explore the spiritual heritage of Varanasi, Ayodhya, Rishikesh, Kedarnath',
        url: 'https://utsavtravels.com',
        siteName: 'Utsav Travels',
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Utsav Travels - Spiritual Heritage Tours',
        description: 'Explore the spiritual heritage of Varanasi, Ayodhya, Rishikesh, Kedarnath',
        creator: '@utsavtravels',
    },
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
    verification: {
        google: 'your-google-verification-code',
    },
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark">
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
            <meta name="theme-color" content="#0f172a" />
            <meta name="color-scheme" content="dark" />

            {/* Optimized font loading with font-display: swap */}
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link
                href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700&family=Lora:wght@400;500;600;700&display=swap"
                rel="stylesheet"
            />

            {/* Preload critical resources */}
            <link rel="preload" href="/videos/home-hero.webm" as="video" type="video/webm" />

            {/* DNS prefetch for external domains */}
            <link rel="dns-prefetch" href="//images.pexels.com" />

            {/* Security headers */}
            <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
            <meta httpEquiv="Referrer-Policy" content="origin-when-cross-origin" />

            {/* Performance hints */}
            <meta httpEquiv="Accept-CH" content="DPR, Viewport-Width, Width" />

            {/* Enhanced Structured data for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "TravelAgency",
                        "name": "Utsav Travels",
                        "description": "Premier spiritual heritage tours across India",
                        "url": "https://utsavtravels.com",
                        "logo": "https://utsavtravels.com/logo.png",
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
                            "https://instagram.com/utsavtravels"
                        ],
                        "offers": {
                            "@type": "Offer",
                            "description": "Spiritual heritage tours and packages"
                        },
                        "aggregateRating": {
                            "@type": "AggregateRating",
                            "ratingValue": "4.9",
                            "reviewCount": "10000"
                        },
                        "priceRange": "₹₹",
                        "knowsAbout": [
                            "Spiritual Tourism",
                            "Heritage Sites",
                            "Cultural Tours",
                            "Varanasi",
                            "Ayodhya",
                            "Rishikesh",
                            "Kedarnath"
                        ],
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
                        ]
                    })
                }}
            />
            <title>Utsav Travels</title>
        </head>
        <body className={cn(
            'font-body antialiased min-h-screen flex flex-col bg-background',
            'selection:bg-primary/20 selection:text-primary-foreground'
        )}>
        {/* Skip to main content for accessibility */}
        <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50"
        >
            Skip to main content
        </a>

        <Header />

        <main id="main-content" className="flex-grow">
            {children}
        </main>

        <Footer />

        {/* Optimized floating components - lazy loaded */}
        <WhatsappButton />
        <Guide />
        <AnimatedGuide />
        <Toaster />

        {/* Performance monitoring in development only */}
        {process.env.NODE_ENV === 'development' && (
            <div className="fixed bottom-4 left-4 bg-black/80 text-white text-xs p-2 rounded-md z-50">
                <div>Render: {Date.now()}</div>
            </div>
        )}


        </body>
        </html>
    );
}