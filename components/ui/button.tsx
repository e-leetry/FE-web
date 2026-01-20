import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { colorTokens } from "@/lib/tokens/colors";
import { cn } from "@/lib/utils";

const buttonPalette = colorTokens.buttons;

type ButtonPalette = typeof buttonPalette;
type ButtonColorKey = keyof ButtonPalette;
type ButtonVariantKey = keyof ButtonPalette[ButtonColorKey];

type ButtonCSSVariables = {
  "--btn-bg"?: string;
  "--btn-border"?: string;
  "--btn-text"?: string;
  "--btn-hover-bg"?: string;
  "--btn-hover-text"?: string;
  "--btn-ring"?: string;
};

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:bg-[#F1F1F1] disabled:text-[#AAAAAA] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-slate-900 text-slate-50 hover:bg-slate-900/90",
        destructive: "bg-red-500 text-slate-50 hover:bg-red-500/90",
        outline: "border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900",
        secondary: "bg-slate-100 text-slate-900 hover:bg-slate-100/80",
        ghost: "hover:bg-slate-100 hover:text-slate-900",
        link: "text-slate-900 underline-offset-4 hover:underline",
        // Project specific variants (mapped to solid/outlined/soft/text if needed)
        solid:
          "bg-[var(--btn-bg)] text-[var(--btn-text)] border border-transparent hover:bg-[var(--btn-hover-bg)]",
        outlined:
          "bg-[var(--btn-bg)] text-[var(--btn-text)] border border-[var(--btn-border)] hover:bg-[var(--btn-hover-bg)]",
        soft: "bg-[var(--btn-bg)] text-[var(--btn-text)] border border-transparent hover:bg-[var(--btn-hover-bg)]",
        text: "bg-transparent text-[var(--btn-text)] border border-transparent hover:bg-[var(--btn-hover-bg)]"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        md: "h-10 px-4 py-2",
        lg: "h-11 rounded-md px-8",
        xl: "h-[56px] text-[16px] md:text-[18px] font-medium rounded-[16px] transition-colors flex-shrink-0",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: {
      variant: "solid",
      size: "default"
    }
  }
);

export type ButtonColor = ButtonColorKey;
export type ButtonVariant = VariantProps<typeof buttonVariants>["variant"];
export type ButtonSize = VariantProps<typeof buttonVariants>["size"];

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  color?: ButtonColor;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const {
    className,
    variant = "solid",
    size = "default",
    color: colorProp,
    asChild = false,
    isLoading = false,
    children,
    disabled,
    style,
    ...rest
  } = props;

  const color = colorProp ?? "primary";
  // Only use project specific palette if variant is one of solid, outlined, soft, text
  const isProjectVariant = ["solid", "outlined", "soft", "text"].includes(variant as string);
  const palette = isProjectVariant
    ? buttonPalette[color][(variant as ButtonVariantKey) ?? "solid"]
    : null;

  const Comp = asChild ? Slot : "button";
  const showSpinner = isLoading && !asChild;

  const colorStyle: ButtonCSSVariables = palette
    ? {
        "--btn-bg": palette.background,
        "--btn-border": palette.border,
        "--btn-text": palette.text,
        "--btn-hover-bg": palette.hoverBackground,
        "--btn-hover-text": palette.hoverText,
        "--btn-ring": palette.ring
      }
    : {};

  let childContent: React.ReactNode = children;

  // Calculate dynamic width based on text length
  // 4 characters or less: fixed width (120px for xl, 84px for others)
  // 5 characters or more: expand
  const getMinWidthClass = () => {
    if (asChild || typeof children !== "string") return "";
    const length = children.length;
    if (length <= 4) {
      return size === "xl" ? "min-w-[120px]" : "min-w-[84px]";
    }
    return "min-w-fit px-4";
  };

  if (asChild) {
    const childElements = React.Children.toArray(children).filter(
      (child): child is React.ReactElement => React.isValidElement(child)
    );
    childContent = childElements[0] ?? null;

    if (!childContent) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Button with `asChild` requires a single React element child.");
      }
      return null;
    }
  }

  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }), getMinWidthClass())}
      ref={ref}
      disabled={disabled || isLoading}
      data-loading={isLoading ? "" : undefined}
      style={{ ...colorStyle, ...style }}
      {...rest}
    >
      {showSpinner ? (
        <>
          <span
            aria-hidden
            className="h-4 w-4 animate-spin rounded-full border-2 border-current border-b-transparent"
          />
          {children}
        </>
      ) : (
        childContent
      )}
    </Comp>
  );
});
Button.displayName = "Button";

export { Button, buttonVariants };
