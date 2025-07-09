// src/app/packages/[packageId]/page.tsx

import { getPackageById, getPackages } from "@/lib/data";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle, DollarSign, Pin, Info, Star, Map, GalleryVertical } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { OptimizedPackageCard } from "@/components/optimized-package-card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { OptimizedMotionDiv } from "@/components/optimized-motion-div";
import { OptimizedVideoHeroBanner } from "@/components/optimized-video-hero";
import { PLACEHOLDER_VIDEOS } from "@/components/optimized-video-hero";
import { Suspense } from 'react';
import { Metadata } from 'next';

type PackageDetailPageProps = {
    params: {
        packageId: string;
    };
};

// Generate metadata for SEO
export async function generateMetadata({ params }: PackageDetailPageProps): Promise<Metadata> {
    try {
        const pkg = await getPackageById(params.packageId);

        if (!pkg) {
            return {
                title: 'Package Not Found - Utsav Travels',
                description: 'The requested package could not be found.',
            };
        }

        return {
            title: `${pkg.name || 'Unknown Package'} - ${pkg.tagline || 'Travel Package'} | Utsav Travels`,
            description: `${(pkg.description || '').slice(0, 155)}...`,
            keywords: `${pkg.name || ''}, ${(pkg.cities || []).join(', ')}, ${(pkg.tags || []).join(', ')}, spiritual tour package`,
            openGraph: {
                title: pkg.name || 'Travel Package',
                description: pkg.tagline || 'Discover amazing destinations',
                images: [{ url: pkg.thumbnail || '/placeholder.jpg', width: 1200, height: 630, alt: pkg.name || 'Package' }],
            },
            twitter: {
                title: pkg.name || 'Travel Package',
                description: pkg.tagline || 'Discover amazing destinations',
                images: [pkg.thumbnail || '/placeholder.jpg'],
            },
        };
    } catch (error) {
        return {
            title: 'Package Details - Utsav Travels',
            description: 'Explore our spiritual travel packages',
        };
    }
}

// Generate static params for better performance
export async function generateStaticParams() {
    try {
        const packages = await getPackages();
        return (packages || []).slice(0, 10).map((pkg) => ({
            packageId: pkg?.id || 'unknown',
        }));
    } catch (error) {
        console.error('Error generating static params:', error);
        return [];
    }
}

// Optimized data fetching with comprehensive error handling
async function getPackageData(packageId: string) {
    try {
        const [pkg, allPackages] = await Promise.all([
            getPackageById(packageId),
            getPackages().catch(() => [])
        ]);

        if (!pkg) {
            return null;
        }

        // Safe package object with defaults
        const safePackage = {
            id: pkg.id || 'unknown',
            name: pkg.name || 'Unknown Package',
            tagline: pkg.tagline || 'Discover new places',
            description: pkg.description || 'This is an amazing travel package.',
            duration: pkg.duration || '3 Days',
            cities: pkg.cities || [],
            price: pkg.price || 'Contact for pricing',
            thumbnail: pkg.thumbnail || 'https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?w=600&h=400',
            images: pkg.images || [],
            tags: pkg.tags || [],
            highlights: pkg.highlights || ['Amazing destinations', 'Expert guides', 'Comfortable accommodation'],
            inclusions: pkg.inclusions || ['Accommodation', 'Transportation', 'Meals', 'Guide'],
            itinerary: pkg.itinerary || [
                { day: 1, title: 'Arrival', description: 'Welcome to your spiritual journey' },
                { day: 2, title: 'Exploration', description: 'Discover sacred places' },
                { day: 3, title: 'Departure', description: 'Safe travels home' }
            ]
        };

        const safeAllPackages = Array.isArray(allPackages) ? allPackages : [];
        const relatedPackages = safeAllPackages
            .filter(p => p?.id !== safePackage.id && (
                p?.cities?.some(c => safePackage.cities.includes(c)) ||
                p?.tags?.some(t => safePackage.tags.includes(t))
            ))
            .slice(0, 3);

        return { pkg: safePackage, relatedPackages };
    } catch (error) {
        console.error('Error fetching package data:', error);
        return null;
    }
}

// Loading component
function PackageDetailLoading() {
    return (
        <div className="animate-fade-in">
            <div className="h-[60vh] bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="text-white text-xl animate-pulse">Loading package details...</div>
            </div>
            <div className="section-padding bg-secondary">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-2 space-y-8">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="h-32 bg-white/10 animate-pulse rounded-lg" />
                            ))}
                        </div>
                        <div className="lg:col-span-1">
                            <div className="h-96 bg-white/10 animate-pulse rounded-lg" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Helper function to get package-specific video with safety checks
function getPackageVideo(packageTags?: string[], packageName?: string): string {
    if (!packageTags && !packageName) {
        return PLACEHOLDER_VIDEOS.spiritual;
    }

    const normalizedName = (packageName || '').toLowerCase();
    const normalizedTags = (packageTags || []).map(tag => (tag || '').toLowerCase());

    if (normalizedTags.includes('spiritual') || normalizedName.includes('spiritual')) {
        return PLACEHOLDER_VIDEOS.spiritual;
    }
    if (normalizedTags.includes('adventure') || normalizedName.includes('trek')) {
        return PLACEHOLDER_VIDEOS.journey;
    }
    if (normalizedTags.includes('heritage') || normalizedName.includes('heritage')) {
        return PLACEHOLDER_VIDEOS.temple;
    }
    return PLACEHOLDER_VIDEOS.nature;
}

export default async function OptimizedPackageDetailPage({ params }: PackageDetailPageProps) {
    const data = await getPackageData(params.packageId);

    if (!data) {
        notFound();
    }

    const { pkg, relatedPackages } = data;

    return (
        <div className="animate-fade-in">
            {/* Video Hero Section */}
            <Suspense fallback={<PackageDetailLoading />}>
                <OptimizedVideoHeroBanner
                    videoSrc={getPackageVideo(pkg.tags, pkg.name)}
                    fallbackImage={pkg.images[0] || pkg.thumbnail}
                    title={pkg.name}
                    subtitle={pkg.tagline}
                    height="60vh"
                    overlayDarkness={0.5}
                >
                    {/* Custom overlay content */}
                    <div className="relative z-30 text-center max-w-4xl mx-auto px-4">
                        <div className="mb-4">
                            <span className="text-lg text-accent font-medium">{pkg.cities.join(', ')}</span>
                        </div>
                        <h1 className="font-headline text-5xl md:text-7xl font-bold text-white mb-4 text-shadow-lg">
                            {pkg.name}
                        </h1>
                        <p className="text-xl md:text-2xl text-primary mb-6 text-shadow">{pkg.tagline}</p>
                        <div className="flex flex-wrap gap-2 justify-center">
                            {pkg.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="backdrop-blur-sm bg-black/30 text-white border-white/20 hover:bg-black/40 transition-colors">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </OptimizedVideoHeroBanner>
            </Suspense>

            {/* Details Section */}
            <section className="py-16 md:py-24 bg-secondary">
                <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-12">

                        <OptimizedMotionDiv preset="slideUp">
                            <h2 className="font-headline text-4xl mb-6 flex items-center gap-3">
                                <Info className="h-8 w-8 text-primary"/>
                                Package Overview
                            </h2>
                            <p className="text-lg text-muted-foreground">{pkg.description}</p>
                        </OptimizedMotionDiv>

                        <OptimizedMotionDiv preset="slideUp">
                            <h2 className="font-headline text-4xl mb-6 flex items-center gap-3">
                                <Map className="h-8 w-8 text-primary" />
                                Your Adventure Itinerary
                            </h2>
                            <Accordion type="single" collapsible className="w-full bg-card p-4 rounded-lg">
                                {pkg.itinerary.map((item, index) => (
                                    <AccordionItem
                                        value={`day-${item.day}`}
                                        key={item.day}
                                        className={index === pkg.itinerary.length - 1 ? "border-b-0" : ""}
                                    >
                                        <AccordionTrigger className="text-xl font-headline hover:no-underline text-accent">
                                            Day {item.day}: {item.title}
                                        </AccordionTrigger>
                                        <AccordionContent className="text-muted-foreground text-base pl-2 pt-2">
                                            {item.description}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </OptimizedMotionDiv>

                        <OptimizedMotionDiv preset="slideUp">
                            <h2 className="font-headline text-4xl mb-6 flex items-center gap-3">
                                <GalleryVertical className="h-8 w-8 text-primary"/>
                                Gallery
                            </h2>
                            {pkg.images.length > 0 ? (
                                <Carousel className="w-full -ml-1">
                                    <CarouselContent>
                                        {pkg.images.map((img, index) => (
                                            <CarouselItem key={index} className="md:basis-1/2">
                                                <div className="p-1">
                                                    <Card>
                                                        <CardContent className="relative flex aspect-video items-center justify-center p-0 overflow-hidden rounded-lg">
                                                            <Image
                                                                src={img}
                                                                alt={`${pkg.name} gallery image ${index + 1}`}
                                                                fill
                                                                className="object-cover transition-transform hover:scale-105"
                                                                loading="lazy"
                                                            />
                                                        </CardContent>
                                                    </Card>
                                                </div>
                                            </CarouselItem>
                                        ))}
                                    </CarouselContent>
                                    <CarouselPrevious />
                                    <CarouselNext />
                                </Carousel>
                            ) : (
                                <Card>
                                    <CardContent className="relative flex aspect-video items-center justify-center p-0 overflow-hidden rounded-lg">
                                        <Image
                                            src={pkg.thumbnail}
                                            alt={pkg.name}
                                            fill
                                            className="object-cover"
                                            loading="lazy"
                                        />
                                    </CardContent>
                                </Card>
                            )}
                        </OptimizedMotionDiv>
                    </div>

                    <aside className="lg:col-span-1">
                        <OptimizedMotionDiv preset="scaleIn" className="sticky top-24">
                            <Card className="shadow-lg bg-card/80 backdrop-blur-md">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-4 mb-4 pb-4 border-b">
                                        <Calendar className="h-8 w-8 text-primary"/>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Duration</p>
                                            <p className="font-bold text-lg">{pkg.duration}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 mb-4 pb-4 border-b">
                                        <Pin className="h-8 w-8 text-primary"/>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Cities</p>
                                            <p className="font-bold text-lg">{pkg.cities.join(', ') || 'Multiple cities'}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 mb-6 pb-4 border-b">
                                        <DollarSign className="h-8 w-8 text-primary"/>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Price</p>
                                            <p className="font-bold text-lg">{pkg.price}</p>
                                        </div>
                                    </div>

                                    <h3 className="font-headline text-2xl mb-4 flex items-center gap-3">
                                        <Star className="h-6 w-6 text-accent" />
                                        Highlights
                                    </h3>
                                    <ul className="space-y-2 list-disc list-inside text-muted-foreground mb-6">
                                        {pkg.highlights.map((item, index) => (
                                            <li key={index}>{item}</li>
                                        ))}
                                    </ul>

                                    <h3 className="font-headline text-2xl mb-4">What's Included</h3>
                                    <ul className="space-y-3 text-muted-foreground">
                                        {pkg.inclusions.map((item, index) => (
                                            <li key={index} className="flex items-start gap-3">
                                                <CheckCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        </OptimizedMotionDiv>
                    </aside>
                </div>
            </section>

            {/* Related Packages */}
            {relatedPackages.length > 0 && (
                <section className="py-16 md:py-24 bg-background">
                    <div className="container mx-auto px-4">
                        <h2 className="text-4xl font-headline text-center mb-12">Related Packages</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {relatedPackages.map((p, index) => (
                                <OptimizedPackageCard key={p?.id || index} pkg={p} index={index} showAnimation={false} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Schema markup */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "TouristTrip",
                        "name": pkg.name,
                        "description": pkg.description,
                        "image": pkg.thumbnail,
                        "offers": {
                            "@type": "Offer",
                            "price": pkg.price,
                            "priceCurrency": "INR",
                            "availability": "https://schema.org/InStock"
                        },
                        "itinerary": pkg.itinerary.map((item) => ({
                            "@type": "TouristAttraction",
                            "name": item.title,
                            "description": item.description
                        })),
                        "provider": {
                            "@type": "TravelAgency",
                            "name": "Utsav Travels"
                        }
                    })
                }}
            />
        </div>
    );
}