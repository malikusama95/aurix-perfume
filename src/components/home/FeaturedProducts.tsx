import { useState, useEffect } from "react";
import ProductCard from "@/components/product/ProductCard";
import { useFeaturedProducts } from "@/hooks/useProducts";
import { Loader2 } from "lucide-react";

const FeaturedProducts = () => {
  const { data: featuredProducts = [], isLoading } = useFeaturedProducts();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (featuredProducts.length === 0) return;
    
    const imagePromises = featuredProducts.map(product => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = reject;
        img.src = product.image;
      });
    });

    Promise.all(imagePromises).then(() => setIsLoaded(true)).catch(() => setIsLoaded(true));
  }, [featuredProducts]);

  if (isLoading) {
    return (
      <div className="bg-[#0A0A0A] py-12">
        <div className="container mx-auto px-4 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0A0A0A] py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-serif mb-2 text-white">Featured Fragrances</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Discover our most loved scents, crafted with exquisite ingredients and designed to captivate the senses.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-10">
          <a href="/products" className="btn-secondary inline-block">
            View All Fragrances
          </a>
        </div>
      </div>
    </div>
  );
};

export default FeaturedProducts;
