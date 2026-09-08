
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { ShippingAddress } from "@/hooks/useShippingAddresses";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ShippingAddressSelectorProps {
  addresses: ShippingAddress[];
  selectedAddressId: string;
  onAddressSelect: (addressId: string) => void;
}

const ShippingAddressSelector = ({
  addresses,
  selectedAddressId,
  onAddressSelect,
}: ShippingAddressSelectorProps) => {
  if (addresses.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <Label htmlFor="savedAddress" className="mb-2 block text-base">Select a saved address</Label>
      <Select
        value={selectedAddressId}
        onValueChange={onAddressSelect}
      >
        <SelectTrigger className="w-full bg-background border-input mb-4">
          <SelectValue placeholder="Choose a saved address" />
        </SelectTrigger>
        <SelectContent>
          {addresses.map((address) => (
            <SelectItem key={address.id} value={address.id} className="cursor-pointer">
              {address.full_name} - {address.address}, {address.city}
              {address.is_default ? " (Default)" : ""}
            </SelectItem>
          ))}
          <SelectItem value="new" className="cursor-pointer text-perfume-purple font-medium">+ Add new address</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ShippingAddressSelector;
