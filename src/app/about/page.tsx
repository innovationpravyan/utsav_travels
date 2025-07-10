// src/app/about/page.tsx

import { Target, Heart, MapPin, Users, Award, Sparkles, Globe, Star } from 'lucide-react';
import Image from 'next/image';
import { HeroImageBanner } from '@/components/hero-image-banner';
import Link from 'next/link';
import { OptimizedMotionDiv, StaggerContainer } from '@/components/optimized-motion-div';
import { getPlaces, getPackages } from '@/lib/data';
import { GlassCard } from '@/components/ui/glass-card';
import { Suspense } from 'react';
import {
  ABOUT_CONTENT,
  TEAM_MEMBERS,
  COMPANY_MILESTONES,
  PLACEHOLDERS,
  COMPANY_INFO
} from '@/lib/utils';

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

  // Helper function to get icon component
  const getIconComponent = (iconName: string) => {
    const icons = {
      Target,
      Heart,
      MapPin,
      Sparkles,
      Users,
      Award,
      Globe,
    };
    return icons[iconName as keyof typeof icons] || MapPin;
  };

  return (
      <div className="animate-fade-in">
        {/* Hero Image Banner */}
        <Suspense fallback={
          <div className="h-[80vh] w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
            <div className="text-white text-xl animate-pulse">Loading about us...</div>
          </div>
        }>
          <HeroImageBanner
              page="about"
              height="80vh"
              parallaxEffect={true}
              showScrollIndicator={true}
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
                    {ABOUT_CONTENT.story.title.split(' ')[0]}
                    <span className="block text-gradient-alt">{ABOUT_CONTENT.story.title.split(' ')[1]} {ABOUT_CONTENT.story.title.split(' ')[2]}</span>
                  </h2>
                </OptimizedMotionDiv>

                <OptimizedMotionDiv preset="fadeIn">
                  <div className="space-y-6 text-lg text-white/80 leading-relaxed">
                    {ABOUT_CONTENT.story.description.map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </OptimizedMotionDiv>

                <OptimizedMotionDiv preset="slideUp">
                  <div className="flex flex-wrap gap-4 mt-8">
                    {ABOUT_CONTENT.story.features.map((feature, index) => (
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
                          src={PLACEHOLDERS.images.about}
                          alt="Spiritual heritage of India"
                          width={600}
                          height={400}
                          className="rounded-lg shadow-2xl transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                      />

                      <div className="absolute -top-4 -right-4">
                        <GlassCard className="p-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-white">{COMPANY_INFO.stats.experience}</div>
                            <div className="text-white/70 text-xs">Years</div>
                          </div>
                        </GlassCard>
                      </div>

                      <div className="absolute -bottom-4 -left-4">
                        <GlassCard className="p-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-white">{COMPANY_INFO.stats.happyTravelers}</div>
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
              {ABOUT_CONTENT.coreValues.map((value, index) => {
                const IconComponent = getIconComponent(value.icon);
                return (
                    <OptimizedMotionDiv key={value.title} preset="slideUp" hover>
                      <GlassCard className="h-full p-8 group">
                        <div className="text-center">
                          <div className={`mx-auto mb-6 p-4 bg-gradient-to-br ${value.color} bg-opacity-20 rounded-full w-fit group-hover:scale-110 transition-transform duration-200`}>
                            <IconComponent className="h-10 w-10 text-white" />
                          </div>
                          <h3 className="font-headline text-2xl text-white mb-4">{value.title}</h3>
                          <p className="text-white/70 leading-relaxed mb-4">
                            {value.description}
                          </p>

                        </div>
                      </GlassCard>
                    </OptimizedMotionDiv>
                );
              })}
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
                {COMPANY_MILESTONES.map((milestone, index) => {
                  const IconComponent = getIconComponent(milestone.icon);
                  return (
                      <OptimizedMotionDiv
                          key={milestone.year}
                          preset="slideUp"
                          className={`flex items-center ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
                      >
                        <div className={`w-full lg:w-5/12 ${index % 2 === 0 ? 'lg:pr-8' : 'lg:pl-8'}`}>
                          <GlassCard className="p-8">
                            <div className={`flex items-center gap-4 mb-4 ${index % 2 === 0 ? '' : 'lg:flex-row-reverse lg:text-right'}`}>
                              <div className={`p-3 bg-gradient-to-br ${milestone.color} rounded-full`}>
                                <IconComponent className="h-6 w-6 text-white" />
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
                  );
                })}
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
              {TEAM_MEMBERS.map((member, index) => (
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
                                    src={item?.thumbnail || PLACEHOLDERS.images.gallery}
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