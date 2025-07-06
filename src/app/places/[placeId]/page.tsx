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
import { PlaceCard } from "@/components/place-card";
import { MotionDiv } from "@/components/motion-div";
import { VideoHeroBanner } from "@/components/video-hero-banner";
import { VIDEO_SOURCES, PLACEHOLDER_VIDEOS } from "@/types/hero";
import { Suspense } from 'react';

type PlaceDetailPageProps = {
  params: {
    placeId: string;
  };
};

// Generate static params for all places
export async function generateStaticParams() {
  const places = await getPlaces();
  
  return places.map((place) => ({
    placeId: place.id,
  }));
}

export default async function PlaceDetailPage({ params }: PlaceDetailPageProps) {
  const place = await getPlaceById(params.placeId);

  if (!place) {
    notFound();
  }
  
  const allPlaces = await getPlaces();
  const relatedPlaces = allPlaces.filter(
    p => p.id !== place.id && (p.city === place.city || p.category === place.category)
  ).slice(0, 3);

  // Get place-specific video or fallback
  const getPlaceVideo = (placeName: string) => {
    const normalizedName = placeName.toLowerCase();
    if (normalizedName.includes('varanasi')) return VIDEO_SOURCES.places.varanasi.webm;
    if (normalizedName.includes('ayodhya')) return VIDEO_SOURCES.places.ayodhya.webm;
    if (normalizedName.includes('rishikesh')) return VIDEO_SOURCES.places.rishikesh.webm;
    if (normalizedName.includes('kedarnath')) return VIDEO_SOURCES.places.kedarnath.webm;
    return PLACEHOLDER_VIDEOS.temple; // Default fallback
  };

  return (
    <div className="animate-fade-in">
      {/* Video Hero Section */}
      <Suspense fallback={
        <div className="h-[60vh] w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
          <div className="text-white text-xl animate-pulse">Loading {place.name}...</div>
        </div>
      }>
        <VideoHeroBanner
          videoSrc={getPlaceVideo(place.name)}
          fallbackImage={place.images[0] || 'https://placehold.co/1200x800.png'}
          title={place.name}
          subtitle={`${place.city} • ${place.category}`}
          height="60vh"
          overlayDarkness={0.5}
          showWhatsApp={false}
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
        </VideoHeroBanner>
      </Suspense>

      {/* Content Section */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              <MotionDiv>
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
              </MotionDiv>

              <MotionDiv>
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
              </MotionDiv>
            </div>

            <aside className="lg:col-span-1">
              <MotionDiv className="sticky top-24">
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
              </MotionDiv>
            </aside>
          </div>
        </div>
      </section>
      
      {/* Gallery and Map section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
           <h2 className="font-headline text-4xl text-center mb-12">Discover More</h2>
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <MotionDiv>
                    <h3 className="font-headline text-3xl mb-4 flex items-center gap-3"><GalleryVertical className="h-7 w-7 text-primary"/>Gallery</h3>
                    <Carousel className="w-full -ml-1">
                        <CarouselContent>
                        {place.images.map((img, index) => (
                            <CarouselItem key={index}>
                                <Card>
                                <CardContent className="relative flex aspect-video items-center justify-center p-0 overflow-hidden rounded-lg">
                                    <Image src={img} alt={`${place.name} gallery image ${index + 1}`} fill className="object-cover transition-transform hover:scale-105" data-ai-hint="travel photography"/>
                                </CardContent>
                                </Card>
                            </CarouselItem>
                        ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>
                </MotionDiv>
                <MotionDiv>
                    <h3 className="font-headline text-3xl mb-4 flex items-center gap-3"><MapPin className="h-7 w-7 text-primary"/>Location</h3>
                    <Card>
                        <CardContent className="relative aspect-video p-0 rounded-lg overflow-hidden">
                           <div className="absolute inset-0 bg-gray-300 flex items-center justify-center">
                               <Image src={`https://placehold.co/800x600.png`} alt={`Map of ${place.name}`} fill className="object-cover" data-ai-hint="city map"/>
                               <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center">
                                    <MapPin className="h-12 w-12 text-white/80 mb-2"/>
                                    <p className="text-white font-bold text-lg text-shadow">{place.name}</p>
                                    <p className="text-white text-sm">Lat: {place.location.lat}, Lng: {place.location.lng}</p>
                               </div>
                           </div>
                        </CardContent>
                    </Card>
                </MotionDiv>
           </div>
        </div>
      </section>
      
      {/* Related Places Section */}
      {relatedPlaces.length > 0 && (
        <section className="py-16 md:py-24 bg-secondary">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-headline text-center mb-12">Related Destinations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedPlaces.map((p) => (
                <PlaceCard key={p.id} place={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}