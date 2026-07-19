export interface VideoSlide {
  id: number;
  label: string;
  title: string;
  description: string;
  ctaText: string;
  videoUrl: string;
  posterUrl: string;
}

export interface GalleryItem {
  id: number;
  src: string;
  title: string;
  category: string;
}

export interface Coach {
  id: number;
  name: string;
  role: string;
  description: string;
  imageUrl: string;
  socials: {
    instagram?: string;
    youtube?: string;
    facebook?: string;
  };
}

export interface MembershipPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  features: string[];
  isFeatured?: boolean;
}

export interface Testimonial {
  id: number;
  quote: string;
  author: string;
  role: string;
}
