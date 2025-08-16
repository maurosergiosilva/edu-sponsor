import { View } from "react-native";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { ControlledInput } from "../molecules";
import { formatPhone } from "@/helpers/format";
import { InternalTemplate } from "../templates";
import { useState } from "react";
import { TermsCheckbox } from "../organisms";
import { UserData, useUserStore } from "@/store";
import { useRouter } from "expo-router";

const StudentSignupSchema = z.object({
  fullName: z.string().min(3, "Nome completo é obrigatório"),
  email: z.email("E-mail inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  age: z
    .string()
    .refine((val) => !isNaN(Number(val)), "Idade deve ser um número")
    .refine((val) => Number(val) >= 16, "Idade mínima é 16 anos"),
  phone: z.string(),
  acceptTerms: z.boolean().refine((val) => val, "Você deve aceitar os termos"),
});

type StudentSignupFormData = z.infer<typeof StudentSignupSchema>;

export const StudentSignUp = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signUp, signIn } = useUserStore();

  const form = useForm({
    resolver: zodResolver(StudentSignupSchema),
    defaultValues: {
      fullName: "João Pedro Martins",
      email: "joao.martins@example.com",
      age: "16",
      password: "aprendizado2025",
      phone: "48 99123-4567",
      acceptTerms: true,
    },
  });

  const onSubmit = async (data: StudentSignupFormData) => {
    setIsSubmitting(true);
    try {
      const userData: UserData = {
        id: Math.random().toString(),
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        age: data.age,
        phone: data.phone,
        userType: "student",
      };

      signUp(userData);
      console.log("Estudante cadastrado com sucesso!");

      signIn(data.email, data.password);
      console.log("Estudante logado com sucesso!");

      router.push("/homepage");
    } catch (error) {
      console.error("Erro no cadastro:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormProvider {...form}>
      <InternalTemplate
        title="Cadastro de Aluno"
        description="Preencha seus dados para buscar patrocínio"
        onPress={form.handleSubmit(onSubmit)}
        disabled={!form.formState.isValid || isSubmitting}
        hideSettings
      >
        <View className="px-2 gap-4">
          <ControlledInput
            form={form}
            name="fullName"
            label="Nome Completo"
            placeholder="Digite seu nome completo"
          />

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

          <ControlledInput
            form={form}
            name="age"
            label="Idade"
            placeholder="Digite sua idade"
            keyboardType="numeric"
          />

          <ControlledInput
            form={form}
            name="phone"
            label="Telefone"
            placeholder="(00) 00000-0000"
            keyboardType="phone-pad"
            maxLength={15}
            onChangeText={(text) => {
              const formatted = formatPhone(text);
              form.setValue("phone", formatted);
            }}
          />

          <TermsCheckbox
            control={form.control}
            name="acceptTerms"
            onPress={() => {
              form.setValue("acceptTerms", !form.getValues("acceptTerms"));
            }}
          />
        </View>
      </InternalTemplate>
    </FormProvider>
  );
};

export default StudentSignUp;
