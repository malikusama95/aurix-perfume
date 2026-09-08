
import { CartItem } from "@/types";
import OrderSummary from "./OrderSummary";

interface CheckoutSummaryProps {
  items: CartItem[];
  totalAmount: number;
}

const CheckoutSummary = ({ items, totalAmount }: CheckoutSummaryProps) => {
  return <OrderSummary items={items} totalAmount={totalAmount} />;
};

export default CheckoutSummary;
