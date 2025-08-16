import { View, Pressable, ScrollView } from "react-native";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { InternalTemplate } from "@/components/templates";
import { ControlledInput } from "@/components/molecules";
import { useUserStore } from "@/store";
import { useRouter } from "expo-router";
import { Alert } from "react-native";
import { useState } from "react";
import { cn } from "@/lib/utils";

const SignInSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

type SignInFormData = z.infer<typeof SignInSchema>;

export const SignIn = () => {
  const router = useRouter();
  const { signIn, users } = useUserStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showUserList, setShowUserList] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const form = useForm<SignInFormData>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignInFormData) => {
    setIsSubmitting(true);
    try {
      const user = signIn(data.email, data.password);

      if (user) {
        router.replace("/homepage");
      } else {
        Alert.alert("Erro de login", "E-mail ou senha incorretos.");
      }
    } catch (error) {
      Alert.alert("Erro", "Ocorreu um erro durante o login.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickLogin = (user: { email: string; password: string }) => {
    setSelectedUser(user.email);
    form.setValue("email", user.email);
    form.setValue("password", user.password);
    setShowUserList(false);
  };

  return (
    <InternalTemplate
      title="Entrar na sua conta"
      description="Informe seus dados para acessar o app"
      hideSettings
    >
      <FormProvider {...form}>
        <View className="flex-1 justify-between bg-background">
          {showUserList ? (
            <View className="flex-1">
              <Text className="text-xl font-bold mb-6 text-foreground">
                Selecione uma conta
              </Text>

              <ScrollView className="mb-4">
                {users.map((user) => (
                  <Pressable
                    key={user.id}
                    onPress={() => handleQuickLogin(user)}
                    className={cn(
                      "p-5 mb-3 rounded-lg border",
                      selectedUser === user.email
                        ? "border-primary bg-primary/10"
                        : "border-border bg-card"
                    )}
                  >
                    <View className="flex-row gap-4 items-center">
                      <View className="bg-primary/20 p-2 rounded-full">
                        <Text className="text-primary font-bold text-lg">
                          {user.fullName.charAt(0).toUpperCase()}
                        </Text>
                      </View>

                      <View>
                        <Text className="font-semibold text-foreground">
                          {user.fullName}
                        </Text>

                        <Text className="text-muted-foreground text-sm">
                          {user.email}
                        </Text>

                        <Text className="text-xs mt-1 px-2 py-1 bg-secondary rounded-full self-start text-secondary-foreground">
                          {user.userType === "student"
                            ? "Estudante"
                            : "Patrocinador"}
                        </Text>
                      </View>
                    </View>
                  </Pressable>
                ))}
              </ScrollView>

              <Button
                variant="outline"
                onPress={() => setShowUserList(false)}
                className="mt-4 border-border"
              >
                <Text className="text-foreground">Voltar ao login</Text>
              </Button>
            </View>
          ) : (
            <>
              <View>
                <ControlledInput
                  form={form}
                  name="email"
                  label="E-mail"
                  placeholder="seu@email.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                <ControlledInput
                  form={form}
                  name="password"
                  label="Senha"
                  placeholder="Digite sua senha"
                  secureTextEntry
                />

                {users.length > 0 && (
                  <Pressable
                    onPress={() => setShowUserList(true)}
                    className="mt-3"
                  >
                    <Text className="text-primary text-center font-medium text-base">
                      Entrar com uma conta existente
                    </Text>
                  </Pressable>
                )}
              </View>

              <View className={cn("gap-4 pb-6")}>
                <Button
                  size="lg"
                  className={cn("w-full bg-primary")}
                  onPress={form.handleSubmit(onSubmit)}
                  disabled={isSubmitting}
                >
                  <Text className={cn("text-lg text-primary-foreground")}>
                    {isSubmitting ? "Entrando..." : "Entrar"}
                  </Text>
                </Button>

                <Button
                  variant="link"
                  onPress={() => router.navigate("/")}
                  className="p-0"
                >
                  <Text className="text-primary">Criar nova conta</Text>
                </Button>
              </View>
            </>
          )}
        </View>
      </FormProvider>
    </InternalTemplate>
  );
};

export default SignIn;
