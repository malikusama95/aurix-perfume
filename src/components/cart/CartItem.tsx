
import { useState } from "react";
import { Link } from "react-router-dom";
import { CartItem as CartItemType } from "@/types";
import { Trash2, Plus, Minus } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Card } from "@/components/ui/card";

interface CartItemProps {
  item: CartItemType;
}

const CartItem = ({ item }: CartItemProps) => {
  const { product, quantity } = item;
  const { updateQuantity, removeItem } = useCart();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleQuantityChange = (newQuantity: number) => {
    setIsUpdating(true);
    if (newQuantity <= 0) {
      removeItem(product.id);
    } else {
      updateQuantity(product.id, newQuantity);
    }
    setTimeout(() => setIsUpdating(false), 300);
  };

  // Calculate the total price for this item
  const totalPrice = product.price * quantity;

  return (
    <Card className="mb-4 overflow-hidden shadow-none border-neutral-800 bg-neutral-900 rounded-none transition-shadow duration-200">
      <div className="flex flex-col sm:flex-row items-start p-4">
        {/* Product Image */}
        <div className="w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 rounded-md overflow-hidden">
          <Link to={`/products/${product.id}`}>
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </Link>
        </div>
        
        {/* Product Details */}
        <div className="ml-0 sm:ml-6 mt-4 sm:mt-0 flex-grow w-full">
          <div className="flex flex-col sm:flex-row sm:justify-between">
            <div>
              <Link to={`/products/${product.id}`} className="group">
                <h3 className="font-medium text-lg text-white group-hover:text-perfume-gold transition-colors">{product.name}</h3>
              </Link>
              <p className="text-sm text-gray-400">{product.brand}</p>
              <p className="text-sm text-gray-400 mt-1">{product.size.value}{product.size.unit}</p>
            </div>
            
            <div className="mt-4 sm:mt-0">
              <span className="font-medium text-lg text-white">₹{totalPrice.toFixed(2)}</span>
              <div className="text-sm text-gray-400 mt-1">Unit Price: ₹{product.price.toFixed(2)}</div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-4 pt-4 border-t border-neutral-800">
            {/* Quantity Controls */}
            <div className="flex items-center">
              <span className="text-sm font-medium mr-3 text-gray-400">Quantity:</span>
              <div className="flex items-center border border-neutral-700 bg-transparent h-10 text-white rounded-none">
                <button 
                  onClick={() => handleQuantityChange(quantity - 1)}
                  className="px-3 h-full text-gray-400 hover:text-white disabled:opacity-50 transition-colors flex items-center justify-center"
                  disabled={isUpdating}
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span className="px-4 py-1 min-w-[2.5rem] text-center text-sm font-medium">{quantity}</span>
                <button 
                  onClick={() => handleQuantityChange(quantity + 1)}
                  className="px-3 h-full text-gray-400 hover:text-white disabled:opacity-50 transition-colors flex items-center justify-center"
                  disabled={isUpdating}
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
            
            {/* Remove Button */}
            <button 
              onClick={() => removeItem(product.id)}
              className="flex items-center mt-4 sm:mt-0 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-none transition-colors"
              aria-label="Remove from cart"
            >
              <Trash2 size={16} className="mr-1" />
              <span>Remove</span>
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CartItem;
