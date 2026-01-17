"use client";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Control, FieldPath, FieldValues } from "react-hook-form";

interface FormInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  control: Control<TFieldValues>;
  name: TName;
  label: string;
  type?: string;
  placeholder?: string;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
}

const INPUT_BASE_CLASS =
  "w-full p-4 border border-[#EEEEEE] rounded-[12px] text-[#282828] text-[15px] bg-white placeholder:text-[#BDBDBD] focus:outline-none focus:border-[#282828] transition-colors";

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
  inputClassName
}: FormInputProps<TFieldValues, TName>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel className={labelClassName}>{label}</FormLabel>
          <FormControl>
            <input
              {...field}
              type={type}
              className={cn(INPUT_BASE_CLASS, inputClassName)}
              placeholder={placeholder}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
