// src/types/hero.ts

export interface VideoHeroBannerProps {
  /** WebM video source URL or path */
  videoSrc: string;
  /** Fallback image URL for when video fails to load */
  fallbackImage?: string;
  /** Main heading text */
  title: string;
  /** Optional subtitle text */
  subtitle?: string;
  /** Optional description text */
  description?: string;
  /** Overlay darkness level (0-1) */
  overlayDarkness?: number;
  /** Show WhatsApp floating button */
  showWhatsApp?: boolean;
  /** Banner height */
  height?: string;
  /** Enable video autoplay */
  autoplay?: boolean;
  /** Enable video loop */
  loop?: boolean;
  /** Start video muted */
  muted?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Custom content to render over video */
  children?: React.ReactNode;
}

export interface VideoControlsProps {
  /** Is video currently muted */
  isMuted: boolean;
  /** Toggle mute function */
  onToggleMute: () => void;
  /** Is video currently playing */
  isPlaying: boolean;
  /** Toggle play/pause function */
  onTogglePlay: () => void;
  /** Position of controls */
  position?: 'bottom-right' | 'top-right' | 'bottom-left' | 'top-left';
}

export interface HeroBannerContentProps {
  /** Main heading */
  title: string;
  /** Optional subtitle */
  subtitle?: string;
  /** Optional description */
  description?: string;
  /** Content alignment */
  alignment?: 'center' | 'left' | 'right';
  /** Animation delay */
  delay?: number;
}

// Video source configuration
export interface VideoSource {
  /** WebM video URL */
  webm: string;
  /** MP4 fallback URL */
  mp4?: string;
  /** Video poster image */
  poster?: string;
}

// Pre-configured video sources for different pages
export const VIDEO_SOURCES = {
  home: {
    webm: '/videos/home-hero.webm',
    mp4: '/videos/home-hero.mp4',
    poster: '/images/home-hero-poster.jpg'
  },
  about: {
    webm: '/videos/about-hero.webm', 
    mp4: '/videos/about-hero.mp4',
    poster: '/images/about-hero-poster.jpg'
  },
  destinations: {
    webm: '/videos/destinations-hero.webm',
    mp4: '/videos/destinations-hero.mp4', 
    poster: '/images/destinations-hero-poster.jpg'
  },
  packages: {
    webm: '/videos/packages-hero.webm',
    mp4: '/videos/packages-hero.mp4',
    poster: '/images/packages-hero-poster.jpg'
  },
  places: {
    varanasi: {
      webm: '/videos/places/varanasi.webm',
      mp4: '/videos/places/varanasi.mp4',
      poster: '/images/places/varanasi-poster.jpg'
    },
    ayodhya: {
      webm: '/videos/places/ayodhya.webm',
      mp4: '/videos/places/ayodhya.mp4', 
      poster: '/images/places/ayodhya-poster.jpg'
    },
    rishikesh: {
      webm: '/videos/places/rishikesh.webm',
      mp4: '/videos/places/rishikesh.mp4',
      poster: '/images/places/rishikesh-poster.jpg'
    },
    kedarnath: {
      webm: '/videos/places/kedarnath.webm',
      mp4: '/videos/places/kedarnath.mp4',
      poster: '/images/places/kedarnath-poster.jpg'
    }
  }
} as const;

// Placeholder video URLs (replace with your actual videos)
export const PLACEHOLDER_VIDEOS = {
  spiritual: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.webm',
  nature: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.webm', 
  temple: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.webm',
  journey: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.webm'
} as const;