import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, Clock, Navigation } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface LocationAndCTAProps {
  onOpenBooking: (plan?: string) => void;
}

export default function LocationAndCTA({ onOpenBooking }: LocationAndCTAProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Reveal the location details on scroll
      gsap.fromTo(".location-details",
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 1.0,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".location-section",
            start: "top 80%",
            toggleActions: "play none none none"
          }
        }
      );

      // Reveal the location visual card
      gsap.fromTo(".location-visual",
        { opacity: 0, x: 50 },
        {
          opacity: 1,
          x: 0,
          duration: 1.0,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".location-section",
            start: "top 80%",
            toggleActions: "play none none none"
          }
        }
      );

      // Parallax scale on final CTA card background
      gsap.fromTo(".cta-bg",
        { scale: 1.1 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ctaRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleDirectionsClick = () => {
    window.open("https://maps.google.com/?q=Mumbai+High+Performance+Gym", "_blank");
  };

  return (
    <div ref={containerRef} className="bg-[#050505]">
      
      {/* 1. LOCATION SECTION */}
      <section 
        id="contact"
        className="location-section relative py-24 md:py-36 px-6 md:px-16 border-b border-neutral-900"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">
          
          {/* Left: Location Details */}
          <div className="location-details lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                <span className="text-xs tracking-widest font-mono text-neutral-500 uppercase">THE HQ</span>
              </div>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white font-display tracking-tighter uppercase leading-none">
                YOUR NEW <br />
                <span className="text-accent text-stroke-accent">TRAINING GROUND.</span>
              </h2>
            </div>

            <div className="space-y-6">
              {/* Card Address */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full border border-neutral-800 flex items-center justify-center text-accent flex-shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-mono text-neutral-400 tracking-wider">IRON DISTRICT HQ</h4>
                  <p className="text-white text-base sm:text-lg font-bold font-display uppercase tracking-wider">
                    High Performance Fitness Club
                  </p>
                  <p className="text-neutral-400 text-xs sm:text-sm font-light font-sans">
                    123 Performance Avenue, Mumbai, Maharashtra
                  </p>
                </div>
              </div>

              {/* Card Clock */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full border border-neutral-800 flex items-center justify-center text-accent flex-shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-mono text-neutral-400 tracking-wider">OPERATIONS HOURS</h4>
                  <p className="text-white text-base sm:text-lg font-bold font-display uppercase tracking-wider">
                    MONDAY — SUNDAY
                  </p>
                  <p className="text-neutral-400 text-xs sm:text-sm font-light font-sans">
                    05:00 AM — 11:00 PM
                  </p>
                </div>
              </div>
            </div>

            {/* Directions Button */}
            <div className="pt-4">
              <button
                onClick={handleDirectionsClick}
                className="inline-flex items-center gap-3 px-8 py-4 bg-accent text-black font-extrabold text-xs tracking-widest hover:bg-white hover:text-black transition-all duration-300 hover:scale-[1.05]"
              >
                <Navigation className="w-4 h-4" />
                <span>GET DIRECTIONS</span>
              </button>
            </div>
          </div>

          {/* Right: Premium Location Visual (Creative stylized high-contrast minimap card) */}
          <div className="location-visual lg:col-span-7">
            <div className="relative h-[400px] w-full border border-neutral-900 overflow-hidden bg-neutral-950 group">
              {/* Stylized Dark Blueprint Vector Representation */}
              <div className="absolute inset-0 z-0 opacity-20 pointer-events-none select-none">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#222" strokeWidth="0.5"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                  {/* Abstract rings mapping coords */}
                  <circle cx="50%" cy="50%" r="180" fill="none" stroke="#333" strokeWidth="1" strokeDasharray="5,5" />
                  <circle cx="50%" cy="50%" r="100" fill="none" stroke="rgba(204,255,0,0.2)" strokeWidth="1.5" />
                  <circle cx="50%" cy="50%" r="4" fill="#ccff00" />
                </svg>
              </div>

              {/* Real cinematic background photography of gym interior with logo marker */}
              <img
                src="https://images.unsplash.com/photo-1540539234-c14a20fb7c7b?auto=format&fit=crop&q=80&w=1200"
                alt="Gym location aerial representation"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover opacity-60 filter grayscale brightness-50 group-hover:scale-102 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent z-10" />

              {/* Coords overlay / Details */}
              <div className="absolute top-6 left-6 z-20 font-mono text-[10px] text-neutral-500 tracking-widest space-y-1">
                <div>COORD: 19.0760° N, 72.8777° E</div>
                <div>ALT: 14M ELEVATION</div>
              </div>

              {/* Hover Badge Pin */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-accent/20 border border-accent flex items-center justify-center text-accent animate-bounce">
                  <div className="w-4 h-4 rounded-full bg-accent" />
                </div>
                <div className="bg-black/90 backdrop-blur-md border border-neutral-800 px-4 py-2 font-display font-bold text-sm tracking-widest text-white uppercase shadow-2xl">
                  IRON DISTRICT
                </div>
              </div>

              {/* Footer specs inside map */}
              <div className="absolute bottom-6 left-6 right-6 z-20 flex justify-between items-center text-[10px] font-mono text-neutral-500 tracking-wider">
                <div>WESTERN INgress // MAIN GATEWAY</div>
                <div>SECURED ENTRY</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. FINAL CTA SECTION */}
      <section 
        ref={ctaRef}
        className="relative py-32 md:py-48 px-6 md:px-16 border-b border-neutral-900 overflow-hidden"
      >
        {/* Background Image Parallax Parallaxes */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=1920"
            alt="Cinematic barbell weights background"
            referrerPolicy="no-referrer"
            className="cta-bg w-full h-[140%] object-cover origin-center brightness-[0.25] filter contrast-110"
          />
        </div>

        {/* Cinematic Radial dark glow */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/60 to-black z-10" />

        {/* Visual Content Block */}
        <div className="relative z-20 max-w-4xl mx-auto text-center space-y-8">
          <div className="flex items-center justify-center gap-3">
            <span className="w-1.5 h-1.5 bg-accent rounded-full animate-ping" />
            <span className="text-xs tracking-widest font-mono text-accent uppercase font-medium">THE ULTIMATE CALL</span>
          </div>
          <h2 className="text-6xl sm:text-8xl md:text-10xl font-black text-white font-display tracking-tight uppercase leading-[0.9]">
            YOUR EXCUSES <br />
            <span className="text-accent text-stroke-accent">END HERE.</span>
          </h2>
          <p className="text-neutral-300 text-sm sm:text-base md:text-lg max-w-md mx-auto font-sans font-light tracking-wide leading-relaxed">
            Your next level starts with one decision. Eliminate average. Join the District.
          </p>
          <div className="pt-4">
            <button
              onClick={() => onOpenBooking()}
              className="inline-flex items-center px-10 py-5 bg-accent text-black font-extrabold text-xs tracking-widest hover:bg-white hover:text-black hover:scale-[1.05] transition-all duration-300 shadow-2xl cursor-pointer"
            >
              BECOME A MEMBER
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
