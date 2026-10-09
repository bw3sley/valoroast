import type { ComponentProps } from "react";
import { tv, type VariantProps } from "tailwind-variants";

import { cn } from "@/lib/utils";

const cardVariants = tv({
  base: "relative bg-card text-foreground",
  variants: {
    variant: {
      default: "",
      accent: "border-primary border-l-3",
      feature:
        "overflow-hidden border-primary border-l-4 bg-linear-to-b from-foreground/3 to-transparent",
      success: "border-success border-l-3 bg-success/9",
    },
    size: {
      sm: "px-4.5 py-4",
      md: "px-7 py-8.5",
      lg: "p-7 md:p-8 lg:p-11",
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
