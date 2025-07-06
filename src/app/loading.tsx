import { Loader2, MapPin, Calendar, Star } from 'lucide-react';

/**
 * Global Loading Component
 * 
 * This component provides a consistent loading experience across the application.
 * It includes animated elements and progress indicators to engage users during loading.
 * 
 * Features:
 * - Animated loading spinner
 * - Floating elements for visual interest
 * - Responsive design
 * - Branded loading experience
 * - Smooth animations
 */

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center relative overflow-hidden">
      {/* Main Loading Container */}
      <div className="text-center z-10 px-4">
        {/* Brand Logo/Icon */}
        <div className="mb-8 relative">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mb-4 shadow-2xl animate-pulse">
            <MapPin className="w-10 h-10 text-white" />
          </div>
          
          {/* Loading Spinner Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-24 h-24 text-primary/50 animate-spin" strokeWidth={1} />
          </div>
        </div>

        {/* Loading Text */}
        <div className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-headline font-bold text-white">
            Loading Your
            <span className="block bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
              Journey
            </span>
          </h2>
          
          <p className="text-white/70 text-lg max-w-md mx-auto">
            Preparing an amazing spiritual experience for you...
          </p>
        </div>

        {/* Loading Progress Dots */}
        <div className="mt-8 flex justify-center space-x-2">
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce" />
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
        </div>

        {/* Loading Stats */}
        <div className="mt-12 grid grid-cols-3 gap-4 max-w-md mx-auto">
          <div className="text-center opacity-60 animate-pulse">
            <Calendar className="w-6 h-6 text-primary mx-auto mb-2" />
            <div className="text-white/50 text-sm">Planning</div>
          </div>
          <div className="text-center opacity-80 animate-pulse" style={{ animationDelay: '0.5s' }}>
            <MapPin className="w-6 h-6 text-accent mx-auto mb-2" />
            <div className="text-white/50 text-sm">Mapping</div>
          </div>
          <div className="text-center opacity-60 animate-pulse" style={{ animationDelay: '1s' }}>
            <Star className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
            <div className="text-white/50 text-sm">Curating</div>
          </div>
        </div>
      </div>

      {/* Floating Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Large floating circles */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-400/10 to-purple-600/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-pink-400/10 to-red-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-gradient-to-r from-yellow-400/10 to-orange-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />

        {/* Small floating particles */}
        <div className="absolute top-20 left-20 w-4 h-4 bg-white/20 rounded-full animate-ping" />
        <div className="absolute top-32 right-32 w-2 h-2 bg-primary/30 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 left-1/3 w-3 h-3 bg-accent/20 rounded-full animate-ping" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-32 right-20 w-2 h-2 bg-yellow-400/30 rounded-full animate-ping" style={{ animationDelay: '3s' }} />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/50 pointer-events-none" />

      {/* Progressive Loading Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
        <div className="h-full bg-gradient-to-r from-primary via-accent to-primary bg-size-200 animate-shimmer" />
      </div>
    </div>
  );
}

/**
 * Custom CSS classes used (add to globals.css if not already present):
 * 
 * .animate-float {
 *   animation: float 6s ease-in-out infinite;
 * }
 * 
 * .animate-shimmer {
 *   animation: shimmer 2s ease-in-out infinite;
 * }
 * 
 * .bg-grid-pattern {
 *   background-image: linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
 *                     linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px);
 *   background-size: 20px 20px;
 * }
 * 
 * .bg-size-200 {
 *   background-size: 200% 100%;
 * }
 * 
 * @keyframes float {
 *   0%, 100% { transform: translateY(0px) rotate(0deg); }
 *   50% { transform: translateY(-20px) rotate(5deg); }
 * }
 * 
 * @keyframes shimmer {
 *   0% { background-position: -200% 0; }
 *   100% { background-position: 200% 0; }
 * }
 */