import { ComponentProps } from "react";
import { TextInput } from "react-native";

import { UseFormReturn } from "react-hook-form";
import { ControlledInputVariants, FormField, FormInput } from "../ui/form";

export interface ControlledInputProps extends ComponentProps<typeof TextInput> {
  form: UseFormReturn<any>;
  name: string;
  label?: string;
  description?: string;
  onDescriptionPress?: () => void;
  showError?: boolean;
  formClassName?: string;
  variant?: ControlledInputVariants;
}

export const ControlledInput = ({
  form,
  name,
  label,
  description,
  onDescriptionPress,
  variant = "default",
  ...props
}: ControlledInputProps) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormInput
          label={label}
          description={description}
          onDescriptionPress={onDescriptionPress}
          onChangeText={(text) => field.onChange(text)}
          variant={variant}
          {...props}
          {...field}
          value={field.value || ""}
        />
      )}
    />
  );
};
