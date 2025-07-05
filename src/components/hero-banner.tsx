'use client';

import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { Skeleton } from './ui/skeleton';

const Globe = dynamic(() => import('@/components/globe'), { 
  ssr: false,
  loading: () => <Skeleton className="h-screen w-full bg-black" /> 
});


export function HeroBanner() {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      <Globe />
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-4 text-center text-white bg-black/30">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold"
        >
          Explore the World
        </motion.h1>
        <p className="mt-4 max-w-xl text-lg md:text-xl">
          Discover the Spiritual Heritage of Varanasi, Ayodhya, and Prayagraj
        </p>
      </div>
    </section>
  );
}
