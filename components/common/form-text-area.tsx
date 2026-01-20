"use client";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
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
  rows?: number;
  autoResize?: boolean;
}

const TEXTAREA_BASE_CLASS =
  "w-full p-4 border border-[#EEEEEE] rounded-[12px] text-[#282828] text-[15px] bg-white placeholder:text-[#BDBDBD] focus:outline-none focus:border-[#282828] transition-colors resize-none overflow-hidden";

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
  textareaClassName,
  rows = 1,
  autoResize = false
}: FormTextAreaProps<TFieldValues, TName>) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleResize = () => {
    if (!autoResize || !textareaRef.current) return;

    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  };

  useEffect(() => {
    if (autoResize) {
      handleResize();
    }
  }, [autoResize, handleResize]);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("space-y-0", className)}>
          <FormLabel className={labelClassName}>{label}</FormLabel>
          <FormControl>
            <textarea
              {...field}
              ref={(e) => {
                field.ref(e);
                textareaRef.current = e;
              }}
              onChange={(e) => {
                field.onChange(e);
                handleResize();
              }}
              className={cn(TEXTAREA_BASE_CLASS, textareaClassName)}
              placeholder={placeholder}
              rows={rows}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
