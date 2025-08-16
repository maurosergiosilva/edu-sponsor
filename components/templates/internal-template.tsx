import { ReactNode } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { cn } from "@/lib/utils";
import { Text } from "../ui/text";
import { Button } from "../ui/button";
import { SettingsPopover } from "../organisms";

type InternalTemplateProps = {
  children: ReactNode;
  title?: string;
  description?: string;
  onPress?: () => void;
  buttonLabel?: string;
  disabled?: boolean;
  className?: string;
  hideSettings?: boolean;
};

export const InternalTemplate = ({
  children,
  title,
  onPress,
  buttonLabel = "Continuar",
  description,
  disabled,
  className,
  hideSettings,
}: InternalTemplateProps) => {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={insets.top}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerClassName={cn("flex-grow bg-background")}
          contentContainerStyle={{
            paddingTop: insets.top,
            paddingBottom: insets.bottom + (onPress ? 72 : 24),
          }}
        >
          <View className={cn("flex-1 px-4")}>
            {title && (
              <View className="mb-6">
                <View className="flex-row items-center justify-between">
                  <Text className="text-3xl font-bold text-foreground">
                    {title}
                  </Text>
                  {!hideSettings && <SettingsPopover />}
                </View>

                {description && (
                  <Text className="text-lg text-muted-foreground">
                    {description}
                  </Text>
                )}
              </View>
            )}

            <View className={cn("flex-1", className)}>{children}</View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {onPress && (
        <View
          className="absolute bottom-0 left-0 right-0 px-4 pb-4 pt-2 bg-background border-t border-muted"
          style={{ paddingTop: 20, paddingBottom: insets.bottom }}
        >
          <Button
            size="lg"
            onPress={onPress}
            disabled={disabled}
            className="shadow-sm"
          >
            <Text className="font-semibold text-lg">{buttonLabel}</Text>
          </Button>
        </View>
      )}
    </View>
  );
};
