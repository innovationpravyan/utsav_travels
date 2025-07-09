import Link from "next/link";
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

export function Footer() {
  const quickLinks = [
    { href: "/destinations", label: "Destinations" },
    { href: "/packages", label: "Packages" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
  ];

  const socialLinks = [
    { href: "https://facebook.com/utsavtravels", icon: Facebook, label: "Facebook" },
    { href: "https://instagram.com/utsavtravels", icon: Instagram, label: "Instagram" },
    { href: "https://twitter.com/utsavtravels", icon: Twitter, label: "Twitter" },
  ];

  return (
      <footer className="bg-gradient-to-br from-black via-slate-900 to-black relative">
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full bg-[radial-gradient(circle_at_1px_1px,_white_1px,_transparent_1px)] bg-[length:24px_24px]" />
        </div>

        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

            {/* Company Info */}
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-headline font-bold text-gradient mb-4">
                  Utsav Travels
                </h3>
                <p className="text-white/70 leading-relaxed">
                  Your gateway to India's spiritual heritage. Experience authentic journeys through sacred destinations with expert guidance.
                </p>
              </div>

              {/* Social Links */}
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                    <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 glass-subtle rounded-lg hover:glass-card transition-all duration-200 group"
                        aria-label={social.label}
                    >
                      <social.icon className="w-5 h-5 text-white/70 group-hover:text-white group-hover:scale-110 transition-all duration-200" />
                    </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h4 className="text-xl font-semibold text-white">Quick Links</h4>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                          href={link.href}
                          className="text-white/70 hover:text-white transition-colors duration-200 hover:translate-x-1 inline-block"
                      >
                        {link.label}
                      </Link>
                    </li>
                ))}
              </ul>
            </div>

            {/* Destinations */}
            <div className="space-y-6">
              <h4 className="text-xl font-semibold text-white">Sacred Destinations</h4>
              <ul className="space-y-3">
                <li><span className="text-white/70">Varanasi</span></li>
                <li><span className="text-white/70">Ayodhya</span></li>
                <li><span className="text-white/70">Rishikesh</span></li>
                <li><span className="text-white/70">Kedarnath</span></li>
                <li><span className="text-white/70">Prayagraj</span></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <h4 className="text-xl font-semibold text-white">Contact Us</h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-white/70 text-sm">Call Us</p>
                    <a href="tel:+919876543210" className="text-white hover:text-primary transition-colors">
                      +91 98765 43210
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-white/70 text-sm">Email</p>
                    <a href="mailto:info@utsavtravels.com" className="text-white hover:text-primary transition-colors">
                      info@utsavtravels.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-white/70 text-sm">Location</p>
                    <p className="text-white">Varanasi, Uttar Pradesh</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/10 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-white/60 text-sm">
                © 2024 Utsav Travels. All rights reserved.
              </p>
              <div className="flex gap-6 text-sm">
                <Link href="/privacy" className="text-white/60 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="text-white/60 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
  );
}