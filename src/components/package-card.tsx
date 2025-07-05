'use client';

import Link from "next/link";
import Image from "next/image";
import { type Package } from "@/lib/data";
import { Calendar, Tag, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface PackageCardProps {
  pkg: Package;
}

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

export function PackageCard({ pkg }: PackageCardProps) {
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className="h-full"
    >
      <Link href={`/packages/${pkg.id}`} className="block h-full group">
        <div className="relative h-full w-full overflow-hidden rounded-lg shadow-lg aspect-[4/5] bg-card">
          <Image
            src={pkg.thumbnail}
            alt={`Image of ${pkg.name}`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            data-ai-hint="travel package"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-6 text-white flex flex-col justify-end h-full">
            <div>
              <h3 className="font-headline text-2xl font-bold text-shadow">{pkg.name}</h3>
              <p className="text-accent font-semibold text-sm mb-3 text-shadow">{pkg.tagline}</p>
              
              <div className="flex items-center gap-4 text-xs text-white/80 mb-4">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3 w-3" />
                  <span>{pkg.duration}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Tag className="h-3 w-3" />
                  <span>From {pkg.price}</span>
                </div>
              </div>
              
              <div className="text-primary font-semibold text-sm flex items-center gap-1 transform-gpu transition-transform duration-300 group-hover:translate-x-1 opacity-0 group-hover:opacity-100">
                View Details <ArrowRight className="h-4 w-4"/>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
