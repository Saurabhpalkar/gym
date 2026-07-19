/**
 * IRON DISTRICT — Premium Cinematic Gym Website Script
 * Fully native vanilla JS utilizing GSAP & ScrollTrigger for high performance
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // --- GLOBAL STATE & REFS ---
  let isDeviceDesktop = window.matchMedia('(hover: hover)').matches;

  // --- CUSTOM DESKTOP CURSOR ---
  const cursorDot = document.getElementById('cursorDot');
  const cursorCircle = document.getElementById('cursorCircle');

  if (isDeviceDesktop && cursorDot && cursorCircle) {
    document.addEventListener('mousemove', (e) => {
      // Direct positioning for dot
      gsap.to(cursorDot, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: 'power2.out'
      });
      // Lagged follower position for circular outline
      gsap.to(cursorCircle, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.25,
        ease: 'power2.out'
      });
    });

    // Add pointer events logic to active clickable elements
    const clickables = document.querySelectorAll('a, button, input, select, textarea, .program-panel, .thumb-preview');
    clickables.forEach(item => {
      item.addEventListener('mouseenter', () => {
        document.body.classList.add('custom-cursor-hover');
      });
      item.addEventListener('mouseleave', () => {
        document.body.classList.remove('custom-cursor-hover');
      });
    });
  }

  // --- CINEMATIC PRELOADER ---
  const preloader = document.getElementById('preloader');
  const preloaderCount = document.getElementById('preloaderCount');

  if (preloader && preloaderCount) {
    let countObj = { value: 0 };
    
    // Animate percentage count
    gsap.to(countObj, {
      value: 100,
      duration: 3,
      ease: 'power3.out',
      onUpdate: () => {
        const pad = String(Math.floor(countObj.value)).padStart(3, '0');
        preloaderCount.textContent = `${pad}%`;
      },
      onComplete: () => {
        // Slide out the preloader split or clean slide up
        gsap.to(preloader, {
          yPercent: -100,
          duration: 1.2,
          ease: 'power4.inOut',
          onComplete: () => {
            preloader.style.display = 'none';
            // Start Hero slider progress or initial entry animations
            initHeroSlider();
            initAnimations();
          }
        });
      }
    });
  } else {
    // If no preloader present (fallback)
    initHeroSlider();
    initAnimations();
  }

  // --- MOBILE NAV MENU ---
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const hamburgerIcon = document.getElementById('hamburgerIcon');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-menu-link');

  if (hamburgerBtn && mobileMenu) {
    let isMenuOpen = false;

    const toggleMenu = () => {
      isMenuOpen = !isMenuOpen;
      if (isMenuOpen) {
        mobileMenu.classList.add('open');
        hamburgerIcon.setAttribute('data-lucide', 'x');
        document.body.style.overflow = 'hidden';
      } else {
        mobileMenu.classList.remove('open');
        hamburgerIcon.setAttribute('data-lucide', 'menu');
        document.body.style.overflow = 'auto';
      }
      if (window.lucide) {
        window.lucide.createIcons();
      }
    };

    hamburgerBtn.addEventListener('click', toggleMenu);
    
    // Close on any link clicked
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (isMenuOpen) toggleMenu();
      });
    });
  }

  // --- NAVBAR SCROLL DETECTOR ---
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 80) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // --- HERO SLIDER MODULE ---
  const slidesData = [
    { label: "01 — STRENGTH", title: "BUILD YOUR<br>STRONGEST SELF.", desc: "Train with purpose. Move with power. Become impossible to ignore." },
    { label: "02 — PERFORMANCE", title: "COMMAND YOUR<br>PEAK SPEED.", desc: "Elite sports science designed to expand structural mechanics." },
    { label: "03 — DISCIPLINE", title: "ELIMINATE THE<br>EXCUSES.", desc: "No soft commercial gimmicks. Pure steel, sweat, and performance." },
    { label: "04 — COMMUNITY", title: "JOIN THE ELITE<br>DISTRICT.", desc: "Surround yourself with individuals obsessed with raw execution." }
  ];

  let heroSliderActive = false;
  let heroCurrentIndex = 0;
  let heroIsPlaying = true;
  let heroIsMuted = true;
  let heroProgress = 0;
  let progressInterval = null;

  const heroVideos = [
    document.getElementById('heroVideo1'),
    document.getElementById('heroVideo2'),
    document.getElementById('heroVideo3'),
    document.getElementById('heroVideo4')
  ];

  const heroTitleContainer = document.getElementById('heroTextContainer');
  const currentSlideNumSpan = document.getElementById('currSlideNum');
  const playPauseBtn = document.getElementById('playPauseBtn');
  const playPauseIcon = document.getElementById('playPauseIcon');
  const muteBtn = document.getElementById('muteBtn');
  const muteIcon = document.getElementById('muteIcon');
  const heroProgressBar = document.getElementById('heroProgressBar');

  const prevHeroBtn = document.getElementById('prevHeroBtn');
  const nextHeroBtn = document.getElementById('nextHeroBtn');
  const thumbnailBtns = document.querySelectorAll('.thumb-btn');

  function initHeroSlider() {
    heroSliderActive = true;
    updateHeroSlide(0);
    startProgressTimer();

    // Bind event listeners
    if (playPauseBtn) {
      playPauseBtn.addEventListener('click', () => {
        heroIsPlaying = !heroIsPlaying;
        playPauseIcon.setAttribute('data-lucide', heroIsPlaying ? 'pause' : 'play');
        if (window.lucide) window.lucide.createIcons();

        // Pause/play current video
        const currentVideo = heroVideos[heroCurrentIndex];
        if (currentVideo) {
          if (heroIsPlaying) {
            currentVideo.play().catch(() => {});
          } else {
            currentVideo.pause();
          }
        }
      });
    }

    if (muteBtn) {
      muteBtn.addEventListener('click', () => {
        heroIsMuted = !heroIsMuted;
        muteIcon.setAttribute('data-lucide', heroIsMuted ? 'volume-x' : 'volume-2');
        if (window.lucide) window.lucide.createIcons();

        // Mute/unmute all videos
        heroVideos.forEach(v => {
          if (v) v.muted = heroIsMuted;
        });
      });
    }

    if (prevHeroBtn) {
      prevHeroBtn.addEventListener('click', () => {
        let index = (heroCurrentIndex - 1 + 4) % 4;
        updateHeroSlide(index);
      });
    }

    if (nextHeroBtn) {
      nextHeroBtn.addEventListener('click', () => {
        let index = (heroCurrentIndex + 1) % 4;
        updateHeroSlide(index);
      });
    }

    thumbnailBtns.forEach((btn, idx) => {
      btn.addEventListener('click', () => {
        updateHeroSlide(idx);
      });
    });
  }

  function updateHeroSlide(index) {
    if (index === heroCurrentIndex && heroProgressBar.style.width !== '0%') return;

    // Fade out previous video backdrop, fade in new one
    heroVideos.forEach((v, idx) => {
      if (v) {
        if (idx === index) {
          v.classList.add('active');
          v.muted = heroIsMuted;
          if (heroIsPlaying) {
            v.play().catch(() => {});
          }
        } else {
          v.classList.remove('active');
          v.pause();
          v.currentTime = 0;
        }
      }
    });

    // Update active state in thumbnail previews
    thumbnailBtns.forEach((btn, idx) => {
      if (idx === index) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Animate Text transition elegantly
    if (heroTitleContainer) {
      gsap.to(heroTitleContainer, {
        opacity: 0,
        y: 15,
        duration: 0.3,
        onComplete: () => {
          const s = slidesData[index];
          heroTitleContainer.querySelector('.hero-label').textContent = s.label;
          heroTitleContainer.querySelector('.hero-title').innerHTML = s.title;
          heroTitleContainer.querySelector('.hero-desc').textContent = s.desc;

          gsap.to(heroTitleContainer, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power3.out'
          });
        }
      });
    }

    // Update counter
    if (currentSlideNumSpan) {
      currentSlideNumSpan.textContent = `0${index + 1}`;
    }

    heroCurrentIndex = index;
    heroProgress = 0;
    if (heroProgressBar) {
      heroProgressBar.style.width = '0%';
    }
  }

  function startProgressTimer() {
    if (progressInterval) clearInterval(progressInterval);

    // Run interval every 100ms
    progressInterval = setInterval(() => {
      if (!heroIsPlaying) return;

      heroProgress += (100 / (10000 / 100)); // 10 seconds total duration
      if (heroProgress >= 100) {
        heroProgress = 0;
        // Move to next slide automatically
        let nextIndex = (heroCurrentIndex + 1) % 4;
        updateHeroSlide(nextIndex);
      }

      if (heroProgressBar) {
        heroProgressBar.style.width = `${heroProgress}%`;
      }
    }, 100);
  }


  // --- INTERACTIVE PHOTO GALLERY ARCHIVE ---
  const galleryItems = [
    { url: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=1200", cat: "ATHLETIC PERFORMANCE", title: "HIGH-INTENSITY RUNNING" },
    { url: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=1200", cat: "STRENGTH TRAINING", title: "HEAVY DEADLIFT ALIGNMENT" },
    { url: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=1200", cat: "BODYBUILDING", title: "DUMBBELL RACK INTENSITY" },
    { url: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80&w=1200", cat: "CARDIO POWER", title: "BATTLE ROPE CONDITIONING" },
    { url: "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?auto=format&fit=crop&q=80&w=1200", cat: "COMPUTED RIGS", title: "OLYMPIC BARBELL DEPOT" },
    { url: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&q=80&w=1200", cat: "FUNCTIONAL MOVEMENT", title: "PLYOMETRIC BOX SQUATS" },
    { url: "https://images.unsplash.com/photo-1605296867304-46d5465a25f1?auto=format&fit=crop&q=80&w=1200", cat: "STRENGTH ARCHITECTURE", title: "ELEIKO PLATFORM FOCUS" },
    { url: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&q=80&w=1200", cat: "ATHLETICS", title: "KETTLEBELL SWING INTERVALS" },
    { url: "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&q=80&w=1200", cat: "FIGHT TRAINING", title: "HEAVY BAG WORKOUT" },
    { url: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=1200", cat: "RECOVERY SCIENCE", title: "ACTIVE COLD PLUNGE BASIN" }
  ];

  let galleryIndex = 0;
  let galleryAutoplay = true;
  let galleryTimer = null;

  const mainGalleryImage = document.getElementById('mainGalleryImage');
  const galleryMetaCat = document.getElementById('galleryMetaCat');
  const galleryMetaTitle = document.getElementById('galleryMetaTitle');
  const galleryMetaCurrent = document.getElementById('galleryMetaCurrent');
  const galleryThumbnails = document.querySelectorAll('.thumb-preview');

  const galleryAutoplayToggle = document.getElementById('galleryAutoplayToggle');
  const galleryAutoplayIcon = document.getElementById('galleryAutoplayIcon');
  const galleryAutoplayText = document.getElementById('galleryAutoplayText');

  const prevGalleryBtn = document.getElementById('prevGalleryBtn');
  const nextGalleryBtn = document.getElementById('nextGalleryBtn');

  // Lightbox selectors
  const lightbox = document.getElementById('lightbox');
  const lightboxActiveImage = document.getElementById('lightboxActiveImage');
  const lightboxCurrent = document.getElementById('lightboxCurrent');
  const lightboxMetaCat = document.getElementById('lightboxMetaCat');
  const lightboxMetaTitle = document.getElementById('lightboxMetaTitle');
  const closeLightboxBtn = document.getElementById('closeLightboxBtn');
  const openLightboxBtn = document.getElementById('openLightboxBtn');
  const prevLightboxBtn = document.getElementById('prevLightboxBtn');
  const nextLightboxBtn = document.getElementById('nextLightboxBtn');

  function updateGalleryImage(index) {
    if (!mainGalleryImage) return;

    // Scroll active thumbnail into viewport
    galleryThumbnails.forEach((t, idx) => {
      if (idx === index) {
        t.classList.add('active');
        t.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      } else {
        t.classList.remove('active');
      }
    });

    gsap.to(mainGalleryImage, {
      opacity: 0.1,
      scale: 0.98,
      duration: 0.25,
      onComplete: () => {
        const item = galleryItems[index];
        mainGalleryImage.src = item.url;
        galleryMetaCat.textContent = item.cat;
        galleryMetaTitle.textContent = item.title;
        galleryMetaCurrent.textContent = String(index + 1).padStart(2, '0');

        gsap.to(mainGalleryImage, {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: 'power2.out'
        });
      }
    });

    galleryIndex = index;
    resetGalleryTimer();
  }

  function nextGallery() {
    let idx = (galleryIndex + 1) % galleryItems.length;
    updateGalleryImage(idx);
  }

  function prevGallery() {
    let idx = (galleryIndex - 1 + galleryItems.length) % galleryItems.length;
    updateGalleryImage(idx);
  }

  function resetGalleryTimer() {
    if (galleryTimer) clearInterval(galleryTimer);
    if (galleryAutoplay) {
      galleryTimer = setInterval(() => {
        // Autoplay goes to random slide as specified in design requirements
        const randomIdx = Math.floor(Math.random() * galleryItems.length);
        updateGalleryImage(randomIdx);
      }, 5000); // 5 seconds autoplay speed
    }
  }

  // Bind Gallery controls
  if (galleryThumbnails.length > 0) {
    galleryThumbnails.forEach((thumb, idx) => {
      thumb.addEventListener('click', () => {
        updateGalleryImage(idx);
      });
    });

    if (prevGalleryBtn) {
      prevGalleryBtn.addEventListener('click', prevGallery);
    }
    if (nextGalleryBtn) {
      nextGalleryBtn.addEventListener('click', nextGallery);
    }

    if (galleryAutoplayToggle) {
      galleryAutoplayToggle.addEventListener('click', () => {
        galleryAutoplay = !galleryAutoplay;
        if (galleryAutoplay) {
          galleryAutoplayIcon.setAttribute('data-lucide', 'pause');
          galleryAutoplayText.textContent = "AUTOPLAY: ON";
          resetGalleryTimer();
        } else {
          galleryAutoplayIcon.setAttribute('data-lucide', 'play');
          galleryAutoplayText.textContent = "AUTOPLAY: OFF";
          if (galleryTimer) clearInterval(galleryTimer);
        }
        if (window.lucide) window.lucide.createIcons();
      });
    }

    // Lightbox triggers
    if (openLightboxBtn && lightbox && lightboxActiveImage) {
      openLightboxBtn.addEventListener('click', () => {
        // Show lightbox
        const activeItem = galleryItems[galleryIndex];
        lightboxActiveImage.src = activeItem.url;
        lightboxCurrent.textContent = String(galleryIndex + 1).padStart(2, '0');
        lightboxMetaCat.textContent = activeItem.cat;
        lightboxMetaTitle.textContent = activeItem.title;
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    }

    const closeLightbox = () => {
      if (lightbox) {
        lightbox.classList.remove('open');
        document.body.style.overflow = 'auto';
      }
    };

    if (closeLightboxBtn) {
      closeLightboxBtn.addEventListener('click', closeLightbox);
    }

    // Lightbox nav
    if (prevLightboxBtn) {
      prevLightboxBtn.addEventListener('click', () => {
        let idx = (galleryIndex - 1 + galleryItems.length) % galleryItems.length;
        galleryIndex = idx;
        const item = galleryItems[idx];
        lightboxActiveImage.src = item.url;
        lightboxCurrent.textContent = String(idx + 1).padStart(2, '0');
        lightboxMetaCat.textContent = item.cat;
        lightboxMetaTitle.textContent = item.title;
        updateGalleryImage(idx);
      });
    }

    if (nextLightboxBtn) {
      nextLightboxBtn.addEventListener('click', () => {
        let idx = (galleryIndex + 1) % galleryItems.length;
        galleryIndex = idx;
        const item = galleryItems[idx];
        lightboxActiveImage.src = item.url;
        lightboxCurrent.textContent = String(idx + 1).padStart(2, '0');
        lightboxMetaCat.textContent = item.cat;
        lightboxMetaTitle.textContent = item.title;
        updateGalleryImage(idx);
      });
    }

    // Initial setup
    updateGalleryImage(0);
  }

  // --- TESTIMONIAL SLIDER MODULE ---
  const testimonials = [
    { text: "I stopped looking for motivation and started building discipline. Iron District changed the way I train. The coaching and atmosphere are unmatched anywhere in the city.", author: "ARJUN MEHTA", role: "Member since 2024" },
    { text: "This is a masterpiece of physical culture. There are no row of soft lounge seating or commercial distractions. Every square inch screams heavy lifting.", author: "SNEHA SHARMA", role: "Powerlifting Coach" },
    { text: "The active recovery cryo suites and cold plunge combined with professional Eleiko platforms has completely saved my athletic performance parameters.", author: "ROHIT CHOUDHARY", role: "Pro Athlete" }
  ];

  let testIndex = 0;
  const testimonialContent = document.getElementById('testimonialContent');
  const prevTestimonialBtn = document.getElementById('prevTestimonialBtn');
  const nextTestimonialBtn = document.getElementById('nextTestimonialBtn');
  const testimonialProgress = document.getElementById('testimonialProgress');
  const testimonialNum = document.getElementById('testimonialNum');

  function updateTestimonial(index) {
    if (!testimonialContent) return;

    gsap.to(testimonialContent, {
      opacity: 0,
      y: -10,
      duration: 0.3,
      onComplete: () => {
        const t = testimonials[index];
        testimonialContent.querySelector('.testimonial-quote').textContent = `"${t.text}"`;
        testimonialContent.querySelector('.testimonial-author').textContent = t.author;
        testimonialContent.querySelector('.testimonial-role').textContent = t.role;

        gsap.to(testimonialContent, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out'
        });
      }
    });

    if (testimonialProgress) {
      testimonialProgress.style.width = `${((index + 1) / 3) * 100}%`;
    }

    if (testimonialNum) {
      testimonialNum.textContent = `0${index + 1} / 03`;
    }

    testIndex = index;
  }

  if (testimonialContent) {
    if (prevTestimonialBtn) {
      prevTestimonialBtn.addEventListener('click', () => {
        let idx = (testIndex - 1 + 3) % 3;
        updateTestimonial(idx);
      });
    }
    if (nextTestimonialBtn) {
      nextTestimonialBtn.addEventListener('click', () => {
        let idx = (testIndex + 1) % 3;
        updateTestimonial(idx);
      });
    }
    updateTestimonial(0);
  }

  // --- GSAP SCROLL TRIGGER REVEALS ---
  function initAnimations() {
    // Check if gsap is loaded
    if (!window.gsap || !window.ScrollTrigger) return;

    gsap.registerPlugin(ScrollTrigger);

    // Introduction Stat Counters
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
      const numSpan = card.querySelector('.stat-num');
      const targetVal = parseInt(numSpan.getAttribute('data-target'));

      gsap.from(numSpan, {
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        innerHTML: 0,
        duration: 2,
        ease: 'power3.out',
        snap: { innerHTML: 1 },
        onUpdate: function() {
          let val = Math.floor(this.targets()[0].innerHTML);
          if (targetVal > 100) {
            numSpan.textContent = val.toLocaleString() + '+';
          } else if (numSpan.textContent.includes('DAYS')) {
            numSpan.textContent = val + ' DAYS';
          } else {
            numSpan.textContent = val;
          }
        }
      });
    });

    // Asymmetric Experience Cards Reveal
    const expCards = document.querySelectorAll('.exp-img-card');
    expCards.forEach(card => {
      ScrollTrigger.create({
        trigger: card,
        start: 'top 85%',
        onEnter: () => {
          card.classList.add('active');
        },
        once: true
      });
    });

    // Simple fade parallax scroll for Final CTA background
    const ctaParallaxBg = document.getElementById('ctaParallaxBg');
    if (ctaParallaxBg) {
      gsap.to(ctaParallaxBg, {
        scrollTrigger: {
          trigger: '#finalCta',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        },
        yPercent: 30,
        ease: 'none'
      });
    }
  }

  // --- NEWSLETTER FORM ACTION ---
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert("SUBMITTED // WELCOME TO THE DISTRICT INTEL.");
    });
  }
});

// --- GLOBAL ACQUIRE UTILITY ---
window.enrollPlan = function(planName) {
  alert(`ACQUIRING COMMITTED STATUS // INITIALIZING ${planName} PASSWAY.`);
};

window.openDirections = function() {
  alert(`COORDINATES TRANSFERRED // MAPPED TO 19.0760° N, 72.8777° E`);
};
