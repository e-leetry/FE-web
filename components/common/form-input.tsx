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
  rightElement
}: FormInputProps<TFieldValues, TName>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("space-y-0", className)}>
          <FormLabel className={labelClassName}>{label}</FormLabel>
          <FormControl>
            <div className="relative flex items-center">
              <input
                {...field}
                type={type}
                className={cn(FORM_FIELD_BASE_CLASS, rightElement && "pr-12", inputClassName)}
                placeholder={placeholder}
                onChange={(e) => {
                  field.onChange(e);
                  onChange?.(e);
                }}
              />
              {rightElement && (
                <div className="absolute right-4 flex items-center justify-center">
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
