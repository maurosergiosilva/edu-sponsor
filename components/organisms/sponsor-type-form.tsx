import { View } from "react-native";
import { SponsorTypeToggle } from "../atoms";

interface SponsorTypeFormProps {
  currentType: string;
  onChangeType: (type: "PF" | "PJ") => void;
}

export const SponsorTypeForm = ({
  currentType,
  onChangeType,
}: SponsorTypeFormProps) => (
  <View className="flex-row mb-4">
    <SponsorTypeToggle
      type="PF"
      currentType={currentType}
      onPress={() => onChangeType("PF")}
      label="Pessoa Física"
      position="left"
    />
    <SponsorTypeToggle
      type="PJ"
      currentType={currentType}
      onPress={() => onChangeType("PJ")}
      label="Pessoa Jurídica"
      position="right"
    />
  </View>
);
