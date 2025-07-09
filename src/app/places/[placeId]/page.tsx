// src/app/places/[placeId]/page.tsx

import { getPlaceById, getPlaces } from "@/lib/data";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Landmark, BookOpen, Star, MapPin, GalleryVertical } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { OptimizedPlaceCard } from "@/components/optimized-place-card";
import { OptimizedMotionDiv } from "@/components/optimized-motion-div";
import { OptimizedVideoHeroBanner } from "@/components/optimized-video-hero";
import { PLACEHOLDER_VIDEOS } from "@/components/optimized-video-hero";
import { Suspense } from 'react';
import { Metadata } from 'next';

type PlaceDetailPageProps = {
    params: {
        placeId: string;
    };
};

// Generate metadata for SEO
export async function generateMetadata({ params }: PlaceDetailPageProps): Promise<Metadata> {
    try {
        const place = await getPlaceById(params.placeId);

        if (!place) {
            return {
                title: 'Place Not Found - Utsav Travels',
                description: 'The requested place could not be found.',
            };
        }

        return {
            title: `${place.name || 'Unknown Place'} - ${place.city || 'India'} | Utsav Travels`,
            description: `Discover ${place.name || 'this amazing place'} in ${place.city || 'India'}. ${(place.description || '').slice(0, 140)}...`,
            keywords: `${place.name || ''}, ${place.city || ''}, ${place.category || ''}, ${(place.tags || []).join(', ')}, spiritual destination`,
            openGraph: {
                title: `${place.name || 'Unknown Place'} - ${place.city || 'India'}`,
                description: place.tagline || `Discover ${place.name || 'this amazing place'} in ${place.city || 'India'}`,
                images: [{ url: place.thumbnail || '/placeholder.jpg', width: 1200, height: 630, alt: place.name || 'Place' }],
            },
            twitter: {
                title: `${place.name || 'Unknown Place'} - ${place.city || 'India'}`,
                description: place.tagline || `Discover ${place.name || 'this amazing place'} in ${place.city || 'India'}`,
                images: [place.thumbnail || '/placeholder.jpg'],
            },
        };
    } catch (error) {
        return {
            title: 'Place Details - Utsav Travels',
            description: 'Explore spiritual destinations across India',
        };
    }
}

// Generate static params for better performance
export async function generateStaticParams() {
    try {
        const places = await getPlaces();
        return (places || []).slice(0, 15).map((place) => ({
            placeId: place?.id || 'unknown',
        }));
    } catch (error) {
        console.error('Error generating static params:', error);
        return [];
    }
}

// Optimized data fetching with comprehensive error handling
async function getPlaceData(placeId: string) {
    try {
        const [place, allPlaces] = await Promise.all([
            getPlaceById(placeId),
            getPlaces().catch(() => [])
        ]);

        if (!place) {
            return null;
        }

        // Safe place object with defaults
        const safePlace = {
            id: place.id || 'unknown',
            name: place.name || 'Unknown Place',
            city: place.city || 'Unknown City',
            category: place.category || 'Destination',
            thumbnail: place.thumbnail || 'https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?w=600&h=400',
            tagline: place.tagline || '',
            tags: place.tags || [],
            images: place.images || [],
            highlights: place.highlights || [],
            description: place.description || 'This is a beautiful spiritual destination.',
            history: place.history || 'This place has a rich cultural heritage.',
            location: place.location || { lat: 0, lng: 0 }
        };

        const safeAllPlaces = Array.isArray(allPlaces) ? allPlaces : [];
        const relatedPlaces = safeAllPlaces
            .filter(p => p?.id !== safePlace.id && (
                p?.city === safePlace.city ||
                p?.category === safePlace.category
            ))
            .slice(0, 3);

        return { place: safePlace, relatedPlaces };
    } catch (error) {
        console.error('Error fetching place data:', error);
        return null;
    }
}

// Loading component
function PlaceDetailLoading() {
    return (
        <div className="animate-fade-in">
            <div className="h-[60vh] bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="text-white text-xl animate-pulse">Loading place details...</div>
            </div>
            <div className="section-padding bg-secondary">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-2 space-y-8">
                            {Array.from({ length: 2 }).map((_, i) => (
                                <div key={i} className="h-48 bg-white/10 animate-pulse rounded-lg" />
                            ))}
                        </div>
                        <div className="lg:col-span-1">
                            <div className="h-64 bg-white/10 animate-pulse rounded-lg" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Helper function to get place-specific video
function getPlaceVideo(placeName?: string): string {
    if (!placeName || typeof placeName !== 'string') {
        return PLACEHOLDER_VIDEOS.temple;
    }

    const normalizedName = placeName.toLowerCase();
    if (normalizedName.includes('varanasi')) return '/videos/varanasi.webm';
    if (normalizedName.includes('ayodhya')) return '/videos/ayodhya.webm';
    if (normalizedName.includes('rishikesh')) return '/videos/rishikesh.webm';
    if (normalizedName.includes('kedarnath')) return '/videos/kedarnath.webm';
    return PLACEHOLDER_VIDEOS.temple;
}

export default async function OptimizedPlaceDetailPage({ params }: PlaceDetailPageProps) {
    const data = await getPlaceData(params.placeId);

    if (!data) {
        notFound();
    }

    const { place, relatedPlaces } = data;

    return (
        <div className="animate-fade-in">
            {/* Video Hero Section */}
            <Suspense fallback={<PlaceDetailLoading />}>
                <OptimizedVideoHeroBanner
                    videoSrc={getPlaceVideo(place.name)}
                    fallbackImage={place.images[0] || place.thumbnail}
                    title={place.name}
                    subtitle={`${place.city} • ${place.category}`}
                    height="60vh"
                    overlayDarkness={0.5}
                >
                    {/* Custom overlay content */}
                    <div className="relative z-30 text-center max-w-4xl mx-auto px-4">
                        <div className="mb-4">
                            <span className="text-lg text-accent font-medium">{place.city} • {place.category}</span>
                        </div>
                        <h1 className="font-headline text-5xl md:text-7xl font-bold text-white mb-6 text-shadow-lg">
                            {place.name}
                        </h1>
                        <div className="flex flex-wrap gap-2 justify-center">
                            {place.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="backdrop-blur-sm bg-black/30 text-white border-white/20 hover:bg-black/40 transition-colors">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </OptimizedVideoHeroBanner>
            </Suspense>

            {/* Content Section */}
            <section className="py-16 md:py-24 bg-secondary">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-2 space-y-8">

                            <OptimizedMotionDiv preset="slideUp">
                                <Card className="bg-card/80 backdrop-blur-md">
                                    <CardHeader>
                                        <CardTitle className="font-headline text-4xl flex items-center gap-3">
                                            <Landmark className="h-8 w-8 text-primary"/>
                                            About {place.name}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-lg text-muted-foreground space-y-4">
                                        <p>{place.description}</p>
                                    </CardContent>
                                </Card>
                            </OptimizedMotionDiv>

                            <OptimizedMotionDiv preset="slideUp">
                                <Card className="bg-card/80 backdrop-blur-md">
                                    <CardHeader>
                                        <CardTitle className="font-headline text-4xl flex items-center gap-3">
                                            <BookOpen className="h-8 w-8 text-primary"/>
                                            A Glimpse into History
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-lg text-muted-foreground space-y-4">
                                        <p>{place.history}</p>
                                    </CardContent>
                                </Card>
                            </OptimizedMotionDiv>
                        </div>

                        <aside className="lg:col-span-1">
                            <OptimizedMotionDiv preset="scaleIn" className="sticky top-24">
                                <Card className="bg-card/80 backdrop-blur-md">
                                    <CardHeader>
                                        <CardTitle className="font-headline text-3xl flex items-center gap-3">
                                            <Star className="h-7 w-7 text-accent"/>
                                            Highlights
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                                            {place.highlights.map((highlight, index) => (
                                                <li key={index}>
                                                    {highlight}
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            </OptimizedMotionDiv>
                        </aside>
                    </div>
                </div>
            </section>

            {/* Gallery and Map section */}
            <section className="py-16 md:py-24 bg-background">
                <div className="container mx-auto px-4">
                    <h2 className="font-headline text-4xl text-center mb-12">Discover More</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                        <OptimizedMotionDiv preset="slideUp">
                            <h3 className="font-headline text-3xl mb-4 flex items-center gap-3">
                                <GalleryVertical className="h-7 w-7 text-primary"/>
                                Gallery
                            </h3>
                            {place.images.length > 0 ? (
                                <Carousel className="w-full -ml-1">
                                    <CarouselContent>
                                        {place.images.map((img, index) => (
                                            <CarouselItem key={index}>
                                                <Card>
                                                    <CardContent className="relative flex aspect-video items-center justify-center p-0 overflow-hidden rounded-lg">
                                                        <Image
                                                            src={img}
                                                            alt={`${place.name} gallery image ${index + 1}`}
                                                            fill
                                                            className="object-cover transition-transform hover:scale-105"
                                                            loading="lazy"
                                                        />
                                                    </CardContent>
                                                </Card>
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
                                            src={place.thumbnail}
                                            alt={place.name}
                                            fill
                                            className="object-cover"
                                            loading="lazy"
                                        />
                                    </CardContent>
                                </Card>
                            )}
                        </OptimizedMotionDiv>

                        <OptimizedMotionDiv preset="slideUp">
                            <h3 className="font-headline text-3xl mb-4 flex items-center gap-3">
                                <MapPin className="h-7 w-7 text-primary"/>
                                Location
                            </h3>
                            <Card>
                                <CardContent className="relative aspect-video p-0 rounded-lg overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                                        <div className="text-center text-white">
                                            <MapPin className="h-12 w-12 text-white/80 mx-auto mb-2"/>
                                            <p className="font-bold text-lg">{place.name}</p>
                                            <p className="text-sm">{place.city}</p>
                                            <p className="text-xs mt-2">Lat: {place.location.lat}, Lng: {place.location.lng}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </OptimizedMotionDiv>
                    </div>
                </div>
            </section>

            {/* Related Places Section */}
            {relatedPlaces.length > 0 && (
                <section className="py-16 md:py-24 bg-secondary">
                    <div className="container mx-auto px-4">
                        <h2 className="text-4xl font-headline text-center mb-12">Related Destinations</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {relatedPlaces.map((p, index) => (
                                <OptimizedPlaceCard key={p?.id || index} place={p} index={index} showAnimation={false} />
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
                        "@type": "TouristAttraction",
                        "name": place.name,
                        "description": place.description,
                        "image": place.thumbnail,
                        "address": {
                            "@type": "PostalAddress",
                            "addressLocality": place.city,
                            "addressCountry": "IN"
                        },
                        "geo": {
                            "@type": "GeoCoordinates",
                            "latitude": place.location.lat,
                            "longitude": place.location.lng
                        },
                        "category": place.category,
                        "keywords": place.tags.join(", "),
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