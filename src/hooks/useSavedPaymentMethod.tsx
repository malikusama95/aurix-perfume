
import { useState, useEffect } from "react";
import { PaymentInfo } from "@/components/checkout/PaymentForm";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export const useSavedPaymentMethod = () => {
  const { user } = useAuth();
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    paymentMethod: 'card',
    cardName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    upiId: "",
    upiUtr: "",
    savePaymentMethod: false
  });

  // Load saved payment method on component mount
  useEffect(() => {
    if (user) {
      loadSavedPaymentMethod();
    }
  }, [user]);

  const loadSavedPaymentMethod = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('payment_methods')
        .select()
        .eq('user_id', user.id)
        .eq('is_default', true)
        .maybeSingle();
        
      if (error) throw error;
      
      if (data) {
        // Only display payment processor data (never actual card details)
        const displayText = data.card_last4 
          ? `${data.card_brand?.toUpperCase() || 'Card'} •••• ${data.card_last4}`
          : 'Saved payment method';
        
        setPaymentInfo({
          paymentMethod: 'card',
          cardName: displayText,
          cardNumber: displayText,
          expiryDate: data.card_exp_month && data.card_exp_year 
            ? `${String(data.card_exp_month).padStart(2, '0')}/${String(data.card_exp_year).slice(-2)}`
            : '',
          cvv: '',
          upiId: '',
          savePaymentMethod: true
        });
      }
    } catch (error) {
      console.error("Error loading payment method:", error);
    }
  };

  const savePaymentMethod = async () => {
    if (!user || !paymentInfo.savePaymentMethod || paymentInfo.paymentMethod !== 'card') return;
    
    // SECURITY: Payment method saving is disabled until Stripe integration is complete
    // Never store actual card data in your database - use payment processor tokens only
    
    toast({
      title: "Payment Processor Required",
      description: "Please integrate Stripe or another payment processor to save payment methods securely. Never store card data directly.",
      variant: "destructive"
    });
    
    console.warn("Payment method saving requires Stripe integration. Card data must never be stored directly.");
    
    return false;
  };

  const clearSensitiveData = () => {
    // Clear sensitive payment data from memory
    setPaymentInfo(prev => ({
      ...prev,
      cardNumber: "",
      cvv: "",
      upiId: ""
    }));
  };

  return { paymentInfo, setPaymentInfo, savePaymentMethod, clearSensitiveData };
};
