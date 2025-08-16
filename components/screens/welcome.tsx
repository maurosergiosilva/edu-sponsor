import * as React from "react";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Handshake, GraduationCap } from "@/lib/icons";
import { useRouter } from "expo-router";
import { View } from "react-native";
import { InternalTemplate } from "@/components/templates";

export const Welcome = () => {
  const router = useRouter();

  return (
    <InternalTemplate hideSettings>
      <View className="flex-1 justify-between">
        <View className="items-center mt-16">
          <GraduationCap size={48} className="text-primary mb-4" />
          <Text className="text-4xl font-bold text-foreground mb-2">
            Edu-Sponsor
          </Text>
          <Text className="text-lg text-muted-foreground text-center">
            Aproximando talentos e apoiadores para transformar trajetórias de
            estudo
          </Text>
        </View>

        <View className="items-center flex-1 justify-center">
          <Handshake size={120} className="text-primary/90 mb-8" />

          <Text className="text-xl font-semibold text-center mb-6">
            Como você quer participar?
          </Text>
        </View>

        <View className="gap-3">
          <Button
            size="lg"
            className="w-full"
            onPress={() => router.navigate("/student-sign-up")}
          >
            <Text className="text-lg">Quero ampliar meus estudos</Text>
          </Button>

          <Button
            variant="secondary"
            size="lg"
            className="w-full"
            onPress={() => router.navigate("/sponsor-sign-up")}
          >
            <Text className="text-lg">Quero investir em educação</Text>
          </Button>

          <Button
            variant="link"
            onPress={() => router.navigate("/sign-in")}
            className="mt-2"
          >
            <Text className="text-primary">Já possuo cadastro</Text>
          </Button>
        </View>
      </View>
    </InternalTemplate>
  );
};

export default Welcome;
