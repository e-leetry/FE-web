import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import {
  typographyTokens,
  type TypographyFont,
  type TypographySize,
  type TypographyTone,
  type TypographyVariant,
  type TypographyWeight
} from "@/lib/tokens/typography";
import { cn } from "@/lib/utils";

const textVariants = cva(
  "inline text-[var(--text-color)] transition-colors hover:text-[var(--text-hover-color,var(--text-color))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
  {
    variants: {
      align: {
        start: "text-left",
        center: "text-center",
        end: "text-right",
        justify: "text-justify"
      },
      truncate: {
        true: "truncate",
        false: ""
      }
    },
    defaultVariants: {
      align: "start",
      truncate: false
    }
  }
);

type TextVariantProps = VariantProps<typeof textVariants>;

type TextCSSVariables = React.CSSProperties & {
  "--text-color"?: string;
  "--text-hover-color"?: string;
};

export interface TextProps extends React.ComponentPropsWithoutRef<"span">, TextVariantProps {
  asChild?: boolean;
  variant?: TypographyVariant;
  tone?: TypographyTone;
  size?: TypographySize;
  font?: TypographyFont;
  weight?: TypographyWeight;
}

const Text = React.forwardRef<React.ElementRef<"span">, TextProps>((props, ref) => {
  const {
    asChild = false,
    align,
    truncate,
    className,
    children,
    variant: variantProp = "body",
    tone: toneProp,
    size: sizeOverride,
    font: fontOverride,
    weight: weightOverride,
    style,
    ...rest
  } = props;

  const variant = typographyTokens.variants[variantProp];
  const sizeKey = sizeOverride ?? variant.size;
  const fontKey = fontOverride ?? variant.font;
  const weightKey = weightOverride ?? variant.weight;
  const toneKey = toneProp ?? variant.tone ?? "default";

  const sizeScale = typographyTokens.sizes[sizeKey];
  const toneScale = typographyTokens.tones[toneKey];
  const fontFamily = typographyTokens.fonts[fontKey];
  const weightValue = typographyTokens.weights[weightKey];

  const textStyle: TextCSSVariables = {
    "--text-color": toneScale.color,
    "--text-hover-color": toneScale.hoverColor,
    fontFamily,
    fontWeight: weightValue,
    fontSize: sizeScale.fontSize,
    lineHeight: sizeScale.lineHeight,
    letterSpacing: sizeScale.letterSpacing,
    textTransform: variant.transform,
    ...style
  };

  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      ref={ref}
      className={cn(textVariants({ align, truncate }), className)}
      style={textStyle}
      {...rest}
    >
      {children}
    </Comp>
  );
});

Text.displayName = "Text";

export { Text, textVariants };
