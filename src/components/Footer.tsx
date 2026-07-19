import React, { useState } from 'react';
import { Instagram, Youtube, Facebook, ArrowRight, Check } from 'lucide-react';

export default function Footer() {
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNewsletterSuccess(true);
  };

  return (
    <footer className="bg-[#050505] border-t border-neutral-900 pt-24 pb-12 px-6 md:px-16 overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-20">
        
        {/* Main Grid Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Brand Info */}
          <div className="md:col-span-4 space-y-6">
            <a 
              href="#" 
              onClick={(e) => handleScrollTo(e, 'hero')}
              className="text-3xl font-black tracking-tighter text-white font-display select-none block hover:text-accent transition-colors duration-300"
            >
              IRON <span className="text-accent text-stroke-accent">DISTRICT</span>
            </a>
            <p className="text-neutral-500 text-xs sm:text-sm font-light max-w-sm font-sans tracking-wide leading-relaxed">
              BUILD YOUR STRONGEST SELF.<br />
              An elite, high-performance physical culture club. Built with Olympic steel, professional training rigs, and active recovery systems.
            </p>
            {/* Social Block */}
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full border border-neutral-900 text-neutral-400 hover:text-accent hover:border-accent flex items-center justify-center transition-colors duration-200">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-neutral-900 text-neutral-400 hover:text-accent hover:border-accent flex items-center justify-center transition-colors duration-200">
                <Youtube className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-neutral-900 text-neutral-400 hover:text-accent hover:border-accent flex items-center justify-center transition-colors duration-200">
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick links columns */}
          <div className="md:col-span-4 grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-xs font-mono text-neutral-500 tracking-widest uppercase">NAVIGATION</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#training" onClick={(e) => handleScrollTo(e, 'training')} className="text-xs sm:text-sm text-neutral-400 hover:text-accent font-sans transition-colors duration-200 block uppercase">
                    TRAINING
                  </a>
                </li>
                <li>
                  <a href="#programs" onClick={(e) => handleScrollTo(e, 'programs')} className="text-xs sm:text-sm text-neutral-400 hover:text-accent font-sans transition-colors duration-200 block uppercase">
                    PROGRAMS
                  </a>
                </li>
                <li>
                  <a href="#gallery" onClick={(e) => handleScrollTo(e, 'gallery')} className="text-xs sm:text-sm text-neutral-400 hover:text-accent font-sans transition-colors duration-200 block uppercase">
                    GALLERY
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-mono text-neutral-500 tracking-widest uppercase">CLUB SERVICES</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#coaches" onClick={(e) => handleScrollTo(e, 'coaches')} className="text-xs sm:text-sm text-neutral-400 hover:text-accent font-sans transition-colors duration-200 block uppercase">
                    COACHES
                  </a>
                </li>
                <li>
                  <a href="#membership" onClick={(e) => handleScrollTo(e, 'membership')} className="text-xs sm:text-sm text-neutral-400 hover:text-accent font-sans transition-colors duration-200 block uppercase">
                    MEMBERSHIP
                  </a>
                </li>
                <li>
                  <a href="#contact" onClick={(e) => handleScrollTo(e, 'contact')} className="text-xs sm:text-sm text-neutral-400 hover:text-accent font-sans transition-colors duration-200 block uppercase">
                    CONTACT
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Newsletter Column */}
          <div className="md:col-span-4 space-y-6">
            <div className="space-y-2">
              <h4 className="text-xs font-mono text-neutral-500 tracking-widest uppercase">THE INTEL NEWSLETTER</h4>
              <p className="text-neutral-400 text-xs font-light leading-relaxed">
                Receive biomechanical guidance, nutritional reports, and updates regarding exclusive district camps. No spam. Komplete privacy.
              </p>
            </div>
            {/* Form / Success message */}
            {!newsletterSuccess ? (
              <form onSubmit={handleNewsletterSubmit} className="flex border border-neutral-900 bg-neutral-950 p-1.5 focus-within:border-accent transition-colors duration-300">
                <input
                  type="email"
                  required
                  placeholder="YOUR EMAIL"
                  className="bg-transparent border-0 flex-grow px-3 py-2 text-xs font-mono text-white focus:outline-none focus:ring-0 uppercase placeholder-neutral-700"
                  aria-label="Email address for newsletter"
                />
                <button
                  type="submit"
                  className="w-10 h-10 bg-accent text-black flex items-center justify-center hover:bg-white hover:text-black hover:scale-[1.02] transition-all duration-300"
                  aria-label="Subscribe to newsletter"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <div className="border border-accent/30 bg-[#0a0a0a] p-4 flex items-center gap-3 animate-fadeIn">
                <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent flex items-center justify-center text-accent flex-shrink-0">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-mono text-accent tracking-widest uppercase font-semibold">KOMPLETE REGISTRATION</div>
                  <div className="text-[11px] text-neutral-400 font-sans">Welcome to the District Intel database.</div>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-12 border-t border-neutral-900 font-mono text-[10px] text-neutral-500 tracking-widest">
          <div>© 2026 IRON DISTRICT. ALL RIGHTS RESERVED.</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-accent transition-colors">PRIVACY CODE</a>
            <a href="#" className="hover:text-accent transition-colors">LIABILITY CLAUSE</a>
            <a href="#" className="hover:text-accent transition-colors">DEVELOPER PORTAL</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
