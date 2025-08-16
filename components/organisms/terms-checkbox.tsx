import { View } from "react-native";
import { FormField, FormCheckbox } from "@/components/ui/form";
import { Text } from "@/components/ui/text";
import { Control } from "react-hook-form";

interface TermsCheckboxProps {
  control: Control<any>;
  name: string;
  onPress: () => void;
}

export const TermsCheckbox = ({
  control,
  name,
  onPress,
}: TermsCheckboxProps) => (
  <View className="mt-6 flex-row items-start">
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <View className="mt-1 mr-2">
          <FormCheckbox {...field} />
        </View>
      )}
    />
    <Text className="flex-1 text-sm pr-2">
      Li e aceito os termos de uso e privacidade do Edu-Sponsor
    </Text>
  </View>
);
