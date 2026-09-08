
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export const CartButton = () => {
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [animateCount, setAnimateCount] = useState(false);

  // Animate the cart count when it changes
  useEffect(() => {
    if (totalItems > 0) {
      setAnimateCount(true);
      const timer = setTimeout(() => setAnimateCount(false), 300);
      return () => clearTimeout(timer);
    }
  }, [totalItems]);

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={() => navigate("/cart")} 
      className="relative flex items-center justify-center hover:bg-white/10 transition-colors h-10 w-10 rounded-full"
    >
      <ShoppingCart className="h-5 w-5 text-white" />
      {totalItems > 0 && (
        <span 
          className={`absolute -top-1 -right-1 bg-perfume-gold text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-sm transition-transform duration-300 ${
            animateCount ? 'scale-125' : 'scale-100'
          }`}
        >
          {totalItems}
        </span>
      )}
    </Button>
  );
};
