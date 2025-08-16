import { View } from "react-native";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { InternalTemplate } from "../templates";
import { useState } from "react";
import { SponsorTypeToggle } from "../atoms";
import { ControlledInput, CreditCardSelector } from "../molecules";
import { TermsCheckbox } from "../organisms";
import { formatPhone, formatDocument } from "@/helpers/format";
import { UserData, useUserStore } from "@/store";
import { useRouter } from "expo-router";
import { CREDIT_CARDS } from "@/helpers/constant";

const SponsorSignupSchema = z.discriminatedUnion("sponsorType", [
  z.object({
    sponsorType: z.literal("PF"),
    fullName: z.string().min(3, "Nome completo é obrigatório"),
    cpf: z.string().min(11, "CPF inválido"),
    email: z.email("E-mail inválido"),
    password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
    phone: z.string().min(11, "Telefone inválido"),
    creditCardId: z.string().min(1, "Selecione um cartão"),
    acceptTerms: z
      .boolean()
      .refine((val) => val, "Você deve aceitar os termos"),
  }),
  z.object({
    sponsorType: z.literal("PJ"),
    companyName: z.string().min(3, "Razão social é obrigatória"),
    cnpj: z.string().min(14, "CNPJ inválido"),
    email: z.email("E-mail inválido"),
    password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
    phone: z.string().min(11, "Telefone inválido"),
    representativeName: z
      .string()
      .min(3, "Nome do representante é obrigatório"),
    creditCardId: z.string().min(1, "Selecione um cartão"),
    acceptTerms: z
      .boolean()
      .refine((val) => val, "Você deve aceitar os termos"),
  }),
]);

type SponsorSignupFormData = z.infer<typeof SponsorSignupSchema>;

export const SponsorSignUp = () => {
  const router = useRouter();
  const { signUp, signIn } = useUserStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<SponsorSignupFormData>({
    resolver: zodResolver(SponsorSignupSchema),
    defaultValues: {
      sponsorType: "PF",
      fullName: "Maria da Silva",
      cpf: "12345678909",
      email: "maria.silva@example.com",
      password: "senhaSegura123",
      phone: "48991234567",
      creditCardId: "1",
      acceptTerms: true,
    },
  });

  const sponsorType = form.watch("sponsorType");

  const onSubmit = async (data: SponsorSignupFormData) => {
    setIsSubmitting(true);
    try {
      const baseData = {
        id: Math.random().toString(),
        email: data.email,
        password: data.password,
        phone: data.phone,
        userType: "sponsor" as const,
      };

      let userData;

      if (data.sponsorType === "PF") {
        userData = {
          ...baseData,
          fullName: data.fullName,
          document: data.cpf,
          sponsorType: "PF",
        };
      } else {
        userData = {
          ...baseData,
          companyName: data.companyName,
          representativeName: data.representativeName,
          document: data.cnpj,
          sponsorType: "PJ",
        };
      }

      signUp(userData as UserData);
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
        title="Cadastro de Patrocinador"
        description="Preencha seus dados para oferecer patrocínios"
        onPress={form.handleSubmit(onSubmit)}
        disabled={!form.formState.isValid || isSubmitting}
        className="pb-6"
        hideSettings
      >
        <View className="px-2">
          <View className="flex-row mb-4">
            <SponsorTypeToggle
              type="PF"
              currentType={sponsorType}
              onPress={() => form.setValue("sponsorType", "PF")}
              label="Pessoa Física"
              position="left"
            />
            <SponsorTypeToggle
              type="PJ"
              currentType={sponsorType}
              onPress={() => form.setValue("sponsorType", "PJ")}
              label="Pessoa Jurídica"
              position="right"
            />
          </View>

          {sponsorType === "PJ" ? (
            <>
              <ControlledInput
                form={form}
                name="companyName"
                label="Razão Social"
                placeholder="Digite a razão social da empresa"
              />

              <ControlledInput
                form={form}
                name="cnpj"
                label="CNPJ"
                placeholder="00.000.000/0000-00"
                keyboardType="numeric"
                maxLength={18}
                onChangeText={(text) => {
                  const formatted = formatDocument(text);
                  form.setValue("cnpj", formatted);
                }}
              />

              <ControlledInput
                form={form}
                name="representativeName"
                label="Nome do Representante"
                placeholder="Digite o nome do representante"
              />
            </>
          ) : (
            <>
              <ControlledInput
                form={form}
                name="fullName"
                label="Nome Completo"
                placeholder="Digite seu nome completo"
              />

              <ControlledInput
                form={form}
                name="cpf"
                label="CPF"
                placeholder="000.000.000-00"
                keyboardType="numeric"
                maxLength={14}
                onChangeText={(text) => {
                  const formatted = formatDocument(text);
                  form.setValue("cpf", formatted);
                }}
              />
            </>
          )}

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

          <CreditCardSelector
            control={form.control}
            name="creditCardId"
            cards={CREDIT_CARDS}
          />

          <TermsCheckbox
            control={form.control}
            name="acceptTerms"
            onPress={() =>
              form.setValue("acceptTerms", !form.getValues("acceptTerms"))
            }
          />
        </View>
      </InternalTemplate>
    </FormProvider>
  );
};

export default SponsorSignUp;
