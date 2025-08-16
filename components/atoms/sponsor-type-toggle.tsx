import { Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

interface SponsorTypeToggleProps {
  type: "PF" | "PJ";
  currentType: string;
  onPress: () => void;
  label: string;
  position?: "left" | "right";
}

export const SponsorTypeToggle = ({
  type,
  currentType,
  onPress,
  label,
  position = "left",
}: SponsorTypeToggleProps) => {
  const isActive = currentType === type;

  return (
    <Pressable
      onPress={onPress}
      className={cn(
        "flex-1 py-3 px-4 border-2",
        position === "left" ? "rounded-l-xl" : "rounded-r-xl",
        isActive ? "bg-primary border-primary" : "bg-card border-muted"
      )}
    >
      <Text
        className={cn(
          "text-center font-medium",
          isActive ? "text-primary-foreground" : "text-muted-foreground"
        )}
      >
        {label}
      </Text>
    </Pressable>
  );
};
