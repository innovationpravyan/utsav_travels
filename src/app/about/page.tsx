import { Target, Heart, MapPin, Users, Award, Clock, Sparkles, Globe, Mountain, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { PageBanner, type BannerItem } from '@/components/page-banner';
import Link from 'next/link';
import { MotionDiv, StaggerContainer, ParallaxDiv } from '@/components/motion-div';
import { getPlaces, getPackages } from '@/lib/data';
import { ParallaxSection, ParallaxContent } from '@/components/ui/parallax-section';
import { GlassCard, InteractiveGlassCard, FloatingGlassCard } from '@/components/ui/glass-card';
import { FloatingElements } from '@/components/ui/floating-elements';

export default async function AboutPage() {
  const topPlaces = (await getPlaces()).slice(0, 5);
  const topPackages = (await getPackages()).slice(0, 5);
  
  const bannerPlaces: BannerItem[] = topPlaces.slice(0,3).map(p => ({
    id: p.id,
    image: p.images[0] || p.thumbnail,
    name: p.name,
    tagline: p.city
  }));
  const bannerPackages: BannerItem[] = topPackages.slice(0,2).map(p => ({
    id: p.id,
    image: p.images[0] || p.thumbnail,
    name: p.name,
    tagline: p.duration
  }));

  const bannerItems = [...bannerPlaces, ...bannerPackages].sort(() => 0.5 - Math.random());
  
  const galleryItems = [...topPlaces, ...topPackages].sort(() => 0.5 - Math.random()).slice(0, 10);

  // Team members data
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

  // Journey milestones
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
      {/* Enhanced Page Banner */}
      <PageBanner 
        title="About Utsav Travels" 
        subtitle="Your Gateway to Spiritual India"
        description="Discover the profound heritage and sacred wisdom of India's most revered destinations"
        items={bannerItems}
        variant="dramatic"
        height="80vh"
        showStats
        showFloatingElements
      />

      {/* Who We Are Section with Parallax */}
      <ParallaxSection
        height="auto"
        className="section-padding"
        layers={[
          {
            id: 'about-bg',
            speed: -0.3,
            content: (
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" />
            ),
          },
          {
            id: 'about-pattern',
            speed: -0.1,
            content: (
              <div className="absolute inset-0 pattern-dots opacity-5" />
            ),
          },
        ]}
        floatingElements
      >
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <StaggerContainer>
              <MotionDiv preset="slideUp" delay={0.2}>
                <div className="flex items-center gap-3 mb-6">
                  <FloatingGlassCard variant="gradient" size="sm" className="p-3">
                    <Heart className="h-6 w-6 text-primary" />
                  </FloatingGlassCard>
                  <span className="text-primary font-semibold text-lg">Our Story</span>
                </div>
              </MotionDiv>
              
              <MotionDiv preset="typewriter" delay={0.4}>
                <h2 className="font-headline text-5xl md:text-6xl mb-8 text-white leading-tight">
                  Who We
                  <span className="block text-gradient-alt">Are</span>
                </h2>
              </MotionDiv>
              
              <MotionDiv preset="fadeIn" delay={0.6}>
                <div className="space-y-6 text-lg text-white/80 leading-relaxed">
                  <p>
                    Utsav Travels is a premier travel showcase dedicated to unveiling the spiritual, cultural, and historical richness of India's most sacred cities. We were born from a passion for heritage and a desire to connect travelers with the authentic soul of Varanasi, Ayodhya, Rishikesh, and Kedarnath.
                  </p>
                  <p>
                    Our initiative focuses on promoting sustainable and immersive tourism, ensuring that every journey is not just a trip, but a profound experience that respects local traditions and supports communities.
                  </p>
                </div>
              </MotionDiv>

              <MotionDiv preset="slideUp" delay={0.8}>
                <div className="flex flex-wrap gap-4 mt-8">
                  {['Authentic Experiences', 'Local Expertise', 'Spiritual Focus', 'Cultural Immersion'].map((feature, index) => (
                    <MotionDiv
                      key={feature}
                      preset="scaleIn"
                      delay={1 + index * 0.1}
                      hover
                    >
                      <GlassCard variant="subtle" size="sm" className="px-4 py-2">
                        <span className="text-white/90 text-sm font-medium">{feature}</span>
                      </GlassCard>
                    </MotionDiv>
                  ))}
                </div>
              </MotionDiv>
            </StaggerContainer>

            <MotionDiv preset="scaleIn" delay={0.6} hover magnetic>
              <div className="relative group">
                <InteractiveGlassCard
                  variant="frosted"
                  className="p-8 overflow-hidden"
                >
                  <div className="relative">
                    <Image 
                      src="https://images.pexels.com/photos/3401403/pexels-photo-3401403.jpeg?w=600&h=400" 
                      alt="Spiritual heritage of India" 
                      width={600} 
                      height={400} 
                      className="rounded-lg shadow-2xl transition-transform duration-700 group-hover:scale-105"
                    />
                    
                    {/* Floating stats overlay */}
                    <div className="absolute -top-4 -right-4">
                      <FloatingGlassCard variant="gradient" size="sm" className="p-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-white">5+</div>
                          <div className="text-white/70 text-xs">Years</div>
                        </div>
                      </FloatingGlassCard>
                    </div>
                    
                    <div className="absolute -bottom-4 -left-4">
                      <FloatingGlassCard variant="colored" size="sm" className="p-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-white">10K+</div>
                          <div className="text-white/70 text-xs">Travelers</div>
                        </div>
                      </FloatingGlassCard>
                    </div>
                  </div>
                </InteractiveGlassCard>
              </div>
            </MotionDiv>
          </div>
        </div>
      </ParallaxSection>
      
      {/* Core Values Section */}
      <ParallaxSection
        height="auto"
        className="section-padding"
        layers={[
          {
            id: 'values-bg',
            speed: -0.4,
            content: (
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900" />
            ),
          },
        ]}
        floatingElements
      >
        <div className="container mx-auto px-4 relative z-10">
          <StaggerContainer className="text-center mb-16">
            <MotionDiv preset="slideUp" delay={0.2}>
              <h2 className="text-5xl md:text-6xl font-headline font-bold text-white mb-6">
                Our Core
                <span className="block text-gradient">Values</span>
              </h2>
            </MotionDiv>
            <MotionDiv preset="fadeIn" delay={0.4}>
              <p className="text-xl text-white/80 max-w-3xl mx-auto">
                The principles that guide every journey we create
              </p>
            </MotionDiv>
          </StaggerContainer>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <MotionDiv preset="float" delay={0.2} hover magnetic>
              <InteractiveGlassCard variant="frosted" size="lg" className="h-full p-8 group">
                <div className="text-center">
                  <div className="mx-auto mb-6 p-4 bg-gradient-to-br from-blue-400/20 to-blue-600/20 rounded-full w-fit group-hover:scale-110 transition-transform duration-300">
                    <Target className="h-10 w-10 text-blue-400" />
                  </div>
                  <h3 className="font-headline text-2xl text-white mb-4">Mission & Vision</h3>
                  <p className="text-white/70 leading-relaxed">
                    Our mission is to be the leading platform for heritage tourism in the region, showcasing its spiritual depth to the world. We envision a future where every traveler leaves with a deeper understanding and appreciation of this ancient land.
                  </p>
                </div>
              </InteractiveGlassCard>
            </MotionDiv>

            <MotionDiv preset="float" delay={0.4} hover magnetic>
              <InteractiveGlassCard variant="frosted" size="lg" className="h-full p-8 group">
                <div className="text-center">
                  <div className="mx-auto mb-6 p-4 bg-gradient-to-br from-red-400/20 to-red-600/20 rounded-full w-fit group-hover:scale-110 transition-transform duration-300">
                    <Heart className="h-10 w-10 text-red-400" />
                  </div>
                  <h3 className="font-headline text-2xl text-white mb-4">Why Choose Us</h3>
                  <p className="text-white/70 leading-relaxed">
                    With our deep local expertise, we offer authentic, off-the-beaten-path experiences. Our seamless WhatsApp contact system and commitment to personalized service make planning your spiritual journey effortless and enjoyable.
                  </p>
                </div>
              </InteractiveGlassCard>
            </MotionDiv>

            <MotionDiv preset="float" delay={0.6} hover magnetic>
              <InteractiveGlassCard variant="frosted" size="lg" className="h-full p-8 group">
                <div className="text-center">
                  <div className="mx-auto mb-6 p-4 bg-gradient-to-br from-green-400/20 to-green-600/20 rounded-full w-fit group-hover:scale-110 transition-transform duration-300">
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
              </InteractiveGlassCard>
            </MotionDiv>
          </div>
        </div>
      </ParallaxSection>

      {/* Journey Timeline Section */}
      <ParallaxSection
        height="auto"
        className="section-padding"
        layers={[
          {
            id: 'timeline-bg',
            speed: -0.2,
            content: (
              <div className="absolute inset-0 bg-gradient-to-br from-black via-slate-900 to-black" />
            ),
          },
        ]}
      >
        <div className="container mx-auto px-4 relative z-10">
          <StaggerContainer className="text-center mb-16">
            <MotionDiv preset="slideUp" delay={0.2}>
              <h2 className="text-5xl md:text-6xl font-headline font-bold text-white mb-6">
                Our
                <span className="block text-gradient-alt">Journey</span>
              </h2>
            </MotionDiv>
            <MotionDiv preset="fadeIn" delay={0.4}>
              <p className="text-xl text-white/80 max-w-3xl mx-auto">
                Milestones that shaped our path to becoming a trusted spiritual travel partner
              </p>
            </MotionDiv>
          </StaggerContainer>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-px h-full bg-gradient-to-b from-primary via-accent to-primary opacity-30"></div>

            <div className="space-y-16">
              {milestones.map((milestone, index) => (
                <MotionDiv
                  key={milestone.year}
                  preset="slideUp"
                  delay={index * 0.2}
                  className={`flex items-center ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
                >
                  <div className={`w-full lg:w-5/12 ${index % 2 === 0 ? 'lg:pr-8' : 'lg:pl-8'}`}>
                    <InteractiveGlassCard variant="gradient" size="lg" className="p-8">
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
                    </InteractiveGlassCard>
                  </div>

                  {/* Timeline node */}
                  <div className="hidden lg:flex w-2/12 justify-center">
                    <div className="w-6 h-6 bg-gradient-to-br from-primary to-accent rounded-full border-4 border-background shadow-lg"></div>
                  </div>

                  <div className="hidden lg:block w-5/12"></div>
                </MotionDiv>
              ))}
            </div>
          </div>
        </div>
      </ParallaxSection>

      {/* Team Section */}
      <ParallaxSection
        height="auto"
        className="section-padding"
        layers={[
          {
            id: 'team-bg',
            speed: -0.3,
            content: (
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900" />
            ),
          },
        ]}
        floatingElements
      >
        <div className="container mx-auto px-4 relative z-10">
          <StaggerContainer className="text-center mb-16">
            <MotionDiv preset="slideUp" delay={0.2}>
              <h2 className="text-5xl md:text-6xl font-headline font-bold text-white mb-6">
                Meet Our
                <span className="block text-gradient">Team</span>
              </h2>
            </MotionDiv>
            <MotionDiv preset="fadeIn" delay={0.4}>
              <p className="text-xl text-white/80 max-w-3xl mx-auto">
                Passionate experts dedicated to creating unforgettable spiritual experiences
              </p>
            </MotionDiv>
          </StaggerContainer>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <MotionDiv
                key={member.name}
                preset="scaleIn"
                delay={index * 0.2}
                hover
                magnetic
              >
                <InteractiveGlassCard variant="frosted" size="lg" className="p-8 text-center group">
                  <div className="relative mb-6">
                    <div className="w-32 h-32 mx-auto rounded-full overflow-hidden group-hover:scale-110 transition-transform duration-300">
                      <Image
                        src={member.image}
                        alt={member.name}
                        width={128}
                        height={128}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                      <GlassCard variant="gradient" size="sm" className="px-3 py-1">
                        <Star className="h-4 w-4 text-yellow-400" />
                      </GlassCard>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">{member.name}</h3>
                  <p className="text-primary font-medium mb-4">{member.role}</p>
                  <p className="text-white/70 text-sm mb-6">{member.bio}</p>

                  <div className="flex flex-wrap gap-2 justify-center">
                    {member.expertise.map((skill, skillIndex) => (
                      <GlassCard key={skill} variant="subtle" size="sm" className="px-3 py-1">
                        <span className="text-white/80 text-xs">{skill}</span>
                      </GlassCard>
                    ))}
                  </div>
                </InteractiveGlassCard>
              </MotionDiv>
            ))}
          </div>
        </div>
      </ParallaxSection>

      {/* Enhanced Gallery Section */}
      <ParallaxSection
        height="auto"
        className="section-padding"
        layers={[
          {
            id: 'gallery-bg',
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
                Our
                <span className="block text-gradient-alt">Gallery</span>
              </h2>
            </MotionDiv>
            <MotionDiv preset="fadeIn" delay={0.4}>
              <p className="text-xl text-white/80 max-w-3xl mx-auto">
                Capturing the essence of spiritual India through our travelers' journeys
              </p>
            </MotionDiv>
          </StaggerContainer>

          <div className="columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
            {galleryItems.map((item, index) => (
              <MotionDiv key={item.id} preset="fadeIn" delay={index * 0.1} hover>
                <Link href={('city' in item) ? `/places/${item.id}` : `/packages/${item.id}`}>
                  <div className="break-inside-avoid mb-6">
                    <InteractiveGlassCard className="overflow-hidden p-0 group">
                      <div className="relative">
                        <Image
                          src={item.thumbnail}
                          alt={item.name}
                          width={400}
                          height={600}
                          className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="absolute bottom-4 left-4 right-4">
                            <h3 className="text-white font-bold text-lg mb-1">{item.name}</h3>
                            <p className="text-white/70 text-sm">
                              {'city' in item ? item.city : item.duration}
                            </p>
                          </div>
                        </div>
                      </div>
                    </InteractiveGlassCard>
                  </div>
                </Link>
              </MotionDiv>
            ))}
          </div>
        </div>
      </ParallaxSection>
    </div>
  );
}