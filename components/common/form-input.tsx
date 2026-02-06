"use client";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { FieldPath, FieldValues } from "react-hook-form";
import { BaseFormFieldProps, FORM_FIELD_BASE_CLASS, cn } from "./form-shared";

interface FormInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends BaseFormFieldProps<TFieldValues, TName> {
  type?: string;
  inputClassName?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  rightElement?: React.ReactNode;
  rightElementClassName?: string;
  rightPaddingClassName?: string;
  disabled?: boolean;
}

/**
 * 재사용 가능한 텍스트 입력 필드 컴포넌트
 */
export const FormInput = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  label,
  type = "text",
  placeholder,
  className,
  labelClassName,
  inputClassName,
  onChange,
  rightElement,
  rightElementClassName,
  rightPaddingClassName,
  disabled,
  isRequired
}: FormInputProps<TFieldValues, TName>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("space-y-0", className)}>
          <FormLabel className={labelClassName}>
            {label}
            {isRequired && <span className="ml-1 text-[#FF3B30]">*</span>}
          </FormLabel>
          <FormControl>
            <div className="relative flex items-center">
              <input
                {...field}
                type={type}
                className={cn(
                  FORM_FIELD_BASE_CLASS,
                  rightElement && (rightPaddingClassName ?? "pr-12"),
                  inputClassName
                )}
                placeholder={placeholder}
                disabled={disabled}
                onChange={(e) => {
                  field.onChange(e);
                  onChange?.(e);
                }}
              />
              {rightElement && (
                <div
                  className={cn(
                    "absolute inset-y-0 right-4 flex items-center justify-center",
                    rightElementClassName
                  )}
                >
                  {rightElement}
                </div>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
