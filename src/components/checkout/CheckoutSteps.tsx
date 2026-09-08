import { Check } from "lucide-react";

type CheckoutStep = "shipping" | "payment" | "review";

interface CheckoutStepsProps {
  currentStep: CheckoutStep;
  onStepClick?: (step: CheckoutStep) => void;
}

const CheckoutSteps = ({ currentStep, onStepClick }: CheckoutStepsProps) => {
  const steps: CheckoutStep[] = ["shipping", "payment", "review"];
  
  const canGoToStep = (targetStep: CheckoutStep) => {
    const currentIndex = steps.indexOf(currentStep);
    const targetIndex = steps.indexOf(targetStep);
    return targetIndex < currentIndex;
  };

  const handleStepClick = (step: CheckoutStep) => {
    if (onStepClick && canGoToStep(step)) {
      onStepClick(step);
    }
  };

  return (
    <div className="flex justify-center mb-8">
      <div className="flex items-center max-w-md w-full">
        {/* Shipping Step */}
        <div 
          className={`flex flex-col items-center ${currentStep === "shipping" ? "text-perfume-purple" : "text-gray-500"} ${canGoToStep("shipping") ? "cursor-pointer hover:text-perfume-dark-purple" : ""}`}
          onClick={() => handleStepClick("shipping")}
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${currentStep === "shipping" ? "bg-perfume-purple text-white" : "bg-perfume-purple/90 text-white"}`}>
            {currentStep === "shipping" ? <span>1</span> : <Check size={18} />}
          </div>
          <span className="text-sm mt-2 font-medium">Shipping</span>
        </div>
        
        <div className={`w-16 h-1 ${currentStep !== "shipping" ? "bg-perfume-purple" : "bg-gray-200"}`}></div>
        
        {/* Payment Step */}
        <div 
          className={`flex flex-col items-center ${currentStep === "payment" ? "text-perfume-purple" : "text-gray-500"} ${canGoToStep("payment") ? "cursor-pointer hover:text-perfume-dark-purple" : ""}`}
          onClick={() => handleStepClick("payment")}
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${currentStep === "payment" ? "bg-perfume-purple text-white" : currentStep === "review" ? "bg-perfume-purple/90 text-white" : "bg-gray-200"}`}>
            {currentStep === "review" ? <Check size={18} /> : <span>2</span>}
          </div>
          <span className="text-sm mt-2 font-medium">Payment</span>
        </div>
        
        <div className={`w-16 h-1 ${currentStep === "review" ? "bg-perfume-purple" : "bg-gray-200"}`}></div>
        
        {/* Review Step */}
        <div className={`flex flex-col items-center ${currentStep === "review" ? "text-perfume-purple" : "text-gray-500"}`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep === "review" ? "bg-perfume-purple text-white" : "bg-gray-200"}`}>
            <span>3</span>
          </div>
          <span className="text-sm mt-2 font-medium">Review</span>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSteps;
