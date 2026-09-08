
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CartItem } from "@/types";
import { CreditCard, MapPin, Smartphone, ShoppingCart } from "lucide-react";
import { type ShippingFormValues } from "./ShippingAddressForm";
import { PaymentInfo } from "./PaymentForm";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ShippingAddress } from "@/hooks/useShippingAddresses";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

interface OrderReviewProps {
  shippingInfo: ShippingFormValues;
  paymentInfo: PaymentInfo;
  items: CartItem[];
  onBack: () => void;
  onSubmit: () => void;
  savedAddresses?: ShippingAddress[];
  onAddressSelect?: (address: ShippingAddress) => void;
  saveAddress?: boolean;
  onSaveAddressChange?: (save: boolean) => void;
  selectedAddressId?: string | null;
}

const OrderReview = ({ 
  shippingInfo, 
  paymentInfo, 
  items, 
  onBack, 
  onSubmit,
  savedAddresses = [],
  onAddressSelect,
  saveAddress = false,
  onSaveAddressChange,
  selectedAddressId = null
}: OrderReviewProps) => {
  const [showAddressDropdown, setShowAddressDropdown] = useState(false);
  
  // Generate subtotal, shipping, and total
  const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + shipping;

  const getPaymentMethodDisplay = () => {
    switch (paymentInfo.paymentMethod) {
      case 'card':
        return {
          icon: <CreditCard size={18} className="mr-2 text-perfume-purple" />,
          title: 'Credit/Debit Card',
          details: `Card ending in ${paymentInfo.cardNumber.slice(-4)}`,
          subDetails: `Expiry: ${paymentInfo.expiryDate}`
        };
      case 'upi':
        return {
          icon: <Smartphone size={18} className="mr-2 text-orange-600" />,
          title: 'UPI Transaction',
          details: paymentInfo.upiUtr ? `UTR: ${paymentInfo.upiUtr}` : 'Awaiting UPI confirmation',
          subDetails: null
        };
      case 'cod':
        return {
          icon: <ShoppingCart size={18} className="mr-2 text-green-600" />,
          title: 'Cash on Delivery',
          details: 'Pay in cash when order arrives',
          subDetails: null
        };
      default:
        return {
          icon: <CreditCard size={18} className="mr-2 text-perfume-purple" />,
          title: 'Payment Method',
          details: 'Not selected',
          subDetails: null
        };
    }
  };

  const paymentDisplay = getPaymentMethodDisplay();

  return (
    <div className="bg-neutral-900 rounded-none p-6 shadow-none border border-neutral-800 space-y-8 text-white">
      <h2 className="text-xl font-medium mb-4">Order Review</h2>
      
      {/* Shipping Address Section */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium text-base flex items-center">
            <MapPin size={18} className="mr-2 text-perfume-purple" />
            Shipping Address
          </h3>
          
          {savedAddresses.length > 0 && onAddressSelect && (
            <DropdownMenu open={showAddressDropdown} onOpenChange={setShowAddressDropdown}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto rounded-none border-neutral-700 text-white hover:bg-neutral-800 hover:text-white uppercase tracking-widest text-[10px] font-bold">
                  Change Address
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72">
                {savedAddresses.map((address) => (
                  <DropdownMenuItem 
                    key={address.id}
                    className={`cursor-pointer ${address.id === selectedAddressId ? "bg-muted" : ""}`}
                    onClick={() => {
                      onAddressSelect(address);
                      setShowAddressDropdown(false);
                    }}
                  >
                    <div className="border-t border-neutral-800 pt-4 mb-6">
                      <p className="font-medium">{address.full_name}</p>
                      <p className="text-xs text-muted-foreground truncate">{address.address}, {address.city}, {address.state}</p>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        
        <Card className="overflow-hidden">
          <CardContent className="p-4">
            <p className="font-medium">{shippingInfo.fullName}</p>
            <p>{shippingInfo.address}</p>
            <p>
              {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zip}
            </p>
            <p>{shippingInfo.country}</p>
            <div className="mt-3 text-sm text-muted-foreground">
              <p>{shippingInfo.email}</p>
              <p>{shippingInfo.phone}</p>
            </div>
          </CardContent>
        </Card>
        
        {onSaveAddressChange && !selectedAddressId && (
          <div className="flex items-center space-x-2 mt-3">
            <Checkbox 
              id="save-address" 
              checked={saveAddress}
              onCheckedChange={(checked) => onSaveAddressChange(!!checked)} 
            />
            <label htmlFor="save-address" className="text-sm text-muted-foreground cursor-pointer">
              Save this address for future shopping
            </label>
          </div>
        )}
      </div>
      
      {/* Payment Method Section */}
      <div>
        <h3 className="font-medium text-base mb-3 flex items-center">
          {paymentDisplay.icon}
          Payment Method
        </h3>
        <Card className="overflow-hidden">
          <CardContent className="p-4">
            <p className="font-medium">{paymentDisplay.title}</p>
            {paymentDisplay.details && (
              <p className="text-sm text-muted-foreground mt-1">{paymentDisplay.details}</p>
            )}
            {paymentDisplay.subDetails && (
              <p className="text-sm text-muted-foreground">{paymentDisplay.subDetails}</p>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Order Items Section */}
      <div>
        <h3 className="font-medium text-base mb-3">Order Items</h3>
        <Card className="overflow-hidden">
          <CardContent className="p-4 divide-y">
            {items.map((item) => (
              <div key={item.product.id} className="py-3 first:pt-0 last:pb-0 flex justify-between items-center">
                <div className="flex items-center">
                  <img 
                    src={item.product.image} 
                    alt={item.product.name} 
                    className="w-16 h-16 object-cover rounded-none mr-4"
                  />
                  <div>
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                </div>
                <p className="font-medium">₹{(item.product.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      
      {/* Action Buttons */}
      <div className="pt-2">
        <Button 
          onClick={onBack}
          className="btn-secondary w-full mb-4"
        >
          Back
        </Button>
        <Button 
          onClick={onSubmit}
          className="btn-gold w-full"
        >
          Place Order
        </Button>
      </div>
    </div>
  );
};

export default OrderReview;
