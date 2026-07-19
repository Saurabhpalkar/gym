import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface Program {
  id: string;
  num: string;
  title: string;
  desc: string;
  image: string;
}

export default function Programs() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const programs: Program[] = [
    {
      id: "strength",
      num: "01",
      title: "STRENGTH",
      desc: "Build heavy power, dense muscle mass, and unshakable athletic confidence.",
      image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: "conditioning",
      num: "02",
      title: "CONDITIONING",
      desc: "Push cardiovascular thresholds, ignite your metabolism, and build endurance.",
      image: "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: "athletic",
      num: "03",
      title: "ATHLETIC PERFORMANCE",
      desc: "Move faster, react instantly, jump higher, and perform at the absolute peak.",
      image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: "personal",
      num: "04",
      title: "PERSONAL TRAINING",
      desc: "Get fully personalized programs, custom biomechanical reviews, and strict accountability.",
      image: "https://images.unsplash.com/photo-1548690312-e3b507d8c110?auto=format&fit=crop&q=80&w=800"
    }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = cardsRef.current?.children;
      if (cards) {
        gsap.fromTo(cards,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 1.0,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: cardsRef.current,
              start: "top 80%",
              toggleActions: "play none none none"
            }
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      id="programs"
      ref={containerRef}
      className="relative bg-[#0a0a0a] py-24 md:py-36 px-6 md:px-16 border-b border-neutral-900"
    >
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-accent rounded-full" />
              <span className="text-xs tracking-widest font-mono text-neutral-500 uppercase">OUR BLUEPRINT</span>
            </div>
            <h2 className="text-5xl sm:text-6xl md:text-7xl font-black text-white font-display tracking-tighter uppercase leading-none">
              TRAIN WITH <span className="text-accent text-stroke-accent">PURPOSE.</span>
            </h2>
          </div>
          <p className="text-neutral-400 text-sm md:text-base max-w-sm font-light leading-relaxed">
            Choose your specialization. Every program at Iron District is curated by world-class trainers and backed by rigorous sports science.
          </p>
        </div>

        {/* 4 Premium Large Panels */}
        <div 
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {programs.map((program) => (
            <div
              key={program.id}
              className="group relative h-[480px] w-full overflow-hidden border border-neutral-800 bg-neutral-900 flex flex-col justify-between p-6 cursor-pointer"
            >
              {/* Background Image Zoom on Hover */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                <img
                  src={program.image}
                  alt={program.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out scale-105 group-hover:scale-115 group-hover:filter brightness-75"
                  style={{ filter: "brightness(0.35) contrast(1.1)" }}
                />
              </div>

              {/* Smooth Dark Gradient Overlays */}
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/40 to-black/20" />

              {/* Number label */}
              <div className="relative z-20 flex justify-between items-start">
                <span className="font-mono text-xs text-neutral-500 tracking-widest group-hover:text-accent transition-colors duration-300">
                  {program.num}
                </span>
                <span className="w-8 h-8 rounded-full border border-neutral-800 flex items-center justify-center text-white group-hover:bg-accent group-hover:text-black group-hover:border-accent transition-all duration-500 transform group-hover:rotate-45">
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </div>

              {/* Panel Content at Bottom */}
              <div className="relative z-20 space-y-3">
                <h3 className="text-2xl sm:text-3xl font-bold text-white font-display tracking-wide uppercase transition-colors group-hover:text-accent duration-300">
                  {program.title}
                </h3>
                <p className="text-neutral-400 text-xs sm:text-sm font-sans font-light leading-relaxed group-hover:text-neutral-200 transition-colors duration-300">
                  {program.desc}
                </p>
                
                {/* Visual Accent Bar */}
                <div className="h-[2px] w-0 bg-accent group-hover:w-full transition-all duration-500 ease-out" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
