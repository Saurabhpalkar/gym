import { useState } from 'react';
import Preloader from './components/Preloader';
import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import HeroSlider from './components/HeroSlider';
import Introduction from './components/Introduction';
import Programs from './components/Programs';
import Experience from './components/Experience';
import PhotoGallery from './components/PhotoGallery';
import Coaches from './components/Coaches';
import Membership from './components/Membership';
import Testimonials from './components/Testimonials';
import LocationAndCTA from './components/LocationAndCTA';
import Footer from './components/Footer';
import BookingModal from './components/BookingModal';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | undefined>(undefined);

  const handlePreloaderComplete = () => {
    setIsLoading(false);
  };

  const handleOpenBooking = (planName?: string) => {
    setSelectedPlan(planName);
    setIsBookingOpen(true);
  };

  return (
    <div className="relative min-h-screen bg-[#050505] text-white overflow-hidden font-sans antialiased selection:bg-accent selection:text-black">
      {/* 1. Preloader Component */}
      {isLoading && <Preloader onComplete={handlePreloaderComplete} />}

      {/* 2. Global Page Content (Rendered but revealed/interacted with once loaded) */}
      {!isLoading && (
        <>
          {/* Custom Film Grain Overlay for atmospheric mood */}
          <div className="grain-overlay" />

          {/* Desktop Only Premium Cursor */}
          <CustomCursor />

          {/* Nav Bar */}
          <Navbar onOpenBooking={handleOpenBooking} />

          {/* Main sections */}
          <main>
            <HeroSlider onOpenBooking={handleOpenBooking} />
            <Introduction />
            <Programs />
            <Experience />
            <PhotoGallery />
            <Coaches />
            <Membership onOpenBooking={handleOpenBooking} />
            <Testimonials />
            <LocationAndCTA onOpenBooking={handleOpenBooking} />
          </main>

          {/* Footers */}
          <Footer />

          {/* Global Booking & Registration Modal */}
          <BookingModal 
            isOpen={isBookingOpen} 
            onClose={() => setIsBookingOpen(false)} 
            initialPlan={selectedPlan} 
          />
        </>
      )}
    </div>
  );
}
