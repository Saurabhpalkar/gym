import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check } from 'lucide-react';
import { membershipPlans } from '../data';

gsap.registerPlugin(ScrollTrigger);

interface MembershipProps {
  onOpenBooking: (plan?: string) => void;
}

export default function Membership({ onOpenBooking }: MembershipProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gridRef.current?.children;
      if (cards) {
        gsap.fromTo(cards,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1.0,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: gridRef.current,
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
      id="membership"
      ref={sectionRef}
      className="relative bg-[#050505] py-24 md:py-36 px-6 md:px-16 border-b border-neutral-900 overflow-hidden"
    >
      {/* Background Decorative Accent Ring */}
      <div className="absolute right-0 top-1/4 w-[500px] h-[500px] bg-accent/2 rounded-full blur-[120px] pointer-events-none select-none z-0" />

      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto space-y-4">
          <div className="flex items-center justify-center gap-3">
            <span className="w-1.5 h-1.5 bg-accent rounded-full" />
            <span className="text-xs tracking-widest font-mono text-neutral-500 uppercase">PRICING BLUEPRINT</span>
          </div>
          <h2 className="text-5xl sm:text-6xl md:text-7xl font-black text-white font-display tracking-tighter uppercase leading-none">
            CHOOSE YOUR <span className="text-accent text-stroke-accent">LEVEL.</span>
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base font-light leading-relaxed max-w-md mx-auto">
            We don't negotiate on quality. Choose the commitment level that maps directly to your physical and psychological goals.
          </p>
        </div>

        {/* Pricing Grid */}
        <div 
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto"
        >
          {membershipPlans.map((plan) => (
            <div 
              key={plan.id}
              className={`relative flex flex-col justify-between p-8 border ${
                plan.isFeatured 
                  ? 'border-accent bg-neutral-950/90 shadow-[0_0_40px_rgba(204,255,0,0.04)] scale-100 md:scale-[1.03] z-10' 
                  : 'border-neutral-900 bg-neutral-950/45 z-0'
              }`}
            >
              {/* Featured Badge */}
              {plan.isFeatured && (
                <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 bg-accent text-black font-mono text-[9px] font-bold tracking-widest px-4 py-1.5 rounded-full">
                  RECOMMENDED LEVEL
                </div>
              )}

              {/* Title & Price Header */}
              <div className="space-y-6">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-2xl font-black text-white font-display tracking-wider uppercase">
                    {plan.name}
                  </h3>
                  {plan.isFeatured && <span className="w-2.5 h-2.5 bg-accent rounded-full animate-ping" />}
                </div>

                <div className="space-y-1">
                  <div className="text-4xl sm:text-5xl md:text-6xl font-black font-display text-white tracking-tight flex items-baseline">
                    <span className={plan.isFeatured ? 'text-accent' : 'text-white'}>{plan.price}</span>
                    <span className="text-xs font-mono text-neutral-500 font-light tracking-widest ml-1 uppercase">
                      / {plan.period}
                    </span>
                  </div>
                  <p className="text-[10px] font-mono text-neutral-500 tracking-wider">TAXES AND INITIATION FEES INCLUDED</p>
                </div>

                {/* Divider */}
                <div className={`h-[1px] ${plan.isFeatured ? 'bg-accent/20' : 'bg-neutral-900'}`} />

                {/* Feature List */}
                <ul className="space-y-4 pt-2">
                  {plan.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className={`w-4 h-4 flex-shrink-0 mt-0.5 ${plan.isFeatured ? 'text-accent' : 'text-neutral-400'}`} />
                      <span className="text-xs sm:text-sm font-sans text-neutral-300 font-light tracking-wide">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Action Button */}
              <div className="pt-8 mt-12">
                <button
                  onClick={() => onOpenBooking(plan.name)}
                  className={`w-full py-4 text-xs font-extrabold tracking-widest uppercase transition-all duration-300 hover:scale-[1.02] cursor-pointer ${
                    plan.isFeatured 
                      ? 'bg-accent text-black hover:bg-white' 
                      : 'border border-neutral-800 text-white hover:border-white hover:bg-neutral-900'
                  }`}
                >
                  CHOOSE PLAN
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
