import Link from "next/link";
import Image from "next/image";
import { Place } from "@/lib/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { InteractiveCard } from "./interactive-card";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";

interface PlaceCardProps {
  place: Place;
}

export function PlaceCard({ place }: PlaceCardProps) {
  return (
    <InteractiveCard>
      <Link href={`/places/${place.id}`} className="block h-full">
        <Card className="h-full flex flex-col overflow-hidden transition-shadow duration-300 hover:shadow-2xl hover:shadow-primary/20 bg-card">
          <CardHeader className="p-0">
            <div className="relative h-48 w-full">
              <Image
                src={place.thumbnail}
                alt={`Image of ${place.name}`}
                fill
                className="object-cover"
                data-ai-hint="travel destination"
              />
            </div>
            <div className="p-6">
              <CardTitle className="font-headline text-2xl mb-1">{place.name}</CardTitle>
              <CardDescription className="text-primary font-semibold">{place.tagline}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex-grow p-6 pt-0">
            <p className="text-muted-foreground line-clamp-3">
              {place.description}
            </p>
          </CardContent>
          <div className="p-6 pt-0 mt-auto">
             <Button variant="link" className="p-0 h-auto text-accent hover:text-primary">
              Explore Destination <ArrowRight className="ml-2 h-4 w-4"/>
            </Button>
          </div>
        </Card>
      </Link>
    </InteractiveCard>
  );
}
