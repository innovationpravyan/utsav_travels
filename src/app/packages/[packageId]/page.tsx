import { getPackageById } from "@/lib/data";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle, DollarSign } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

type PackageDetailPageProps = {
  params: {
    packageId: string;
  };
};

export default function PackageDetailPage({ params }: PackageDetailPageProps) {
  const pkg = getPackageById(params.packageId);

  if (!pkg) {
    notFound();
  }

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative h-[50vh] w-full">
        <Image
          src={pkg.images[0]}
          alt={pkg.name}
          fill
          className="object-cover"
          priority
          data-ai-hint="travel landscape"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center text-white">
          <h1 className="font-headline text-5xl md:text-7xl font-bold">{pkg.name}</h1>
          <p className="text-xl md:text-2xl mt-2 text-primary">{pkg.tagline}</p>
        </div>
      </section>

      {/* Details Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            {/* Itinerary */}
            <div className="mb-12">
              <h2 className="font-headline text-4xl mb-6">Your Adventure Itinerary</h2>
              <div className="space-y-8 border-l-2 border-primary pl-8 relative">
                {pkg.itinerary.map((item, index) => (
                  <div key={item.day} className="relative">
                    <div className="absolute -left-[42px] top-1 h-6 w-6 rounded-full bg-primary border-4 border-secondary flex items-center justify-center text-primary-foreground font-bold text-sm">
                      {item.day}
                    </div>
                    <h3 className="font-headline text-2xl font-semibold mb-1">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Gallery */}
            <div>
               <h2 className="font-headline text-4xl mb-6">Gallery</h2>
               <Carousel className="w-full">
                 <CarouselContent>
                   {pkg.images.map((img, index) => (
                     <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                        <div className="p-1">
                          <Card>
                            <CardContent className="relative flex aspect-video items-center justify-center p-0 overflow-hidden rounded-lg">
                               <Image src={img} alt={`${pkg.name} gallery image ${index + 1}`} fill className="object-cover transition-transform hover:scale-105" data-ai-hint="travel photography"/>
                            </CardContent>
                          </Card>
                        </div>
                     </CarouselItem>
                   ))}
                 </CarouselContent>
                 <CarouselPrevious />
                 <CarouselNext />
               </Carousel>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <Card className="sticky top-24 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4 pb-4 border-b">
                   <Calendar className="h-8 w-8 text-accent"/>
                   <div>
                       <p className="text-sm text-muted-foreground">Duration</p>
                       <p className="font-bold text-lg">{pkg.duration}</p>
                   </div>
                </div>
                <div className="flex items-center gap-4 mb-6">
                   <DollarSign className="h-8 w-8 text-accent"/>
                   <div>
                       <p className="text-sm text-muted-foreground">Starting From</p>
                       <p className="font-bold text-lg">{pkg.price} / person</p>
                   </div>
                </div>

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
          </aside>
        </div>
      </section>
    </div>
  );
}
