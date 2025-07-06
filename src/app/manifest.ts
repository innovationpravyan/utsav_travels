import { MetadataRoute } from 'next';

/**
 * PWA Manifest Configuration
 * 
 * This file configures the Progressive Web App manifest for better mobile experience.
 * Enables app-like behavior when installed on mobile devices.
 * 
 * Features:
 * - App installation capability
 * - Custom icons and splash screens
 * - Theme colors and branding
 * - Offline capability indicators
 * - Mobile optimization
 */

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Utsav Travels - Spiritual Journey Experiences',
    short_name: 'Utsav Travels',
    description: 'Explore the spiritual heritage of India with authentic travel experiences across Varanasi, Ayodhya, Rishikesh, and Kedarnath.',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#f59e0b',
    orientation: 'portrait-primary',
    scope: '/',
    
    // App categories for better discoverability
    categories: [
      'travel',
      'lifestyle',
      'entertainment',
      'navigation',
      'business'
    ],
    
    // Language and direction
    lang: 'en-IN',
    dir: 'ltr',
    
    // Icons for different platforms and sizes
    icons: [
      {
        src: '/icons/icon-72x72.png',
        sizes: '72x72',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/icons/icon-96x96.png',
        sizes: '96x96',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/icons/icon-128x128.png',
        sizes: '128x128',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/icons/icon-144x144.png',
        sizes: '144x144',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/icons/icon-152x152.png',
        sizes: '152x152',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/icons/icon-384x384.png',
        sizes: '384x384',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'
      },
      
      // Apple Touch Icons
      {
        src: '/icons/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'any'
      },
      
      // Monochrome icons for system themes
      {
        src: '/icons/icon-monochrome.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'monochrome'
      }
    ],
    
    // Shortcuts for quick actions
    shortcuts: [
      {
        name: 'Browse Destinations',
        short_name: 'Destinations',
        description: 'Explore sacred destinations across India',
        url: '/places',
        icons: [
          {
            src: '/icons/shortcut-destinations.png',
            sizes: '96x96',
            type: 'image/png'
          }
        ]
      },
      {
        name: 'View Packages',
        short_name: 'Packages',
        description: 'Browse travel packages and tours',
        url: '/packages',
        icons: [
          {
            src: '/icons/shortcut-packages.png',
            sizes: '96x96',
            type: 'image/png'
          }
        ]
      },
      {
        name: 'Contact Us',
        short_name: 'Contact',
        description: 'Get in touch with our travel experts',
        url: '/contact',
        icons: [
          {
            src: '/icons/shortcut-contact.png',
            sizes: '96x96',
            type: 'image/png'
          }
        ]
      },
      {
        name: 'WhatsApp Chat',
        short_name: 'WhatsApp',
        description: 'Chat with us on WhatsApp',
        url: 'https://wa.me/919876543210',
        icons: [
          {
            src: '/icons/shortcut-whatsapp.png',
            sizes: '96x96',
            type: 'image/png'
          }
        ]
      }
    ],
    
    // Screenshots for app store listings
    screenshots: [
      {
        src: '/screenshots/home-mobile.png',
        sizes: '390x844',
        type: 'image/png',
        form_factor: 'narrow',
        label: 'Home page showcasing spiritual destinations'
      },
      {
        src: '/screenshots/destinations-mobile.png',
        sizes: '390x844',
        type: 'image/png',
        form_factor: 'narrow',
        label: 'Browse sacred destinations across India'
      },
      {
        src: '/screenshots/packages-mobile.png',
        sizes: '390x844',
        type: 'image/png',
        form_factor: 'narrow',
        label: 'Explore curated travel packages'
      },
      {
        src: '/screenshots/home-desktop.png',
        sizes: '1920x1080',
        type: 'image/png',
        form_factor: 'wide',
        label: 'Desktop view of spiritual travel experiences'
      }
    ],
    
    // Protocol handlers for deep linking
    protocol_handlers: [
      {
        protocol: 'web+utsav',
        url: '/places/%s'
      }
    ],
    
    // Related applications
    related_applications: [
      {
        platform: 'play',
        url: 'https://play.google.com/store/apps/details?id=com.utsavtravels.app',
        id: 'com.utsavtravels.app'
      }
    ],
    
    // Prefer related applications (set to false to promote PWA)
    prefer_related_applications: false,
    
    // Edge side panel configuration
    edge_side_panel: {
      preferred_width: 400
    },
    
    // Launch handler for PWA
    launch_handler: {
      client_mode: ['navigate-existing', 'auto']
    },
    
    // File handlers (if app can handle specific file types)
    file_handlers: [
      {
        action: '/handle-files',
        accept: {
          'image/*': ['.jpg', '.jpeg', '.png', '.webp'],
          'application/pdf': ['.pdf']
        }
      }
    ],
    
    // Share target for sharing content to the app
    share_target: {
      action: '/share',
      method: 'POST',
      enctype: 'multipart/form-data',
      params: {
        title: 'title',
        text: 'text',
        url: 'url',
        files: [
          {
            name: 'files',
            accept: ['image/*', '.pdf']
          }
        ]
      }
    }
  };
}