import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Instagram, Youtube, Facebook } from 'lucide-react';
import { coaches } from '../data';

gsap.registerPlugin(ScrollTrigger);

export default function Coaches() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const coachesGridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const children = coachesGridRef.current?.children;
      if (children) {
        gsap.fromTo(children,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1.0,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: coachesGridRef.current,
              start: "top 80%",
              toggleActions: "play none none none"
            }
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      id="coaches"
      ref={sectionRef}
      className="relative bg-[#0a0a0a] py-24 md:py-36 px-6 md:px-16 border-b border-neutral-900 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Section Header */}
        <div className="max-w-xl space-y-4">
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-1.5 bg-accent rounded-full" />
            <span className="text-xs tracking-widest font-mono text-neutral-500 uppercase">THE ARCHITECTS</span>
          </div>
          <h2 className="text-5xl sm:text-6xl md:text-7xl font-black text-white font-display tracking-tighter uppercase leading-none">
            MEET THE PEOPLE WHO <span className="text-accent text-stroke-accent">PUSH YOU FURTHER.</span>
          </h2>
          <p className="text-neutral-400 text-sm md:text-base font-light">
            Our elite coaching staff isn't here to hold your hand—they are here to construct your peak physical form with strict attention to detail and zero compromises.
          </p>
        </div>

        {/* Profiles Grid */}
        <div 
          ref={coachesGridRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {coaches.map((coach) => (
            <div 
              key={coach.id}
              className="group flex flex-col justify-between border border-neutral-900 bg-neutral-950 p-6 space-y-6 hover:border-neutral-800 transition-all duration-300 relative overflow-hidden"
            >
              {/* Image Frame with Editorial Feel */}
              <div className="relative h-[360px] w-full overflow-hidden border border-neutral-900">
                <img
                  src={coach.imageUrl}
                  alt={coach.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-out scale-100 group-hover:scale-[1.04]"
                />
                
                {/* Social icons block visible on hover */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  <a href="#" className="w-9 h-9 rounded-full bg-black/85 backdrop-blur border border-neutral-800 flex items-center justify-center text-white hover:bg-accent hover:text-black hover:border-accent transition-colors duration-200">
                    <Instagram className="w-4 h-4" />
                  </a>
                  <a href="#" className="w-9 h-9 rounded-full bg-black/85 backdrop-blur border border-neutral-800 flex items-center justify-center text-white hover:bg-accent hover:text-black hover:border-accent transition-colors duration-200">
                    <Youtube className="w-4 h-4" />
                  </a>
                  <a href="#" className="w-9 h-9 rounded-full bg-black/85 backdrop-blur border border-neutral-800 flex items-center justify-center text-white hover:bg-accent hover:text-black hover:border-accent transition-colors duration-200">
                    <Facebook className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Bio details */}
              <div className="space-y-2 relative z-10">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-2xl font-bold text-white font-display uppercase tracking-wide group-hover:text-accent transition-colors duration-300">
                    {coach.name}
                  </h3>
                  <span className="font-mono text-[10px] text-accent tracking-widest uppercase">
                    {coach.role.split(' ')[0]}
                  </span>
                </div>
                <div className="text-xs font-mono text-neutral-500 tracking-wider">
                  {coach.role}
                </div>
                <p className="text-neutral-400 text-xs sm:text-sm font-sans font-light leading-relaxed pt-2">
                  {coach.description}
                </p>
              </div>

              {/* Corner decorative bracket */}
              <div className="absolute bottom-0 right-0 w-[12px] h-[12px] border-b-2 border-r-2 border-neutral-900 group-hover:border-accent transition-colors duration-300" />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
