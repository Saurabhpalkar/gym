import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Experience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title Animation
      gsap.fromTo(titleRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1.0,
          ease: "power3.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 85%",
            toggleActions: "play none none none"
          }
        }
      );

      // Clip Path Reveal and Parallax for asymmetric image layouts
      imageRefs.current.forEach((imgContainer, index) => {
        if (!imgContainer) return;
        const img = imgContainer.querySelector('img');
        
        // Clip path wipe-reveal
        gsap.fromTo(imgContainer,
          { clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)" },
          {
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
            duration: 1.5,
            ease: "power4.inOut",
            scrollTrigger: {
              trigger: imgContainer,
              start: "top 85%",
              toggleActions: "play none none none"
            }
          }
        );

        // Parallax scroll on the inner image
        if (img) {
          gsap.fromTo(img,
            { y: "-10%" },
            {
              y: "10%",
              ease: "none",
              scrollTrigger: {
                trigger: imgContainer,
                start: "top bottom",
                end: "bottom top",
                scrub: true
              }
            }
          );
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative bg-[#050505] py-24 md:py-36 px-6 md:px-16 border-b border-neutral-900 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto space-y-20">
        
        {/* Title Section */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="flex items-center justify-center gap-3">
            <span className="w-1.5 h-1.5 bg-accent rounded-full animate-ping" />
            <span className="text-xs tracking-widest font-mono text-accent font-medium uppercase">THE ENVIRONMENT</span>
          </div>
          <h2 
            ref={titleRef}
            className="text-5xl sm:text-7xl md:text-8xl font-black text-white font-display tracking-tight uppercase leading-none"
          >
            BUILT FOR THE <br />
            <span className="text-accent text-stroke-accent">OBSESSED.</span>
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base font-light leading-relaxed max-w-lg mx-auto">
            A physical manifestation of dedication. Premium Olympic steel, dedicated fight rigs, active recovery suites, and an atmosphere forged in sweat and steel.
          </p>
        </div>

        {/* Editorial Magazine Layout (Asymmetrical Bento-ish Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-stretch">
          
          {/* Item 1: Giant Portrait (Lifting / Power) */}
          <div className="md:col-span-7 flex flex-col justify-between space-y-6">
            <div 
              ref={(el) => { imageRefs.current[0] = el; }}
              className="relative h-[400px] md:h-[550px] w-full overflow-hidden border border-neutral-900 group"
              style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)" }}
            >
              <img
                src="https://images.unsplash.com/photo-1605296867304-46d5465a25f1?auto=format&fit=crop&q=80&w=1200"
                alt="Elite weight training"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-[120%] object-cover brightness-[0.7] group-hover:brightness-[0.9] transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
              <div className="absolute bottom-6 left-6 z-20">
                <span className="font-mono text-xs text-accent tracking-widest uppercase block mb-1">01 — STRENGTH RIGS</span>
                <h3 className="text-2xl sm:text-3xl font-bold text-white font-display uppercase tracking-wide">ELEIKO PLATFORMS</h3>
              </div>
            </div>
          </div>

          {/* Item 2: Small Landscape + Text column */}
          <div className="md:col-span-5 flex flex-col justify-between gap-8">
            <div 
              ref={(el) => { imageRefs.current[1] = el; }}
              className="relative h-[250px] md:h-[300px] w-full overflow-hidden border border-neutral-900 group"
              style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)" }}
            >
              <img
                src="https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&q=80&w=800"
                alt="Boxing fight training"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-[120%] object-cover brightness-[0.7] group-hover:brightness-[0.9] transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
              <div className="absolute bottom-6 left-6 z-20">
                <span className="font-mono text-xs text-accent tracking-widest uppercase block mb-1">02 — BOXING RING</span>
                <h3 className="text-2xl font-bold text-white font-display uppercase tracking-wide">FIGHT PROTOCOLS</h3>
              </div>
            </div>

            <div className="bg-neutral-950 border border-neutral-900 p-8 flex flex-col justify-center space-y-4">
              <span className="text-xs font-mono text-neutral-500 tracking-wider">THE MAG SPEC</span>
              <p className="text-neutral-300 text-sm leading-relaxed font-light">
                "We don't do commercial gimmicks. We don't have endless rows of smart televisions or soft lounge seating. Every square centimeter of Iron District is designed to optimize physical performance and mental resilience."
              </p>
              <div className="flex items-center gap-4 text-xs font-mono text-accent">
                <span>— CARTER, DIRECTOR OF PERFORMANCE</span>
              </div>
            </div>
          </div>

          {/* Item 3: Secondary columns (3 items grid) */}
          <div className="md:col-span-4 flex flex-col justify-between space-y-6">
            <div 
              ref={(el) => { imageRefs.current[2] = el; }}
              className="relative h-[300px] w-full overflow-hidden border border-neutral-900 group"
              style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)" }}
            >
              <img
                src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=800"
                alt="Functional movement"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-[120%] object-cover brightness-[0.7] group-hover:brightness-[0.9] transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
              <div className="absolute bottom-6 left-6 z-20">
                <span className="font-mono text-xs text-accent tracking-widest uppercase block mb-1">03 — FUNCTIONAL</span>
                <h3 className="text-2xl font-bold text-white font-display uppercase tracking-wide">BATTLE ZONES</h3>
              </div>
            </div>
          </div>

          <div className="md:col-span-4 flex flex-col justify-between space-y-6">
            <div 
              ref={(el) => { imageRefs.current[3] = el; }}
              className="relative h-[300px] w-full overflow-hidden border border-neutral-900 group"
              style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)" }}
            >
              <img
                src="https://images.unsplash.com/photo-1540539234-c14a20fb7c7b?auto=format&fit=crop&q=80&w=800"
                alt="Elite gym interior setup"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-[120%] object-cover brightness-[0.7] group-hover:brightness-[0.9] transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
              <div className="absolute bottom-6 left-6 z-20">
                <span className="font-mono text-xs text-accent tracking-widest uppercase block mb-1">04 — INTERIORS</span>
                <h3 className="text-2xl font-bold text-white font-display uppercase tracking-wide">SILENT STRENGTH</h3>
              </div>
            </div>
          </div>

          <div className="md:col-span-4 flex flex-col justify-between space-y-6">
            <div 
              ref={(el) => { imageRefs.current[4] = el; }}
              className="relative h-[300px] w-full overflow-hidden border border-neutral-900 group"
              style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)" }}
            >
              <img
                src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=800"
                alt="Active recovery cold plunge sauna"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-[120%] object-cover brightness-[0.7] group-hover:brightness-[0.9] transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
              <div className="absolute bottom-6 left-6 z-20">
                <span className="font-mono text-xs text-accent tracking-widest uppercase block mb-1">05 — RECOVERY</span>
                <h3 className="text-2xl font-bold text-white font-display uppercase tracking-wide">CRYOTHERAPY & PLUNGE</h3>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
