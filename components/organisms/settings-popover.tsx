import { Platform, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Text } from "@/components/ui/text";
import { useUserStore } from "@/store";
import { Settings } from "@/lib/icons";
import { ThemeToggle } from "../atoms";
import { useRouter } from "expo-router";
import { useState } from "react";

export const SettingsPopover = () => {
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const insets = useSafeAreaInsets();
  const { signOut } = useUserStore();

  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
  };

  const handleSignOut = () => {
    setOpen(false);
    signOut();
    router.push("/");
  };

  return (
    <Popover onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="ml-2">
          <Settings size={20} className="text-foreground" />
        </Button>
      </PopoverTrigger>
      {open && (
        <PopoverContent
          side={Platform.OS === "web" ? "bottom" : "top"}
          insets={contentInsets}
          className="w-64 p-4"
        >
          <View className="gap-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-medium">Tema</Text>
              <ThemeToggle />
            </View>

            <Button
              variant="destructive"
              onPress={handleSignOut}
              className="mt-2"
            >
              <Text>Sair</Text>
            </Button>
          </View>
        </PopoverContent>
      )}
    </Popover>
  );
};
