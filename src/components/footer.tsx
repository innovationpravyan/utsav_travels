import { Plane, Twitter, Instagram, Facebook } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-secondary border-t border-border/50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Plane className="h-6 w-6 text-primary" />
            <span className="font-headline text-xl font-bold">Utsav Travels</span>
          </div>
          <p className="text-sm text-muted-foreground mb-4 md:mb-0 order-last md:order-none mt-4 md:mt-0">
            © {new Date().getFullYear()} Utsav Travels. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Twitter />
              <span className="sr-only">Twitter</span>
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Instagram />
              <span className="sr-only">Instagram</span>
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Facebook />
              <span className="sr-only">Facebook</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
