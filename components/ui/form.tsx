import * as React from "react";
import { Pressable, View } from "react-native";

import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  FormProvider,
  Noop,
  useFormContext,
} from "react-hook-form";

import { Checkbox } from "./checkbox";
import { Input } from "./input";
import { Label } from "./label";
import { RadioGroup } from "./radio-group";
import { type Option, Select } from "./select";
import { Text } from "./text";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react-native";

const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
);

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState, handleSubmit } = useFormContext();

  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }

  const { nativeID } = itemContext;

  return {
    nativeID,
    name: fieldContext.name,
    formItemNativeID: `${nativeID}-form-item`,
    formDescriptionNativeID: `${nativeID}-form-item-description`,
    formMessageNativeID: `${nativeID}-form-item-message`,
    handleSubmit,
    ...fieldState,
  };
};

type FormItemContextValue = {
  nativeID: string;
};

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
);

const FormItem = React.forwardRef<
  React.ElementRef<typeof View>,
  React.ComponentPropsWithoutRef<typeof View>
>(({ className, ...props }, ref) => {
  const nativeID = React.useId();

  return (
    <FormItemContext.Provider value={{ nativeID }}>
      <View ref={ref as any} className={cn("gap-2", className)} {...props} />
    </FormItemContext.Provider>
  );
});
FormItem.displayName = "FormItem";

const FormLabel = React.forwardRef<
  React.ElementRef<typeof Label>,
  Omit<React.ComponentPropsWithoutRef<typeof Label>, "children"> & {
    children: string;
  }
>(({ className, nativeID: _nativeID, ...props }, ref) => {
  const { error, formItemNativeID } = useFormField();

  return (
    <Label
      ref={ref as any}
      className={cn(
        "native:pb-2 px-px pb-1",
        error && "text-destructive",
        className
      )}
      nativeID={formItemNativeID}
      {...props}
    />
  );
});
FormLabel.displayName = "FormLabel";

const FormDescription = React.forwardRef<React.ElementRef<typeof Text>, any>(
  ({ className, onPress, ...props }, ref) => {
    const { formDescriptionNativeID } = useFormField();

    const content = (
      <Text
        ref={ref as any}
        nativeID={formDescriptionNativeID}
        className={cn(
          "pt-1 text-sm text-muted-foreground",
          className,
          onPress && "text-primary"
        )}
        {...props}
      />
    );

    return onPress ? (
      <Pressable onPress={onPress}>{content}</Pressable>
    ) : (
      content
    );
  }
);
FormDescription.displayName = "FormDescription";

const FormMessage = React.forwardRef<
  React.ElementRef<typeof Text>,
  React.ComponentPropsWithoutRef<typeof Text>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageNativeID } = useFormField();
  const body = error ? String(error?.message) : children;

  return (
    <Text
      ref={ref as any}
      nativeID={formMessageNativeID}
      className={cn("text-xs font-medium text-destructive", className)}
      {...props}
    >
      {body}
    </Text>
  );
});
FormMessage.displayName = "FormMessage";

type Override<T, U> = Omit<T, keyof U> & U;

interface FormFieldFieldProps<T> {
  name: string;
  onBlur: Noop;
  onChange: (val: T) => void;
  value: T;
  disabled?: boolean;
}

export type ControlledInputVariants = "default" | "password" | "currency";

type FormItemProps<T extends React.ElementType<any>, U> = Override<
  React.ComponentPropsWithoutRef<T>,
  FormFieldFieldProps<U>
> & {
  label?: string;
  description?: string;
  onDescriptionPress?: () => void;
  variant?: ControlledInputVariants;
  showError?: boolean;
  formClassName?: string;
};

const FormInput = React.forwardRef<
  React.ElementRef<typeof Input>,
  FormItemProps<typeof Input, string>
>(
  (
    {
      label,
      description,
      onChange,
      onDescriptionPress,
      variant,
      showError = true,
      ...props
    },
    ref
  ) => {
    const [passwordVisible, setPasswordVisible] = React.useState(false);
    const inputRef = React.useRef<React.ComponentRef<typeof Input>>(null);

    const {
      error,
      formItemNativeID,
      formDescriptionNativeID,
      formMessageNativeID,
    } = useFormField();

    React.useImperativeHandle(
      ref,
      () => {
        if (!inputRef.current) {
          return {} as React.ComponentRef<typeof Input>;
        }
        return inputRef.current;
      },
      []
    );

    function handleOnLabelPress() {
      if (!inputRef.current) {
        return;
      }
      if (inputRef.current.isFocused()) {
        inputRef.current?.blur();
      } else {
        inputRef.current?.focus();
      }
    }

    const isPassword = variant === "password";

    const removeAutoCapitalize =
      isPassword || props.keyboardType === "email-address";

    return (
      <FormItem
        className={cn(props.formClassName, description ? "mb-6" : "mb-0")}
      >
        {!!label && (
          <FormLabel
            className="m-0 p-0"
            nativeID={formItemNativeID}
            onPress={handleOnLabelPress}
          >
            {label}
          </FormLabel>
        )}

        <View className="relative">
          <Input
            ref={inputRef as any}
            aria-labelledby={formItemNativeID}
            aria-describedby={
              !error
                ? `${formDescriptionNativeID}`
                : `${formDescriptionNativeID} ${formMessageNativeID}`
            }
            aria-invalid={!!error}
            onChangeText={onChange}
            secureTextEntry={isPassword && !passwordVisible}
            autoCapitalize={removeAutoCapitalize ? "none" : "sentences"}
            {...props}
          />

          {isPassword && (
            <Pressable
              onPress={() => setPasswordVisible(!passwordVisible)}
              className={cn("absolute bottom-2 right-2")}
            >
              {passwordVisible ? (
                <EyeOff size={26} className="text-primary" />
              ) : (
                <Eye size={26} className="text-primary" />
              )}
            </Pressable>
          )}
        </View>

        {description ? (
          <View className="mt-1 w-full flex-row flex-wrap items-center justify-between px-1">
            {showError && <FormMessage />}
            <FormDescription onPress={onDescriptionPress}>
              {description}
            </FormDescription>
          </View>
        ) : (
          showError && <FormMessage className="mt-1 px-1" />
        )}
      </FormItem>
    );
  }
);

FormInput.displayName = "FormInput";

const FormSelect = React.forwardRef<
  React.ElementRef<typeof Select>,
  Omit<
    FormItemProps<typeof Select, Partial<Option>>,
    "open" | "onOpenChange" | "onValueChange"
  >
>(({ label, description, onChange, value, ...props }, ref) => {
  const {
    error,
    formItemNativeID,
    formDescriptionNativeID,
    formMessageNativeID,
  } = useFormField();

  return (
    <FormItem>
      {!!label && <FormLabel nativeID={formItemNativeID}>{label}</FormLabel>}
      <Select
        ref={ref as any}
        aria-labelledby={formItemNativeID}
        aria-describedby={
          !error
            ? `${formDescriptionNativeID}`
            : `${formDescriptionNativeID} ${formMessageNativeID}`
        }
        aria-invalid={!!error}
        value={
          value
            ? { label: value?.label ?? "", value: value?.label ?? "" }
            : undefined
        }
        onValueChange={onChange}
        {...props}
      />
      {!!description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  );
});

FormSelect.displayName = "FormSelect";

const FormRadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroup>,
  Omit<FormItemProps<typeof RadioGroup, string>, "onValueChange">
>(({ label, description, value, onChange, ...props }, ref) => {
  const {
    error,
    formItemNativeID,
    formDescriptionNativeID,
    formMessageNativeID,
  } = useFormField();

  return (
    <FormItem className="gap-3">
      <View>
        {!!label && <FormLabel nativeID={formItemNativeID}>{label}</FormLabel>}
        {!!description && (
          <FormDescription className="pt-0">{description}</FormDescription>
        )}
      </View>
      <RadioGroup
        ref={ref as any}
        aria-labelledby={formItemNativeID}
        aria-describedby={
          !error
            ? `${formDescriptionNativeID}`
            : `${formDescriptionNativeID} ${formMessageNativeID}`
        }
        aria-invalid={!!error}
        onValueChange={onChange}
        value={value}
        {...props}
      />

      <FormMessage />
    </FormItem>
  );
});

FormRadioGroup.displayName = "FormRadioGroup";

const FormCheckbox = React.forwardRef<
  React.ElementRef<typeof Checkbox>,
  Omit<FormItemProps<typeof Checkbox, boolean>, "checked" | "onCheckedChange">
>(({ label, description, value, onChange, showError, ...props }, ref) => {
  const {
    error,
    formItemNativeID,
    formDescriptionNativeID,
    formMessageNativeID,
  } = useFormField();

  function handleOnLabelPress() {
    onChange?.(!value);
  }

  return (
    <FormItem className="px-1">
      <View className="flex-row items-center gap-3">
        <Checkbox
          ref={ref as any}
          aria-labelledby={formItemNativeID}
          aria-describedby={
            !error
              ? `${formDescriptionNativeID}`
              : `${formDescriptionNativeID} ${formMessageNativeID}`
          }
          aria-invalid={!!error}
          onCheckedChange={onChange}
          checked={value}
          {...props}
          nativeID={formItemNativeID}
          onPress={handleOnLabelPress}
        />
        {!!label && (
          <FormLabel
            className="pb-0 !text-sm font-normal"
            nativeID={formItemNativeID}
            onPress={handleOnLabelPress}
          >
            {label}
          </FormLabel>
        )}
      </View>
      {!!description && <FormDescription>{description}</FormDescription>}
      {showError && <FormMessage />}
    </FormItem>
  );
});

FormCheckbox.displayName = "FormCheckbox";

export {
  Form,
  FormDescription,
  FormField,
  FormInput,
  FormItem,
  FormLabel,
  FormMessage,
  FormSelect,
  useFormField,
  FormRadioGroup,
  FormCheckbox,
};
