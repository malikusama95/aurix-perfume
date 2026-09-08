
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ShippingFormValues, formSchema } from "../ShippingAddressForm";
import AddressFormFields from "./AddressFormFields";
import SaveAddressCheckbox from "./SaveAddressCheckbox";

interface AddressFormProps {
  initialValues: ShippingFormValues;
  onSubmit: (data: ShippingFormValues) => void;
  showSaveOption: boolean;
  saveInfo: boolean;
  setSaveInfo: (checked: boolean) => void;
}

const AddressForm = ({ 
  initialValues, 
  onSubmit, 
  showSaveOption, 
  saveInfo, 
  setSaveInfo 
}: AddressFormProps) => {
  const form = useForm<ShippingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <AddressFormFields control={form.control} setValue={form.setValue} />
        
        {showSaveOption && (
          <SaveAddressCheckbox saveInfo={saveInfo} setSaveInfo={setSaveInfo} />
        )}
        
        <div className="pt-4">
          <Button type="submit" className="btn-primary w-full uppercase tracking-wider">
            CONTINUE TO PAYMENT
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddressForm;
