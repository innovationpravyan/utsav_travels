'use client';

import { Button } from './ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Globe from '@/components/globe';

export function HeroBanner() {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      <Globe />
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-4 text-center text-white bg-black/30">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-5xl font-bold drop-shadow-lg md:text-7xl lg:text-8xl"
        >
          Discover Sacred
          <br />
          <span className="font-headline text-primary">Destinations</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          className="mx-auto mt-4 max-w-3xl text-lg text-white/90 drop-shadow-lg md:text-xl"
        >
          Embark on a spiritual journey through Varanasi, Prayagraj, and Ayodhya.
          <br className="hidden md:block" />
          Experience the rich heritage and timeless beauty of India.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
          className="mt-8 flex flex-col gap-4 sm:flex-row"
        >
          <Button asChild size="lg" className="px-10 py-7 text-lg">
            <Link href="/destinations">Explore Destinations</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white/50 bg-white/10 px-10 py-7 text-lg text-white hover:bg-white/20"
          >
            <Link href="/packages">View Packages</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
