
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus, Minus, Check } from "lucide-react";
import ProductQuantityControls from "./ProductQuantityControls";
import { Product } from "@/types";

interface ProductActionsProps {
  product: Product;
  quantity: number;
  cartQuantity: number;
  isInCart: boolean;
  isAdding: boolean;
  showAsAddedToCart: boolean;
  onAddToCart: () => void;
  onAddMoreToCart: () => void;
  onIncreaseQuantity: () => void;
  onDecreaseQuantity: () => void;
}

const ProductActions = ({
  product,
  quantity,
  cartQuantity,
  isInCart,
  isAdding,
  showAsAddedToCart,
  onAddToCart,
  onAddMoreToCart,
  onIncreaseQuantity,
  onDecreaseQuantity
}: ProductActionsProps) => {
  const displayQuantity = isInCart ? cartQuantity : quantity;

  if (!showAsAddedToCart) {
    return (
      <>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-400">Quantity:</span>
          <ProductQuantityControls
            quantity={quantity}
            onIncrease={onIncreaseQuantity}
            onDecrease={onDecreaseQuantity}
            canDecrease={quantity > 1}
            canIncrease={quantity < 10}
          />
        </div>
        <Button 
          onClick={(e) => {
            e.preventDefault();
            onAddToCart();
          }}
          disabled={!product.inStock || isAdding}
          className={`w-full rounded-none transition-all ${isAdding ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-perfume-gold hover:bg-amber-600 text-black font-semibold'}`}
        >
          {isAdding ? (
            <>
              <Check className="mr-2" size={16} />
              Added to Cart
            </>
          ) : (
            <>
              <ShoppingCart className="mr-2" size={16} />
              Add to Cart
            </>
          )}
        </Button>
      </>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <Link to="/cart" className="w-full">
        <Button variant="outline" className="w-full rounded-none border-neutral-700 bg-transparent text-white hover:bg-neutral-800 hover:text-white uppercase tracking-widest text-[10px] font-bold h-10">
          View Cart
        </Button>
      </Link>
      <div className="flex items-center bg-[#111111] border border-neutral-800 rounded-none h-10 text-white">
        <button 
          onClick={(e) => {
            e.preventDefault();
            onDecreaseQuantity();
          }}
          className="w-10 h-full text-gray-400 hover:text-white hover:bg-neutral-800 transition-colors flex items-center justify-center border-r border-neutral-800" 
        >
          <Minus size={14} />
        </button>
        <span className="flex-1 text-center text-[10px] uppercase tracking-widest font-bold text-perfume-gold">{cartQuantity} In Cart</span>
        <button 
          onClick={(e) => {
            e.preventDefault();
            onIncreaseQuantity();
          }}
          className="w-10 h-full text-gray-400 hover:text-white hover:bg-neutral-800 transition-colors flex items-center justify-center border-l border-neutral-800"
          disabled={cartQuantity >= 10}
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
};

export default ProductActions;
