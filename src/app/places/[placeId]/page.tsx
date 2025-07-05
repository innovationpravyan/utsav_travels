import { getPlaceById } from "@/lib/data";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Landmark, BookOpen, Star, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

type PlaceDetailPageProps = {
  params: {
    placeId: string;
  };
};

export default async function PlaceDetailPage({ params }: PlaceDetailPageProps) {
  const place = await getPlaceById(params.placeId);

  if (!place) {
    notFound();
  }

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative h-[60vh] w-full">
        <Image
          src={place.images[0] || 'https://placehold.co/1200x800'}
          alt={place.name}
          fill
          className="object-cover"
          priority
          data-ai-hint="travel destination"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/30" />
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-end pb-12">
          <h1 className="font-headline text-5xl md:text-7xl font-bold text-white drop-shadow-2xl">{place.name}</h1>
          <p className="text-xl md:text-2xl mt-2 text-primary drop-shadow-lg">{place.tagline}</p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline text-4xl flex items-center gap-3">
                    <Landmark className="h-8 w-8 text-accent"/>
                    About {place.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-lg text-muted-foreground space-y-4">
                  <p>{place.description}</p>
                </CardContent>
              </Card>

              <Card className="mt-8">
                <CardHeader>
                  <CardTitle className="font-headline text-4xl flex items-center gap-3">
                    <BookOpen className="h-8 w-8 text-accent"/>
                    A Glimpse into History
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-lg text-muted-foreground space-y-4">
                  <p>{place.history}</p>
                </CardContent>
              </Card>
            </div>

            <aside className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="font-headline text-3xl flex items-center gap-3">
                    <Star className="h-7 w-7 text-primary"/>
                     Highlights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {place.highlights.map((highlight, index) => (
                      <li key={index}>
                        <Badge variant="outline" className="text-base py-1 px-3 border-accent text-accent">{highlight}</Badge>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>
      </section>
      
      {/* Gallery and Map section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
           <h2 className="font-headline text-4xl text-center mb-12">Discover More</h2>
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <h3 className="font-headline text-3xl mb-4">Gallery</h3>
                    <Carousel className="w-full">
                        <CarouselContent>
                        {place.images.map((img, index) => (
                            <CarouselItem key={index}>
                                <Card>
                                <CardContent className="relative flex aspect-video items-center justify-center p-0 overflow-hidden rounded-lg">
                                    <Image src={img} alt={`${place.name} gallery image ${index + 1}`} fill className="object-cover" data-ai-hint="travel photography"/>
                                </CardContent>
                                </Card>
                            </CarouselItem>
                        ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>
                </div>
                <div>
                    <h3 className="font-headline text-3xl mb-4">Location</h3>
                    <Card>
                        <CardContent className="relative aspect-video p-0 rounded-lg overflow-hidden">
                           <div className="absolute inset-0 bg-gray-300 flex items-center justify-center">
                               <Image src={`https://placehold.co/800x600/e2e8f0/334155?text=Map+of+${place.name.replace(' ','+')}`} alt={`Map of ${place.name}`} fill className="object-cover"/>
                               <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center">
                                    <MapPin className="h-12 w-12 text-white/80 mb-2"/>
                                    <p className="text-white font-bold text-lg">{place.name}</p>
                                    <p className="text-white text-sm">Lat: {place.location.lat}, Lng: {place.location.lng}</p>
                               </div>
                           </div>
                        </CardContent>
                    </Card>
                </div>
           </div>
        </div>
      </section>
    </div>
  );
}
