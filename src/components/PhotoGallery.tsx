import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronLeft, ChevronRight, Maximize2, X, Play, Pause } from 'lucide-react';
import { galleryItems } from '../data';

gsap.registerPlugin(ScrollTrigger);

const GALLERY_AUTOPLAY_INTERVAL = 5000;
const INACTIVITY_TIMEOUT = 8000;

export default function PhotoGallery() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [autoplayActive, setAutoplayActive] = useState(true);

  const sectionRef = useRef<HTMLDivElement>(null);
  const mainImageContainerRef = useRef<HTMLDivElement>(null);
  const mainImageRef = useRef<HTMLImageElement>(null);
  const textMetaRef = useRef<HTMLDivElement>(null);
  const thumbnailsRef = useRef<HTMLDivElement>(null);

  const autoplayTimer = useRef<NodeJS.Timeout | null>(null);
  const inactivityTimer = useRef<NodeJS.Timeout | null>(null);

  // Helper: Get random index other than current
  const getRandomIndex = (currIndex: number): number => {
    if (galleryItems.length <= 1) return 0;
    const available = Array.from({ length: galleryItems.length }, (_, i) => i)
                           .filter(i => i !== currIndex);
    return available[Math.floor(Math.random() * available.length)];
  };

  // Autoplay loop using random selection
  const startAutoplay = () => {
    stopAutoplay();
    if (!autoplayActive) return;
    
    autoplayTimer.current = setInterval(() => {
      setActiveIndex((prev) => getRandomIndex(prev));
    }, GALLERY_AUTOPLAY_INTERVAL);
  };

  const stopAutoplay = () => {
    if (autoplayTimer.current) {
      clearInterval(autoplayTimer.current);
      autoplayTimer.current = null;
    }
  };

  // Pause autoplay temporarily due to user interaction, and schedule restart
  const handleUserInteraction = () => {
    stopAutoplay();
    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current);
    }
    inactivityTimer.current = setTimeout(() => {
      if (autoplayActive) {
        startAutoplay();
      }
    }, INACTIVITY_TIMEOUT);
  };

  // Handle active slide changed (trigger cinematic transitions)
  useEffect(() => {
    if (!mainImageRef.current) return;

    // Smooth image transition: scale down current, zoom in new
    gsap.killTweensOf(mainImageRef.current);
    gsap.fromTo(mainImageRef.current,
      { opacity: 0.1, scale: 1.08 },
      { opacity: 1, scale: 1, duration: 1.0, ease: "power3.out" }
    );

    // Smooth meta text slide up/reveal
    if (textMetaRef.current) {
      gsap.killTweensOf(textMetaRef.current.children);
      gsap.fromTo(textMetaRef.current.children,
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: "power2.out" }
      );
    }

    // Scroll active thumbnail into center of previews
    const activeThumb = thumbnailsRef.current?.children[activeIndex] as HTMLElement;
    if (activeThumb && thumbnailsRef.current) {
      const containerWidth = thumbnailsRef.current.clientWidth;
      const thumbLeft = activeThumb.offsetLeft;
      const thumbWidth = activeThumb.clientWidth;
      thumbnailsRef.current.scrollTo({
        left: thumbLeft - containerWidth / 2 + thumbWidth / 2,
        behavior: 'smooth'
      });
    }
  }, [activeIndex]);

  // Handle autoplay state
  useEffect(() => {
    if (autoplayActive) {
      startAutoplay();
    } else {
      stopAutoplay();
    }
    return () => {
      stopAutoplay();
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    };
  }, [autoplayActive]);

  // ScrollTrigger controlled gallery transitions (Pin section on desktop)
  useEffect(() => {
    let scrollTriggerInstance: ScrollTrigger | null = null;

    const ctx = gsap.context(() => {
      // Intro Reveal
      gsap.fromTo(".gallery-container",
        { opacity: 0, y: 80 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power4.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none none"
          }
        }
      );

      // Controlled scroll interaction (Desktop only pinning to change image on scroll)
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        scrollTriggerInstance = ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top top",
          end: "+=1200", // Scroll length to cycle through images
          pin: true,
          scrub: 1,
          onUpdate: (self) => {
            const progress = self.progress;
            const total = galleryItems.length;
            const targetIdx = Math.min(Math.floor(progress * total), total - 1);
            if (targetIdx !== activeIndex) {
              handleUserInteraction();
              setActiveIndex(targetIdx);
            }
          }
        });
      });
    }, sectionRef);

    return () => {
      ctx.revert();
      if (scrollTriggerInstance) {
        scrollTriggerInstance.kill();
      }
    };
  }, [activeIndex]);

  // Manual change actions
  const nextImage = () => {
    handleUserInteraction();
    setActiveIndex((prev) => (prev + 1) % galleryItems.length);
  };

  const prevImage = () => {
    handleUserInteraction();
    setActiveIndex((prev) => (prev - 1 + galleryItems.length) % galleryItems.length);
  };

  const selectImage = (idx: number) => {
    handleUserInteraction();
    setActiveIndex(idx);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLightboxOpen) {
        if (e.key === 'ArrowRight') {
          setLightboxIndex((prev) => (prev + 1) % galleryItems.length);
        } else if (e.key === 'ArrowLeft') {
          setLightboxIndex((prev) => (prev - 1 + galleryItems.length) % galleryItems.length);
        } else if (e.key === 'Escape') {
          closeLightbox();
        }
      } else {
        // Main page arrow keys
        if (e.key === 'ArrowRight') {
          nextImage();
        } else if (e.key === 'ArrowLeft') {
          prevImage();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen]);

  // Lightbox opening/closing
  const openLightbox = (idx: number) => {
    stopAutoplay();
    setLightboxIndex(idx);
    setIsLightboxOpen(true);
    document.body.style.overflow = 'hidden'; // Lock main scroll
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    document.body.style.overflow = 'auto'; // Unlock main scroll
    if (autoplayActive) {
      startAutoplay();
    }
  };

  const nextLightboxImage = () => {
    setLightboxIndex((prev) => (prev + 1) % galleryItems.length);
  };

  const prevLightboxImage = () => {
    setLightboxIndex((prev) => (prev - 1 + galleryItems.length) % galleryItems.length);
  };

  return (
    <section 
      id="gallery"
      ref={sectionRef}
      className="relative bg-[#050505] py-24 md:py-36 px-6 md:px-16 border-b border-neutral-900 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto gallery-container space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-accent rounded-full" />
              <span className="text-xs tracking-widest font-mono text-neutral-500 uppercase">THE ARCHIVES</span>
            </div>
            <h2 className="text-5xl sm:text-6xl md:text-7xl font-black text-white font-display tracking-tighter uppercase leading-none">
              PHOTO <span className="text-accent text-stroke-accent">GALLERY.</span>
            </h2>
          </div>

          {/* Autoplay play/pause toggler */}
          <button
            onClick={() => {
              setAutoplayActive(!autoplayActive);
              handleUserInteraction();
            }}
            className="flex items-center gap-2 border border-neutral-800 hover:border-accent text-xs font-mono tracking-widest uppercase py-2 px-4 rounded-full transition-colors duration-300"
          >
            {autoplayActive ? (
              <>
                <Pause className="w-3.5 h-3.5 text-accent" />
                <span>AUTOPLAY: ON</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-neutral-500" />
                <span>AUTOPLAY: OFF</span>
              </>
            )}
          </button>
        </div>

        {/* Cinematic Main Viewport */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Main Large Image Container */}
          <div className="lg:col-span-9 flex flex-col justify-between">
            <div 
              ref={mainImageContainerRef}
              onClick={() => openLightbox(activeIndex)}
              className="group relative h-[320px] sm:h-[450px] md:h-[550px] w-full bg-neutral-950 border border-neutral-900 overflow-hidden cursor-zoom-in"
            >
              <img
                ref={mainImageRef}
                src={galleryItems[activeIndex].src}
                alt={galleryItems[activeIndex].title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover select-none"
              />
              {/* Image Vignette Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/25 pointer-events-none" />
              
              {/* Floating Expand Icon */}
              <div className="absolute top-6 right-6 w-11 h-11 rounded-full bg-black/60 backdrop-blur-md border border-neutral-800 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all duration-300">
                <Maximize2 className="w-4 h-4" />
              </div>

              {/* Slider Meta details inside poster */}
              <div ref={textMetaRef} className="absolute bottom-8 left-8 right-8 z-10 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
                <div className="space-y-1">
                  <span className="font-mono text-xs text-accent tracking-widest uppercase block">
                    {galleryItems[activeIndex].category}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold font-display text-white uppercase tracking-wider">
                    {galleryItems[activeIndex].title}
                  </h3>
                </div>
                {/* Counter indicator */}
                <div className="font-mono text-sm tracking-widest text-neutral-400">
                  <span className="text-white font-bold">{(activeIndex + 1).toString().padStart(2, '0')}</span> / {galleryItems.length.toString().padStart(2, '0')}
                </div>
              </div>
            </div>
          </div>

          {/* Controls + Thumbnails Sidebar */}
          <div className="lg:col-span-3 flex flex-col justify-between border border-neutral-900 bg-neutral-950 p-6 md:p-8 space-y-8">
            <div className="space-y-4">
              <span className="text-xs font-mono text-neutral-500 tracking-wider block">NAVIGATION</span>
              <p className="text-neutral-400 text-xs font-light leading-relaxed">
                Click thumbnails below, scroll up/down, or use side arrows to experience our high-performance facility in high definition.
              </p>
              
              {/* Prev Next Arrows */}
              <div className="flex gap-2">
                <button
                  onClick={prevImage}
                  className="w-12 h-12 border border-neutral-800 hover:border-white rounded-full flex items-center justify-center text-white transition-colors duration-300"
                  aria-label="Previous gallery image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="w-12 h-12 border border-neutral-800 hover:border-white rounded-full flex items-center justify-center text-white transition-colors duration-300"
                  aria-label="Next gallery image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Thumbnail Scroll Previews */}
            <div className="space-y-3">
              <span className="text-xs font-mono text-neutral-500 tracking-wider block">PREVIEWS</span>
              <div 
                ref={thumbnailsRef}
                className="flex lg:grid lg:grid-cols-2 gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 scrollbar-none snap-x"
                style={{ scrollbarWidth: 'none' }}
              >
                {galleryItems.map((item, idx) => (
                  <button
                    key={item.id}
                    onClick={() => selectImage(idx)}
                    className={`flex-shrink-0 w-20 h-20 lg:w-auto lg:h-[70px] border snap-start transition-all duration-300 ${
                      idx === activeIndex 
                        ? 'border-accent scale-[0.98] ring-1 ring-accent' 
                        : 'border-neutral-900 opacity-40 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={item.src}
                      alt={`Thumbnail ${idx}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover select-none"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* FULLSCREEN LIGHTBOX OVERLAY */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-[10005] bg-black/95 backdrop-blur-md flex flex-col justify-between p-6 select-none animate-fadeIn">
          {/* Top Bar of Lightbox */}
          <div className="flex justify-between items-center z-10">
            <div className="font-mono text-xs text-neutral-400 tracking-widest">
              IRON DISTRICT GALLERY // {(lightboxIndex + 1).toString().padStart(2, '0')} OF {galleryItems.length}
            </div>
            <button
              onClick={closeLightbox}
              className="w-12 h-12 rounded-full bg-neutral-900 border border-neutral-800 text-white flex items-center justify-center hover:bg-accent hover:text-black hover:border-accent transition-all duration-300"
              aria-label="Close Lightbox"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Central Main Image */}
          <div className="my-auto relative flex justify-center items-center w-full max-h-[70vh]">
            
            {/* Left Nav in Lightbox */}
            <button
              onClick={prevLightboxImage}
              className="absolute left-2 sm:left-6 w-14 h-14 rounded-full bg-neutral-950/80 border border-neutral-800 text-white flex items-center justify-center hover:bg-white hover:text-black hover:border-white transition-all duration-300 z-10"
              aria-label="Previous lightbox image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Lightbox Active Large Image */}
            <div className="max-w-[90%] md:max-w-[80%] max-h-[70vh] border border-neutral-900 overflow-hidden">
              <img
                src={galleryItems[lightboxIndex].src}
                alt={galleryItems[lightboxIndex].title}
                referrerPolicy="no-referrer"
                className="object-contain max-h-[70vh] mx-auto select-none"
              />
            </div>

            {/* Right Nav in Lightbox */}
            <button
              onClick={nextLightboxImage}
              className="absolute right-2 sm:right-6 w-14 h-14 rounded-full bg-neutral-950/80 border border-neutral-800 text-white flex items-center justify-center hover:bg-white hover:text-black hover:border-white transition-all duration-300 z-10"
              aria-label="Next lightbox image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

          </div>

          {/* Bottom Metabar of Lightbox */}
          <div className="text-center pb-6 z-10 space-y-1">
            <span className="font-mono text-xs text-accent tracking-widest uppercase block">
              {galleryItems[lightboxIndex].category}
            </span>
            <h4 className="text-xl sm:text-2xl font-bold font-display text-white uppercase tracking-wider">
              {galleryItems[lightboxIndex].title}
            </h4>
          </div>
        </div>
      )}
    </section>
  );
}
