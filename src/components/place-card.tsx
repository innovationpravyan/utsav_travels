'use client';

import Link from "next/link";
import Image from "next/image";
import { type Place } from "@/lib/data";
import { ArrowRight } from "lucide-react";
import { MotionDiv } from "./motion-div";

interface PlaceCardProps {
  place: Place;
}

export function PlaceCard({ place }: PlaceCardProps) {
  return (
    <MotionDiv className="h-full">
      <Link href={`/places/${place.id}`} className="block h-full group">
        <div className="relative h-full w-full overflow-hidden rounded-lg shadow-lg aspect-[4/5] bg-card">
          <Image
            src={place.thumbnail}
            alt={`Image of ${place.name}`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            data-ai-hint="travel destination"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white flex flex-col justify-end h-full">
            <div>
              <h3 className="font-headline text-2xl font-bold text-shadow">{place.name}</h3>
              <p className="text-primary font-semibold text-sm mb-3 text-shadow">{place.tagline}</p>
              <div className="text-accent font-semibold text-sm flex items-center gap-1 opacity-0 transition-all group-hover:opacity-100 group-hover:gap-2">
                Explore <ArrowRight className="h-4 w-4"/>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </MotionDiv>
  );
}
