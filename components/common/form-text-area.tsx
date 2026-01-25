"use client";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useCallback, useEffect, useRef } from "react";
import { FieldPath, FieldValues, useWatch } from "react-hook-form";
import { BaseFormFieldProps, FORM_FIELD_BASE_CLASS, cn } from "./form-shared";

interface FormTextAreaProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends BaseFormFieldProps<TFieldValues, TName> {
  textareaClassName?: string;
  rows?: number;
  autoResize?: boolean;
}

const TEXTAREA_BASE_CLASS = cn(FORM_FIELD_BASE_CLASS, "resize-none overflow-hidden");

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

  // 필드 값 감시 (setValue로 변경될 때도 감지)
  const fieldValue = useWatch({ control, name });

  const handleResize = useCallback(() => {
    if (!autoResize || !textareaRef.current) return;

    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  }, [autoResize]);

  // 값이 변경될 때마다 resize
  useEffect(() => {
    if (autoResize) {
      handleResize();
    }
  }, [autoResize, handleResize, fieldValue]);

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
