import { ContactForm } from "./contact-form";
import { OptimizedMotionDiv, StaggerContainer } from "@/components/optimized-motion-div";
import { GlassCard } from "@/components/ui/glass-card";
import { Mail, Phone, MapPin, Clock, MessageCircle, Users, Headphones, Star } from "lucide-react";
import { CONTACT_METHODS, COMPANY_INFO } from "@/utils/utils";

// Dynamic icon mapping
const iconMap = {
  Phone,
  MessageCircle,
  Mail,
  MapPin,
};

export default function OptimizedContactPage() {
  const stats = [
    { icon: Users, label: "Happy Travelers", value: COMPANY_INFO.stats.happyTravelers, color: "text-blue-400" },
    { icon: Star, label: "Average Rating", value: COMPANY_INFO.stats.rating, color: "text-yellow-400" },
    { icon: Headphones, label: "Support Hours", value: COMPANY_INFO.stats.supportHours, color: "text-green-400" },
    { icon: Clock, label: "Response Time", value: COMPANY_INFO.stats.responseTime, color: "text-purple-400" },
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
        <section className="relative h-[80vh] flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
          <div className="absolute inset-0 opacity-20">
            <div className="w-full h-full bg-[radial-gradient(circle_at_1px_1px,_white_1px,_transparent_1px)] bg-[length:24px_24px]" />
          </div>

          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-400/30 to-purple-600/30 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-pink-400/20 to-red-500/20 rounded-full blur-3xl animate-pulse animation-delay-2000" />
          </div>

          <div className="container mx-auto px-4 text-center relative z-10">
            <StaggerContainer>
              <OptimizedMotionDiv preset="scaleIn">
                <GlassCard className="inline-block p-4 mb-6">
                  <MessageCircle className="h-10 w-10 text-white" />
                </GlassCard>
              </OptimizedMotionDiv>

              <OptimizedMotionDiv preset="slideUp">
                <h1 className="font-headline text-6xl md:text-8xl font-bold text-white mb-6 leading-tight">
                  Get in
                  <span className="block bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
                  Touch
                </span>
                </h1>
              </OptimizedMotionDiv>

              <OptimizedMotionDiv preset="slideUp">
                <p className="mt-4 text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed">
                  Ready to start your spiritual journey? Our travel experts are here to help you plan the perfect adventure across India's most sacred destinations.
                </p>
              </OptimizedMotionDiv>

              <OptimizedMotionDiv preset="fadeIn">
                <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
                  {stats.map((stat, index) => (
                      <OptimizedMotionDiv
                          key={stat.label}
                          preset="slideUp"
                          hover
                      >
                        <GlassCard className="p-4 text-center">
                          <stat.icon className={`h-6 w-6 ${stat.color} mx-auto mb-2`} />
                          <div className={`text-2xl font-bold ${stat.color}`}>
                            {stat.value}
                          </div>
                          <p className="text-white/70 text-xs">{stat.label}</p>
                        </GlassCard>
                      </OptimizedMotionDiv>
                  ))}
                </div>
              </OptimizedMotionDiv>
            </StaggerContainer>
          </div>
        </section>

        {/* Contact Methods Section */}
        <section className="section-padding bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative">
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <OptimizedMotionDiv preset="slideUp">
                <h2 className="text-5xl md:text-6xl font-headline font-bold text-white mb-6">
                  Multiple Ways to
                  <span className="block text-gradient-alt">Connect</span>
                </h2>
              </OptimizedMotionDiv>
              <OptimizedMotionDiv preset="fadeIn">
                <p className="text-xl text-white/80 max-w-2xl mx-auto">
                  Choose the communication method that works best for you
                </p>
              </OptimizedMotionDiv>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {CONTACT_METHODS.map((method, index) => {
                const IconComponent = iconMap[method.icon as keyof typeof iconMap];

                return (
                    <OptimizedMotionDiv
                        key={method.title}
                        preset="scaleIn"
                        hover
                    >
                      <a href={method.href} target={method.href.startsWith('http') ? '_blank' : '_self'} rel="noopener noreferrer">
                        <GlassCard className="h-full p-8 text-center group cursor-pointer hover:scale-105 transition-all duration-200">
                          <div className={`mx-auto mb-6 p-4 rounded-full w-fit bg-gradient-to-br ${method.color} bg-opacity-20`}>
                            <IconComponent className="h-8 w-8 text-white group-hover:scale-110 transition-transform duration-200" />
                          </div>

                          <h3 className="text-xl font-bold text-white mb-2">{method.title}</h3>
                          <p className="text-white/70 text-sm mb-3">{method.subtitle}</p>
                          <p className={`font-semibold text-transparent bg-gradient-to-r ${method.color} bg-clip-text mb-3`}>
                            {method.value}
                          </p>
                          <p className="text-white/60 text-xs">{method.description}</p>

                          <div className="absolute inset-0 rounded-inherit opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                            <div className={`absolute inset-0 rounded-inherit bg-gradient-to-br ${method.color} opacity-10`} />
                          </div>
                        </GlassCard>
                      </a>
                    </OptimizedMotionDiv>
                );
              })}
            </div>
          </div>
        </section>

        {/* Main Contact Section */}
        <section className="section-padding bg-gradient-to-br from-rose-900 via-pink-900 to-purple-900 relative">
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              {/* Left Column - Information */}
              <StaggerContainer>
                <OptimizedMotionDiv preset="slideUp">
                  <div className="flex items-center gap-3 mb-6">
                    <GlassCard className="p-3">
                      <Phone className="h-6 w-6 text-white" />
                    </GlassCard>
                    <span className="text-primary font-semibold text-lg">Let's Talk</span>
                  </div>
                </OptimizedMotionDiv>

                <OptimizedMotionDiv preset="fadeIn">
                  <h2 className="font-headline text-4xl md:text-5xl mb-8 text-white leading-tight">
                    Plan Your Perfect
                    <span className="block text-gradient">Spiritual Journey</span>
                  </h2>
                </OptimizedMotionDiv>

                <OptimizedMotionDiv preset="slideUp">
                  <p className="text-white/80 mb-8 text-lg leading-relaxed">
                    We are here to help you plan your perfect trip to the sacred cities of India.
                    Fill out the form, and one of our travel experts will call you back shortly to
                    discuss your requirements. You can also reach us directly via the contact details below.
                  </p>
                </OptimizedMotionDiv>

                <OptimizedMotionDiv preset="fadeIn">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <GlassCard className="p-3">
                        <Phone className="h-6 w-6 text-primary" />
                      </GlassCard>
                      <div>
                        <p className="text-white/70 text-sm">Call Us</p>
                        <a href={`tel:${COMPANY_INFO.contact.phone}`} className="text-white hover:text-primary transition-colors text-lg font-medium">
                          {COMPANY_INFO.contact.phoneDisplay}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <GlassCard className="p-3">
                        <Mail className="h-6 w-6 text-primary" />
                      </GlassCard>
                      <div>
                        <p className="text-white/70 text-sm">Email Us</p>
                        <a href={`mailto:${COMPANY_INFO.contact.email}`} className="text-white hover:text-primary transition-colors text-lg font-medium">
                          {COMPANY_INFO.contact.email}
                        </a>
                      </div>
                    </div>
                  </div>
                </OptimizedMotionDiv>

                <OptimizedMotionDiv preset="slideUp">
                  <div className="mt-12 space-y-6">
                    <h3 className="text-2xl font-bold text-white mb-6">Why Choose Our Support?</h3>
                    <div className="grid gap-4">
                      {supportFeatures.map((feature, index) => (
                          <OptimizedMotionDiv
                              key={feature.title}
                              preset="slideLeft"
                              hover
                          >
                            <GlassCard className="p-4 flex items-start gap-4">
                              <div className="p-2 bg-primary/20 rounded-lg">
                                <feature.icon className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <h4 className="text-white font-semibold mb-1">{feature.title}</h4>
                                <p className="text-white/70 text-sm">{feature.description}</p>
                              </div>
                            </GlassCard>
                          </OptimizedMotionDiv>
                      ))}
                    </div>
                  </div>
                </OptimizedMotionDiv>
              </StaggerContainer>

              {/* Right Column - Contact Form */}
              <OptimizedMotionDiv preset="scaleIn" hover>
                <div className="relative">
                  <GlassCard className="p-0 overflow-hidden">
                    <div className="p-8 pb-0">
                      <div className="flex items-center gap-3 mb-4">
                        <GlassCard className="p-2">
                          <MessageCircle className="h-5 w-5 text-white" />
                        </GlassCard>
                        <h3 className="text-xl font-bold text-white">Request a Call Back</h3>
                      </div>
                      <p className="text-white/70 text-sm mb-6">
                        Leave your details and we'll call you back to plan your trip.
                      </p>
                    </div>

                    <div className="p-8 pt-0">
                      <ContactForm />
                    </div>

                    <div className="absolute top-4 right-4 opacity-30">
                      <div className="w-2 h-2 bg-white rounded-full animate-ping" />
                    </div>
                    <div className="absolute bottom-6 left-4 opacity-20">
                      <div className="w-1 h-1 bg-primary rounded-full animate-ping animation-delay-1000" />
                    </div>
                  </GlassCard>

                  <div className="absolute -top-4 -right-4 z-10">
                    <GlassCard className="p-3">
                      <div className="text-center">
                        <Star className="h-5 w-5 text-yellow-400 mx-auto mb-1" />
                        <div className="text-white text-xs font-bold">Trusted</div>
                      </div>
                    </GlassCard>
                  </div>

                  <div className="absolute -bottom-4 -left-4 z-10">
                    <GlassCard className="p-3">
                      <div className="text-center">
                        <Clock className="h-5 w-5 text-green-400 mx-auto mb-1" />
                        <div className="text-white text-xs font-bold">Fast Reply</div>
                      </div>
                    </GlassCard>
                  </div>
                </div>
              </OptimizedMotionDiv>
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-20 bg-gradient-to-br from-black via-slate-900 to-black relative">
          <div className="container mx-auto px-4 text-center relative z-10">
            <StaggerContainer>
              <OptimizedMotionDiv preset="scaleIn">
                <h2 className="text-4xl md:text-5xl font-headline font-bold text-white mb-6">
                  Trusted by Thousands
                </h2>
              </OptimizedMotionDiv>

              <OptimizedMotionDiv preset="fadeIn">
                <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto">
                  Join thousands of satisfied travelers who have experienced the magic of India with us
                </p>
              </OptimizedMotionDiv>

              <OptimizedMotionDiv preset="slideUp">
                <GlassCard className="inline-block px-12 py-6 cursor-pointer group hover:scale-105 transition-all duration-200">
                <span className="text-white font-bold text-xl flex items-center gap-3">
                  Start Your Journey Today
                  <MapPin className="h-6 w-6 group-hover:scale-110 transition-transform" />
                </span>
                </GlassCard>
              </OptimizedMotionDiv>
            </StaggerContainer>
          </div>
        </section>
      </div>
  );
}