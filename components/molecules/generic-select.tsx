import * as React from "react";
import { ScrollView } from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { cn } from "@/lib/utils";
import { Dialog } from "../ui/dialog";

type Option = {
  value: string;
  label: string;
};

type GenericSelectProps = {
  options: Option[];
  selectedValue?: string | null;
  onSelect: (value: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  disabled?: boolean;
};

export const GenericSelect = ({
  options,
  selectedValue = null,
  onSelect,
  placeholder = "Selecione uma opção",
  label,
  className,
  disabled = false,
}: GenericSelectProps) => {
  const [open, setOpen] = React.useState(false);
  const [selectTriggerWidth, setSelectTriggerWidth] = React.useState(0);
  const insets = useSafeAreaInsets();

  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
  };

  return (
    <Select
      value={options.find((opt) => opt.value === selectedValue) || undefined}
      onValueChange={(option) => {
        if (option && option.value) {
          onSelect(option.value);
        }
      }}
      className={cn("w-full", className)}
    >
      {label && (
        <Label nativeID={label} className="mb-1">
          {label}
        </Label>
      )}

      <SelectTrigger
        onPress={() => !disabled && setOpen(true)}
        onLayout={(ev) => {
          setSelectTriggerWidth(ev.nativeEvent.layout.width);
        }}
        disabled={disabled}
        className={cn(
          "flex-row items-center justify-between px-4 py-2",
          disabled && "opacity-50"
        )}
      >
        <SelectValue
          className={cn("text-base", !selectedValue && "text-muted-foreground")}
          placeholder={placeholder}
        >
          {selectedValue
            ? options.find((opt) => opt.value === selectedValue)?.label
            : placeholder}
        </SelectValue>
      </SelectTrigger>

      <Dialog open={open} onOpenChange={setOpen}>
        <SelectContent
          insets={contentInsets}
          style={{ width: selectTriggerWidth }}
          className="px-0"
        >
          <ScrollView className="max-h-64">
            <SelectGroup>
              {options.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  label={option.label}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </ScrollView>
        </SelectContent>
      </Dialog>
    </Select>
  );
};
