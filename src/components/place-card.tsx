import Link from "next/link";
import Image from "next/image";
import { type Place } from "@/lib/data";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface PlaceCardProps {
  place: Place;
}

export function PlaceCard({ place }: PlaceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="h-full"
    >
      <Link href={`/places/${place.id}`} className="block h-full group">
        <div className="relative h-full w-full overflow-hidden rounded-lg shadow-lg aspect-[4/5]">
          <Image
            src={place.thumbnail}
            alt={`Image of ${place.name}`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            data-ai-hint="travel destination"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <h3 className="font-headline text-xl font-bold drop-shadow-md">{place.name}</h3>
            <p className="text-primary font-semibold text-sm mb-2 drop-shadow-md">{place.tagline}</p>
            <p className="text-xs text-white/80 line-clamp-2 mb-3 drop-shadow-sm">
              {place.description}
            </p>
            <div className="text-accent font-semibold text-sm flex items-center gap-1 transition-transform duration-300 group-hover:translate-x-1">
              Explore <ArrowRight className="h-4 w-4"/>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
