import type { ComponentProps } from "react";
import { tv, type VariantProps } from "tailwind-variants";

import { cn } from "@/lib/utils";

const eyebrowVariants = tv({
  base: "block font-condensed uppercase",
  variants: {
    variant: {
      primary: "text-primary",
      success: "text-success",
      muted: "text-muted-foreground",
      faint: "text-faint-foreground",
    },
    size: {
      sm: "text-xs tracking-widest",
      md: "text-sm tracking-widest",
    },
  },
  defaultVariants: {
    variant: "faint",
    size: "md",
  },
});

type EyebrowVariants = VariantProps<typeof eyebrowVariants>;

interface EyebrowProps extends ComponentProps<"span">, EyebrowVariants {}

function Eyebrow({ className, variant, size, ...props }: EyebrowProps) {
  return (
    <span
      className={cn(eyebrowVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Eyebrow, eyebrowVariants, type EyebrowProps, type EyebrowVariants };
