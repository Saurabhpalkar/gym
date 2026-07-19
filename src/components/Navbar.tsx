import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  onOpenBooking: (plan?: string) => void;
}

export default function Navbar({ onOpenBooking }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);

  // Scroll event to change bg opacity
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // GSAP animation for mobile overlay
  useEffect(() => {
    if (isOpen) {
      // Open animation
      gsap.killTweensOf([mobileMenuRef.current, '.mobile-link']);
      
      gsap.to(mobileMenuRef.current, {
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
        duration: 0.8,
        ease: "power4.inOut"
      });

      gsap.fromTo('.mobile-link', 
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, delay: 0.3, stagger: 0.08, ease: "power3.out" }
      );
    } else {
      // Close animation
      gsap.killTweensOf([mobileMenuRef.current, '.mobile-link']);
      
      gsap.to(mobileMenuRef.current, {
        clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)",
        duration: 0.8,
        ease: "power4.inOut"
      });
    }
  }, [isOpen]);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    setIsOpen(false);
    
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const navItems = [
    { label: 'TRAINING', id: 'training' },
    { label: 'PROGRAMS', id: 'programs' },
    { label: 'GALLERY', id: 'gallery' },
    { label: 'COACHES', id: 'coaches' },
    { label: 'MEMBERSHIP', id: 'membership' },
    { label: 'CONTACT', id: 'contact' }
  ];

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 py-5 px-6 md:px-16 flex justify-between items-center ${
          isScrolled 
            ? 'bg-black/90 backdrop-blur-md border-b border-neutral-900/60 py-4' 
            : 'bg-gradient-to-b from-black/80 to-transparent'
        }`}
      >
        {/* Logo */}
        <a 
          href="#" 
          onClick={(e) => handleLinkClick(e, 'hero')}
          className="text-2xl font-black tracking-tighter text-white font-display select-none transition-transform hover:scale-[1.02]"
        >
          IRON <span className="text-accent text-stroke-accent">DISTRICT</span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-10">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => handleLinkClick(e, item.id)}
              className="text-xs tracking-widest font-mono font-medium text-neutral-300 hover:text-accent transition-colors duration-300"
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Action Button */}
        <div className="hidden lg:block">
          <button
            onClick={() => onOpenBooking()}
            className="px-6 py-2.5 text-xs font-bold tracking-widest bg-accent text-black font-sans hover:bg-white hover:text-black transition-all duration-300 hover:scale-[1.05] block cursor-pointer"
          >
            GET ACCESS
          </button>
        </div>

        {/* Hamburger Menu Icon */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden text-white hover:text-accent transition-colors p-1"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Fullscreen Mobile Menu Overlay */}
      <div
        ref={mobileMenuRef}
        className="fixed inset-0 z-45 bg-[#050505] flex flex-col justify-between p-8 md:p-16 lg:hidden"
        style={{ clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" }}
      >
        {/* Background Decorative Large Logo */}
        <div className="absolute inset-x-0 bottom-1/4 pointer-events-none select-none text-center opacity-[0.015] leading-none">
          <div className="text-[12vw] font-black font-display text-white">IRON DISTRICT</div>
        </div>

        {/* Top spacing placeholder */}
        <div className="h-16" />

        {/* Navigation Links */}
        <div ref={linksRef} className="flex flex-col space-y-6 md:space-y-8 my-auto pl-4">
          {navItems.map((item) => (
            <div key={item.id} className="overflow-hidden">
              <a
                href={`#${item.id}`}
                onClick={(e) => handleLinkClick(e, item.id)}
                className="mobile-link text-4xl sm:text-5xl md:text-6xl font-extrabold text-white font-display tracking-tight hover:text-accent block transition-colors duration-300"
              >
                {item.label}
              </a>
            </div>
          ))}
        </div>

        {/* Bottom CTA / Details */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pt-8 border-t border-neutral-900">
          <div>
            <div className="text-xs font-mono text-neutral-500 mb-1">MUMBAI, MH</div>
            <div className="text-xs font-mono text-neutral-400">MON – SUN: 05AM – 11PM</div>
          </div>
          <button
            onClick={() => {
              setIsOpen(false);
              onOpenBooking();
            }}
            className="w-full sm:w-auto px-8 py-4 text-center text-sm font-extrabold tracking-widest bg-accent text-black font-sans hover:bg-white hover:text-black transition-all duration-300 cursor-pointer"
          >
            GET ACCESS
          </button>
        </div>
      </div>
    </>
  );
}
