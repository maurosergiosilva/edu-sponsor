import { View, Pressable, Image } from "react-native";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

interface CreditCardItemProps {
  card: {
    id: string;
    lastFour: string;
    brand: string;
    name: string;
    expDate: string;
  };
  isSelected: boolean;
  onPress: () => void;
  className?: string;
}

export const CreditCardItem = ({
  card,
  isSelected,
  onPress,
  className,
}: CreditCardItemProps) => {
  return (
    <Pressable
      onPress={onPress}
      className={cn(
        "p-4 border-2 rounded-xl",
        isSelected ? "border-primary bg-primary/5" : "border-muted bg-card",
        className
      )}
    >
      <View className="flex-row items-center space-x-3">
        <Image
          source={require("@/assets/images/mastercard.png")}
          className="w-12 h-8"
          resizeMode="contain"
        />
        <View className="flex-1">
          <Text className="font-medium text-foreground">{card.name}</Text>
          <Text className="text-muted-foreground text-sm mt-1">
            •••• •••• •••• {card.lastFour} • Expira {card.expDate}
          </Text>
        </View>
        {isSelected && (
          <View className="w-5 h-5 rounded-full bg-primary items-center justify-center">
            <View className="w-2 h-2 rounded-full bg-primary-foreground" />
          </View>
        )}
      </View>
    </Pressable>
  );
};
