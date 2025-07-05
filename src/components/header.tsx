"use client";

import Link from "next/link";
import { Plane, Menu, Phone } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { useState } from "react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/destinations", label: "Destinations" },
  { href: "/packages", label: "Packages" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const isMobile = useIsMobile();
  const [isSheetOpen, setSheetOpen] = useState(false);

  const NavLinks = ({ className }: { className?: string }) => (
    <nav className={cn("flex items-center gap-4 lg:gap-6", className)}>
      {NAV_LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="text-sm font-medium transition-colors text-foreground/80 hover:text-foreground"
          onClick={() => setSheetOpen(false)}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Plane className="h-6 w-6 text-primary" />
          <span className="font-headline text-xl font-bold">Utsav Travels</span>
        </Link>

        {isMobile ? (
          <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-8 pt-8">
                <Link href="/" className="flex items-center gap-2" onClick={() => setSheetOpen(false)}>
                   <Plane className="h-6 w-6 text-primary" />
                   <span className="font-headline text-xl font-bold">Utsav Travels</span>
                </Link>
                <NavLinks className="flex-col items-start gap-4" />
                <Button asChild>
                  <Link href="/contact" onClick={() => setSheetOpen(false)}>
                    <Phone className="mr-2 h-4 w-4" />
                    Request a Call
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        ) : (
          <div className="flex items-center gap-4">
            <NavLinks />
             <Button asChild>
                <Link href="/contact">
                  Request a Call
                </Link>
              </Button>
          </div>
        )}
      </div>
    </header>
  );
}
