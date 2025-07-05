import Link from "next/link";
import Image from "next/image";
import { type Package } from "@/lib/data";
import { InteractiveCard } from "./interactive-card";
import { Calendar, Tag, ArrowRight } from "lucide-react";

interface PackageCardProps {
  pkg: Package;
}

export function PackageCard({ pkg }: PackageCardProps) {
  return (
    <InteractiveCard className="h-full">
      <Link href={`/packages/${pkg.id}`} className="block h-full group">
        <div className="relative h-full w-full overflow-hidden rounded-lg shadow-lg">
          <Image
            src={pkg.thumbnail}
            alt={`Image of ${pkg.name}`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            data-ai-hint="travel package"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-4">
             <div className="rounded-lg bg-white/10 p-4 backdrop-blur-md border border-white/20 text-white">
                <h3 className="font-headline text-xl font-bold">{pkg.name}</h3>
                <p className="text-accent font-semibold text-sm mb-2">{pkg.tagline}</p>
                
                <div className="flex items-center gap-4 text-xs text-white/80 mb-3">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3 w-3" />
                    <span>{pkg.duration}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Tag className="h-3 w-3" />
                    <span>From {pkg.price}</span>
                  </div>
                </div>
                
                <div className="text-primary font-semibold text-sm flex items-center gap-1 transition-transform duration-300 group-hover:translate-x-1">
                  View Details <ArrowRight className="h-4 w-4"/>
                </div>
             </div>
          </div>
        </div>
      </Link>
    </InteractiveCard>
  );
}
