
import { CartItem } from "@/types";
import { Separator } from "@/components/ui/separator";
import { usePricingSettings } from "@/hooks/usePricingSettings";

interface OrderSummaryProps {
  items: CartItem[];
  totalAmount: number;
}

const OrderSummary = ({ items, totalAmount }: OrderSummaryProps) => {
  const { shipping, tax, orderTotal } = usePricingSettings(totalAmount);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="bg-neutral-900 rounded-none shadow-none p-6 sticky top-24 border border-neutral-800 text-white">
      <h2 className="text-xl font-medium mb-6">Order Summary</h2>

      {/* List of items in cart */}
      <div className="max-h-80 overflow-y-auto mb-6">
        {items.map((item) => (
          <div key={item.product.id} className="flex py-3 border-b last:border-0">
            <div className="w-16 h-16 flex-shrink-0">
              <img 
                src={item.product.image} 
                alt={item.product.name} 
                className="w-full h-full object-cover rounded-md"
              />
            </div>
            <div className="ml-4 flex-grow">
              <p className="text-sm font-medium text-white truncate max-w-[120px]" title={item.product.name}>
                {item.product.name}
              </p>
              <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
              <div className="flex justify-end">
                <span className="text-sm font-medium text-white">₹{(item.product.price * item.quantity).toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-400">
          <span>Subtotal ({totalItems} items)</span>
          <span className="text-white">₹{totalAmount.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between text-sm text-gray-400">
          <span>Shipping</span>
          <span className={shipping === 0 ? "text-perfume-gold" : "text-white"}>
            {shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}
          </span>
        </div>
        
        <div className="flex justify-between text-sm text-gray-400">
          <span>Tax</span>
          <span className="text-white">₹{tax.toFixed(2)}</span>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-neutral-800">
        <div className="flex justify-between items-center mb-1">
          <span className="font-medium text-gray-300">Total</span>
          <span className="text-lg font-bold text-perfume-gold">₹{orderTotal.toFixed(2)}</span>
        </div>
        <p className="text-xs text-gray-500 text-right">Includes all taxes and duties</p>
      </div>
    </div>
  );
};

export default OrderSummary;
