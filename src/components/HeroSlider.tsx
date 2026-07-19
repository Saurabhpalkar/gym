import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Play, Pause, ChevronLeft, ChevronRight } from 'lucide-react';
import { videoSlides } from '../data';

interface HeroSliderProps {
  onOpenBooking: (plan?: string) => void;
}

export default function HeroSlider({ onOpenBooking }: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);
  const textRefs = useRef<HTMLDivElement>(null);
  
  // Touch Swiping State
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const prevIndexRef = useRef<number>(0);

  // Smooth automatic progress bar & slide changing
  useEffect(() => {
    if (!isPlaying) return;

    const slideDuration = 6000; // 6 seconds per slide
    const updateInterval = 50; // Update progress bar every 50ms for buttery smooth motion
    const totalSteps = slideDuration / updateInterval;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const currentProgress = (currentStep / totalSteps) * 100;
      setProgress(currentProgress);

      if (currentStep >= totalSteps) {
        setProgress(0);
        setCurrentIndex((prev) => (prev + 1) % videoSlides.length);
      }
    }, updateInterval);

    return () => {
      clearInterval(interval);
    };
  }, [currentIndex, isPlaying]);

  // Synchronize cross-fade and text transitions
  useEffect(() => {
    const isIndexChanged = prevIndexRef.current !== currentIndex;
    prevIndexRef.current = currentIndex;

    videoSlides.forEach((_, index) => {
      const img = imageRefs.current[index];
      if (img) {
        const isCurrent = index === currentIndex;
        
        // Premium cross-fade animation with scale-in effect
        gsap.to(img, {
          opacity: isCurrent ? 1 : 0,
          scale: isCurrent ? 1 : 1.05,
          duration: 1.2,
          ease: "power2.inOut",
        });
      }
    });

    // Fade and reveal hero texts dynamically on change
    if (isIndexChanged) {
      const textChildren = textRefs.current?.children;
      if (textChildren) {
        gsap.fromTo(textChildren,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out", delay: 0.2 }
        );
      }
    }
  }, [currentIndex]);

  const nextSlide = () => {
    setProgress(0);
    setCurrentIndex((prev) => (prev + 1) % videoSlides.length);
  };

  const prevSlide = () => {
    setProgress(0);
    setCurrentIndex((prev) => (prev - 1 + videoSlides.length) % videoSlides.length);
  };

  const selectSlide = (index: number) => {
    setProgress(0);
    setCurrentIndex(index);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  // Touch Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const minSwipeDistance = 50;
    const swipeDistance = touchStartX.current - touchEndX.current;
    
    if (Math.abs(swipeDistance) > minSwipeDistance) {
      if (swipeDistance > 0) {
        nextSlide(); // Swiped left
      } else {
        prevSlide(); // Swiped right
      }
    }
  };

  return (
    <section 
      id="hero"
      className="relative h-screen w-full overflow-hidden bg-black select-none flex items-center justify-center"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 4 Absolute Backdrop Images for instant cinematic cross-fades */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
        {videoSlides.map((slide, idx) => (
          <img
            key={slide.id}
            ref={(el) => { imageRefs.current[idx] = el; }}
            src={slide.posterUrl}
            alt={slide.title}
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover origin-center opacity-0 transform scale-[1.05]"
            style={{ filter: "brightness(0.35) contrast(1.1)" }}
          />
        ))}
      </div>

      {/* Hero Slide Content Wrapper */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-16 flex flex-col justify-center h-full pt-16">
        
        {/* Main Text Content */}
        <div ref={textRefs} className="max-w-3xl flex flex-col space-y-4">
          <span className="text-accent text-sm md:text-base font-bold tracking-widest font-mono uppercase block">
            {videoSlides[currentIndex].label}
          </span>
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-white leading-[0.9] font-display uppercase tracking-tighter">
            {videoSlides[currentIndex].title.split('\n').map((line, i) => (
              <span key={i} className="block">{line}</span>
            ))}
          </h1>
          <p className="text-neutral-300 text-sm sm:text-base md:text-lg max-w-lg font-sans font-light tracking-wide leading-relaxed pb-4">
            {videoSlides[currentIndex].description}
          </p>
          <div>
            <button
              onClick={() => onOpenBooking()}
              className="inline-flex items-center px-8 py-4 bg-accent text-black font-extrabold text-xs tracking-widest hover:bg-white hover:text-black hover:scale-[1.05] transition-all duration-300 cursor-pointer"
            >
              {videoSlides[currentIndex].ctaText}
            </button>
          </div>
        </div>

        {/* Thumbnail Preview Slider & Controls Bar */}
        <div className="absolute bottom-10 left-6 right-6 md:left-16 md:right-16 flex flex-col md:flex-row justify-between items-stretch md:items-end gap-6 z-20">
          
          {/* Thumbnails */}
          <div className="grid grid-cols-4 gap-3 max-w-xl w-full">
            {videoSlides.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => selectSlide(idx)}
                className={`group text-left border-t-2 pt-3 pb-1 transition-all duration-300 ${
                  idx === currentIndex 
                    ? 'border-accent text-white' 
                    : 'border-neutral-800 text-neutral-500 hover:border-neutral-500'
                }`}
              >
                <div className="font-mono text-[10px] tracking-wider mb-1">0{slide.id}</div>
                <div className="font-display text-[12px] md:text-[14px] font-bold tracking-wide uppercase truncate">
                  {slide.label.split(' — ')[1]}
                </div>
              </button>
            ))}
          </div>

          {/* Controls Panel */}
          <div className="flex items-center justify-between md:justify-end gap-6">
            
            {/* Slide Count */}
            <div className="text-neutral-400 font-mono text-sm tracking-widest">
              <span className="text-white font-bold">0{currentIndex + 1}</span> / 0{videoSlides.length}
            </div>

            {/* Play pause */}
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="w-10 h-10 rounded-full border border-neutral-800 flex items-center justify-center text-white hover:bg-white hover:text-black hover:border-white transition-all duration-300"
                aria-label="Play or Pause slideshow"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white hover:fill-black" />}
              </button>
            </div>

            {/* Previous & Next */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={prevSlide}
                className="w-10 h-10 rounded-full border border-neutral-800 flex items-center justify-center text-white hover:bg-white hover:text-black hover:border-white transition-all duration-300"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextSlide}
                className="w-10 h-10 rounded-full border border-neutral-800 flex items-center justify-center text-white hover:bg-white hover:text-black hover:border-white transition-all duration-300"
                aria-label="Next slide"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

          </div>

        </div>

        {/* Global Progress Bar of the Current Slide */}
        <div className="absolute bottom-0 left-0 w-full h-[4px] bg-neutral-900/60 z-20">
          <div 
            className="h-full bg-accent transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

      </div>
    </section>
  );
}
