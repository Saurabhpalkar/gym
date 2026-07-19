import { useEffect, useState } from 'react';
import gsap from 'gsap';

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Increment counter from 0 to 100
    const obj = { value: 0 };
    const ctx = gsap.context(() => {
      gsap.to(obj, {
        value: 100,
        duration: 2.2,
        ease: "power2.out",
        onUpdate: () => {
          setCount(Math.floor(obj.value));
        },
        onComplete: () => {
          // Animation out of preloader
          const tl = gsap.timeline({
            onComplete: onComplete
          });
          
          tl.to(".preloader-text", {
            y: -50,
            opacity: 0,
            duration: 0.6,
            ease: "power3.in"
          })
          .to(".preloader-count", {
            y: 50,
            opacity: 0,
            duration: 0.6,
            ease: "power3.in"
          }, "-=0.4")
          .to(".preloader-bg", {
            clipPath: "polygon(0 0, 100% 0, 100% 0%, 0 0%)", // upward reveal
            duration: 1.0,
            ease: "power4.inOut"
          }, "-=0.2");
        }
      });
    });

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div className="preloader-bg fixed inset-0 z-[9999] bg-[#050505] flex flex-col justify-between p-8 md:p-16 select-none" style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}>
      {/* Top logo placeholder */}
      <div className="flex justify-between items-center text-xs tracking-widest text-neutral-500 font-mono">
        <div>IRON DISTRICT</div>
        <div>EST. 2026</div>
      </div>

      {/* Main visual brand name */}
      <div className="my-auto overflow-hidden">
        <h1 className="preloader-text text-6xl sm:text-8xl md:text-11xl font-extrabold tracking-tighter text-white font-display select-none leading-none">
          IRON <span className="text-accent text-stroke-accent">DISTRICT</span>
        </h1>
      </div>

      {/* Bottom loading status */}
      <div className="flex justify-between items-end font-mono">
        <div className="text-xs text-neutral-500 tracking-widest">
          BUILD YOUR STRONGEST SELF.
        </div>
        <div className="preloader-count text-4xl sm:text-6xl md:text-7xl font-bold font-sans text-accent tracking-tighter">
          {count.toString().padStart(3, '0')}%
        </div>
      </div>
    </div>
  );
}
