// src/app/about/page.tsx

import { Target, Heart, MapPin, Users, Award, Sparkles, Globe, Star } from 'lucide-react';
import Image from 'next/image';
import { AboutVideoHero } from '@/components/optimized-video-hero';
import Link from 'next/link';
import { OptimizedMotionDiv, StaggerContainer } from '@/components/optimized-motion-div';
import { getPlaces, getPackages } from '@/lib/data';
import { GlassCard } from '@/components/ui/glass-card';
import { Suspense } from 'react';

export default async function OptimizedAboutPage() {
  // Optimized data loading with error handling
  let topPlaces: any[] = [];
  let topPackages: any[] = [];
  let galleryItems: any[] = [];

  try {
    const [places, packages] = await Promise.all([
      getPlaces().catch(() => []),
      getPackages().catch(() => [])
    ]);

    topPlaces = places?.slice(0, 5) || [];
    topPackages = packages?.slice(0, 5) || [];
    galleryItems = [...topPlaces, ...topPackages]
        .sort(() => 0.5 - Math.random())
        .slice(0, 10);
  } catch (error) {
    console.error('Error loading data for about page:', error);
  }

  // Safe team members data
  const teamMembers = [
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
  ];

  // Safe journey milestones
  const milestones = [
    {
      year: "2019",
      title: "Company Founded",
      description: "Started with a vision to promote spiritual tourism",
      icon: Sparkles,
      color: "from-blue-400 to-blue-600"
    },
    {
      year: "2020",
      title: "First 1000 Travelers",
      description: "Reached our first major milestone of happy customers",
      icon: Users,
      color: "from-green-400 to-green-600"
    },
    {
      year: "2021",
      title: "Award Recognition",
      description: "Received excellence award for spiritual tourism",
      icon: Award,
      color: "from-yellow-400 to-yellow-600"
    },
    {
      year: "2022",
      title: "50+ Destinations",
      description: "Expanded to cover all major spiritual sites",
      icon: MapPin,
      color: "from-purple-400 to-purple-600"
    },
    {
      year: "2023",
      title: "Digital Innovation",
      description: "Launched advanced booking and experience platform",
      icon: Globe,
      color: "from-pink-400 to-pink-600"
    }
  ];

  return (
      <div className="animate-fade-in">
        {/* Video Hero Banner */}
        <Suspense fallback={
          <div className="h-[80vh] w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
            <div className="text-white text-xl animate-pulse">Loading about us...</div>
          </div>
        }>
          <AboutVideoHero
              videoSrc="/videos/about-hero.webm"
              fallbackImage="https://images.pexels.com/photos/3401403/pexels-photo-3401403.jpeg?w=1920&h=1080&fit=crop"
          />
        </Suspense>

        {/* Who We Are Section */}
        <section className="section-padding bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative">
          <div className="absolute inset-0 opacity-5">
            <div className="w-full h-full bg-[radial-gradient(circle_at_1px_1px,_white_1px,_transparent_1px)] bg-[length:24px_24px]" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <StaggerContainer>
                <OptimizedMotionDiv preset="slideUp">
                  <div className="flex items-center gap-3 mb-6">
                    <GlassCard className="p-3">
                      <Heart className="h-6 w-6 text-primary" />
                    </GlassCard>
                    <span className="text-primary font-semibold text-lg">Our Story</span>
                  </div>
                </OptimizedMotionDiv>

                <OptimizedMotionDiv preset="slideUp">
                  <h2 className="font-headline text-5xl md:text-6xl mb-8 text-white leading-tight">
                    Who We
                    <span className="block text-gradient-alt">Are</span>
                  </h2>
                </OptimizedMotionDiv>

                <OptimizedMotionDiv preset="fadeIn">
                  <div className="space-y-6 text-lg text-white/80 leading-relaxed">
                    <p>
                      Utsav Travels is a premier travel showcase dedicated to unveiling the spiritual, cultural, and historical richness of India's most sacred cities. We were born from a passion for heritage and a desire to connect travelers with the authentic soul of Varanasi, Ayodhya, Rishikesh, and Kedarnath.
                    </p>
                    <p>
                      Our initiative focuses on promoting sustainable and immersive tourism, ensuring that every journey is not just a trip, but a profound experience that respects local traditions and supports communities.
                    </p>
                  </div>
                </OptimizedMotionDiv>

                <OptimizedMotionDiv preset="slideUp">
                  <div className="flex flex-wrap gap-4 mt-8">
                    {['Authentic Experiences', 'Local Expertise', 'Spiritual Focus', 'Cultural Immersion'].map((feature, index) => (
                        <OptimizedMotionDiv
                            key={feature}
                            preset="scaleIn"
                            hover
                        >
                          <GlassCard className="px-4 py-2">
                            <span className="text-white/90 text-sm font-medium">{feature}</span>
                          </GlassCard>
                        </OptimizedMotionDiv>
                    ))}
                  </div>
                </OptimizedMotionDiv>
              </StaggerContainer>

              <OptimizedMotionDiv preset="scaleIn" hover>
                <div className="relative group">
                  <GlassCard className="p-8 overflow-hidden">
                    <div className="relative">
                      <Image
                          src="https://images.pexels.com/photos/3401403/pexels-photo-3401403.jpeg?w=600&h=400"
                          alt="Spiritual heritage of India"
                          width={600}
                          height={400}
                          className="rounded-lg shadow-2xl transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                      />

                      <div className="absolute -top-4 -right-4">
                        <GlassCard className="p-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-white">5+</div>
                            <div className="text-white/70 text-xs">Years</div>
                          </div>
                        </GlassCard>
                      </div>

                      <div className="absolute -bottom-4 -left-4">
                        <GlassCard className="p-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-white">10K+</div>
                            <div className="text-white/70 text-xs">Travelers</div>
                          </div>
                        </GlassCard>
                      </div>
                    </div>
                  </GlassCard>
                </div>
              </OptimizedMotionDiv>
            </div>
          </div>
        </section>

        {/* Core Values Section */}
        <section className="section-padding bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative">
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <OptimizedMotionDiv preset="slideUp">
                <h2 className="text-5xl md:text-6xl font-headline font-bold text-white mb-6">
                  Our Core
                  <span className="block text-gradient">Values</span>
                </h2>
              </OptimizedMotionDiv>
              <OptimizedMotionDiv preset="fadeIn">
                <p className="text-xl text-white/80 max-w-3xl mx-auto">
                  The principles that guide every journey we create
                </p>
              </OptimizedMotionDiv>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <OptimizedMotionDiv preset="slideUp" hover>
                <GlassCard className="h-full p-8 group">
                  <div className="text-center">
                    <div className="mx-auto mb-6 p-4 bg-gradient-to-br from-blue-400/20 to-blue-600/20 rounded-full w-fit group-hover:scale-110 transition-transform duration-200">
                      <Target className="h-10 w-10 text-blue-400" />
                    </div>
                    <h3 className="font-headline text-2xl text-white mb-4">Mission & Vision</h3>
                    <p className="text-white/70 leading-relaxed">
                      Our mission is to be the leading platform for heritage tourism in the region, showcasing its spiritual depth to the world. We envision a future where every traveler leaves with a deeper understanding and appreciation of this ancient land.
                    </p>
                  </div>
                </GlassCard>
              </OptimizedMotionDiv>

              <OptimizedMotionDiv preset="slideUp" hover>
                <GlassCard className="h-full p-8 group">
                  <div className="text-center">
                    <div className="mx-auto mb-6 p-4 bg-gradient-to-br from-red-400/20 to-red-600/20 rounded-full w-fit group-hover:scale-110 transition-transform duration-200">
                      <Heart className="h-10 w-10 text-red-400" />
                    </div>
                    <h3 className="font-headline text-2xl text-white mb-4">Why Choose Us</h3>
                    <p className="text-white/70 leading-relaxed">
                      With our deep local expertise, we offer authentic, off-the-beaten-path experiences. Our seamless WhatsApp contact system and commitment to personalized service make planning your spiritual journey effortless and enjoyable.
                    </p>
                  </div>
                </GlassCard>
              </OptimizedMotionDiv>

              <OptimizedMotionDiv preset="slideUp" hover>
                <GlassCard className="h-full p-8 group">
                  <div className="text-center">
                    <div className="mx-auto mb-6 p-4 bg-gradient-to-br from-green-400/20 to-green-600/20 rounded-full w-fit group-hover:scale-110 transition-transform duration-200">
                      <MapPin className="h-10 w-10 text-green-400" />
                    </div>
                    <h3 className="font-headline text-2xl text-white mb-4">Regions We Serve</h3>
                    <div className="text-white/70 leading-relaxed">
                      <p className="mb-4">We specialize exclusively in the spiritual triangle of Uttar Pradesh, focusing our expertise on providing unparalleled travel experiences in:</p>
                      <ul className="list-disc list-inside space-y-2 text-left">
                        <li>Varanasi</li>
                        <li>Ayodhya</li>
                        <li>Prayagraj</li>
                        <li>Rishikesh</li>
                        <li>Kedarnath</li>
                      </ul>
                    </div>
                  </div>
                </GlassCard>
              </OptimizedMotionDiv>
            </div>
          </div>
        </section>

        {/* Journey Timeline Section */}
        <section className="section-padding bg-gradient-to-br from-black via-slate-900 to-black relative">
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <OptimizedMotionDiv preset="slideUp">
                <h2 className="text-5xl md:text-6xl font-headline font-bold text-white mb-6">
                  Our
                  <span className="block text-gradient-alt">Journey</span>
                </h2>
              </OptimizedMotionDiv>
              <OptimizedMotionDiv preset="fadeIn">
                <p className="text-xl text-white/80 max-w-3xl mx-auto">
                  Milestones that shaped our path to becoming a trusted spiritual travel partner
                </p>
              </OptimizedMotionDiv>
            </div>

            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 w-px h-full bg-gradient-to-b from-primary via-accent to-primary opacity-30"></div>

              <div className="space-y-16">
                {milestones.map((milestone, index) => (
                    <OptimizedMotionDiv
                        key={milestone.year}
                        preset="slideUp"
                        className={`flex items-center ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
                    >
                      <div className={`w-full lg:w-5/12 ${index % 2 === 0 ? 'lg:pr-8' : 'lg:pl-8'}`}>
                        <GlassCard className="p-8">
                          <div className={`flex items-center gap-4 mb-4 ${index % 2 === 0 ? '' : 'lg:flex-row-reverse lg:text-right'}`}>
                            <div className={`p-3 bg-gradient-to-br ${milestone.color} rounded-full`}>
                              <milestone.icon className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <div className="text-2xl font-bold text-primary">{milestone.year}</div>
                              <h3 className="text-xl font-semibold text-white">{milestone.title}</h3>
                            </div>
                          </div>
                          <p className={`text-white/70 ${index % 2 === 0 ? '' : 'lg:text-right'}`}>
                            {milestone.description}
                          </p>
                        </GlassCard>
                      </div>

                      {/* Timeline node */}
                      <div className="hidden lg:flex w-2/12 justify-center">
                        <div className="w-6 h-6 bg-gradient-to-br from-primary to-accent rounded-full border-4 border-background shadow-lg"></div>
                      </div>

                      <div className="hidden lg:block w-5/12"></div>
                    </OptimizedMotionDiv>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="section-padding bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative">
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <OptimizedMotionDiv preset="slideUp">
                <h2 className="text-5xl md:text-6xl font-headline font-bold text-white mb-6">
                  Meet Our
                  <span className="block text-gradient">Team</span>
                </h2>
              </OptimizedMotionDiv>
              <OptimizedMotionDiv preset="fadeIn">
                <p className="text-xl text-white/80 max-w-3xl mx-auto">
                  Passionate experts dedicated to creating unforgettable spiritual experiences
                </p>
              </OptimizedMotionDiv>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                  <OptimizedMotionDiv
                      key={member.name}
                      preset="scaleIn"
                      hover
                  >
                    <GlassCard className="p-8 text-center group">
                      <div className="relative mb-6">
                        <div className="w-32 h-32 mx-auto rounded-full overflow-hidden group-hover:scale-110 transition-transform duration-200">
                          <Image
                              src={member.image}
                              alt={member.name}
                              width={128}
                              height={128}
                              className="w-full h-full object-cover"
                              loading="lazy"
                          />
                        </div>
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                          <GlassCard className="px-3 py-1">
                            <Star className="h-4 w-4 text-yellow-400" />
                          </GlassCard>
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-white mb-2">{member.name}</h3>
                      <p className="text-primary font-medium mb-4">{member.role}</p>
                      <p className="text-white/70 text-sm mb-6">{member.bio}</p>

                      <div className="flex flex-wrap gap-2 justify-center">
                        {member.expertise.map((skill) => (
                            <GlassCard key={skill} className="px-3 py-1">
                              <span className="text-white/80 text-xs">{skill}</span>
                            </GlassCard>
                        ))}
                      </div>
                    </GlassCard>
                  </OptimizedMotionDiv>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Gallery Section */}
        <section className="section-padding bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative">
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <OptimizedMotionDiv preset="slideUp">
                <h2 className="text-5xl md:text-6xl font-headline font-bold text-white mb-6">
                  Our
                  <span className="block text-gradient-alt">Gallery</span>
                </h2>
              </OptimizedMotionDiv>
              <OptimizedMotionDiv preset="fadeIn">
                <p className="text-xl text-white/80 max-w-3xl mx-auto">
                  Capturing the essence of spiritual India through our travelers' journeys
                </p>
              </OptimizedMotionDiv>
            </div>

            {galleryItems.length > 0 ? (
                <div className="columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
                  {galleryItems.map((item, index) => (
                      <OptimizedMotionDiv key={item?.id || index} preset="fadeIn" hover>
                        <Link href={('city' in item) ? `/places/${item.id}` : `/packages/${item.id}`}>
                          <div className="break-inside-avoid mb-6">
                            <GlassCard className="overflow-hidden p-0 group">
                              <div className="relative">
                                <Image
                                    src={item?.thumbnail || 'https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?w=400&h=600'}
                                    alt={item?.name || 'Gallery item'}
                                    width={400}
                                    height={600}
                                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                  <div className="absolute bottom-4 left-4 right-4">
                                    <h3 className="text-white font-bold text-lg mb-1">{item?.name || 'Unknown'}</h3>
                                    <p className="text-white/70 text-sm">
                                      {'city' in item ? item.city : item?.duration || ''}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </GlassCard>
                          </div>
                        </Link>
                      </OptimizedMotionDiv>
                  ))}
                </div>
            ) : (
                <OptimizedMotionDiv preset="fadeIn" className="text-center py-16">
                  <GlassCard className="inline-block p-8">
                    <p className="text-white/80 text-lg">Gallery content will be available soon.</p>
                  </GlassCard>
                </OptimizedMotionDiv>
            )}
          </div>
        </section>
      </div>
  );
}