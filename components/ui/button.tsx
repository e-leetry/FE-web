import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg border text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base disabled:pointer-events-none disabled:opacity-60",
  {
    variants: {
      variant: {
        default: "bg-brand-primary text-brand-primary-foreground hover:bg-brand-primary-hover border-transparent focus-visible:ring-brand-primary-focus",
        secondary: "bg-surface-accent text-surface-foreground hover:bg-surface-accent/80 border-transparent focus-visible:ring-brand-primary-focus",
        outline: "border-surface-border bg-transparent text-surface-foreground hover:bg-surface-accent/70 focus-visible:ring-brand-primary-focus",
        ghost: "bg-transparent text-surface-foreground hover:bg-surface-accent/70 focus-visible:ring-brand-primary-focus",
        destructive: "bg-danger-base text-danger-foreground hover:bg-danger-hover focus-visible:ring-danger-focus border-transparent",
        link: "bg-transparent border-transparent text-link-base underline-offset-4 hover:text-link-hover hover:underline focus-visible:ring-brand-primary-focus"
      },
      size: {
        sm: "h-9 px-3 text-sm",
        default: "h-10 px-4",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const { className, variant, size, asChild = false, isLoading = false, children, disabled, ...rest } = props;
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn(buttonVariants({ variant, size }), className)}
      ref={ref}
      disabled={disabled || isLoading}
      data-loading={isLoading ? "" : undefined}
      {...rest}
    >
      {isLoading && <span aria-hidden className="h-4 w-4 animate-spin rounded-full border-2 border-surface-foreground border-b-transparent" />}
      {children}
    </Comp>
  );
});
Button.displayName = "Button";

export { Button, buttonVariants };
