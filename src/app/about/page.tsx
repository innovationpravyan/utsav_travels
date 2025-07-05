import { Building, Target, Heart, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { getPlaces, getPackages } from '@/lib/data';
import { PageBanner, type BannerItem } from '@/components/page-banner';
import Link from 'next/link';

export default async function AboutPage() {
  const topPlaces = (await getPlaces()).slice(0, 5);
  const topPackages = (await getPackages()).slice(0, 5);
  
  const bannerPlaces: BannerItem[] = topPlaces.slice(0,3).map(p => ({
    id: p.id,
    image: p.images[0] || p.thumbnail,
    name: p.name,
    tagline: p.city
  }));
  const bannerPackages: BannerItem[] = topPackages.slice(0,2).map(p => ({
    id: p.id,
    image: p.images[0] || p.thumbnail,
    name: p.name,
    tagline: p.duration
  }));

  const bannerItems = [...bannerPlaces, ...bannerPackages];
  
  const galleryItems = [...topPlaces, ...topPackages].sort(() => 0.5 - Math.random()).slice(0, 10);

  return (
    <div className="animate-fade-in">
      <PageBanner title="About Utsav Travels" items={bannerItems} />

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-headline text-4xl mb-6">Who We Are</h2>
              <p className="text-lg text-muted-foreground mb-4">
                Utsav Travels is a premier travel showcase dedicated to unveiling the spiritual, cultural, and historical richness of India's most sacred cities. We were born from a passion for heritage and a desire to connect travelers with the authentic soul of Varanasi, Ayodhya, and Prayagraj.
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
      
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
           <h2 className="text-4xl md:text-5xl font-headline text-center mb-12">Our Gallery</h2>
           <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
              {galleryItems.map(item => (
                 <Link href={('city' in item) ? `/places/${item.id}` : `/packages/${item.id}`} key={item.id}>
                    <div className="overflow-hidden rounded-lg relative group">
                        <Image
                            src={item.thumbnail}
                            alt={item.name}
                            width={500}
                            height={500}
                            className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110"
                            data-ai-hint="travel collage"
                        />
                         <div className="absolute inset-0 bg-black/40 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <p className="text-white font-bold">{item.name}</p>
                        </div>
                    </div>
                 </Link>
              ))}
           </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-headline text-center mb-12">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-card/60 backdrop-blur-md">
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
            <Card className="bg-card/60 backdrop-blur-md">
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
            <Card className="bg-card/60 backdrop-blur-md">
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
