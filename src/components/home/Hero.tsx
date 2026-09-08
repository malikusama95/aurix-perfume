import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

const coverPhotos = [
  { id: 1, src: "/hero1.jpg", alt: "Aurore - The Golden Standard" },
  { id: 2, src: "/hero2.jpg", alt: "Eclat De Lumiere - Crystalline Perfection" },
  { id: 3, src: "/hero3.jpg", alt: "Velvet Amber - Rich and Artistic" },
];

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 1000], ["0%", "30%"]);

  // Auto-rotate every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % coverPhotos.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + coverPhotos.length) % coverPhotos.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % coverPhotos.length);
  };

  return (
    <div className="relative w-full h-[85vh] min-h-[600px] overflow-hidden bg-neutral-900 flex items-center justify-center group">
      
      {/* Background Images with Ken Burns and Parallax effect */}
      <motion.div 
        className="absolute inset-0 w-full h-full"
        style={{ y: backgroundY }}
      >
        {coverPhotos.map((photo, index) => (
          <div
            key={photo.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? 'opacity-100 z-0' : 'opacity-0 -z-10'
            }`}
          >
          <img
            src={photo.src}
            alt={photo.alt}
            className={`w-full h-full object-cover transition-transform duration-[10000ms] ease-linear ${
              index === currentIndex ? 'scale-110' : 'scale-100'
            }`}
          />
          {/* Elegant dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/40 bg-gradient-to-t from-black/70 via-black/20 to-black/40"></div>
        </div>
      ))}
      </motion.div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 flex flex-col items-center text-center mt-16">
        <span className="text-xs md:text-sm font-bold tracking-[0.3em] text-white/80 uppercase mb-4 opacity-0 animate-[fadeIn_1s_ease-out_0.2s_forwards]">
          The Art of Fragrance
        </span>
        <h1 className="text-5xl md:text-7xl font-serif font-black text-white tracking-widest mb-6 leading-[1.1] max-w-4xl drop-shadow-2xl opacity-0 animate-[fadeIn_1s_ease-out_0.4s_forwards]">
          DISCOVER YOUR <br/> SIGNATURE SCENT
        </h1>
        <p className="text-lg md:text-xl text-white/90 font-light max-w-2xl mb-10 drop-shadow-md opacity-0 animate-[fadeIn_1s_ease-out_0.6s_forwards]">
          Explore our collection of exquisite fragrances, carefully crafted to evoke emotions and capture unforgettable memories.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center opacity-0 animate-[fadeIn_1s_ease-out_0.8s_forwards]">
          <Link to="/products" className="bg-white text-black px-10 py-4 font-bold tracking-[0.2em] uppercase text-xs hover:bg-neutral-200 transition-all hover:scale-105 shadow-xl">
            Shop Collection
          </Link>
          <Link to="/about" className="border border-white text-white px-10 py-4 font-bold tracking-[0.2em] uppercase text-xs hover:bg-white/10 transition-all hover:scale-105 backdrop-blur-sm shadow-xl">
            Our Story
          </Link>
        </div>
      </div>

      {/* Navigation Arrows (Glassmorphism) */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 transition-all opacity-0 group-hover:opacity-100 z-20 shadow-2xl hover:scale-110"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-8 h-8" />
      </button>
      
      <button
        onClick={goToNext}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 transition-all opacity-0 group-hover:opacity-100 z-20 shadow-2xl hover:scale-110"
        aria-label="Next slide"
      >
        <ChevronRight className="w-8 h-8" />
      </button>

      {/* Pagination Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3 z-20">
        {coverPhotos.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`transition-all duration-500 rounded-full shadow-lg ${
              index === currentIndex 
                ? 'w-10 h-1.5 bg-white' 
                : 'w-2 h-1.5 bg-white/40 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Hero;
