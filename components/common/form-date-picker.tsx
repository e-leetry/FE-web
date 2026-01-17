"use client";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Control, FieldPath, FieldValues } from "react-hook-form";

interface FormDatePickerProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  control: Control<TFieldValues>;
  name: TName;
  label: string;
  placeholder?: string;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
}

/**
 * 공통 입력 필드 스타일
 */
const INPUT_BASE_CLASS =
  "w-full p-4 border border-[#EEEEEE] rounded-[12px] text-[#282828] text-[15px] bg-white placeholder:text-[#BDBDBD] focus:outline-none focus:border-[#282828] transition-colors";

/**
 * 재사용 가능한 날짜 선택 입력 필드 컴포넌트
 */
export const FormDatePicker = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  label,
  placeholder = "날짜를 선택해주세요",
  className,
  labelClassName,
  inputClassName
}: FormDatePickerProps<TFieldValues, TName>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("w-[300px]", className)}>
          <FormLabel className={labelClassName}>{label}</FormLabel>
          <div className="relative">
            <FormControl>
              <input
                {...field}
                type="text"
                className={cn(INPUT_BASE_CLASS, "pr-10 cursor-pointer", inputClassName)}
                placeholder={placeholder}
                readOnly
              />
            </FormControl>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 9L12 15L18 9"
                  stroke="#727272"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
