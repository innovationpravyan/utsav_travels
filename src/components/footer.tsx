'use client';

import Link from 'next/link';
import React, { memo } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Plane,
  Heart,
  ExternalLink,
  Shield,
  Award,
  Users
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { OptimizedMotionDiv, StaggerContainer } from '@/components/optimized-motion-div';
import { usePerformancePreference } from '@/hooks/use-mobile';

// Import constants from utils
import {
  COMPANY_INFO,
  FOOTER_SECTIONS,
  SOCIAL_LINKS,
  CONTACT_INFO,
  TRUST_INDICATORS,
  NEWSLETTER_CONFIG,
  LEGAL_LINKS,
  SCHEMA_MARKUP
} from '@/lib/utils';

// Types
interface FooterSection {
  title: string;
  links: Array<{
    label: string;
    href: string;
    external?: boolean;
    description?: string;
  }>;
}

interface SocialLink {
  name: string;
  href: string;
  icon: React.ReactNode;
  color: string;
  followers?: string;
}

interface ContactInfo {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
  description?: string;
}

// Icon mapping for dynamic icons
const ICON_MAP = {
  Phone,
  Mail,
  MapPin,
  Clock,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Shield,
  Award,
  Users
} as const;

// Memoized footer section component
const FooterSection = memo(({ section, index }: { section: FooterSection; index: number }) => (
    <OptimizedMotionDiv preset="slideUp" delay={index * 100}>
      <div className="space-y-4">
        <h3 className="text-white font-semibold text-lg">{section.title}</h3>
        <ul className="space-y-3">
          {section.links.map((link) => (
              <li key={link.label}>
                <Link
                    href={link.href}
                    className={cn(
                        "text-white/70 hover:text-white transition-colors duration-200 text-sm",
                        "flex items-center gap-2 group"
                    )}
                    {...(link.external && {
                      target: "_blank",
                      rel: "noopener noreferrer",
                      'aria-label': `${link.label} (opens in new tab)`
                    })}
                >
              <span className="group-hover:translate-x-1 transition-transform duration-200">
                {link.label}
              </span>
                  {link.external && <ExternalLink className="w-3 h-3 opacity-50" />}
                </Link>
                {link.description && (
                    <p className="text-white/50 text-xs mt-1 ml-0">{link.description}</p>
                )}
              </li>
          ))}
        </ul>
      </div>
    </OptimizedMotionDiv>
));

FooterSection.displayName = 'FooterSection';

// Memoized contact info component
const ContactInfoItem = memo(({ info, index }: { info: ContactInfo; index: number }) => {
  const IconComponent = ICON_MAP[info.icon as keyof typeof ICON_MAP];

  return (
      <OptimizedMotionDiv preset="fadeIn" delay={index * 100}>
        <div className="flex items-start gap-3 group">
          <div className="flex-shrink-0 p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
            {IconComponent && <IconComponent className="w-4 h-4" />}
          </div>
          <div className="flex-1">
            <p className="text-white/60 text-xs font-medium">{info.label}</p>
            {info.href ? (
                <Link
                    href={info.href}
                    className="text-white hover:text-primary transition-colors text-sm font-medium"
                >
                  {info.value}
                </Link>
            ) : (
                <p className="text-white text-sm font-medium">{info.value}</p>
            )}
            {info.description && (
                <p className="text-white/50 text-xs mt-1">{info.description}</p>
            )}
          </div>
        </div>
      </OptimizedMotionDiv>
  );
});

ContactInfoItem.displayName = 'ContactInfoItem';

// Memoized social links component
const SocialLinks = memo(() => {
  const { shouldReduceEffects } = usePerformancePreference();

  return (
      <OptimizedMotionDiv preset="slideUp" delay={400}>
        <div className="space-y-4">
          <h4 className="text-white font-medium">Follow Our Journey</h4>
          <div className="flex gap-3">
            {SOCIAL_LINKS.map((social) => {
              const IconComponent = ICON_MAP[social.icon as keyof typeof ICON_MAP];
              return (
                  <Link
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                          "p-3 bg-white/10 rounded-lg transition-all duration-200 text-white/70",
                          social.color,
                          !shouldReduceEffects && "hover:scale-110 hover:bg-white/20"
                      )}
                      aria-label={`Follow us on ${social.name} - ${social.followers} followers`}
                  >
                    {IconComponent && <IconComponent className="w-5 h-5" />}
                  </Link>
              );
            })}
          </div>
          <div className="flex flex-wrap gap-4 text-xs text-white/50">
            {SOCIAL_LINKS.map((social) => (
                <span key={social.name}>
              {social.name}: {social.followers}
            </span>
            ))}
          </div>
        </div>
      </OptimizedMotionDiv>
  );
});

SocialLinks.displayName = 'SocialLinks';

// Memoized newsletter component
const Newsletter = memo(() => (
    <OptimizedMotionDiv preset="slideUp" delay={500}>
      <GlassCard className="p-6 space-y-4">
        <div className="text-center">
          <h4 className="text-white font-semibold text-lg mb-2">
            {NEWSLETTER_CONFIG.title}
          </h4>
          <p className="text-white/70 text-sm">
            {NEWSLETTER_CONFIG.description}
          </p>
        </div>

        <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
          <div className="flex gap-2">
            <input
                type="email"
                placeholder={NEWSLETTER_CONFIG.placeholder}
                className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                required
            />
            <Button
                type="submit"
                size="sm"
                className="bg-primary hover:bg-primary/90 text-white"
            >
              {NEWSLETTER_CONFIG.buttonText}
            </Button>
          </div>
          <p className="text-white/50 text-xs">
            {NEWSLETTER_CONFIG.privacyText}
          </p>
        </form>
      </GlassCard>
    </OptimizedMotionDiv>
));

Newsletter.displayName = 'Newsletter';

// Memoized trust indicators
const TrustIndicators = memo(() => (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {TRUST_INDICATORS.map((indicator, index) => {
        const IconComponent = ICON_MAP[indicator.icon as keyof typeof ICON_MAP];
        return (
            <OptimizedMotionDiv key={indicator.label} preset="fadeIn" delay={index * 100}>
              <div className="flex items-center gap-3 text-center sm:text-left">
                {IconComponent && <IconComponent className={`w-5 h-5 ${indicator.color}`} />}
                <div>
                  <p className="text-white text-sm font-medium">{indicator.label}</p>
                  <p className="text-white/60 text-xs">{indicator.value}</p>
                </div>
              </div>
            </OptimizedMotionDiv>
        );
      })}
    </div>
));

TrustIndicators.displayName = 'TrustIndicators';

// Main footer component
export const Footer = memo(() => {
  const currentYear = new Date().getFullYear();

  return (
      <footer className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full bg-[radial-gradient(circle_at_1px_1px,_white_1px,_transparent_1px)] bg-[length:32px_32px]" />
        </div>

        <div className="relative z-10">
          {/* Main footer content */}
          <div className="container mx-auto px-4 py-16">
            <StaggerContainer staggerDelay={100}>
              {/* Top section */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-12">

                {/* Company info and contact */}
                <div className="lg:col-span-1 space-y-8">
                  <OptimizedMotionDiv preset="slideUp">
                    <div className="space-y-4">
                      {/* Logo and tagline */}
                      <Link href="/" className="flex items-center gap-2 group">
                        <Plane className="h-8 w-8 text-primary group-hover:rotate-12 transition-transform duration-200" />
                        <div>
                          <span className="text-2xl font-bold text-gradient">{COMPANY_INFO.name}</span>
                          <p className="text-white/60 text-sm">{COMPANY_INFO.tagline}</p>
                        </div>
                      </Link>

                      <p className="text-white/70 leading-relaxed">
                        {COMPANY_INFO.footerDescription}
                      </p>
                    </div>
                  </OptimizedMotionDiv>

                  {/* Contact information */}
                  <div className="space-y-4">
                    {CONTACT_INFO.map((info, index) => (
                        <ContactInfoItem key={info.label} info={info} index={index} />
                    ))}
                  </div>
                </div>

                {/* Footer sections */}
                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {FOOTER_SECTIONS.map((section, index) => (
                      <FooterSection key={section.title} section={section} index={index} />
                  ))}
                </div>

                {/* Social and newsletter */}
                <div className="lg:col-span-1 space-y-8">
                  <SocialLinks />
                  <Newsletter />
                </div>
              </div>

              {/* Trust indicators */}
              <OptimizedMotionDiv preset="fadeIn" delay={600}>
                <div className="py-8 border-t border-white/10">
                  <TrustIndicators />
                </div>
              </OptimizedMotionDiv>

              {/* Bottom section */}
              <OptimizedMotionDiv preset="fadeIn" delay={700}>
                <div className="pt-8 border-t border-white/10">
                  <div className="flex flex-col md:flex-row justify-between items-center gap-4">

                    {/* Copyright */}
                    <div className="text-center md:text-left">
                      <p className="text-white/60 text-sm">
                        © {currentYear} {COMPANY_INFO.name}. All rights reserved.
                      </p>
                      <p className="text-white/50 text-xs mt-1 flex items-center justify-center md:justify-start gap-1">
                        Made with <Heart className="w-3 h-3 text-red-400 fill-current" /> in India
                      </p>
                    </div>

                    {/* Legal links */}
                    <div className="flex flex-wrap justify-center gap-6 text-sm">
                      {LEGAL_LINKS.map((link) => (
                          <Link
                              key={link.label}
                              href={link.href}
                              className="text-white/60 hover:text-white transition-colors"
                          >
                            {link.label}
                          </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </OptimizedMotionDiv>
            </StaggerContainer>
          </div>

          {/* Back to top button */}
          <div className="absolute bottom-8 right-8">
            <Button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                size="icon"
                className="rounded-full bg-primary/20 backdrop-blur-sm hover:bg-primary/30 text-white border border-white/20"
                aria-label="Scroll to top"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </Button>
          </div>
        </div>

        {/* Schema markup for organization */}
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(SCHEMA_MARKUP.organization)
            }}
        />
      </footer>
  );
});

Footer.displayName = 'Footer';