import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import CartItem from "@/components/cart/CartItem";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShoppingCart, Home, ArrowLeft, Trash2 } from "lucide-react";
import { usePricingSettings } from "@/hooks/usePricingSettings";

const Cart = () => {
  const { items, totalItems, totalAmount, clearCart } = useCart();
  const navigate = useNavigate();
  
  const { shipping, tax, orderTotal, shippingFee, freeShippingThreshold } = usePricingSettings(totalAmount);

  const handleGoBack = () => {
    // Check if there's previous history
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      // Fallback to products page if no history
      navigate("/products");
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="mb-6">
          <ShoppingCart size={64} className="mx-auto text-neutral-800" />
        </div>
        <h2 className="text-2xl font-serif mb-4 text-white">Your Cart is Empty</h2>
        <p className="mb-8 text-gray-400">Explore our collection and add some fragrances to get started.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => navigate("/")} variant="outline" className="bg-transparent gap-2 rounded-none border-white text-white hover:bg-white hover:text-black uppercase tracking-widest text-[10px] font-bold">
            <Home size={16} />
            Go Home
          </Button>
          <Button onClick={() => navigate("/products")} className="gap-2 rounded-none bg-perfume-gold text-black hover:bg-yellow-600 uppercase tracking-widest text-[10px] font-bold">
            <ShoppingCart size={16} />
            Browse Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8 border-b border-neutral-800 pb-4">
        <h1 className="text-3xl font-serif text-white">Your Cart</h1>
        <Button 
          variant="ghost" 
          onClick={handleGoBack}
          className="flex items-center gap-1 text-gray-400 hover:text-white hover:bg-neutral-900 rounded-none uppercase tracking-widest text-[10px] font-bold"
        >
          <ArrowLeft size={16} />
          Continue Shopping
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-xl font-medium text-white">Cart Items ({totalItems})</h2>
            <Button
              onClick={clearCart}
              variant="ghost"
              className="text-red-400 hover:text-red-300 hover:bg-red-900/20 flex items-center gap-1 rounded-none uppercase tracking-widest text-[10px] font-bold"
              size="sm"
            >
              <Trash2 size={16} />
              Clear Cart
            </Button>
          </div>

          <div className="space-y-4">
            {items.map((item) => (
              <CartItem key={item.product.id} item={item} />
            ))}
          </div>
        </div>

        {/* Cart Summary */}
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-24 shadow-none bg-neutral-900 border-neutral-800 rounded-none">
            <h2 className="text-xl font-medium mb-6 border-b border-neutral-800 pb-2 text-white">Order Summary</h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-white">
                <span className="text-gray-400">Subtotal ({totalItems} items)</span>
                <span className="font-medium">₹{totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-white">
                <span className="text-gray-400">Shipping</span>
                <span className={shipping === 0 ? "text-perfume-gold font-medium flex items-center gap-2" : ""}>
                  {shipping === 0 ? (
                    <>
                      <span className="line-through text-gray-600 font-normal">₹{shippingFee.toFixed(2)}</span>
                      Free
                    </>
                  ) : (
                    `₹${shipping.toFixed(2)}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-white">
                <span className="text-gray-400">Estimated Tax</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-neutral-800 pt-4 mt-2">
                <div className="flex justify-between font-medium text-lg text-white">
                  <span>Total</span>
                  <span className="text-perfume-gold">₹{orderTotal.toFixed(2)}</span>
                </div>
                {shipping === 0 && (
                  <p className="text-sm text-perfume-gold mt-1">You qualify for free shipping!</p>
                )}
                {shipping > 0 && (
                  <p className="text-sm text-gray-400 mt-1">Add ₹{(freeShippingThreshold - totalAmount).toFixed(2)} more to get free shipping</p>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => navigate("/checkout")}
                className="w-full bg-perfume-gold hover:bg-yellow-600 text-black rounded-none uppercase tracking-widest text-[10px] font-bold py-6"
                size="lg"
              >
                Proceed to Checkout
              </Button>
              
              <div className="grid grid-cols-2 gap-3 mt-4">
                <Link to="/" className="flex-1">
                  <Button variant="outline" className="w-full rounded-none border-neutral-700 bg-transparent text-gray-300 hover:bg-neutral-800 hover:text-white uppercase tracking-widest text-[10px] font-bold h-12">
                    <Home size={16} className="mr-2" />
                    Home
                  </Button>
                </Link>
                <Link to="/products" className="flex-1">
                  <Button variant="outline" className="w-full rounded-none border-neutral-700 bg-transparent text-gray-300 hover:bg-neutral-800 hover:text-white uppercase tracking-widest text-[10px] font-bold h-12">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Cart;

