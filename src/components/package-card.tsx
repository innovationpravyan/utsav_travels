import Link from "next/link";
import Image from "next/image";
import { Package } from "@/lib/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { InteractiveCard } from "./interactive-card";
import { Calendar, Tag } from "lucide-react";
import { Badge } from "./ui/badge";

interface PackageCardProps {
  pkg: Package;
}

export function PackageCard({ pkg }: PackageCardProps) {
  return (
    <InteractiveCard>
      <Link href={`/packages/${pkg.id}`} className="block h-full">
        <Card className="h-full flex flex-col overflow-hidden transition-shadow duration-300 hover:shadow-2xl hover:shadow-accent/20 bg-card/60 backdrop-blur-md">
          <CardHeader className="p-0">
            <div className="relative h-48 w-full">
              <Image
                src={pkg.thumbnail}
                alt={`Image of ${pkg.name}`}
                fill
                className="object-cover"
                data-ai-hint="travel package"
              />
            </div>
             <div className="p-6">
              <CardTitle className="font-headline text-2xl mb-1">{pkg.name}</CardTitle>
              <CardDescription className="text-accent font-semibold">{pkg.tagline}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex-grow p-6 pt-0">
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <span>{pkg.duration}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Tag className="h-4 w-4" />
                <span>From {pkg.price}</span>
              </div>
            </div>
            <p className="text-muted-foreground line-clamp-2">
              {pkg.description}
            </p>
          </CardContent>
          <div className="p-6 pt-0 mt-auto">
            <Badge variant="default">View Details</Badge>
          </div>
        </Card>
      </Link>
    </InteractiveCard>
  );
}
