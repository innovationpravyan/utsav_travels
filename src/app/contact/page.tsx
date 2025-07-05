import { ContactForm } from "./contact-form";
import { MotionDiv, StaggerContainer } from "@/components/motion-div";
import { ParallaxSection } from "@/components/ui/parallax-section";
import { FloatingElements } from "@/components/ui/floating-elements";
import { GlassCard, InteractiveGlassCard, FloatingGlassCard } from "@/components/ui/glass-card";
import { Mail, Phone, MapPin, Clock, MessageCircle, Users, Headphones, Star } from "lucide-react";

export default function ContactPage() {
  const contactMethods = [
    {
      icon: Phone,
      title: "Call Us",
      subtitle: "Speak directly with our travel experts",
      value: "+91 98765 43210",
      href: "tel:+919876543210",
      color: "from-green-400 to-emerald-600",
      description: "Available 24/7 for immediate assistance"
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      subtitle: "Quick responses via WhatsApp",
      value: "Chat with us",
      href: "https://wa.me/919876543210",
      color: "from-green-500 to-green-700",
      description: "Fastest way to get your questions answered"
    },
    {
      icon: Mail,
      title: "Email Us",
      subtitle: "Detailed inquiries and planning",
      value: "info@utsavtravels.com",
      href: "mailto:info@utsavtravels.com",
      color: "from-blue-400 to-blue-600",
      description: "Perfect for detailed trip planning"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      subtitle: "Meet us in person",
      value: "Varanasi, Uttar Pradesh",
      href: "#",
      color: "from-purple-400 to-purple-600",
      description: "Located in the heart of spiritual India"
    }
  ];

  const stats = [
    { icon: Users, label: "Happy Travelers", value: "10,000+", color: "text-blue-400" },
    { icon: Star, label: "Average Rating", value: "4.9/5", color: "text-yellow-400" },
    { icon: Headphones, label: "Support Hours", value: "24/7", color: "text-green-400" },
    { icon: Clock, label: "Response Time", value: "< 1 Hour", color: "text-purple-400" },
  ];

  const supportFeatures = [
    {
      title: "Expert Travel Consultants",
      description: "Our team of experienced travel consultants have deep knowledge of spiritual destinations",
      icon: Users,
    },
    {
      title: "24/7 Customer Support",
      description: "Round-the-clock assistance for any queries or emergencies during your journey",
      icon: Headphones,
    },
    {
      title: "Personalized Itineraries",
      description: "Custom-designed travel plans tailored to your spiritual and cultural preferences",
      icon: Star,
    },
    {
      title: "Quick Response Guarantee",
      description: "We respond to all inquiries within 1 hour during business hours",
      icon: Clock,
    }
  ];

  return (
    <div className="animate-fade-in overflow-hidden">
      {/* Enhanced Hero Section */}
      <ParallaxSection
        height="80vh"
        className="relative flex items-center justify-center"
        layers={[
          {
            id: 'contact-bg',
            speed: -0.5,
            content: (
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900" />
            ),
          },
          {
            id: 'contact-pattern',
            speed: -0.3,
            content: (
              <div className="absolute inset-0 pattern-dots opacity-20" />
            ),
          },
          {
            id: 'contact-glow',
            speed: -0.1,
            content: (
              <div className="absolute inset-0">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-400/30 to-purple-600/30 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-pink-400/20 to-red-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
              </div>
            ),
          },
        ]}
        floatingElements
      >
        <div className="container mx-auto px-4 text-center relative z-10">
          <StaggerContainer>
            <MotionDiv preset="scaleIn" delay={0.2}>
              <FloatingGlassCard variant="gradient" size="sm" className="inline-block p-4 mb-6">
                <MessageCircle className="h-10 w-10 text-white" />
              </FloatingGlassCard>
            </MotionDiv>

            <MotionDiv preset="typewriter" delay={0.4}>
              <h1 className="font-headline text-6xl md:text-8xl font-bold text-white mb-6 leading-tight">
                Get in
                <span className="block bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
                  Touch
                </span>
              </h1>
            </MotionDiv>

            <MotionDiv preset="slideUp" delay={0.6}>
              <p className="mt-4 text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed">
                Ready to start your spiritual journey? Our travel experts are here to help you plan the perfect adventure across India's most sacred destinations.
              </p>
            </MotionDiv>

            {/* Floating Contact Stats */}
            <MotionDiv preset="fadeIn" delay={0.8}>
              <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
                {stats.map((stat, index) => (
                  <MotionDiv
                    key={stat.label}
                    preset="float"
                    delay={1 + index * 0.1}
                    hover
                    magnetic
                  >
                    <GlassCard variant="frosted" size="sm" className="p-4 text-center">
                      <stat.icon className={`h-6 w-6 ${stat.color} mx-auto mb-2`} />
                      <div className={`text-2xl font-bold ${stat.color}`}>
                        {stat.value}
                      </div>
                      <p className="text-white/70 text-xs">{stat.label}</p>
                    </GlassCard>
                  </MotionDiv>
                ))}
              </div>
            </MotionDiv>
          </StaggerContainer>
        </div>
      </ParallaxSection>

      {/* Contact Methods Section */}
      <ParallaxSection
        height="auto"
        className="section-padding"
        layers={[
          {
            id: 'methods-bg',
            speed: -0.2,
            content: (
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" />
            ),
          },
        ]}
      >
        <div className="container mx-auto px-4 relative z-10">
          <StaggerContainer className="text-center mb-16">
            <MotionDiv preset="slideUp" delay={0.2}>
              <h2 className="text-5xl md:text-6xl font-headline font-bold text-white mb-6">
                Multiple Ways to
                <span className="block text-gradient-alt">Connect</span>
              </h2>
            </MotionDiv>
            <MotionDiv preset="fadeIn" delay={0.4}>
              <p className="text-xl text-white/80 max-w-2xl mx-auto">
                Choose the communication method that works best for you
              </p>
            </MotionDiv>
          </StaggerContainer>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactMethods.map((method, index) => (
              <MotionDiv
                key={method.title}
                preset="scaleIn"
                delay={0.6 + index * 0.1}
                hover
                magnetic
              >
                <a href={method.href} target={method.href.startsWith('http') ? '_blank' : '_self'} rel="noopener noreferrer">
                  <InteractiveGlassCard
                    variant="frosted"
                    size="lg"
                    className="h-full p-8 text-center group cursor-pointer"
                  >
                    <div className={`mx-auto mb-6 p-4 rounded-full w-fit bg-gradient-to-br ${method.color} bg-opacity-20`}>
                      <method.icon className="h-8 w-8 text-white group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-2">{method.title}</h3>
                    <p className="text-white/70 text-sm mb-3">{method.subtitle}</p>
                    <p className={`font-semibold text-transparent bg-gradient-to-r ${method.color} bg-clip-text mb-3`}>
                      {method.value}
                    </p>
                    <p className="text-white/60 text-xs">{method.description}</p>

                    {/* Hover effect */}
                    <div className="absolute inset-0 rounded-inherit opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <div className={`absolute inset-0 rounded-inherit bg-gradient-to-br ${method.color} opacity-10`} />
                    </div>
                  </InteractiveGlassCard>
                </a>
              </MotionDiv>
            ))}
          </div>
        </div>
      </ParallaxSection>

      {/* Main Contact Section */}
      <ParallaxSection
        height="auto"
        className="section-padding"
        layers={[
          {
            id: 'form-bg',
            speed: -0.3,
            content: (
              <div className="absolute inset-0 bg-gradient-to-br from-rose-900 via-pink-900 to-purple-900" />
            ),
          },
        ]}
        floatingElements
      >
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Left Column - Information */}
            <StaggerContainer>
              <MotionDiv preset="slideUp" delay={0.2}>
                <div className="flex items-center gap-3 mb-6">
                  <FloatingGlassCard variant="gradient" size="sm" className="p-3">
                    <Phone className="h-6 w-6 text-white" />
                  </FloatingGlassCard>
                  <span className="text-primary font-semibold text-lg">Let's Talk</span>
                </div>
              </MotionDiv>

              <MotionDiv preset="fadeIn" delay={0.4}>
                <h2 className="font-headline text-4xl md:text-5xl mb-8 text-white leading-tight">
                  Plan Your Perfect
                  <span className="block text-gradient">Spiritual Journey</span>
                </h2>
              </MotionDiv>

              <MotionDiv preset="slideUp" delay={0.6}>
                <p className="text-white/80 mb-8 text-lg leading-relaxed">
                  We are here to help you plan your perfect trip to the sacred cities of India. 
                  Fill out the form, and one of our travel experts will call you back shortly to 
                  discuss your requirements. You can also reach us directly via the contact details below.
                </p>
              </MotionDiv>

              <MotionDiv preset="fadeIn" delay={0.8}>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <GlassCard variant="subtle" size="sm" className="p-3">
                      <Phone className="h-6 w-6 text-primary" />
                    </GlassCard>
                    <div>
                      <p className="text-white/70 text-sm">Call Us</p>
                      <a href="tel:+919876543210" className="text-white hover:text-primary transition-colors text-lg font-medium">
                        +91 98765 43210
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <GlassCard variant="subtle" size="sm" className="p-3">
                      <Mail className="h-6 w-6 text-primary" />
                    </GlassCard>
                    <div>
                      <p className="text-white/70 text-sm">Email Us</p>
                      <a href="mailto:info@utsavtravels.com" className="text-white hover:text-primary transition-colors text-lg font-medium">
                        info@utsavtravels.com
                      </a>
                    </div>
                  </div>
                </div>
              </MotionDiv>

              {/* Support Features */}
              <MotionDiv preset="slideUp" delay={1.0}>
                <div className="mt-12 space-y-6">
                  <h3 className="text-2xl font-bold text-white mb-6">Why Choose Our Support?</h3>
                  <div className="grid gap-4">
                    {supportFeatures.map((feature, index) => (
                      <MotionDiv
                        key={feature.title}
                        preset="slideLeft"
                        delay={1.2 + index * 0.1}
                        hover
                      >
                        <GlassCard variant="subtle" className="p-4 flex items-start gap-4">
                          <div className="p-2 bg-primary/20 rounded-lg">
                            <feature.icon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="text-white font-semibold mb-1">{feature.title}</h4>
                            <p className="text-white/70 text-sm">{feature.description}</p>
                          </div>
                        </GlassCard>
                      </MotionDiv>
                    ))}
                  </div>
                </div>
              </MotionDiv>
            </StaggerContainer>

            {/* Right Column - Contact Form */}
            <MotionDiv preset="scaleIn" delay={0.8} hover magnetic>
              <div className="relative">
                <InteractiveGlassCard
                  variant="frosted"
                  size="lg"
                  className="p-0 overflow-hidden"
                >
                  {/* Form Header */}
                  <div className="p-8 pb-0">
                    <div className="flex items-center gap-3 mb-4">
                      <GlassCard variant="gradient" size="sm" className="p-2">
                        <MessageCircle className="h-5 w-5 text-white" />
                      </GlassCard>
                      <h3 className="text-xl font-bold text-white">Request a Call Back</h3>
                    </div>
                    <p className="text-white/70 text-sm mb-6">
                      Leave your details and we'll call you back to plan your trip.
                    </p>
                  </div>

                  {/* Contact Form */}
                  <div className="p-8 pt-0">
                    <ContactForm />
                  </div>

                  {/* Floating decorative elements */}
                  <div className="absolute top-4 right-4 opacity-30">
                    <div className="w-2 h-2 bg-white rounded-full animate-ping" />
                  </div>
                  <div className="absolute bottom-6 left-4 opacity-20">
                    <div className="w-1 h-1 bg-primary rounded-full animate-ping" style={{ animationDelay: '1s' }} />
                  </div>
                </InteractiveGlassCard>

                {/* Floating trust indicators */}
                <div className="absolute -top-4 -right-4 z-10">
                  <FloatingGlassCard variant="colored" size="sm" className="p-3">
                    <div className="text-center">
                      <Star className="h-5 w-5 text-yellow-400 mx-auto mb-1" />
                      <div className="text-white text-xs font-bold">Trusted</div>
                    </div>
                  </FloatingGlassCard>
                </div>

                <div className="absolute -bottom-4 -left-4 z-10">
                  <FloatingGlassCard variant="gradient" size="sm" className="p-3">
                    <div className="text-center">
                      <Clock className="h-5 w-5 text-green-400 mx-auto mb-1" />
                      <div className="text-white text-xs font-bold">Fast Reply</div>
                    </div>
                  </FloatingGlassCard>
                </div>
              </div>
            </MotionDiv>
          </div>
        </div>
      </ParallaxSection>

      {/* Trust Section */}
      <ParallaxSection
        height="auto"
        className="py-20"
        layers={[
          {
            id: 'trust-bg',
            speed: -0.1,
            content: (
              <div className="absolute inset-0 bg-gradient-to-br from-black via-slate-900 to-black" />
            ),
          },
        ]}
      >
        <div className="container mx-auto px-4 text-center relative z-10">
          <StaggerContainer>
            <MotionDiv preset="scaleIn" delay={0.2}>
              <h2 className="text-4xl md:text-5xl font-headline font-bold text-white mb-6">
                Trusted by Thousands
              </h2>
            </MotionDiv>
            
            <MotionDiv preset="fadeIn" delay={0.4}>
              <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto">
                Join thousands of satisfied travelers who have experienced the magic of India with us
              </p>
            </MotionDiv>
            
            <MotionDiv preset="elastic" delay={0.6}>
              <InteractiveGlassCard
                variant="gradient"
                animation="hover"
                glow
                className="inline-block px-12 py-6 cursor-pointer group"
              >
                <span className="text-white font-bold text-xl flex items-center gap-3">
                  Start Your Journey Today
                  <MapPin className="h-6 w-6 group-hover:scale-110 transition-transform" />
                </span>
              </InteractiveGlassCard>
            </MotionDiv>
          </StaggerContainer>
        </div>
      </ParallaxSection>
    </div>
  );
}