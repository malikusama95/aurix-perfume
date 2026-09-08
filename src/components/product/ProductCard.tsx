import { useState } from "react";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { useWishlist, useToggleWishlist } from "@/hooks/useWishlist";
import { Card, CardContent } from "@/components/ui/card";
import { Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ProductImage from "./ProductImage";
import ProductInfo from "./ProductInfo";
import ProductActions from "./ProductActions";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem, updateQuantity, items } = useCart();
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: wishlist = [] } = useWishlist();
  const toggleWishlist = useToggleWishlist();

  const isWishlisted = wishlist.some(item => item.product_id === product.id);

  // Check if product is already in cart and get its quantity
  const cartItem = items.find(item => item.product.id === product.id);
  const isInCart = !!cartItem;
  const cartQuantity = cartItem?.quantity || 0;

  const handleAddToCart = () => {
    setIsAdding(true);
    addItem(product, quantity);
    setIsAddedToCart(true);

    // Reset adding state after animation
    setTimeout(() => {
      setIsAdding(false);
    }, 1000);
  };

  const handleIncreaseQuantity = () => {
    if (isInCart) {
      // Directly update cart quantity
      if (cartQuantity < 10) {
        updateQuantity(product.id, cartQuantity + 1);
      }
    } else {
      setQuantity(prev => Math.min(10, prev + 1));
    }
  };

  const handleDecreaseQuantity = () => {
    if (isInCart) {
      // Directly update cart quantity
      if (cartQuantity > 1) {
        updateQuantity(product.id, cartQuantity - 1);
      }
    } else {
      setQuantity(prev => Math.max(1, prev - 1));
    }
  };

  const handleAddMoreToCart = () => {
    setIsAdding(true);
    addItem(product, quantity);

    // Reset adding state after animation
    setTimeout(() => {
      setIsAdding(false);
    }, 1000);
  };

  const showAsAddedToCart = isAddedToCart || isInCart;

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist.mutate(
      { productId: product.id, isWishlisted },
      {
        onError: (err: any) => {
          if (err.message.includes("logged in")) {
            toast({
              title: "Login Required",
              description: "Please log in to add items to your wishlist.",
              variant: "default",
            });
            navigate("/auth");
          } else {
            toast({
              title: "Error",
              description: "Could not update wishlist. Please try again.",
              variant: "destructive",
            });
          }
        },
        onSuccess: (data) => {
          toast({
            title: data.action === 'added' ? "Added to Wishlist" : "Removed from Wishlist",
            description: `${product.name} has been ${data.action} your wishlist.`,
          });
        }
      }
    );
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="h-full group"
    >
      <Card className="h-full overflow-hidden bg-transparent border-none shadow-none group transition-all duration-500 group-hover:shadow-[0_0_30px_rgba(212,175,55,0.1)]">
        <div className="relative">
          <ProductImage product={product} />
          <button 
            onClick={handleWishlistClick}
            className="absolute top-3 right-3 p-2 bg-neutral-900/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-neutral-900 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 z-10 border border-neutral-700"
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart 
              className={`w-5 h-5 transition-colors ${isWishlisted ? 'fill-perfume-gold text-perfume-gold' : 'text-gray-400 hover:text-perfume-gold'}`} 
            />
          </button>
        </div>

        <CardContent className="p-4 flex flex-col flex-grow">
          <ProductInfo product={product} />

          <div className="mt-auto">
            <ProductActions
              product={product}
              quantity={quantity}
              cartQuantity={cartQuantity}
              isInCart={isInCart}
              isAdding={isAdding}
              showAsAddedToCart={showAsAddedToCart}
              onAddToCart={handleAddToCart}
              onAddMoreToCart={handleAddMoreToCart}
              onIncreaseQuantity={handleIncreaseQuantity}
              onDecreaseQuantity={handleDecreaseQuantity}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProductCard;
