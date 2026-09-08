
import { useCart } from "@/context/CartContext";
import CheckoutStepsContainer from "@/components/checkout/CheckoutStepsContainer";

const Checkout = () => {
  const { items, totalItems, totalAmount, clearCart } = useCart();

  return (
    <CheckoutStepsContainer 
      items={items}
      totalItems={totalItems}
      totalAmount={totalAmount}
      clearCart={clearCart}
    />
  );
};

export default Checkout;
