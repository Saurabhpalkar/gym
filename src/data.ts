import { VideoSlide, GalleryItem, Coach, MembershipPlan, Testimonial } from './types';

export const videoSlides: VideoSlide[] = [
  {
    id: 1,
    label: "01 — STRENGTH",
    title: "BUILD YOUR STRONGEST SELF.",
    description: "Train with purpose. Move with power. Become impossible to ignore.",
    ctaText: "START YOUR JOURNEY",
    videoUrl: "https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c02227d87174ac2a7b73b0d4aa608853&profile_id=164&oauth2_token_id=57447761",
    posterUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1200"
  },
  {
    id: 2,
    label: "02 — PERFORMANCE",
    title: "PUSH BEYOND LIMITS.",
    description: "High-performance training for people who refuse average.",
    ctaText: "BOOK A SESSION",
    videoUrl: "https://player.vimeo.com/external/435674703.sd.mp4?s=7fdf1af1a94154fa16b060d402120e58fa266d62&profile_id=165&oauth2_token_id=57447761",
    posterUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=1200"
  },
  {
    id: 3,
    label: "03 — DISCIPLINE",
    title: "DISCIPLINE CREATES RESULTS.",
    description: "Every rep. Every day. Every level.",
    ctaText: "JOIN NOW",
    videoUrl: "https://player.vimeo.com/external/510850877.sd.mp4?s=d0db5d3bc64627ef1cf1613b5ee0ae1a30ff524e&profile_id=165&oauth2_token_id=57447761",
    posterUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=1200"
  },
  {
    id: 4,
    label: "04 — COMMUNITY",
    title: "STRONGER TOGETHER.",
    description: "Train alongside people who push you further.",
    ctaText: "GET ACCESS",
    videoUrl: "https://player.vimeo.com/external/435675628.sd.mp4?s=6a4574a682ff7b5247c11f75e0be95ffae7594d7&profile_id=165&oauth2_token_id=57447761",
    posterUrl: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&q=80&w=1200"
  }
];

export const galleryItems: GalleryItem[] = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=800",
    title: "HIGH-INTENSITY RUNNING",
    category: "ATHLETIC PERFORMANCE"
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=800",
    title: "KETTLEBELL FLOWS",
    category: "STRENGTH TRAINING"
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=800",
    title: "HEAVY OVERHEAD PRESS",
    category: "STRENGTH TRAINING"
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80&w=800",
    title: "PREMIUM POWER RACKS",
    category: "GYM INTERIOR"
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?auto=format&fit=crop&q=80&w=800",
    title: "OLYMPIC PLATFORMS",
    category: "GYM INTERIOR"
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&q=80&w=800",
    title: "PREMIUM BOXING BAGS",
    category: "BOXING & CONDITIONING"
  },
  {
    id: 7,
    src: "https://images.unsplash.com/photo-1605296867304-46d5465a25f1?auto=format&fit=crop&q=80&w=800",
    title: "HEAVY DEADLIFTS",
    category: "STRENGTH TRAINING"
  },
  {
    id: 8,
    src: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&q=80&w=800",
    title: "DUMBBELL SELECTIONS",
    category: "STRENGTH TRAINING"
  },
  {
    id: 9,
    src: "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&q=80&w=800",
    title: "OUTDOOR ATHLETICS",
    category: "ATHLETIC PERFORMANCE"
  },
  {
    id: 10,
    src: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=800",
    title: "FUNCTIONAL BATTLE ROPES",
    category: "BOXING & CONDITIONING"
  }
];

export const coaches: Coach[] = [
  {
    id: 1,
    name: "Alex Morgan",
    role: "Strength Coach",
    description: "Former competitive powerlifter. 10+ years coaching elite strength athletes and beginners.",
    imageUrl: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&q=80&w=600",
    socials: { instagram: "#", youtube: "#", facebook: "#" }
  },
  {
    id: 2,
    name: "Daniel Carter",
    role: "Performance Coach",
    description: "Specializes in explosive power, athletic movement, speed, and recovery protocols.",
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600",
    socials: { instagram: "#", youtube: "#", facebook: "#" }
  },
  {
    id: 3,
    name: "Maya Lewis",
    role: "Conditioning Coach",
    description: "HIIT, boxing, and energy systems expert. Dedicated to building bulletproof cardio capacity.",
    imageUrl: "https://images.unsplash.com/photo-1548690312-e3b507d8c110?auto=format&fit=crop&q=80&w=600",
    socials: { instagram: "#", youtube: "#", facebook: "#" }
  }
];

export const membershipPlans: MembershipPlan[] = [
  {
    id: "essential",
    name: "ESSENTIAL",
    price: "₹1,999",
    period: "MONTH",
    features: [
      "Full Gym Access",
      "Locker & Shower Access",
      "Complimentary Fitness Assessment",
      "Standard Towel Service"
    ]
  },
  {
    id: "performance",
    name: "PERFORMANCE",
    price: "₹3,999",
    period: "MONTH",
    features: [
      "Full Gym Access",
      "All Premium Group Classes",
      "Monthly 1-on-1 Coaching Session",
      "Personalized Nutrition Guidance",
      "Priority Locker Bookings"
    ],
    isFeatured: true
  },
  {
    id: "elite",
    name: "ELITE",
    price: "₹7,999",
    period: "MONTH",
    features: [
      "Unlimited Personal Training",
      "Fully Custom Training & Goal Plan",
      "Weekly Body Composition Reports",
      "Premium Nutrition & Recovery Coaching",
      "Priority 24/7 Club Access",
      "Private VIP Lounge Access"
    ]
  }
];

export const testimonials: Testimonial[] = [
  {
    id: 1,
    quote: "I stopped looking for motivation and started building discipline. Iron District changed the way I train. The coaching and atmosphere are unmatched anywhere in the city.",
    author: "ARJUN MEHTA",
    role: "Member since 2024"
  },
  {
    id: 2,
    quote: "The elite equipment, the community, and the expert guidance make every session feel like a professional athlete's camp. There is simply no other standard.",
    author: "KABIR MALHOTRA",
    role: "Competitive Lifter"
  },
  {
    id: 3,
    quote: "I joined hoping to shed some weight, but I ended up discovering a brand new level of performance. This isn't just a gym—it's a lifestyle of absolute dedication.",
    author: "RHEA SHARMA",
    role: "Triathlete & Member"
  }
];
