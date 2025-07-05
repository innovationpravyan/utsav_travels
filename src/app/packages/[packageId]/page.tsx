import { getPackageById, getPackages } from "@/lib/data";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle, DollarSign, Pin, Info, Star, Map, GalleryVertical } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PackageCard } from "@/components/package-card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { MotionDiv } from "@/components/motion-div";


type PackageDetailPageProps = {
  params: {
    packageId: string;
  };
};

export default async function PackageDetailPage({ params }: PackageDetailPageProps) {
  const pkg = await getPackageById(params.packageId);

  if (!pkg) {
    notFound();
  }
  
  const allPackages = await getPackages();
  const relatedPackages = allPackages.filter(
    p => p.id !== pkg.id && (p.cities.some(c => pkg.cities.includes(c)) || p.tags.some(t => pkg.tags.includes(t)))
  ).slice(0, 3);

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative h-[60vh] w-full">
        <Image
          src={pkg.images[0] || 'https://placehold.co/1200x800.png'}
          alt={pkg.name}
          fill
          className="object-cover"
          priority
          data-ai-hint="travel landscape"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-black/40 to-black/60" />
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-end pb-12 text-white">
          <p className="text-lg text-accent text-shadow">{pkg.cities.join(', ')}</p>
          <h1 className="font-headline text-5xl md:text-7xl font-bold text-shadow">{pkg.name}</h1>
          <p className="text-xl md:text-2xl mt-2 text-primary text-shadow">{pkg.tagline}</p>
          <div className="flex flex-wrap gap-2 mt-4">
            {pkg.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="backdrop-blur-sm bg-black/30 text-white border-white/20">
                    {tag}
                </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Details Section */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            
            <MotionDiv>
              <h2 className="font-headline text-4xl mb-6 flex items-center gap-3"><Info className="h-8 w-8 text-primary"/>Package Overview</h2>
              <p className="text-lg text-muted-foreground">{pkg.description}</p>
            </MotionDiv>
          
            <MotionDiv>
               <h2 className="font-headline text-4xl mb-6 flex items-center gap-3"><Map className="h-8 w-8 text-primary" />Your Adventure Itinerary</h2>
                <Accordion type="single" collapsible className="w-full bg-card p-4 rounded-lg">
                  {pkg.itinerary.map((item, index) => (
                    <AccordionItem value={`day-${item.day}`} key={item.day} className={index === pkg.itinerary.length - 1 ? "border-b-0" : ""}>
                      <AccordionTrigger className="text-xl font-headline hover:no-underline text-accent">Day {item.day}: {item.title}</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground text-base pl-2 pt-2">
                        {item.description}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
            </MotionDiv>

            <MotionDiv>
               <h2 className="font-headline text-4xl mb-6 flex items-center gap-3"><GalleryVertical className="h-8 w-8 text-primary"/>Gallery</h2>
               <Carousel className="w-full -ml-1">
                 <CarouselContent>
                   {pkg.images.map((img, index) => (
                     <CarouselItem key={index} className="md:basis-1/2">
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
            </MotionDiv>
          </div>

          <aside className="lg:col-span-1">
            <MotionDiv className="sticky top-24">
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
                         <p className="font-bold text-lg">{pkg.cities.join(', ')}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-4 mb-6 pb-4 border-b">
                     <DollarSign className="h-8 w-8 text-primary"/>
                     <div>
                         <p className="text-sm text-muted-foreground">Price</p>
                         <p className="font-bold text-lg">{pkg.price}</p>
                     </div>
                  </div>
                  
                  <h3 className="font-headline text-2xl mb-4 flex items-center gap-3"><Star className="h-6 w-6 text-accent" />Highlights</h3>
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
            </MotionDiv>
          </aside>
        </div>
      </section>

      {relatedPackages.length > 0 && (
         <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-headline text-center mb-12">Related Packages</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedPackages.map((p) => (
                <PackageCard key={p.id} pkg={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
