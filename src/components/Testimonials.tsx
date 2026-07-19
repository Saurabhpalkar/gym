import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { testimonials } from '../data';

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const textContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // GSAP crossfade animation on content change
    const children = textContainerRef.current?.children;
    if (children) {
      gsap.fromTo(children,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" }
      );
    }
  }, [activeIndex]);

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section 
      className="relative bg-[#0a0a0a] py-24 md:py-36 px-6 md:px-16 border-b border-neutral-900 overflow-hidden"
    >
      <div className="max-w-4xl mx-auto space-y-12 relative z-10">
        
        {/* Header */}
        <div className="flex items-center gap-3 justify-center mb-6">
          <span className="w-1.5 h-1.5 bg-accent rounded-full" />
          <span className="text-xs tracking-widest font-mono text-neutral-500 uppercase">THE VERDICT</span>
        </div>

        {/* Big Quote Symbol */}
        <div className="flex justify-center text-accent/15">
          <Quote className="w-16 h-16 fill-accent/10" />
        </div>

        {/* Text Container */}
        <div ref={textContainerRef} className="text-center space-y-6">
          <h2 className="text-sm tracking-widest font-mono text-accent uppercase font-semibold">THE RESULTS SPEAK.</h2>
          <blockquote className="text-xl sm:text-2xl md:text-3xl font-light text-white leading-relaxed font-sans max-w-3xl mx-auto italic">
            "{testimonials[activeIndex].quote}"
          </blockquote>
          <div className="space-y-1">
            <cite className="not-italic text-lg sm:text-xl font-bold font-display tracking-widest text-white block uppercase">
              {testimonials[activeIndex].author}
            </cite>
            <span className="text-xs font-mono text-neutral-500 tracking-wider">
              {testimonials[activeIndex].role}
            </span>
          </div>
        </div>

        {/* Slider Controls Bar */}
        <div className="flex flex-col items-center gap-6 pt-8">
          
          {/* Custom Progress Line Indicator */}
          <div className="w-48 h-[1px] bg-neutral-800 relative">
            <div 
              className="absolute left-0 top-0 h-full bg-accent transition-all duration-500"
              style={{ 
                width: `${((activeIndex + 1) / testimonials.length) * 100}%`
              }}
            />
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={prevTestimonial}
              className="w-11 h-11 border border-neutral-800 hover:border-white rounded-full flex items-center justify-center text-white transition-colors duration-200"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono text-xs tracking-widest text-neutral-400">
              0{activeIndex + 1} / 0{testimonials.length}
            </span>
            <button
              onClick={nextTestimonial}
              className="w-11 h-11 border border-neutral-800 hover:border-white rounded-full flex items-center justify-center text-white transition-colors duration-200"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
