import { Building, Target, Heart, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="animate-fade-in">
      <section className="relative h-[40vh] w-full">
        <Image
          src="https://placehold.co/1200x400"
          alt="About Us Banner"
          fill
          className="object-cover"
          priority
          data-ai-hint="company team"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center text-white">
          <h1 className="font-headline text-5xl md:text-7xl font-bold">About Wanderlust 3D</h1>
          <p className="text-xl md:text-2xl mt-2 text-primary">Your Gateway to India's Spiritual Heartland</p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-headline text-4xl mb-6">Who We Are</h2>
              <p className="text-lg text-muted-foreground mb-4">
                Wanderlust 3D is a premier travel showcase dedicated to unveiling the spiritual, cultural, and historical richness of India's most sacred cities. We were born from a passion for heritage and a desire to connect travelers with the authentic soul of Varanasi, Ayodhya, and Prayagraj.
              </p>
              <p className="text-lg text-muted-foreground">
                Our initiative focuses on promoting sustainable and immersive tourism, ensuring that every journey is not just a trip, but a profound experience that respects local traditions and supports communities.
              </p>
            </div>
            <div>
              <Image 
                src="https://placehold.co/600x400" 
                alt="A collage of travel images" 
                width={600} 
                height={400} 
                className="rounded-lg shadow-xl"
                data-ai-hint="heritage india"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-headline text-center mb-12">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 font-headline text-2xl">
                  <Target className="h-8 w-8 text-accent" />
                  Mission & Vision
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Our mission is to be the leading platform for heritage tourism in the region, showcasing its spiritual depth to the world. We envision a future where every traveler leaves with a deeper understanding and appreciation of this ancient land.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 font-headline text-2xl">
                  <Heart className="h-8 w-8 text-accent" />
                  Why Choose Us
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                With our deep local expertise, we offer authentic, off-the-beaten-path experiences. Our seamless WhatsApp contact system and commitment to personalized service make planning your spiritual journey effortless and enjoyable.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 font-headline text-2xl">
                  <MapPin className="h-8 w-8 text-accent" />
                  Regions We Serve
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                We specialize exclusively in the spiritual triangle of Uttar Pradesh, focusing our expertise on providing unparalleled travel experiences in:
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Varanasi</li>
                  <li>Ayodhya</li>
                  <li>Prayagraj</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
