
import { Link } from "react-router-dom";
import { Product } from "@/types";

interface ProductInfoProps {
  product: Product;
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  return (
    <>
      <div className="mb-3 flex items-start justify-between">
        <Link to={`/products/${product.id}`}>
          <h3 className="font-serif text-lg font-medium text-white hover:text-perfume-gold transition-colors line-clamp-2 uppercase tracking-widest text-sm">
            {product.name}
          </h3>
        </Link>
        <span className="font-medium text-white">₹{product.price.toFixed(2)}</span>
      </div>

      <p className="text-sm text-gray-400 mb-2">{product.brand}</p>

      <div className="flex items-center text-sm text-perfume-gold mb-4">
        {"★".repeat(Math.floor(product.rating))}
        {"☆".repeat(5 - Math.floor(product.rating))}
        <span className="ml-1 text-gray-500">({product.reviews})</span>
      </div>
    </>
  );
};

export default ProductInfo;
