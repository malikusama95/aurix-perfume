import { useEffect, useState } from "react";
import { useLocation, Link, useSearchParams, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, Loader2, AlertCircle, Banknote, Smartphone, CreditCard, MessageCircle, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useSiteSetting } from "@/hooks/useSiteSettings";

const OrderConfirmation = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const orderIdParam = searchParams.get("order_id");

  const stateOrderId: string | undefined = location.state?.orderId;
  const statePaymentMethod: string | undefined = location.state?.paymentMethod;
  const statePaymentStatus: string | undefined = location.state?.paymentStatus;
  const stateTotalAmount: number | undefined = location.state?.totalAmount;

  const adminWhatsapp = useSiteSetting("admin_whatsapp_number") || "+919876543210";

  const [verifying, setVerifying] = useState<boolean>(!!sessionId);
  const [paid, setPaid] = useState<boolean | null>(null);
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    const run = async () => {
      if (sessionId && orderIdParam) {
        try {
          const { data, error } = await supabase.functions.invoke("verify-payment", {
            body: { sessionId, orderId: orderIdParam },
          });
          if (error) throw error;
          setPaid(!!data?.paid);
        } catch (e) {
          console.error("verify-payment failed", e);
          setPaid(false);
        } finally {
          setVerifying(false);
        }

        // Fetch the order details
        const { data: o } = await supabase
          .from("orders")
          .select("*")
          .eq("id", orderIdParam)
          .maybeSingle();
        if (o) setOrder(o);
      }
    };
    run();
  }, [sessionId, orderIdParam]);

  // No way to identify the order — go home
  if (!sessionId && !stateOrderId) {
    return <Navigate to="/" />;
  }

  const orderNumber = order?.order_number || stateOrderId || "—";
  const paymentMethod = order?.payment_method || statePaymentMethod;
  const paymentStatus = paid === true ? "paid" : paid === false ? "failed" : (order?.payment_status || statePaymentStatus || "unpaid");

  const methodIcon = paymentMethod === "upi" ? <Smartphone className="w-4 h-4" /> :
                     paymentMethod === "cod" ? <Banknote className="w-4 h-4" /> :
                     paymentMethod === "manual" ? <MessageCircle className="w-4 h-4" /> :
                     <CreditCard className="w-4 h-4" />;

  const methodLabel = paymentMethod === "upi" ? "UPI" :
                      paymentMethod === "cod" ? "Cash on Delivery" :
                      paymentMethod === "manual" ? "WhatsApp / Contact Admin" :
                      paymentMethod === "card" ? "Card / Apple Pay / Google Pay" :
                      "—";

  const statusBadge = () => {
    if (verifying) return { icon: <Loader2 className="w-16 h-16 animate-spin text-primary" />, title: "Verifying your payment…", desc: "Hang tight, this only takes a moment." };
    if (paymentStatus === "paid") return { icon: <CheckCircle className="w-16 h-16 text-green-500" />, title: "Payment Successful!", desc: "Your order has been confirmed and is being processed." };
    if (paymentStatus === "cod_pending") return { icon: <Banknote className="w-16 h-16 text-green-600" />, title: "Order Placed!", desc: "Your Cash on Delivery order has been received. Pay when it arrives." };
    if (paymentStatus === "awaiting_contact") return { icon: <MessageCircle className="w-16 h-16 text-emerald-600" />, title: "Order Placed — Contact Us to Complete Payment", desc: "Please message our admin on WhatsApp to arrange payment. Your order will be confirmed once payment is received." };
    if (paymentStatus === "unpaid" && paymentMethod === "upi") return { icon: <Clock className="w-16 h-16 text-orange-500" />, title: "Order Received — Awaiting Verification", desc: "We'll confirm your UPI payment within a few hours." };
    if (paymentStatus === "failed") return { icon: <AlertCircle className="w-16 h-16 text-destructive" />, title: "Payment Failed", desc: "Your payment was not completed. Please try again from the cart." };
    return { icon: <CheckCircle className="w-16 h-16 text-green-500" />, title: "Thank You for Your Order!", desc: "Your order has been successfully placed." };
  };

  const s = statusBadge();

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-6 flex justify-center">{s.icon}</div>
        <h1 className="text-3xl font-serif mb-3">{s.title}</h1>
        <p className="text-lg mb-8 text-muted-foreground">{s.desc}</p>

        <div className="bg-card shadow-sm rounded-lg p-6 mb-8 border">
          <div className="text-left space-y-4">
            <h2 className="text-xl font-medium">Order Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-muted-foreground text-sm">Order Number</p>
                <p className="font-medium">{orderNumber}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Order Date</p>
                <p className="font-medium">{new Date().toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Payment Method</p>
                <p className="font-medium flex items-center gap-2">{methodIcon}{methodLabel}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Payment Status</p>
                <p className="font-medium capitalize">{paymentStatus.replace("_", " ")}</p>
              </div>
              {order?.total_amount && (
                <div>
                  <p className="text-muted-foreground text-sm">Total Paid</p>
                  <p className="font-medium">₹{Number(order.total_amount).toFixed(2)}</p>
                </div>
              )}
              {order?.upi_utr && (
                <div>
                  <p className="text-muted-foreground text-sm">UPI UTR</p>
                  <p className="font-medium">{order.upi_utr}</p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t">
              <h3 className="font-medium mb-2">Next Steps</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm">
                <li>You'll receive an email update when your order ships.</li>
                <li>Track your order anytime from the Order Tracking page.</li>
                {paymentMethod === "upi" && paymentStatus === "unpaid" && (
                  <li>Our team will verify your UPI payment shortly.</li>
                )}
                {paymentMethod === "cod" && (
                  <li>Please keep ₹{order?.total_amount ? Number(order.total_amount).toFixed(2) : ""} ready for the courier.</li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {paymentMethod === "manual" && paymentStatus === "awaiting_contact" && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 mb-8">
            <h3 className="font-medium text-emerald-900 mb-2 flex items-center justify-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Complete Your Payment
            </h3>
            <p className="text-sm text-emerald-800 mb-4">
              Click below to message our admin on WhatsApp. We'll share UPI / bank details so you can pay for order <strong>{orderNumber}</strong>.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={`https://wa.me/${adminWhatsapp.replace(/[^\d]/g, "")}?text=${encodeURIComponent(
                  `Hi, I just placed order ${orderNumber} for ₹${(order?.total_amount ?? stateTotalAmount ?? 0).toFixed
                    ? Number(order?.total_amount ?? stateTotalAmount ?? 0).toFixed(2)
                    : order?.total_amount ?? stateTotalAmount ?? ""}. Please share payment details.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex"
              >
                <Button className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white">
                  <MessageCircle className="w-4 h-4 mr-1" />
                  Message Admin on WhatsApp
                </Button>
              </a>
              <a href={`tel:${adminWhatsapp}`} className="inline-flex">
                <Button variant="outline" className="w-full sm:w-auto">
                  <Phone className="w-4 h-4 mr-1" />
                  Call Admin
                </Button>
              </a>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/order-tracking">
            <Button className="w-full sm:w-auto">Track My Order</Button>
          </Link>
          <Link to="/products">
            <Button variant="outline" className="w-full sm:w-auto">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
