import { View } from "react-native";
import { Controller } from "react-hook-form";
import { Text } from "@/components/ui/text";
import { CreditCardItem } from "../atoms";
import { cn } from "@/lib/utils";

interface CreditCardSelectorProps {
  control: any;
  name: string;
  cards: Array<{
    id: string;
    lastFour: string;
    brand: string;
    name: string;
    expDate: string;
  }>;
  label?: string;
  className?: string;
}

export const CreditCardSelector = ({
  control,
  name,
  cards,
  label = "Cartão de Crédito",
  className,
}: CreditCardSelectorProps) => (
  <View className={cn("mt-4", className)}>
    <Text className="text-sm font-medium mb-3 text-foreground/80">{label}</Text>
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <View className="gap-3">
          {cards.map((card) => (
            <CreditCardItem
              key={card.id}
              card={card}
              isSelected={value === card.id}
              onPress={() => onChange(card.id)}
            />
          ))}
        </View>
      )}
    />
  </View>
);
