import { MetadataRoute } from 'next';

/**
 * Production-ready PWA Manifest Configuration
 * Optimized for performance, security, and user experience
 */
export default function manifest(): {
  name: string;
  short_name: string;
  description: string;
  start_url: string;
  display: string;
  background_color: string;
  theme_color: string;
  orientation: string;
  scope: string;
  id: string;
  categories: string[];
  lang: string;
  dir: string;
  icons: ({ src: string; sizes: string; type: string; purpose: string } | {
    src: string;
    sizes: string;
    type: string;
    purpose: string
  } | { src: string; sizes: string; type: string; purpose: string } | {
    src: string;
    sizes: string;
    type: string;
    purpose: string
  } | { src: string; sizes: string; type: string; purpose: string } | {
    src: string;
    sizes: string;
    type: string;
    purpose: string
  } | { src: string; sizes: string; type: string; purpose: string } | {
    src: string;
    sizes: string;
    type: string;
    purpose: string
  } | { src: string; sizes: string; type: string; purpose: string } | {
    src: string;
    sizes: string;
    type: string;
    purpose: string
  } | { src: string; sizes: string; type: string; purpose: string } | {
    src: string;
    sizes: string;
    type: string;
    purpose: string
  })[];
  shortcuts: ({
    name: string;
    short_name: string;
    description: string;
    url: string;
    icons: { src: string; sizes: string; type: string }[]
  } | {
    name: string;
    short_name: string;
    description: string;
    url: string;
    icons: { src: string; sizes: string; type: string }[]
  } | {
    name: string;
    short_name: string;
    description: string;
    url: string;
    icons: { src: string; sizes: string; type: string }[]
  } | {
    name: string;
    short_name: string;
    description: string;
    url: string;
    icons: { src: string; sizes: string; type: string }[]
  })[];
  screenshots: ({ src: string; sizes: string; type: string; form_factor: string; label: string } | {
    src: string;
    sizes: string;
    type: string;
    form_factor: string;
    label: string
  } | { src: string; sizes: string; type: string; form_factor: string; label: string } | {
    src: string;
    sizes: string;
    type: string;
    form_factor: string;
    label: string
  } | { src: string; sizes: string; type: string; form_factor: string; label: string } | {
    src: string;
    sizes: string;
    type: string;
    form_factor: string;
    label: string
  })[];
  protocol_handlers: ({ protocol: string; url: string } | { protocol: string; url: string })[];
  related_applications: ({ platform: string; url: string; id: string } | {
    platform: string;
    url: string;
    id: string
  })[];
  prefer_related_applications: boolean;
  edge_side_panel: { preferred_width: number };
  launch_handler: { client_mode: (string)[] };
  file_handlers: {
    action: string;
    accept: { "image/jpeg": string[]; "image/png": string[]; "image/webp": string[]; "application/pdf": string[] }
  }[];
  share_target: {
    action: string;
    method: string;
    enctype: string;
    params: { title: string; text: string; url: string; files: { name: string; accept: string[] }[] }
  };
  display_override: (string)[];
  handle_links: string;
  note_taking: { new_note_url: string };
  scope_extensions: { origin: any }[]
} {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://utsavtravels.com';

  return {
    name: 'Utsav Travels - Sacred India Tours',
    short_name: 'Utsav Travels',
    description: 'Discover India\'s spiritual heritage with expert-guided tours to sacred destinations like Varanasi, Ayodhya, Rishikesh, and Kedarnath.',
    start_url: '/?utm_source=pwa',
    display: 'standalone',
    background_color: '#0f172a',
    theme_color: '#f59e0b',
    orientation: 'portrait-primary',
    scope: '/',
    id: 'com.utsavtravels.app',

    // Enhanced categories for better discoverability
    categories: [
      'travel',
      'lifestyle',
      'entertainment',
      'navigation',
      'business',
      'tourism'
    ],

    // Language and direction
    lang: 'en-IN',
    dir: 'ltr',

    // Comprehensive icon set for all platforms
    icons: [
      // Android Chrome icons
      {
        src: '/icons/icon-72x72.png',
        sizes: '72x72',
        type: 'image/png',
        purpose: 'maskable any'
      },
      {
        src: '/icons/icon-96x96.png',
        sizes: '96x96',
        type: 'image/png',
        purpose: 'maskable any'
      },
      {
        src: '/icons/icon-128x128.png',
        sizes: '128x128',
        type: 'image/png',
        purpose: 'maskable any'
      },
      {
        src: '/icons/icon-144x144.png',
        sizes: '144x144',
        type: 'image/png',
        purpose: 'maskable any'
      },
      {
        src: '/icons/icon-152x152.png',
        sizes: '152x152',
        type: 'image/png',
        purpose: 'maskable any'
      },
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable any'
      },
      {
        src: '/icons/icon-384x384.png',
        sizes: '384x384',
        type: 'image/png',
        purpose: 'maskable any'
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable any'
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
      },

      // Favicon variations
      {
        src: '/icons/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icons/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
        purpose: 'any'
      }
    ],

    // Quick action shortcuts
    shortcuts: [
      {
        name: 'Browse Sacred Destinations',
        short_name: 'Destinations',
        description: 'Explore sacred destinations across India',
        url: '/places?utm_source=pwa_shortcut',
        icons: [
          {
            src: '/icons/shortcut-destinations.png',
            sizes: '96x96',
            type: 'image/png'
          }
        ]
      },
      {
        name: 'View Tour Packages',
        short_name: 'Packages',
        description: 'Browse spiritual tour packages',
        url: '/packages?utm_source=pwa_shortcut',
        icons: [
          {
            src: '/icons/shortcut-packages.png',
            sizes: '96x96',
            type: 'image/png'
          }
        ]
      },
      {
        name: 'Contact Travel Experts',
        short_name: 'Contact',
        description: 'Get in touch with our travel experts',
        url: '/contact?utm_source=pwa_shortcut',
        icons: [
          {
            src: '/icons/shortcut-contact.png',
            sizes: '96x96',
            type: 'image/png'
          }
        ]
      },
      {
        name: 'WhatsApp Support',
        short_name: 'WhatsApp',
        description: 'Chat with us on WhatsApp',
        url: `https://wa.me/919876543210?text=Hi%20Utsav%20Travels!%20I'm%20interested%20in%20spiritual%20tour%20packages.`,
        icons: [
          {
            src: '/icons/shortcut-whatsapp.png',
            sizes: '96x96',
            type: 'image/png'
          }
        ]
      }
    ],

    // App store screenshots for better installation experience
    screenshots: [
      {
        src: '/screenshots/home-mobile.png',
        sizes: '390x844',
        type: 'image/png',
        form_factor: 'narrow',
        label: 'Home page showcasing spiritual destinations and tour packages'
      },
      {
        src: '/screenshots/destinations-mobile.png',
        sizes: '390x844',
        type: 'image/png',
        form_factor: 'narrow',
        label: 'Browse sacred destinations across India including temples and pilgrimage sites'
      },
      {
        src: '/screenshots/packages-mobile.png',
        sizes: '390x844',
        type: 'image/png',
        form_factor: 'narrow',
        label: 'Explore curated spiritual travel packages and yoga retreats'
      },
      {
        src: '/screenshots/contact-mobile.png',
        sizes: '390x844',
        type: 'image/png',
        form_factor: 'narrow',
        label: 'Easy contact options and customer support'
      },
      {
        src: '/screenshots/home-desktop.png',
        sizes: '1920x1080',
        type: 'image/png',
        form_factor: 'wide',
        label: 'Desktop view of spiritual travel experiences and destination guides'
      },
      {
        src: '/screenshots/packages-desktop.png',
        sizes: '1920x1080',
        type: 'image/png',
        form_factor: 'wide',
        label: 'Comprehensive tour package details and booking options'
      }
    ],

    // Deep linking support
    protocol_handlers: [
      {
        protocol: 'web+utsav',
        url: '/places/%s'
      },
      {
        protocol: 'web+spiritual-tour',
        url: '/packages/%s'
      }
    ],

    // Related native applications
    related_applications: [
      {
        platform: 'play',
        url: 'https://play.google.com/store/apps/details?id=com.utsavtravels.app',
        id: 'com.utsavtravels.app'
      },
      {
        platform: 'itunes',
        url: 'https://apps.apple.com/app/utsav-travels/id123456789',
        id: '123456789'
      }
    ],

    // Prefer PWA over native app
    prefer_related_applications: false,

    // Edge side panel configuration for Windows
    edge_side_panel: {
      preferred_width: 400
    },

    // Launch handler for better PWA experience
    launch_handler: {
      client_mode: ['navigate-existing', 'auto']
    },

    // File handling capabilities
    file_handlers: [
      {
        action: '/handle-files',
        accept: {
          'image/jpeg': ['.jpg', '.jpeg'],
          'image/png': ['.png'],
          'image/webp': ['.webp'],
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
    },

    // Display override for foldable devices
    display_override: ['window-controls-overlay', 'standalone', 'minimal-ui'],

    // Handle links within scope
    handle_links: 'preferred',

    // Note taking capabilities
    note_taking: {
      new_note_url: '/notes/new'
    },

    // Minimum viewport for proper display
    scope_extensions: [
      {
        origin: baseUrl
      }
    ]
  };
}