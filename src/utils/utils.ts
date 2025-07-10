import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from 'zod';

/**
 * ============================================================================
 * UTSAV TRAVELS - CONFIGURATION FILE
 * ============================================================================
 *
 * This file contains all configuration constants, schemas, and utilities
 * for the Utsav Travels website - a premier spiritual tourism platform.
 *
 * Organized Sections:
 * 1. Core Configuration & Environment
 * 2. Company & Business Information
 * 3. Contact & Location Data
 * 4. Navigation & UI Configuration
 * 5. Content & Media Assets
 * 6. Form Validation & Messages
 * 7. External Services Integration
 * 8. SEO & Analytics Configuration
 * 9. Utility Functions & Helpers
 *
 * @version 2.0.0
 * @lastModified 2025-01-10
 * ============================================================================
 */

// ============================================================================
// 1. CORE CONFIGURATION & ENVIRONMENT
// ============================================================================

/**
 * Environment detection and application state
 */
export const env = {
    isDev: process.env.NODE_ENV === 'development',
    isProd: process.env.NODE_ENV === 'production',
    isTest: process.env.NODE_ENV === 'test',
    isClient: typeof window !== 'undefined',
    isServer: typeof window === 'undefined',
} as const;

/**
 * Base site configuration
 */
export const SITE_CONFIG = {
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://utsavtravels.com',
    domain: 'utsavtravels.com',
    locale: 'en_IN',
    alternateLocale: 'hi_IN',
    timezone: 'Asia/Kolkata',
} as const;

/**
 * UI and animation constants
 */
export const UI_CONSTANTS = {
    animations: {
        duration: 300,
        durationMs: '300ms',
        durationLong: 500,
        durationLongMs: '500ms',
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        easingOut: 'cubic-bezier(0, 0, 0.2, 1)',
    },
    breakpoints: {
        mobile: 768,
        tablet: 1024,
        desktop: 1280,
        queries: {
            mobile: '(max-width: 767px)',
            tablet: '(min-width: 768px) and (max-width: 1023px)',
            desktop: '(min-width: 1024px)',
        },
    },
    spacing: {
        sectionPadding: 'clamp(2rem, 5vh, 4rem)',
        sectionPaddingSm: 'clamp(1rem, 2vh, 2rem)',
        containerPadding: '1rem',
    },
    scrollThreshold: 50,
    cacheTimeout: 5 * 60 * 1000, // 5 minutes
    apiTimeout: 30000, // 30 seconds
} as const;

// ============================================================================
// 2. COMPANY & BUSINESS INFORMATION
// ============================================================================

/**
 * Core company information - Single source of truth
 */
export const COMPANY_INFO = {
    // Basic Identity
    name: 'Utsav Travels',
    tagline: 'Discover Sacred India',
    fullName: 'Utsav Travels - Sacred India Tours & Spiritual Journeys',

    // Descriptions
    description: 'Premier spiritual heritage tours across India\'s most sacred destinations. Expert-guided tours to Varanasi, Ayodhya, Rishikesh, Kedarnath and sacred destinations across India.',
    shortDescription: 'Embark on transformative spiritual journeys through India\'s most sacred destinations',
    footerDescription: 'Discover India\'s spiritual heritage through expertly curated tours to sacred destinations. Creating transformative travel experiences since 2019.',

    // Contact Information
    contact: {
        phone: '+91 9889084715',
        phoneDisplay: '+91 98890 84715',
        phoneClean: '+919889084715',
        email: 'info@utsavtravels.com',
        whatsapp: '+919889084715',
        whatsappUrl: 'https://wa.me/919889084715',
    },

    // Location
    address: {
        city: 'Varanasi',
        state: 'Uttar Pradesh',
        country: 'India',
        countryCode: 'IN',
        postalCode: '221001',
        full: 'Varanasi, Uttar Pradesh, India',
    },

    // Performance Metrics
    stats: {
        establishedYear: '2019',
        happyTravelers: '10,000+',
        rating: '4.9/5',
        reviewCount: '2,847',
        destinations: '50+',
        experience: '5+',
        supportHours: '24/7',
        responseTime: '< 1 Hour',
    },

    // Operating Hours
    businessHours: {
        display: '9:00 AM - 6:00 PM IST',
        description: 'Monday to Saturday',
        available24x7: true,
    },
} as const;

/**
 * Business configuration and services
 */
export const BUSINESS_CONFIG = {
    // Service Areas
    cities: ['Varanasi', 'Ayodhya', 'Rishikesh', 'Kedarnath'],

    // Destination Categories
    categories: ['Temple', 'Ghat', 'Buddhist Site', 'Bridge', 'Ashram', 'Lake', 'Sacred Site'],

    // Package Types
    packageTypes: ['Spiritual Journeys', 'Adventure Tours', 'Cultural Heritage', 'Yoga Retreats', 'Pilgrimage Tours'],

    // Key Features
    features: [
        'Authentic Experiences',
        'Local Expertise',
        'Spiritual Focus',
        'Cultural Immersion',
        'Expert Travel Consultants',
        '24/7 Customer Support',
        'Personalized Itineraries',
        'Quick Response Guarantee'
    ],

    // Services Offered
    services: [
        'Spiritual Tourism',
        'Heritage Sites',
        'Cultural Tours',
        'Pilgrimage Tours',
        'Temple Tours',
        'Yoga Retreats'
    ],

    // Business Details
    priceRange: '₹₹',
    languages: ['Hindi', 'English'],
} as const;

/**
 * Social media presence
 */
export const SOCIAL_MEDIA = {
    platforms: {
        facebook: 'https://facebook.com/utsavtravels',
        instagram: 'https://instagram.com/utsavtravels',
        twitter: 'https://twitter.com/utsavtravels',
        linkedin: 'https://linkedin.com/company/utsavtravels',
        youtube: 'https://youtube.com/@utsavtravels',
    },
    stats: {
        facebook: '12K',
        instagram: '8.5K',
        twitter: '5.2K',
        youtube: '15K',
    },
} as const;

// ============================================================================
// 3. CONTACT & LOCATION DATA
// ============================================================================

/**
 * Contact methods configuration
 */
export const CONTACT_METHODS = [
    {
        icon: 'Phone',
        title: 'Call Us',
        subtitle: 'Speak directly with our travel experts',
        value: COMPANY_INFO.contact.phoneDisplay,
        href: `tel:${COMPANY_INFO.contact.phone}`,
        color: 'from-green-400 to-emerald-600',
        description: 'Available 24/7 for immediate assistance'
    },
    {
        icon: 'MessageCircle',
        title: 'WhatsApp',
        subtitle: 'Quick responses via WhatsApp',
        value: 'Chat with us',
        href: COMPANY_INFO.contact.whatsappUrl,
        color: 'from-green-500 to-green-700',
        description: 'Fastest way to get your questions answered'
    },
    {
        icon: 'Mail',
        title: 'Email Us',
        subtitle: 'Detailed inquiries and planning',
        value: COMPANY_INFO.contact.email,
        href: `mailto:${COMPANY_INFO.contact.email}`,
        color: 'from-blue-400 to-blue-600',
        description: 'Perfect for detailed trip planning'
    },
    {
        icon: 'MapPin',
        title: 'Visit Us',
        subtitle: 'Meet us in person',
        value: COMPANY_INFO.address.full,
        href: '#',
        color: 'from-purple-400 to-purple-600',
        description: 'Located in the heart of spiritual India'
    }
] as const;

/**
 * Trust indicators for building credibility
 */
export const TRUST_INDICATORS = [
    {
        icon: 'Shield',
        label: 'Secure Booking',
        value: 'SSL Protected',
        color: 'text-green-400'
    },
    {
        icon: 'Award',
        label: 'Award Winning',
        value: 'Best Spiritual Tours 2024',
        color: 'text-yellow-400'
    },
    {
        icon: 'Users',
        label: 'Happy Travelers',
        value: '10,000+ Satisfied Customers',
        color: 'text-blue-400'
    }
] as const;

// ============================================================================
// 4. NAVIGATION & UI CONFIGURATION
// ============================================================================

/**
 * Main navigation links
 */
export const NAV_LINKS = [
    {
        href: "/destinations",
        label: "Destinations",
        icon: "MapPin",
        description: "Sacred places to visit"
    },
    {
        href: "/packages",
        label: "Packages",
        icon: "Plane",
        description: "Curated travel experiences"
    },
    {
        href: "/about",
        label: "About Us",
        icon: "User",
        description: "Our story and mission"
    },
    {
        href: "/contact",
        label: "Contact",
        icon: "Phone",
        description: "Get in touch with us"
    },
] as const;

/**
 * Footer navigation sections
 */
export const FOOTER_SECTIONS = [
    {
        title: 'Destinations',
        links: [
            { label: 'Varanasi Tours', href: '/destinations/varanasi', description: 'Sacred ghats and temples' },
            { label: 'Ayodhya Pilgrimage', href: '/destinations/ayodhya', description: 'Birthplace of Lord Rama' },
            { label: 'Rishikesh Retreats', href: '/destinations/rishikesh', description: 'Yoga and meditation' },
            { label: 'Kedarnath Trek', href: '/destinations/kedarnath', description: 'Sacred Himalayan shrine' },
            { label: 'All Destinations', href: '/destinations' }
        ]
    },
    {
        title: 'Tour Packages',
        links: [
            { label: 'Spiritual Tours', href: '/packages?category=spiritual' },
            { label: 'Pilgrimage Packages', href: '/packages?category=pilgrimage' },
            { label: 'Yoga Retreats', href: '/packages?category=yoga' },
            { label: 'Heritage Tours', href: '/packages?category=heritage' },
            { label: 'Custom Packages', href: '/packages/custom' }
        ]
    },
    {
        title: 'Travel Services',
        links: [
            { label: 'Hotel Booking', href: '/services/hotels' },
            { label: 'Transportation', href: '/services/transport' },
            { label: 'Travel Insurance', href: '/services/insurance' },
            { label: 'Visa Assistance', href: '/services/visa' },
            { label: 'Group Tours', href: '/services/groups' }
        ]
    },
    {
        title: 'Support',
        links: [
            { label: 'Contact Us', href: '/contact' },
            { label: 'FAQ', href: '/faq' },
            { label: 'Travel Guide', href: '/travel-guide' },
            { label: 'Booking Help', href: '/help/booking' },
            { label: 'Cancellation', href: '/help/cancellation' }
        ]
    }
] as const;

/**
 * Social media links with metadata
 */
export const SOCIAL_LINKS = [
    {
        name: 'Facebook',
        href: SOCIAL_MEDIA.platforms.facebook,
        icon: 'Facebook',
        color: 'hover:text-blue-500',
        followers: SOCIAL_MEDIA.stats.facebook
    },
    {
        name: 'Instagram',
        href: SOCIAL_MEDIA.platforms.instagram,
        icon: 'Instagram',
        color: 'hover:text-pink-500',
        followers: SOCIAL_MEDIA.stats.instagram
    },
    {
        name: 'Twitter',
        href: SOCIAL_MEDIA.platforms.twitter,
        icon: 'Twitter',
        color: 'hover:text-blue-400',
        followers: SOCIAL_MEDIA.stats.twitter
    },
    {
        name: 'YouTube',
        href: SOCIAL_MEDIA.platforms.youtube,
        icon: 'Youtube',
        color: 'hover:text-red-500',
        followers: SOCIAL_MEDIA.stats.youtube
    }
] as const;

/**
 * Legal and policy links
 */
export const LEGAL_LINKS = [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Service", href: "/terms-of-service" },
    { label: "Cookie Policy", href: "/cookie-policy" },
    { label: "Sitemap", href: "/sitemap.xml" }
] as const;

// ============================================================================
// 5. CONTENT & MEDIA ASSETS
// ============================================================================

/**
 * Video and media configuration
 */
export const MEDIA_CONFIG = {
    // Home page video carousel
    videoCarousel: {
        default: {
            id: 'default',
            label: 'Default',
            src: '/videos/homepage_video.webm',
            mp4: '/videos/homepage_video.mp4',
            title: 'Discover Sacred India',
            subtitle: 'Journey Through Spiritual Heritage',
            description: 'Embark on transformative journeys through India\'s most sacred destinations',
            thumbnail: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1920&h=1080&fit=crop&crop=center'
        },
        varanasi: {
            id: 'varanasi',
            label: 'Varanasi',
            src: '/videos/varanasi-hero.webm',
            mp4: '/videos/varanasi-hero.mp4',
            title: 'Sacred Varanasi',
            subtitle: 'The Spiritual Capital of India',
            description: 'Experience the eternal city where spirituality flows like the sacred Ganges',
            thumbnail: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=1920&h=1080&fit=crop&crop=center'
        },
        kedarnath: {
            id: 'kedarnath',
            label: 'Kedarnath',
            src: '/videos/kedarnath-hero.webm',
            mp4: '/videos/kedarnath-hero.mp4',
            title: 'Mystical Kedarnath',
            subtitle: 'Lord Shiva\'s Sacred Abode',
            description: 'Journey to the divine heights where earth meets heaven in eternal devotion',
            thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&crop=center'
        },
        rishikesh: {
            id: 'rishikesh',
            label: 'Rishikesh',
            src: '/videos/rishikesh-hero.webm',
            mp4: '/videos/rishikesh-hero.mp4',
            title: 'Serene Rishikesh',
            subtitle: 'Yoga Capital of the World',
            description: 'Find inner peace in the foothills of the Himalayas where the Ganges flows pure',
            thumbnail: 'https://images.unsplash.com/photo-1532664189809-02133fee698d?w=1920&h=1080&fit=crop&crop=center'
        },
        ayodhya: {
            id: 'ayodhya',
            label: 'Ayodhya',
            src: '/videos/ayodhya-hero.webm',
            mp4: '/videos/ayodhya-hero.mp4',
            title: 'Divine Ayodhya',
            subtitle: 'Birthplace of Lord Rama',
            description: 'Walk in the footsteps of divinity in the sacred birthplace of Lord Rama',
            thumbnail: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=1920&h=1080&fit=crop&crop=center'
        }
    },

    // Page hero images
    heroImages: {
        destinations: {
            primary: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1920&h=1080&fit=crop&crop=center',
            title: 'Explore Sacred Destinations',
            subtitle: 'Journey Through India\'s Spiritual Heritage',
            description: 'Discover ancient temples, sacred ghats, and spiritual sites across India'
        },
        packages: {
            primary: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&crop=center',
            title: 'Curated Travel Packages',
            subtitle: 'Journeys Crafted for the Soul',
            description: 'Experience India\'s spiritual heritage through our carefully designed packages'
        },
        about: {
            primary: 'https://images.unsplash.com/photo-1532664189809-02133fee698d?w=1920&h=1080&fit=crop&crop=center',
            title: 'About Utsav Travels',
            subtitle: 'Your Gateway to Spiritual India',
            description: 'Connecting travelers with the authentic soul of sacred destinations'
        }
    },

    // Fallback images
    fallbacks: {
        spiritual: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1920&h=1080&fit=crop&crop=center',
        temple: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&crop=center',
        nature: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&crop=center',
        journey: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=1920&h=1080&fit=crop&crop=center',
        yoga: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&crop=center',
        culture: 'https://images.unsplash.com/photo-1532664189809-02133fee698d?w=1920&h=1080&fit=crop&crop=center',
        default: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1920&h=1080&fit=crop&crop=center'
    },

    // Configuration
    videoCarouselConfig: {
        autoPlay: true,
        autoPlayInterval: 8000,
        loop: true,
        showControls: true,
        showTabs: true,
        tabPosition: 'bottom-left' as const,
        transitionDuration: 800,
        videoSettings: {
            muted: true,
            preload: 'metadata' as const,
            playsInline: true
        }
    },

    heroImageConfig: {
        height: '85vh',
        overlayOpacity: 0.6,
        showScrollIndicator: true,
        parallaxEffect: true
    }
} as const;

/**
 * Homepage statistics
 */
export const HOMEPAGE_STATS = [
    {
        icon: 'MapPin',
        value: 50,
        suffix: '+',
        label: 'Sacred Destinations',
        color: 'text-blue-400'
    },
    {
        icon: 'Users',
        value: 10000,
        suffix: '+',
        label: 'Happy Travelers',
        color: 'text-green-400'
    },
    {
        icon: 'Calendar',
        value: 5,
        suffix: '',
        label: 'Years Experience',
        color: 'text-yellow-400'
    },
    {
        icon: 'Award',
        value: 98,
        suffix: '%',
        label: 'Customer Satisfaction',
        color: 'text-purple-400'
    },
] as const;

/**
 * Customer testimonials
 */
export const TESTIMONIALS = [
    {
        name: "Priya Sharma",
        location: "Mumbai",
        rating: 5,
        text: "The spiritual journey to Varanasi was life-changing. Every detail was perfectly organized.",
        image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=100&h=100&fit=crop&crop=face"
    },
    {
        name: "Rajesh Kumar",
        location: "Delhi",
        rating: 5,
        text: "Incredible experience in Rishikesh. The yoga sessions and temple visits were amazing.",
        image: "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?w=100&h=100&fit=crop&crop=face"
    },
    {
        name: "Anita Patel",
        location: "Ahmedabad",
        rating: 5,
        text: "The Kedarnath trek was challenging but spiritually rewarding. Highly recommended!",
        image: "https://images.pexels.com/photos/1499327/pexels-photo-1499327.jpeg?w=100&h=100&fit=crop&crop=face"
    },
] as const;

/**
 * Team members information
 */
export const TEAM_MEMBERS = [
    {
        name: "Rajesh Gupta",
        role: "Founder & CEO",
        image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?w=300&h=300&fit=crop&crop=face",
        bio: "20+ years in spiritual tourism and heritage preservation",
        expertise: ["Spiritual Tourism", "Heritage Sites", "Cultural Experiences"]
    },
    {
        name: "Priya Sharma",
        role: "Head of Operations",
        image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=300&h=300&fit=crop&crop=face",
        bio: "Expert in travel operations and customer experience",
        expertise: ["Operations Management", "Customer Service", "Quality Assurance"]
    },
    {
        name: "Amit Verma",
        role: "Cultural Guide Director",
        image: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?w=300&h=300&fit=crop&crop=face",
        bio: "Specialist in Indian philosophy and spiritual practices",
        expertise: ["Cultural Heritage", "Spiritual Guidance", "Local History"]
    }
] as const;

/**
 * Company milestones and achievements
 */
export const COMPANY_MILESTONES = [
    {
        year: "2019",
        title: "Company Founded",
        description: "Started with a vision to promote spiritual tourism",
        icon: "Sparkles",
        color: "from-blue-400 to-blue-600"
    },
    {
        year: "2020",
        title: "First 1000 Travelers",
        description: "Reached our first major milestone of happy customers",
        icon: "Users",
        color: "from-green-400 to-green-600"
    },
    {
        year: "2021",
        title: "Award Recognition",
        description: "Received excellence award for spiritual tourism",
        icon: "Award",
        color: "from-yellow-400 to-yellow-600"
    },
    {
        year: "2022",
        title: "50+ Destinations",
        description: "Expanded to cover all major spiritual sites",
        icon: "MapPin",
        color: "from-purple-400 to-purple-600"
    },
    {
        year: "2023",
        title: "Digital Innovation",
        description: "Launched advanced booking and experience platform",
        icon: "Globe",
        color: "from-pink-400 to-pink-600"
    }
] as const;

// ============================================================================
// 6. FORM VALIDATION & MESSAGES
// ============================================================================

/**
 * Form validation schemas using Zod
 */
export const VALIDATION_SCHEMAS = {
    contact: z.object({
        name: z.string()
            .min(2, 'Name must be at least 2 characters.')
            .max(50, 'Name must not exceed 50 characters.')
            .regex(/^[a-zA-Z\s.'-]+$/, 'Name contains invalid characters.')
            .trim(),
        phone: z.string()
            .min(10, 'Phone number must be at least 10 digits.')
            .max(15, 'Phone number must not exceed 15 digits.')
            .regex(/^[+]?[1-9]\d{0,15}$/, 'Invalid phone number format.')
            .trim(),
        email: z.string()
            .email('Invalid email address.')
            .max(100, 'Email must not exceed 100 characters.')
            .optional(),
        message: z.string()
            .max(500, 'Message must not exceed 500 characters.')
            .optional(),
        preferredTime: z.enum(['morning', 'afternoon', 'evening'], {
            errorMap: () => ({message: 'Invalid preferred time.'})
        }).optional(),
        source: z.string().max(50).optional()
    }),

    inquiry: z.object({
        name: z.string()
            .min(2, 'Name must be at least 2 characters.')
            .max(50, 'Name must not exceed 50 characters.')
            .regex(/^[a-zA-Z\s.'-]+$/, 'Name contains invalid characters.')
            .trim(),
        email: z.string()
            .email('Invalid email address.')
            .max(100, 'Email must not exceed 100 characters.')
            .trim(),
        phone: z.string()
            .min(10, 'Phone number must be at least 10 digits.')
            .max(15, 'Phone number must not exceed 15 digits.')
            .regex(/^[+]?[1-9]\d{0,15}$/, 'Invalid phone number format.')
            .trim(),
        subject: z.string()
            .min(5, 'Subject must be at least 5 characters.')
            .max(100, 'Subject must not exceed 100 characters.')
            .trim(),
        message: z.string()
            .min(10, 'Message must be at least 10 characters.')
            .max(1000, 'Message must not exceed 1000 characters.')
            .trim()
    }),

    location: z.object({
        lat: z.number().min(-90).max(90),
        lng: z.number().min(-180).max(180),
    }),
} as const;

/**
 * Error messages for various scenarios
 */
export const ERROR_MESSAGES = {
    generic: 'Something went wrong. Please try again.',
    network: 'Network error. Please check your connection.',
    timeout: 'Request timeout. Please try again.',
    notFound: 'The requested content was not found.',
    validation: 'Please check your input and try again.',

    firebase: {
        init: 'Failed to initialize Firebase application',
        config: 'Firebase configuration error',
        firestore: 'Database connection error',
        fetch: 'Failed to fetch data',
        document: 'Document not found',
    },

    form: {
        required: 'This field is required',
        email: 'Please enter a valid email address',
        phone: 'Please enter a valid phone number',
        name: 'Please enter a valid name',
    },
} as const;

/**
 * Success messages for user feedback
 */
export const SUCCESS_MESSAGES = {
    form: {
        submitted: 'Thank you! We\'ll get back to you within 24 hours.',
        contact: 'Message sent successfully!',
        inquiry: 'Inquiry submitted successfully!',
    },
    general: {
        saved: 'Saved successfully!',
        updated: 'Updated successfully!',
        deleted: 'Deleted successfully!',
    },
} as const;

/**
 * WhatsApp message templates
 */
export const WHATSAPP_TEMPLATES = {
    default: `Hi Utsav Travels! I'm interested in spiritual tour packages.`,
    inquiry: (name: string, destination?: string) =>
        `Hi! I'm ${name} and I'm interested in ${destination ? `visiting ${destination}` : 'your spiritual tour packages'}. Please share more details.`,
    package: (packageName: string) =>
        `Hi! I'm interested in the "${packageName}" package. Please share more details and pricing.`,
    place: (placeName: string) =>
        `Hi! I'd like to visit ${placeName}. Can you help me plan a trip?`,
    support: (issue: string) =>
        `Hi! I need help with: ${issue}`,
} as const;

// ============================================================================
// 7. EXTERNAL SERVICES INTEGRATION
// ============================================================================

/**
 * Firebase configuration
 */
export const FIREBASE_CONFIG = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDbifj2_jatQIx5GNkiDXAOHmAYOCrnzqo",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "utsavtravels-299d5.firebaseapp.com",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "utsavtravels-299d5",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "utsavtravels-299d5.firebasestorage.app",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "841887025085",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:841887025085:web:b663dd26817b4aa849f4d4",
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-8S5PS1SVXG",
} as const;

/**
 * Analytics and tracking configuration
 */
export const ANALYTICS_CONFIG = {
    google: {
        gaId: process.env.NEXT_PUBLIC_GA_ID,
        measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || 'G-8S5PS1SVXG',
    },
    verification: {
        google: process.env.GOOGLE_VERIFICATION,
        yandex: process.env.YANDEX_VERIFICATION,
        bing: process.env.BING_VERIFICATION || '',
    },
} as const;

// ============================================================================
// 8. SEO & ANALYTICS CONFIGURATION
// ============================================================================

/**
 * SEO configuration and metadata
 */
export const SEO_CONFIG = {
    defaultTitle: COMPANY_INFO.fullName,
    titleTemplate: '%s | Utsav Travels - Sacred India Tours',

    keywords: [
        'spiritual tourism India',
        'Varanasi tours',
        'Ayodhya travel',
        'Rishikesh packages',
        'Kedarnath pilgrimage',
        'sacred destinations India',
        'Hindu pilgrimage tours',
        'spiritual travel packages',
        'India heritage tours',
        'temple tours India'
    ],

    openGraph: {
        type: 'website',
        locale: 'en_IN',
        alternateLocale: ['hi_IN'],
        siteName: COMPANY_INFO.name,
        images: {
            default: '/images/og-image.jpg',
            square: '/images/og-square.jpg',
            twitter: '/images/twitter-image.jpg',
        },
    },

    structuredData: {
        '@context': 'https://schema.org',
        '@type': 'TravelAgency',
        name: COMPANY_INFO.name,
        description: COMPANY_INFO.description,
        url: SITE_CONFIG.url,
        priceRange: BUSINESS_CONFIG.priceRange,
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.9',
            reviewCount: COMPANY_INFO.stats.reviewCount,
            bestRating: '5',
            worstRating: '1'
        },
    },
} as const;

/**
 * Default metadata for pages
 */
export const DEFAULT_METADATA = {
    title: 'Utsav Travels - Discover Sacred India | Spiritual Heritage Tours',
    description: 'Embark on transformative spiritual journeys through Varanasi, Ayodhya, Rishikesh, and Kedarnath. Expert-guided tours, authentic experiences, and unforgettable memories await.',
    keywords: 'spiritual tours India, Varanasi pilgrimage, Ayodhya tours, Rishikesh yoga retreat, Kedarnath trek, sacred destinations, heritage tourism, spiritual travel packages',
    openGraph: {
        title: 'Utsav Travels - Discover Sacred India',
        description: 'Embark on transformative spiritual journeys through India\'s most sacred destinations',
        images: [
            {
                url: '/images/home-og.jpg',
                width: 1200,
                height: 630,
                alt: 'Spiritual destinations in India',
            },
        ],
    },
    twitter: {
        title: 'Utsav Travels - Discover Sacred India',
        description: 'Embark on transformative spiritual journeys through India\'s most sacred destinations',
        images: ['/images/home-twitter.jpg'],
    },
} as const;

/**
 * Schema markup for structured data
 */
export const SCHEMA_MARKUP = {
    organization: {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": COMPANY_INFO.name,
        "url": SITE_CONFIG.url,
        "logo": `${SITE_CONFIG.url}/images/logo.png`,
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": COMPANY_INFO.contact.phone,
            "contactType": "Customer Service",
            "availableLanguage": BUSINESS_CONFIG.languages
        },
        "sameAs": Object.values(SOCIAL_MEDIA.platforms)
    }
} as const;

// ============================================================================
// 9. UTILITY FUNCTIONS & HELPERS
// ============================================================================

/**
 * Combines class names using clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs));
}

/**
 * Application error class for better error handling
 */
export class AppError extends Error {
    public readonly code: string;
    public readonly statusCode: number;

    constructor(
        message: string,
        code: string = 'UNKNOWN_ERROR',
        statusCode: number = 500
    ) {
        super(message);
        this.name = 'AppError';
        this.code = code;
        this.statusCode = statusCode;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, AppError);
        }
    }
}

/**
 * Safe async wrapper for better error handling
 */
export async function safeAsync<T, E = AppError>(
    asyncFn: () => Promise<T>
): Promise<[E | null, T | null]> {
    try {
        const result = await asyncFn();
        return [null, result];
    } catch (error) {
        return [error as E, null];
    }
}

/**
 * Type-safe localStorage wrapper
 */
export const storage = {
    get<T>(key: string, fallback: T): T {
        if (env.isServer) return fallback;
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : fallback;
        } catch {
            return fallback;
        }
    },

    set<T>(key: string, value: T): void {
        if (env.isServer) return;
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.warn('Storage write failed:', error);
        }
    },

    remove(key: string): void {
        if (env.isServer) return;
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.warn('Storage remove failed:', error);
        }
    }
};

/**
 * Deep clone utility for objects
 */
export function deepClone<T>(obj: T): T {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime()) as T;
    if (obj instanceof Array) return obj.map(item => deepClone(item)) as T;
    if (typeof obj === 'object') {
        const cloned = {} as T;
        Object.keys(obj).forEach(key => {
            (cloned as any)[key] = deepClone((obj as any)[key]);
        });
        return cloned;
    }
    return obj;
}

/**
 * Responsive breakpoint utilities
 */
export const breakpoints = {
    mobile: `(max-width: ${UI_CONSTANTS.breakpoints.mobile - 1}px)`,
    tablet: `(min-width: ${UI_CONSTANTS.breakpoints.mobile}px) and (max-width: ${UI_CONSTANTS.breakpoints.tablet - 1}px)`,
    desktop: `(min-width: ${UI_CONSTANTS.breakpoints.tablet}px)`,

    isMobile: () => env.isClient && window.matchMedia(breakpoints.mobile).matches,
    isTablet: () => env.isClient && window.matchMedia(breakpoints.tablet).matches,
    isDesktop: () => env.isClient && window.matchMedia(breakpoints.desktop).matches,
} as const;

/**
 * Generate WhatsApp URL with pre-filled message
 */
export function createWhatsAppUrl(message?: string): string {
    const encodedMessage = encodeURIComponent(message || WHATSAPP_TEMPLATES.default);
    return `${COMPANY_INFO.contact.whatsappUrl}?text=${encodedMessage}`;
}

/**
 * Get video carousel configuration and helpers
 */
export const getVideoCarouselTabs = () => {
    return [
        MEDIA_CONFIG.videoCarousel.default,
        MEDIA_CONFIG.videoCarousel.varanasi,
        MEDIA_CONFIG.videoCarousel.kedarnath,
        MEDIA_CONFIG.videoCarousel.rishikesh,
        MEDIA_CONFIG.videoCarousel.ayodhya
    ];
};

export const getVideoSource = (videoId: keyof typeof MEDIA_CONFIG.videoCarousel, quality: 'webm' | 'mp4' = 'webm') => {
    const video = MEDIA_CONFIG.videoCarousel[videoId];
    return quality === 'mp4' ? video.mp4 : video.src;
};

export const getHeroImage = (page: keyof typeof MEDIA_CONFIG.heroImages) => {
    return MEDIA_CONFIG.heroImages[page];
};

// ============================================================================
// 10. PAGE-SPECIFIC CONTENT
// ============================================================================

/**
 * About page content configuration
 */
export const ABOUT_CONTENT = {
    story: {
        title: "Who We Are",
        description: [
            "Utsav Travels is a premier travel showcase dedicated to unveiling the spiritual, cultural, and historical richness of India's most sacred cities. We were born from a passion for heritage and a desire to connect travelers with the authentic soul of Varanasi, Ayodhya, Rishikesh, and Kedarnath.",
            "Our initiative focuses on promoting sustainable and immersive tourism, ensuring that every journey is not just a trip, but a profound experience that respects local traditions and supports communities."
        ],
        features: ['Authentic Experiences', 'Local Expertise', 'Spiritual Focus', 'Cultural Immersion']
    },
    coreValues: [
        {
            title: 'Mission & Vision',
            description: 'Our mission is to be the leading platform for heritage tourism in the region, showcasing its spiritual depth to the world. We envision a future where every traveler leaves with a deeper understanding and appreciation of this ancient land.',
            icon: 'Target',
            color: 'from-blue-400 to-purple-600'
        },
        {
            title: 'Why Choose Us',
            description: 'With our deep local expertise, we offer authentic, off-the-beaten-path experiences. Our seamless WhatsApp contact system and commitment to personalized service make planning your spiritual journey effortless and enjoyable.',
            icon: 'Heart',
            color: 'from-red-400 to-red-600'
        },
        {
            title: 'Regions We Serve',
            description: 'We specialize exclusively in the spiritual triangle of Uttar Pradesh, focusing our expertise on providing unparalleled travel experiences in:',
            cities: BUSINESS_CONFIG.cities,
            icon: 'MapPin',
            color: 'from-green-400 to-green-600'
        }
    ]
} as const;

/**
 * Default placeholders for missing content
 */
export const PLACEHOLDERS = {
    images: {
        place: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&h=400&fit=crop&crop=center',
        package: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop&crop=center',
        gallery: 'https://images.unsplash.com/photo-1532664189809-02133fee698d?w=400&h=600&fit=crop&crop=center',
        about: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&h=400&fit=crop&crop=center'
    },
    text: {
        unknownPlace: 'Unknown Place',
        unknownCity: 'Unknown City',
        unknownPackage: 'Unknown Package',
        defaultCategory: 'Destination',
        defaultDuration: '3 Days',
        defaultTagline: 'Discover new places',
        contactForPricing: 'Contact for pricing'
    }
} as const;

// ============================================================================
// 11. CONSOLIDATED EXPORTS
// ============================================================================

/**
 * Main configuration object with organized exports
 */
export default {
    // Core
    env,
    site: SITE_CONFIG,
    ui: UI_CONSTANTS,

    // Business
    company: COMPANY_INFO,
    business: BUSINESS_CONFIG,
    social: SOCIAL_MEDIA,

    // Contact & Location
    contact: CONTACT_METHODS,
    trust: TRUST_INDICATORS,

    // Navigation
    navigation: NAV_LINKS,
    footer: FOOTER_SECTIONS,
    socialLinks: SOCIAL_LINKS,
    legal: LEGAL_LINKS,

    // Content & Media
    media: MEDIA_CONFIG,
    stats: HOMEPAGE_STATS,
    testimonials: TESTIMONIALS,
    team: TEAM_MEMBERS,
    milestones: COMPANY_MILESTONES,

    // Forms & Validation
    validation: VALIDATION_SCHEMAS,
    errors: ERROR_MESSAGES,
    success: SUCCESS_MESSAGES,
    whatsapp: WHATSAPP_TEMPLATES,

    // External Services
    firebase: FIREBASE_CONFIG,
    analytics: ANALYTICS_CONFIG,

    // SEO & Metadata
    seo: SEO_CONFIG,
    metadata: DEFAULT_METADATA,
    schema: SCHEMA_MARKUP,

    // Page Content
    about: ABOUT_CONTENT,
    placeholders: PLACEHOLDERS,
} as const;