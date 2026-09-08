
import { useState } from "react";
import { Link } from "react-router-dom";
import { Product } from "@/types";

interface ProductImageProps {
  product: Product;
}

const ProductImage = ({ product }: ProductImageProps) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = () => {
    console.log(`Product image loaded successfully for ${product.name}: ${product.image}`);
    setImageLoaded(true);
  };

  const handleImageError = () => {
    console.error(`Failed to load product image for ${product.name}: ${product.image}`);
    setImageError(true);
  };

  return (
    <Link to={`/products/${product.id}`} className="h-64 overflow-hidden relative block">
      {!imageError ? (
        <div className="w-full h-64 relative bg-gray-100">
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          )}
          <img 
            src={product.image} 
            alt={product.name} 
            className={`w-full h-full object-cover transition-all duration-300 ${
              imageLoaded ? 'opacity-100 hover:scale-105' : 'opacity-0'
            }`}
            loading="lazy"
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        </div>
      ) : (
        <div className="w-full h-64 bg-gradient-to-br from-purple-200 to-purple-400 flex items-center justify-center">
          <div className="text-center text-purple-800">
            <div className="text-3xl mb-2">🌸</div>
            <div className="text-sm font-medium">{product.name}</div>
            <div className="text-xs opacity-80">{product.category}</div>
          </div>
        </div>
      )}
      {!product.inStock && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            Out of Stock
          </span>
        </div>
      )}
    </Link>
  );
};

export default ProductImage;
