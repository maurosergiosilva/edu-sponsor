import { View, Alert } from "react-native";
import { useState } from "react";
import { useUserStore } from "@/store";
import { Button } from "@/components/ui/button";
import { InternalTemplate } from "@/components/templates";
import { useRouter } from "expo-router";
import { Input } from "@/components/ui/input";
import { CreditCardItem } from "../atoms";
import { CREDIT_CARDS } from "@/helpers/constant";
import { Text } from "../ui/text";

export const AddFunds = () => {
  const router = useRouter();
  const { currentUser, addFunds } = useUserStore();
  const [amount, setAmount] = useState("");
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatToBRL = (value: number) => {
    return value?.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handleAddFunds = () => {
    if (!currentUser?.id) return;
    if (!selectedCard) {
      Alert.alert(
        "Selecione um cartão",
        "Por favor, escolha um cartão para adicionar fundos"
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const numericAmount = parseFloat(amount.replace(/\D/g, "")) / 100 || 0;

      if (numericAmount <= 0) {
        Alert.alert("Valor inválido", "O valor deve ser maior que zero");
        return;
      }

      addFunds(currentUser.id, numericAmount);
      Alert.alert(
        "Sucesso",
        `${formatToBRL(
          numericAmount
        )} adicionados com sucesso usando o cartão **** ${
          CREDIT_CARDS.find(({ id }) => id === selectedCard)?.lastFour
        }`
      );
      router.back();
    } catch (error) {
      Alert.alert("Erro", "Ocorreu um erro ao adicionar fundos");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAmountChange = (text: string) => {
    const numericValue = text.replace(/\D/g, "");
    const value = parseFloat(numericValue) / 100 || 0;
    setAmount(formatToBRL(value).replace("R$", "").trim());
  };

  return (
    <InternalTemplate
      title="Adicionar Fundos"
      description="Adicione créditos à sua conta"
    >
      <View className="flex-1 justify-between ">
        <View className="gap-y-6 mb-6">
          <View>
            <Text className="text-lg font-medium mb-2">Saldo Atual:</Text>
            <Text className="text-2xl font-bold">
              {formatToBRL(currentUser?.balance || 0)}
            </Text>
          </View>

          <View>
            <Text className="text-lg font-medium mb-2">Cartão de Crédito:</Text>
            <View className="gap-3">
              {CREDIT_CARDS.map((card) => (
                <CreditCardItem
                  key={card.id}
                  card={card}
                  isSelected={selectedCard === card.id}
                  onPress={() => setSelectedCard(card.id)}
                />
              ))}
            </View>
          </View>

          <View>
            <Text className="text-lg font-medium mb-2">Valor a Adicionar:</Text>
            <Input
              value={amount}
              onChangeText={handleAmountChange}
              placeholder={formatToBRL(0)}
              keyboardType="numeric"
            />
          </View>
        </View>

        <Button
          size="lg"
          className="w-full"
          onPress={handleAddFunds}
          disabled={isSubmitting || !amount || !selectedCard}
        >
          <Text className="text-lg text-secondary">
            {isSubmitting ? "Processando..." : "Adicionar Fundos"}
          </Text>
        </Button>
      </View>
    </InternalTemplate>
  );
};
