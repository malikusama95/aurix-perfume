
import { Checkbox } from "@/components/ui/checkbox";

interface SaveAddressCheckboxProps {
  saveInfo: boolean;
  setSaveInfo: (checked: boolean) => void;
}

const SaveAddressCheckbox = ({ saveInfo, setSaveInfo }: SaveAddressCheckboxProps) => {
  return (
    <div className="flex items-center space-x-2 pt-3">
      <Checkbox
        id="saveInfo"
        checked={saveInfo}
        onCheckedChange={(checked) => setSaveInfo(checked as boolean)}
        className="border-perfume-purple data-[state=checked]:bg-perfume-purple"
      />
      <label
        htmlFor="saveInfo"
        className="text-sm font-medium text-gray-700 leading-none cursor-pointer hover:text-perfume-dark-purple"
      >
        Save this information for next time
      </label>
    </div>
  );
};

export default SaveAddressCheckbox;
