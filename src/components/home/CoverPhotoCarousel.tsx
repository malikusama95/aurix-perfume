
import { useState, useEffect } from 'react';

const coverPhotos = [
  {
    id: 1,
    src: "/perfume1.jpg",
    alt: "Luxury perfume collection"
  },
  {
    id: 2,
    src: "/perfume2.jpg", 
    alt: "Elegant fragrance bottles"
  },
  {
    id: 3,
    src: "/perfume3.jpg",
    alt: "Premium scent experience"
  },
  {
    id: 4,
    src: "/perfume4.jpg",
    alt: "Artisan perfume craftsmanship"
  }
];

const CoverPhotoCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState<boolean[]>(new Array(coverPhotos.length).fill(false));
  const [imageErrors, setImageErrors] = useState<boolean[]>(new Array(coverPhotos.length).fill(false));

  // Auto-rotate images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % coverPhotos.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleImageLoad = (index: number) => {
    console.log(`Image ${index} loaded successfully`);
    setImagesLoaded(prev => {
      const newState = [...prev];
      newState[index] = true;
      return newState;
    });
  };

  const handleImageError = (index: number) => {
    console.error(`Failed to load image ${index}:`, coverPhotos[index].src);
    setImageErrors(prev => {
      const newState = [...prev];
      newState[index] = true;
      return newState;
    });
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + coverPhotos.length) % coverPhotos.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % coverPhotos.length);
  };

  return (
    <div className="absolute inset-0 z-0">
      <div className="relative w-full h-full overflow-hidden bg-gray-200">
        {/* Images */}
        {coverPhotos.map((photo, index) => (
          <div
            key={photo.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {!imageErrors[index] ? (
              <img
                src={photo.src}
                alt={photo.alt}
                className="w-full h-full object-cover"
                loading={index === 0 ? "eager" : "lazy"}
                onLoad={() => handleImageLoad(index)}
                onError={() => handleImageError(index)}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-300 to-purple-500 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-4xl mb-2">🌸</div>
                  <div className="text-lg font-serif">Fragrance Collection</div>
                  <div className="text-sm opacity-80">{photo.alt}</div>
                </div>
              </div>
            )}
            <div className="absolute inset-0 bg-black/20"></div>
          </div>
        ))}

        {/* Loading indicator for current image */}
        {!imagesLoaded[currentIndex] && !imageErrors[currentIndex] && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
            <div className="text-gray-600 flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mb-2"></div>
              <div>Loading...</div>
            </div>
          </div>
        )}

        {/* Navigation arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-colors z-10"
          aria-label="Previous image"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-colors z-10"
          aria-label="Next image"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Dots indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
          {coverPhotos.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentIndex ? 'bg-white' : 'bg-white/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoverPhotoCarousel;
