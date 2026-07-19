import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { X, Check, Calendar, Clock, Sparkles } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPlan?: string;
}

interface FormState {
  name: string;
  email: string;
  phone: string;
  plan: string;
  startDate: string;
  trainingTime: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  startDate?: string;
  trainingTime?: string;
}

export default function BookingModal({ isOpen, onClose, initialPlan }: BookingModalProps) {
  const modalOverlayRef = useRef<HTMLDivElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    phone: '',
    plan: 'Performance',
    startDate: '',
    trainingTime: '',
    message: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  // Sync initial plan if passed
  useEffect(() => {
    if (initialPlan) {
      setForm((prev) => ({ ...prev, plan: initialPlan }));
    } else {
      setForm((prev) => ({ ...prev, plan: 'Performance' }));
    }
  }, [initialPlan, isOpen]);

  // Handle Entrance Animations
  useEffect(() => {
    if (isOpen) {
      setIsSubmitted(false);
      setIsAnimatingOut(false);
      setErrors({});

      // Lock scroll
      document.body.style.overflow = 'hidden';

      const ctx = gsap.context(() => {
        // Overlay fade in
        gsap.fromTo(modalOverlayRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.5, ease: 'power2.out' }
        );

        // Content scale up and fade in
        gsap.fromTo(modalContentRef.current,
          { scale: 0.9, opacity: 0, y: 30 },
          { scale: 1, opacity: 1, y: 0, duration: 0.6, delay: 0.1, ease: 'power3.out' }
        );

        // Form elements stagger reveal
        gsap.fromTo('.reveal-field',
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.05, delay: 0.3, ease: 'power2.out' }
        );
      });

      return () => {
        ctx.revert();
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  // Handle closing animation before triggering onClose callback
  const handleClose = () => {
    if (isAnimatingOut) return;
    setIsAnimatingOut(true);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          setIsAnimatingOut(false);
          document.body.style.overflow = '';
          onClose();
        }
      });

      tl.to(modalContentRef.current, {
        scale: 0.92,
        opacity: 0,
        y: 20,
        duration: 0.4,
        ease: 'power3.in'
      })
      .to(modalOverlayRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.inOut'
      }, '-=0.35');
    });
  };

  const validate = (): boolean => {
    const tempErrors: FormErrors = {};
    let isValid = true;

    if (!form.name.trim()) {
      tempErrors.name = 'Full name is required';
      isValid = false;
    } else if (form.name.trim().length < 3) {
      tempErrors.name = 'Name must be at least 3 characters';
      isValid = false;
    }

    if (!form.email.trim()) {
      tempErrors.email = 'Email address is required';
      isValid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email)) {
        tempErrors.email = 'Enter a valid email address';
        isValid = false;
      }
    }

    if (!form.phone.trim()) {
      tempErrors.phone = 'Phone number is required';
      isValid = false;
    } else {
      const phoneRegex = /^\+?[0-9\s\-()]{10,20}$/;
      if (!phoneRegex.test(form.phone.replace(/[\s\-()]/g, ''))) {
        tempErrors.phone = 'Enter a valid 10-digit phone number';
        isValid = false;
      }
    }

    if (!form.startDate) {
      tempErrors.startDate = 'Preferred start date is required';
      isValid = false;
    }

    if (!form.trainingTime) {
      tempErrors.trainingTime = 'Preferred training slot is required';
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    
    // Clear validation error when editing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Animate form switch to success
    const ctx = gsap.context(() => {
      // Fade out form fields
      gsap.to(formRef.current, {
        opacity: 0,
        y: -15,
        duration: 0.4,
        ease: 'power2.inOut',
        onComplete: () => {
          setIsSubmitted(true);
          // Immediately fade in success block
          gsap.fromTo(successRef.current,
            { scale: 0.9, opacity: 0, y: 15 },
            { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }
          );
        }
      });
    });

    // Reset Form fields
    setForm({
      name: '',
      email: '',
      phone: '',
      plan: 'Performance',
      startDate: '',
      trainingTime: '',
      message: ''
    });
  };

  if (!isOpen) return null;

  return (
    <div 
      ref={modalOverlayRef}
      className="fixed inset-0 z-[10100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none"
      onClick={(e) => {
        if (e.target === modalOverlayRef.current) handleClose();
      }}
    >
      <div 
        ref={modalContentRef}
        className="relative max-w-lg w-full bg-[#0a0a0a] border border-accent p-6 sm:p-10 text-white shadow-[0_0_50px_rgba(204,255,0,0.12)] max-h-[90vh] overflow-y-auto custom-scrollbar"
      >
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-accent transition-colors duration-300 p-1"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSubmitted ? (
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            
            {/* Header */}
            <div className="space-y-2 text-center reveal-field">
              <span className="font-mono text-[10px] text-accent tracking-[0.25em] uppercase block font-semibold">
                BIOMETRIC REGISTRATION
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight font-display text-white uppercase">
                ACQUIRE <span className="text-accent text-stroke-accent">ACCESS.</span>
              </h2>
              <p className="text-neutral-400 text-xs font-sans font-light max-w-sm mx-auto">
                Complete your scheduling and intake preferences below. Our concierge team will process your clearances immediately.
              </p>
            </div>

            <div className="space-y-4">
              
              {/* Full Name */}
              <div className="space-y-1.5 reveal-field">
                <label className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase font-bold">
                  FULL NAME *
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleInputChange}
                  placeholder="e.g. John Doe"
                  className={`w-full bg-neutral-950 border ${
                    errors.name ? 'border-red-500 focus:border-red-500' : 'border-neutral-900 focus:border-accent'
                  } p-3 text-xs font-mono tracking-wider focus:outline-none transition-colors uppercase`}
                />
                {errors.name && (
                  <p className="text-[10px] font-mono text-red-500 tracking-wider uppercase">{errors.name}</p>
                )}
              </div>

              {/* Email & Phone side-by-side */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Email */}
                <div className="space-y-1.5 reveal-field">
                  <label className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase font-bold">
                    EMAIL ADDRESS *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                    className={`w-full bg-neutral-950 border ${
                      errors.email ? 'border-red-500 focus:border-red-500' : 'border-neutral-900 focus:border-accent'
                    } p-3 text-xs font-mono tracking-wider focus:outline-none transition-colors`}
                  />
                  {errors.email && (
                    <p className="text-[10px] font-mono text-red-500 tracking-wider uppercase">{errors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-1.5 reveal-field">
                  <label className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase font-bold">
                    PHONE NUMBER *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleInputChange}
                    placeholder="+91 98765 43210"
                    className={`w-full bg-neutral-950 border ${
                      errors.phone ? 'border-red-500 focus:border-red-500' : 'border-neutral-900 focus:border-accent'
                    } p-3 text-xs font-mono tracking-wider focus:outline-none transition-colors`}
                  />
                  {errors.phone && (
                    <p className="text-[10px] font-mono text-red-500 tracking-wider uppercase">{errors.phone}</p>
                  )}
                </div>

              </div>

              {/* Membership Plan Selection */}
              <div className="space-y-1.5 reveal-field">
                <label className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase font-bold">
                  SELECT MEMBERSHIP PLAN *
                </label>
                <div className="relative">
                  <select
                    name="plan"
                    value={form.plan}
                    onChange={handleInputChange}
                    className="w-full bg-neutral-950 border border-neutral-900 focus:border-accent p-3 text-xs font-mono tracking-wider focus:outline-none transition-colors uppercase appearance-none"
                  >
                    <option value="Essential">Essential Blueprint (₹1,999/mo)</option>
                    <option value="Performance">Performance Protocol (₹3,999/mo)</option>
                    <option value="Elite">Elite Custom (₹7,999/mo)</option>
                  </select>
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-accent">
                    <Sparkles className="w-4 h-4 animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Start Date & Preferred Training Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Preferred Start Date */}
                <div className="space-y-1.5 reveal-field">
                  <label className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase font-bold flex items-center gap-1.5">
                    <Calendar className="w-3 h-3 text-accent" />
                    <span>START DATE *</span>
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={form.startDate}
                    onChange={handleInputChange}
                    className={`w-full bg-neutral-950 border ${
                      errors.startDate ? 'border-red-500 focus:border-red-500' : 'border-neutral-900 focus:border-accent'
                    } p-3 text-xs font-mono tracking-wider focus:outline-none transition-colors uppercase`}
                  />
                  {errors.startDate && (
                    <p className="text-[10px] font-mono text-red-500 tracking-wider uppercase">{errors.startDate}</p>
                  )}
                </div>

                {/* Preferred Training Time */}
                <div className="space-y-1.5 reveal-field">
                  <label className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase font-bold flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-accent" />
                    <span>TRAINING TIME *</span>
                  </label>
                  <select
                    name="trainingTime"
                    value={form.trainingTime}
                    onChange={handleInputChange}
                    className={`w-full bg-neutral-950 border ${
                      errors.trainingTime ? 'border-red-500 focus:border-red-500' : 'border-neutral-900 focus:border-accent'
                    } p-3 text-xs font-mono tracking-wider focus:outline-none transition-colors uppercase appearance-none`}
                  >
                    <option value="">Select slot</option>
                    <option value="Morning (5 AM - 10 AM)">Morning (5 AM - 10 AM)</option>
                    <option value="Mid-day (10 AM - 4 PM)">Mid-day (10 AM - 4 PM)</option>
                    <option value="Evening (4 PM - 8 PM)">Evening (4 PM - 8 PM)</option>
                    <option value="Night (8 PM - 11 PM)">Night (8 PM - 11 PM)</option>
                  </select>
                  {errors.trainingTime && (
                    <p className="text-[10px] font-mono text-red-500 tracking-wider uppercase">{errors.trainingTime}</p>
                  )}
                </div>

              </div>

              {/* Optional Message */}
              <div className="space-y-1.5 reveal-field">
                <label className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase font-bold">
                  OPTIONAL MESSAGE
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Share any background or specific targets..."
                  className="w-full bg-neutral-950 border border-neutral-900 focus:border-accent p-3 text-xs font-mono tracking-wider focus:outline-none transition-colors uppercase resize-none"
                />
              </div>

            </div>

            {/* Submit Button */}
            <div className="reveal-field pt-2">
              <button
                type="submit"
                className="w-full py-4 bg-accent text-black font-extrabold text-xs tracking-widest uppercase hover:bg-white transition-all duration-300 transform active:scale-95"
              >
                SUBMIT REQUEST
              </button>
            </div>

          </form>
        ) : (
          <div ref={successRef} className="space-y-8 text-center py-8">
            <div className="w-20 h-20 rounded-full bg-accent/10 border border-accent flex items-center justify-center text-accent mx-auto animate-pulse">
              <Check className="w-10 h-10" />
            </div>

            <div className="space-y-3">
              <span className="font-mono text-xs text-accent tracking-[0.2em] uppercase block font-semibold">
                REGISTRATION COMPLETING
              </span>
              <h3 className="text-3xl font-black text-white uppercase tracking-wider font-display">
                REQUEST RECEIVED
              </h3>
              <p className="text-neutral-400 text-xs sm:text-sm font-sans font-light leading-relaxed max-w-sm mx-auto">
                Thank you for your interest in Iron District. Our team will contact you shortly.
              </p>
            </div>

            <button
              onClick={handleClose}
              className="px-8 py-3 bg-accent text-black font-extrabold text-xs tracking-widest uppercase hover:bg-white transition-all duration-300"
            >
              PROCEED TO GYM
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
