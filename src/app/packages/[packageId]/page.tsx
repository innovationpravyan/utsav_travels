// src/app/packages/[packageId]/page.tsx

import {getPackageById, getPackages} from "@/lib/data";
import {notFound} from "next/navigation";
import Image from "next/image";
import {Badge} from "@/components/ui/badge";
import {Calendar, CheckCircle, Clock, GalleryVertical, MapPin, Route, Star, Users} from "lucide-react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {HeroImageBanner} from '@/components/hero-image-banner';
import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious,} from "@/components/ui/carousel";
import {OptimizedPackageCard} from "@/components/optimized-package-card";
import {OptimizedMotionDiv} from "@/components/optimized-motion-div";
import {Suspense} from 'react';
import {Metadata} from 'next';
import {Button} from "@/components/ui/button";
import Link from "next/link";

type PackageDetailPageProps = {
    params: {
        packageId: string;
    };
};

// Generate metadata for SEO
export async function generateMetadata({params}: PackageDetailPageProps): Promise<Metadata> {
    try {
        const pkg = await getPackageById(params.packageId);

        if (!pkg) {
            return {
                title: 'Package Not Found - Utsav Travels',
                description: 'The requested package could not be found.',
            };
        }

        return {
            title: `${pkg.name || 'Unknown Package'} - ${pkg.duration || ''} | Utsav Travels`,
            description: `${pkg.description || 'Discover amazing travel experiences'}. Duration: ${pkg.duration || 'Contact for details'}. Cities: ${pkg.cities?.join(', ') || 'Multiple destinations'}.`,
            keywords: `${pkg.name || ''}, ${pkg.cities?.join(', ') || ''}, ${(pkg.tags || []).join(', ')}, travel package, spiritual journey`,
            openGraph: {
                title: `${pkg.name || 'Unknown Package'} - ${pkg.duration || ''}`,
                description: pkg.description || 'Discover amazing travel experiences with our curated packages',
                images: [{url: pkg.image || '/placeholder.jpg', width: 1200, height: 630, alt: pkg.name || 'Package'}], // Use 'image' field
            },
            twitter: {
                title: `${pkg.name || 'Unknown Package'} - ${pkg.duration || ''}`,
                description: pkg.description || 'Discover amazing travel experiences with our curated packages',
                images: [pkg.image || '/placeholder.jpg'], // Use 'image' field
            },
        };
    } catch (error) {
        return {
            title: 'Package Details - Utsav Travels',
            description: 'Explore our curated travel packages for spiritual journeys across India',
        };
    }
}

// Generate static params for better performance
export async function generateStaticParams() {
    try {
        const packages = await getPackages();
        return (packages || []).slice(0, 15).map((pkg) => ({
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

        // Safe package object with defaults - using correct field names from data.ts
        const safePackage = {
            id: pkg.id || 'unknown',
            name: pkg.name || 'Unknown Package',
            description: pkg.description || 'An amazing travel experience awaits you.',
            duration: pkg.duration || '3 Days',
            cities: pkg.cities || [],
            image: pkg.image || 'https://images.pexels.com/photos/1008155/pexels-photo-1008155.jpeg?w=600&h=400', // Use 'image' field
            highlights: pkg.highlights || [],
            itinerary: pkg.itinerary || [],
            inclusions: pkg.inclusions || [],
            gallery: pkg.gallery || [], // Use 'gallery' field
            tags: pkg.tags || [],
            price: pkg.price || 'Contact for pricing',
            originalPrice: pkg.originalPrice,
            discount: pkg.discount
        };

        const safeAllPackages = Array.isArray(allPackages) ? allPackages : [];
        const relatedPackages = safeAllPackages
            .filter(p => p?.id !== safePackage.id && (
                p?.cities?.some(city => safePackage.cities.includes(city)) ||
                p?.tags?.some(tag => safePackage.tags.includes(tag))
            ))
            .slice(0, 3);

        return {package: safePackage, relatedPackages};
    } catch (error) {
        console.error('Error fetching package data:', error);
        return null;
    }
}

// Loading component
function PackageDetailLoading() {
    return (
        <div className="animate-fade-in">
            <div
                className="h-[60vh] bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="text-white text-xl animate-pulse">Loading package details...</div>
            </div>
            <div className="section-padding bg-secondary">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-2 space-y-8">
                            {Array.from({length: 3}).map((_, i) => (
                                <div key={i} className="h-48 bg-white/10 animate-pulse rounded-lg"/>
                            ))}
                        </div>
                        <div className="lg:col-span-1">
                            <div className="h-64 bg-white/10 animate-pulse rounded-lg"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default async function OptimizedPackageDetailPage({params}: PackageDetailPageProps) {
    const data = await getPackageData(params.packageId);

    if (!data) {
        notFound();
    }

    const {package: pkg, relatedPackages} = data;

    // Price formatting
    const priceString = pkg.price?.toString() || 'Contact for pricing';
    const priceMatch = priceString.match(/[\d,]+/);
    const priceNumber = priceMatch ? priceMatch[0] : priceString;
    const currency = priceString.includes('₹') ? '₹' : '$';

    return (
        <div className="animate-fade-in">
            {/* Hero Image Banner */}
            <Suspense fallback={<PackageDetailLoading/>}>
                <div className="relative">
                    <HeroImageBanner
                        page="packages"
                        title={pkg.name}
                        subtitle={`${pkg.duration} • ${pkg.cities.join(', ')}`}
                        description={pkg.description}
                        imageUrl={pkg.gallery?.[0] || pkg.image}
                        height="60vh"
                        overlayOpacity={0.5}
                        parallaxEffect={true}
                        showScrollIndicator={false}
                    />

                    {/* Custom overlay content for price and tags */}
                    <div className="absolute inset-0 z-30 flex items-end justify-between p-6 md:p-12">
                        <div className="flex flex-wrap gap-2">
                            {pkg.tags.map((tag) => (
                                <Badge
                                    key={tag}
                                    variant="secondary"
                                    className="backdrop-blur-sm bg-black/30 text-white border-white/20 hover:bg-black/40 transition-colors"
                                >
                                    {tag}
                                </Badge>
                            ))}
                        </div>

                        <div className="backdrop-blur-sm bg-black/30 text-white border border-white/20 rounded-lg p-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-400">
                                    {priceNumber !== priceString ? `${currency}${priceNumber}` : priceString}
                                </div>
                                <div className="text-sm text-white/80">per person</div>
                            </div>
                        </div>
                    </div>
                </div>
            </Suspense>

            {/* Content Section */}
            <section className="py-16 md:py-24 bg-secondary">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-2 space-y-8">

                            {/* Package Overview */}
                            <OptimizedMotionDiv preset="slideUp">
                                <Card className="bg-card/80 backdrop-blur-md">
                                    <CardHeader>
                                        <CardTitle className="font-headline text-4xl flex items-center gap-3">
                                            <Route className="h-8 w-8 text-primary"/>
                                            Package Overview
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-lg text-muted-foreground space-y-4">
                                        <p>{pkg.description}</p>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                                            <div className="text-center p-4 bg-white/5 rounded-lg">
                                                <Clock className="h-6 w-6 text-blue-400 mx-auto mb-2"/>
                                                <div className="font-semibold text-white">{pkg.duration}</div>
                                                <div className="text-sm text-white/70">Duration</div>
                                            </div>
                                            <div className="text-center p-4 bg-white/5 rounded-lg">
                                                <MapPin className="h-6 w-6 text-green-400 mx-auto mb-2"/>
                                                <div className="font-semibold text-white">{pkg.cities.length}</div>
                                                <div className="text-sm text-white/70">Cities</div>
                                            </div>
                                            <div className="text-center p-4 bg-white/5 rounded-lg">
                                                <Star className="h-6 w-6 text-yellow-400 mx-auto mb-2"/>
                                                <div className="font-semibold text-white">4.8</div>
                                                <div className="text-sm text-white/70">Rating</div>
                                            </div>
                                            <div className="text-center p-4 bg-white/5 rounded-lg">
                                                <Users className="h-6 w-6 text-purple-400 mx-auto mb-2"/>
                                                <div className="font-semibold text-white">2-12</div>
                                                <div className="text-sm text-white/70">Group Size</div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </OptimizedMotionDiv>

                            {/* Itinerary */}
                            {pkg.itinerary.length > 0 && (
                                <OptimizedMotionDiv preset="slideUp">
                                    <Card className="bg-card/80 backdrop-blur-md">
                                        <CardHeader>
                                            <CardTitle className="font-headline text-4xl flex items-center gap-3">
                                                <Calendar className="h-8 w-8 text-primary"/>
                                                Day-wise Itinerary
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            {pkg.itinerary.map((day, index) => (
                                                <div key={index} className="border-l-4 border-primary pl-4 py-2">
                                                    <h4 className="font-bold text-white text-lg">
                                                        Day {day.day}: {day.title}
                                                    </h4>
                                                    <ul className="mt-2 space-y-1">
                                                        {day.activities.map((activity, actIndex) => (
                                                            <li key={actIndex}
                                                                className="text-muted-foreground flex items-start gap-2">
                                                                <CheckCircle
                                                                    className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0"/>
                                                                {activity}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))}
                                        </CardContent>
                                    </Card>
                                </OptimizedMotionDiv>
                            )}

                            {/* Inclusions */}
                            {pkg.inclusions.length > 0 && (
                                <OptimizedMotionDiv preset="slideUp">
                                    <Card className="bg-card/80 backdrop-blur-md">
                                        <CardHeader>
                                            <CardTitle className="font-headline text-4xl flex items-center gap-3">
                                                <CheckCircle className="h-8 w-8 text-primary"/>
                                                What's Included
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                {pkg.inclusions.map((inclusion, index) => (
                                                    <div key={index}
                                                         className="flex items-center gap-2 text-muted-foreground">
                                                        <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0"/>
                                                        {inclusion}
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </OptimizedMotionDiv>
                            )}
                        </div>

                        <aside className="lg:col-span-1 space-y-6">
                            {/* Highlights */}
                            <OptimizedMotionDiv preset="scaleIn" className="sticky top-24">
                                <Card className="bg-card/80 backdrop-blur-md">
                                    <CardHeader>
                                        <CardTitle className="font-headline text-3xl flex items-center gap-3">
                                            <Star className="h-7 w-7 text-accent"/>
                                            Highlights
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-2">
                                            {pkg.highlights.map((highlight, index) => (
                                                <li key={index}
                                                    className="flex items-start gap-2 text-muted-foreground">
                                                    <Star className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0"/>
                                                    {highlight}
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            </OptimizedMotionDiv>

                            {/* Cities Covered */}
                            <OptimizedMotionDiv preset="scaleIn">
                                <Card className="bg-card/80 backdrop-blur-md">
                                    <CardHeader>
                                        <CardTitle className="font-headline text-3xl flex items-center gap-3">
                                            <MapPin className="h-7 w-7 text-accent"/>
                                            Cities Covered
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-wrap gap-2">
                                            {pkg.cities.map((city) => (
                                                <Badge
                                                    key={city}
                                                    variant="secondary"
                                                    className="bg-primary/20 text-primary border-primary/30"
                                                >
                                                    {city}
                                                </Badge>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </OptimizedMotionDiv>

                            {/* Booking CTA */}
                            <OptimizedMotionDiv preset="scaleIn">
                                <Card
                                    className="bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-md border-primary/30">
                                    <CardContent className="p-6 text-center">
                                        <h3 className="text-2xl font-bold text-white mb-4">Ready to Book?</h3>
                                        <div className="text-3xl font-bold text-green-400 mb-2">
                                            {priceNumber !== priceString ? `${currency}${priceNumber}` : priceString}
                                        </div>
                                        <div className="text-sm text-white/80 mb-6">per person</div>

                                        <Button asChild
                                                className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3">
                                            <Link href="/contact">
                                                Book Now
                                            </Link>
                                        </Button>

                                        <Button variant="outline" asChild
                                                className="w-full mt-2 border-white/20 text-white hover:bg-white/10">
                                            <Link href="/contact">
                                                Get Custom Quote
                                            </Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            </OptimizedMotionDiv>
                        </aside>
                    </div>
                </div>
            </section>

            {/* Gallery Section */}
            <section className="py-16 md:py-24 bg-background">
                <div className="container mx-auto px-4">
                    <h2 className="font-headline text-4xl text-center mb-12">Package Gallery</h2>

                    <OptimizedMotionDiv preset="slideUp">
                        <h3 className="font-headline text-3xl mb-4 flex items-center gap-3">
                            <GalleryVertical className="h-7 w-7 text-primary"/>
                            Images
                        </h3>
                        {pkg.gallery.length > 0 ? (
                            <Carousel className="w-full -ml-1">
                                <CarouselContent>
                                    {pkg.gallery.map((img, index) => (
                                        <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                                            <Card>
                                                <CardContent
                                                    className="relative flex aspect-video items-center justify-center p-0 overflow-hidden rounded-lg">
                                                    <Image
                                                        src={img}
                                                        alt={`${pkg.name} gallery image ${index + 1}`}
                                                        fill
                                                        className="object-cover transition-transform hover:scale-105"
                                                        loading="lazy"
                                                    />
                                                </CardContent>
                                            </Card>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                <CarouselPrevious/>
                                <CarouselNext/>
                            </Carousel>
                        ) : (
                            <Card>
                                <CardContent
                                    className="relative flex aspect-video items-center justify-center p-0 overflow-hidden rounded-lg">
                                    <Image
                                        src={pkg.image}
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
            </section>

            {relatedPackages.length > 0 && (
                <section className="py-16 md:py-24 bg-secondary">
                    <div className="container mx-auto px-4">
                        <h2 className="text-4xl font-headline text-center mb-12">Similar Packages</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {relatedPackages.map((p, index) => (
                                <OptimizedPackageCard key={p?.id || index} pkg={p} index={index} showAnimation={false}/>
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
                        "image": pkg.image, // Use 'image' field
                        "offers": {
                            "@type": "Offer",
                            "price": priceString,
                            "priceCurrency": currency === '₹' ? 'INR' : 'USD',
                            "availability": "https://schema.org/InStock"
                        },
                        "duration": pkg.duration,
                        "touristType": pkg.tags.join(", "),
                        "itinerary": pkg.itinerary.map(day => ({
                            "@type": "Action",
                            "name": day.title,
                            "description": day.activities.join(", ")
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