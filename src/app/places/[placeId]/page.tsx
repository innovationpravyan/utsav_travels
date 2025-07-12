// src/app/places/[placeId]/page.tsx

import {getPlaceById, getPlaces} from "@/lib/data";
import {notFound} from "next/navigation";
import Image from "next/image";
import {Badge} from "@/components/ui/badge";
import {BookOpen, GalleryVertical, Landmark, MapPin, Star, Crown, Gem, Sparkles, Heart} from "lucide-react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {HeroImageBanner} from '@/components/hero-image-banner';
import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious,} from "@/components/ui/carousel"
import {OptimizedPlaceCard} from "@/components/optimized-place-card";
import {OptimizedMotionDiv} from "@/components/optimized-motion-div";
import {Suspense} from 'react';
import {Metadata} from 'next';
import {cn} from "@/utils/utils";

type PlaceDetailPageProps = {
    params: {
        placeId: string;
    };
};

// Generate metadata for SEO
export async function generateMetadata({params}: PlaceDetailPageProps): Promise<Metadata> {
    try {
        const place = await getPlaceById(params.placeId);

        if (!place) {
            return {
                title: 'Destination Not Found - Sacred Journeys',
                description: 'The requested spiritual destination could not be found.',
            };
        }

        return {
            title: `${place.name || 'Sacred Destination'} - ${place.city || 'India'} | Spiritual Journeys`,
            description: `Discover ${place.name || 'this sacred destination'} in ${place.city || 'India'}. ${(place.description || '').slice(0, 140)}...`,
            keywords: `${place.name || ''}, ${place.city || ''}, ${place.category || ''}, ${(place.tags || []).join(', ')}, spiritual destination, sacred journey`,
            openGraph: {
                title: `${place.name || 'Sacred Destination'} - ${place.city || 'India'}`,
                description: place.shortDescription || `Discover ${place.name || 'this sacred destination'} in ${place.city || 'India'}`,
                images: [{
                    url: place.image || '/placeholder.jpg',
                    width: 1200,
                    height: 630,
                    alt: place.name || 'Place'
                }],
            },
            twitter: {
                title: `${place.name || 'Sacred Destination'} - ${place.city || 'India'}`,
                description: place.shortDescription || `Discover ${place.name || 'this sacred destination'} in ${place.city || 'India'}`,
                images: [place.image || '/placeholder.jpg'],
            },
        };
    } catch (error) {
        return {
            title: 'Place Details - Sacred Journeys',
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
            name: place.name || 'Sacred Destination',
            city: place.city || 'Unknown City',
            category: place.category || 'Destination',
            image: place.image || 'https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?w=600&h=400',
            shortDescription: place.shortDescription || '',
            description: place.description || 'This is a beautiful spiritual destination.',
            history: place.history || 'This place has a rich cultural heritage.',
            highlights: place.highlights || [],
            gallery: place.gallery || [],
            tags: place.tags || [],
            location: place.location || {lat: 0, lng: 0}
        };

        const safeAllPlaces = Array.isArray(allPlaces) ? allPlaces : [];
        const relatedPlaces = safeAllPlaces
            .filter(p => p?.id !== safePlace.id && (
                p?.city === safePlace.city ||
                p?.category === safePlace.category
            ))
            .slice(0, 3);

        return {place: safePlace, relatedPlaces};
    } catch (error) {
        console.error('Error fetching place data:', error);
        return null;
    }
}

// Loading component with luxury theme
function PlaceDetailLoading() {
    return (
        <div className="animate-fade-in-up">
            <div className="h-[60vh] section-thistle flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-thistle-300/30 rounded-full mx-auto mb-4">
                        <div className="w-16 h-16 border-4 border-t-thistle-500 border-r-fairy-500 border-b-carnation-500 border-l-uranian-500 rounded-full animate-spin" />
                    </div>
                    <div className="text-thistle-700 text-xl font-heading animate-pulse">Loading sacred destination details...</div>
                </div>
            </div>
            <div className="section-padding section-luxury">
                <div className="container-luxury">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
                        <div className="lg:col-span-2 space-y-6 md:space-y-8">
                            {Array.from({length: 2}).map((_, i) => (
                                <div key={i} className="h-48 md:h-64 bg-thistle-100 animate-pulse rounded-2xl"/>
                            ))}
                        </div>
                        <div className="lg:col-span-1">
                            <div className="h-64 md:h-80 bg-fairy-100 animate-pulse rounded-2xl"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default async function OptimizedPlaceDetailPage({params}: PlaceDetailPageProps) {
    const data = await getPlaceData(params.placeId);

    if (!data) {
        notFound();
    }

    const {place, relatedPlaces} = data;

    return (
        <div className="animate-fade-in-up">
            {/* Hero Image Banner */}
            <Suspense fallback={<PlaceDetailLoading/>}>
                <div className="relative">
                    <HeroImageBanner
                        page="destinations"
                        title={place.name}
                        subtitle={`${place.city} • ${place.category}`}
                        description={place.shortDescription}
                        imageUrl={place.gallery?.[0] || place.image}
                        height="60vh"
                        overlayOpacity={0.5}
                        parallaxEffect={true}
                        showScrollIndicator={false}
                    />

                    {/* Custom overlay content for tags */}
                    <div className="absolute inset-0 z-30 flex items-end justify-center pb-8 md:pb-12">
                        <div className="flex flex-wrap gap-2 justify-center px-4">
                            {place.tags.map((tag) => (
                                <Badge
                                    key={tag}
                                    variant="secondary"
                                    className="glass-luxury border-white/20 text-white hover:bg-white/20 transition-all duration-300"
                                >
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>
            </Suspense>

            {/* Content Section */}
            <section className="section-padding section-luxury">
                <div className="container-luxury">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
                        <div className="lg:col-span-2 space-y-6 md:space-y-8">

                            {/* About Section */}
                            <OptimizedMotionDiv preset="slideUp">
                                <Card className="card-luxury">
                                    <CardHeader>
                                        <CardTitle className="text-heading text-3xl md:text-4xl flex items-center gap-3">
                                            <Landmark className="h-7 w-7 md:h-8 md:w-8 text-thistle-600"/>
                                            About {place.name}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-lg text-thistle-700 space-y-4 md:space-y-6">
                                        <p className="text-body leading-relaxed">{place.description}</p>

                                        {/* Category and Location info */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                            <div className="flex items-center gap-3 p-4 bg-thistle-50 rounded-xl border border-thistle-100">
                                                <Gem className="h-6 w-6 text-thistle-600" />
                                                <div>
                                                    <div className="font-semibold text-thistle-800">{place.category}</div>
                                                    <div className="text-sm text-thistle-600">Category</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 p-4 bg-fairy-50 rounded-xl border border-fairy-100">
                                                <MapPin className="h-6 w-6 text-fairy-600" />
                                                <div>
                                                    <div className="font-semibold text-fairy-800">{place.city}</div>
                                                    <div className="text-sm text-fairy-600">Location</div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </OptimizedMotionDiv>

                            {/* History Section */}
                            <OptimizedMotionDiv preset="slideUp" delay={200}>
                                <Card className="card-luxury">
                                    <CardHeader>
                                        <CardTitle className="text-heading text-3xl md:text-4xl flex items-center gap-3">
                                            <BookOpen className="h-7 w-7 md:h-8 md:w-8 text-fairy-600"/>
                                            A Glimpse into History
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-lg text-fairy-700 space-y-4 md:space-y-6">
                                        <p className="text-body leading-relaxed">{place.history}</p>
                                    </CardContent>
                                </Card>
                            </OptimizedMotionDiv>
                        </div>

                        <aside className="lg:col-span-1">
                            <OptimizedMotionDiv preset="scaleIn" className="sticky top-24">
                                <Card className="card-luxury">
                                    <CardHeader>
                                        <CardTitle className="text-heading text-2xl md:text-3xl flex items-center gap-3">
                                            <Star className="h-6 w-6 md:h-7 md:w-7 text-carnation-600"/>
                                            Highlights
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-3">
                                            {place.highlights.map((highlight, index) => (
                                                <li key={index}
                                                    className="flex items-start gap-3 text-carnation-700 p-3 bg-carnation-50/50 rounded-xl">
                                                    <Sparkles className="h-4 w-4 md:h-5 md:w-5 text-carnation-500 mt-0.5 flex-shrink-0"/>
                                                    <span className="text-body">{highlight}</span>
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
            <section className="section-padding section-fairy">
                <div className="container-luxury">
                    <div className="text-center mb-12 md:mb-16">
                        <OptimizedMotionDiv preset="slideUp">
                            <h2 className="text-heading text-3xl md:text-4xl lg:text-5xl font-bold text-fairy-800 mb-4">Discover More</h2>
                            <p className="text-body text-fairy-600 max-w-2xl mx-auto">Immerse yourself in the beauty and spirituality of this sacred destination</p>
                        </OptimizedMotionDiv>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">

                        {/* Gallery Section */}
                        <OptimizedMotionDiv preset="slideUp">
                            <div className="space-y-6">
                                <h3 className="text-heading text-2xl md:text-3xl flex items-center gap-3 text-fairy-800">
                                    <GalleryVertical className="h-6 w-6 md:h-7 md:w-7 text-fairy-600"/>
                                    Gallery
                                </h3>
                                {place.gallery.length > 0 ? (
                                    <Carousel className="w-full">
                                        <CarouselContent className="-ml-2 md:-ml-4">
                                            {place.gallery.map((img, index) => (
                                                <CarouselItem key={index} className="pl-2 md:pl-4">
                                                    <Card className="card-luxury overflow-hidden hover-luxury">
                                                        <CardContent className="relative flex aspect-video items-center justify-center p-0">
                                                            <Image
                                                                src={img}
                                                                alt={`${place.name} gallery image ${index + 1}`}
                                                                fill
                                                                className="object-cover transition-transform duration-500 hover:scale-110"
                                                                loading="lazy"
                                                            />
                                                        </CardContent>
                                                    </Card>
                                                </CarouselItem>
                                            ))}
                                        </CarouselContent>
                                        <CarouselPrevious className="glass-luxury hover:bg-fairy-50"/>
                                        <CarouselNext className="glass-luxury hover:bg-fairy-50"/>
                                    </Carousel>
                                ) : (
                                    <Card className="card-luxury overflow-hidden hover-luxury">
                                        <CardContent className="relative flex aspect-video items-center justify-center p-0">
                                            <Image
                                                src={place.image}
                                                alt={place.name}
                                                fill
                                                className="object-cover"
                                                loading="lazy"
                                            />
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        </OptimizedMotionDiv>

                        {/* Location Section */}
                        <OptimizedMotionDiv preset="slideUp" delay={200}>
                            <div className="space-y-6">
                                <h3 className="text-heading text-2xl md:text-3xl flex items-center gap-3 text-fairy-800">
                                    <MapPin className="h-6 w-6 md:h-7 md:w-7 text-fairy-600"/>
                                    Location
                                </h3>
                                <Card className="card-luxury overflow-hidden">
                                    <CardContent className="relative aspect-video p-0">
                                        <div className="absolute inset-0 bg-gradient-to-br from-thistle-100 via-fairy-50 to-carnation-100 flex items-center justify-center">
                                            <div className="text-center p-8">
                                                <div className="w-16 h-16 bg-gradient-to-br from-thistle-500 to-fairy-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                                    <MapPin className="h-8 w-8 text-white"/>
                                                </div>
                                                <h4 className="text-heading font-bold text-xl md:text-2xl text-thistle-800 mb-2">{place.name}</h4>
                                                <p className="text-body text-thistle-600 text-lg mb-4">{place.city}</p>
                                                <div className="text-sm text-thistle-500 space-y-1">
                                                    <p>Latitude: {place.location.lat}</p>
                                                    <p>Longitude: {place.location.lng}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </OptimizedMotionDiv>
                    </div>
                </div>
            </section>

            {/* Related Places Section */}
            {relatedPlaces.length > 0 && (
                <section className="section-padding section-carnation">
                    <div className="container-luxury">
                        <div className="text-center mb-12 md:mb-16">
                            <OptimizedMotionDiv preset="slideUp">
                                <h2 className="text-heading text-3xl md:text-4xl lg:text-5xl font-bold text-carnation-800 mb-4">Related Destinations</h2>
                                <p className="text-body text-carnation-600 max-w-2xl mx-auto">Discover more sacred places in your spiritual journey</p>
                            </OptimizedMotionDiv>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                            {relatedPlaces.map((p, index) => (
                                <OptimizedMotionDiv key={p?.id || index} preset="slideUp" delay={index * 200}>
                                    <div className="card-luxury hover-luxury overflow-hidden h-full">
                                        <OptimizedPlaceCard place={p} index={index} showAnimation={false}/>
                                    </div>
                                </OptimizedMotionDiv>
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
                        "image": place.image,
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
                            "name": "Sacred Journeys"
                        }
                    })
                }}
            />
        </div>
    );
}