import type { ComponentProps } from "react";
import { tv, type VariantProps } from "tailwind-variants";

import { cn } from "@/lib/utils";

const cardVariants = tv({
  base: "relative bg-card text-foreground",
  variants: {
    variant: {
      default: "",
      accent: "border-l-3 border-primary",
      feature:
        "overflow-hidden border-l-4 border-primary bg-linear-to-b from-foreground/3 to-transparent",
      success: "border-l-3 border-success bg-success/9",
    },
    size: {
      sm: "px-4.5 py-4",
      md: "px-7 py-8.5",
      lg: "p-[clamp(28px,4vw,44px)]",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});

type CardVariants = VariantProps<typeof cardVariants>;

interface CardProps extends ComponentProps<"div">, CardVariants {}

function Card({ className, variant, size, ...props }: CardProps) {
  return (
    <div
      className={cn(cardVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Card, cardVariants, type CardProps, type CardVariants };
