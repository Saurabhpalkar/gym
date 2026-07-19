import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface StatItem {
  id: number;
  target: number;
  suffix: string;
  label: string;
}

export default function Introduction() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  
  const stats: StatItem[] = [
    { id: 1, target: 12000, suffix: "+", label: "MEMBERS TRAINED" },
    { id: 2, target: 48, suffix: "", label: "WEEKLY CLASSES" },
    { id: 3, target: 25, suffix: "+", label: "ELITE COACHES" },
    { id: 4, target: 7, suffix: " DAYS", label: "OPEN EVERY WEEK" }
  ];

  const [displayVals, setDisplayVals] = useState<number[]>([0, 0, 0, 0]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Reveal textual content
      gsap.fromTo(textRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1.0,
          scrollTrigger: {
            trigger: textRef.current,
            start: "top 85%",
            toggleActions: "play none none none"
          }
        }
      );

      // Animate the counters using GSAP to update values
      const statObjects = stats.map(() => ({ val: 0 }));
      
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top 80%",
        onEnter: () => {
          statObjects.forEach((obj, idx) => {
            gsap.to(obj, {
              val: stats[idx].target,
              duration: 2.0,
              ease: "power2.out",
              onUpdate: () => {
                setDisplayVals(prev => {
                  const updated = [...prev];
                  updated[idx] = Math.floor(obj.val);
                  return updated;
                });
              }
            });
          });
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      id="training"
      ref={containerRef}
      className="relative bg-[#050505] py-24 md:py-36 px-6 md:px-16 border-b border-neutral-900 overflow-hidden"
    >
      {/* Editorial Grid Layout */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">
        
        {/* Left Column: Big Statement Editorial Layout */}
        <div ref={textRef} className="lg:col-span-7 space-y-6">
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
            <span className="text-xs tracking-widest font-mono text-neutral-500 uppercase">THE COLD TRUTH</span>
          </div>
          <h2 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tighter text-white font-display uppercase leading-[0.95]">
            NOT JUST A GYM.<br />
            <span className="text-accent text-stroke-accent">A STANDARD.</span>
          </h2>
          <p className="text-neutral-400 text-base md:text-lg max-w-xl font-sans font-light tracking-wide leading-relaxed">
            Iron District is a high-performance training environment designed for people who refuse average results. We combine elite-level coaching, state-of-the-art strength equipment, and a culture of absolute commitment. Here, we build bodies, minds, and standards that endure.
          </p>
        </div>

        {/* Right Column: Statistics Grid */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-8 border-l border-neutral-900 pl-0 lg:pl-12">
          {stats.map((stat, index) => (
            <div key={stat.id} className="space-y-1">
              <div className="text-4xl sm:text-5xl md:text-6xl font-black text-white font-display tracking-tight flex items-baseline">
                <span className="text-white">
                  {displayVals[index].toLocaleString()}
                </span>
                <span className="text-accent ml-0.5">{stat.suffix}</span>
              </div>
              <div className="text-xs font-mono text-neutral-500 tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
