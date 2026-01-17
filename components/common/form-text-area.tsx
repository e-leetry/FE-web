"use client";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Control, FieldPath, FieldValues } from "react-hook-form";

interface FormTextAreaProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  control: Control<TFieldValues>;
  name: TName;
  label: string;
  placeholder?: string;
  className?: string;
  labelClassName?: string;
  textareaClassName?: string;
}

const TEXTAREA_BASE_CLASS =
  "w-full p-4 border border-[#EEEEEE] rounded-[12px] text-[#282828] text-[15px] bg-white placeholder:text-[#BDBDBD] focus:outline-none focus:border-[#282828] transition-colors h-[100px] resize-none";

/**
 * 재사용 가능한 텍스트 영역 입력 필드 컴포넌트
 */
export const FormTextArea = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  label,
  placeholder,
  className,
  labelClassName,
  textareaClassName
}: FormTextAreaProps<TFieldValues, TName>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel className={labelClassName}>{label}</FormLabel>
          <FormControl>
            <textarea
              {...field}
              className={cn(TEXTAREA_BASE_CLASS, textareaClassName)}
              placeholder={placeholder}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
