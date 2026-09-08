
import { Plus, Minus } from "lucide-react";

interface ProductQuantityControlsProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  canDecrease: boolean;
  canIncrease: boolean;
}

const ProductQuantityControls = ({ 
  quantity, 
  onIncrease, 
  onDecrease, 
  canDecrease, 
  canIncrease 
}: ProductQuantityControlsProps) => {
  return (
    <div className="flex items-center bg-[#111111] border border-neutral-800 rounded-none h-10 text-white">
      <button 
        onClick={(e) => {
          e.preventDefault();
          onDecrease();
        }}
        className="w-10 h-full text-gray-400 hover:text-white hover:bg-neutral-800 disabled:opacity-50 transition-colors flex items-center justify-center border-r border-neutral-800" 
        disabled={!canDecrease}
      >
        <Minus size={14} />
      </button>
      <span className="w-12 text-center text-sm font-medium">{quantity}</span>
      <button 
        onClick={(e) => {
          e.preventDefault();
          onIncrease();
        }}
        className="w-10 h-full text-gray-400 hover:text-white hover:bg-neutral-800 disabled:opacity-50 transition-colors flex items-center justify-center border-l border-neutral-800"
        disabled={!canIncrease}
      >
        <Plus size={14} />
      </button>
    </div>
  );
};

export default ProductQuantityControls;
