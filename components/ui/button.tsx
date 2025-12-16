import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

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
  "inline-flex items-center justify-center gap-2 rounded-lg border font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:pointer-events-none disabled:opacity-60 bg-[var(--btn-bg)] text-[var(--btn-text)] border-[var(--btn-border)] hover:bg-[var(--btn-hover-bg)] hover:text-[var(--btn-hover-text)] focus-visible:ring-[var(--btn-ring)]",
  {
    variants: {
      variant: {
        solid: "border-transparent shadow-sm",
        outlined: "shadow-sm",
        soft: "border-transparent",
        text: "border-transparent bg-transparent shadow-none"
      },
      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base"
      }
    },
    defaultVariants: {
      variant: "solid",
      size: "md"
    }
  }
);

export type ButtonColor = ButtonColorKey;
export type ButtonVariant = ButtonVariantKey;
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  isLoading?: boolean;
  variant?: ButtonVariant;
  color?: ButtonColor;
  size?: ButtonSize;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const {
    className,
    variant: variantProp,
    color: colorProp,
    size,
    asChild = false,
    isLoading = false,
    children,
    disabled,
    style,
    ...rest
  } = props;
  const variant = variantProp ?? "solid";
  const color = colorProp ?? "primary";
  const palette = buttonPalette[color][variant];
  const Comp = asChild ? Slot : "button";
  const showSpinner = isLoading && !asChild;

  const colorStyle: ButtonCSSVariables = {
    "--btn-bg": palette.background,
    "--btn-border": palette.border,
    "--btn-text": palette.text,
    "--btn-hover-bg": palette.hoverBackground,
    "--btn-hover-text": palette.hoverText,
    "--btn-ring": palette.ring
  };

  let childContent: React.ReactNode = children;

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
      className={cn(buttonVariants({ variant, size }), className)}
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
