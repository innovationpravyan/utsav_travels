'use client';

import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { Skeleton } from './ui/skeleton';

const Globe = dynamic(
  () => import('@/components/globe'),
  { 
    ssr: false,
    loading: () => <Skeleton className="absolute inset-0 h-full w-full bg-black" />
  }
);


export function HeroBanner() {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      <Globe />
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-4 text-center text-white bg-black/40">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl md:text-7xl font-headline font-bold text-shadow"
        >
          Discover the Spiritual Heritage
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-4 max-w-2xl text-lg md:text-xl text-primary text-shadow"
        >
          of Varanasi, Ayodhya, and Prayagraj
        </motion.p>
      </div>
    </section>
  );
}
