import { Separator as SeparatorPrimitive } from "radix-ui";
import type { ComponentProps } from "react";
import { tv, type VariantProps } from "tailwind-variants";

import { cn } from "@/lib/utils";

const separatorVariants = tv({
  base: "shrink-0 data-[orientation=horizontal]:w-full data-[orientation=vertical]:self-stretch",
  variants: {
    variant: {
      default: "bg-border",
      primary: "bg-primary/40",
    },
    size: {
      sm: "data-[orientation=horizontal]:h-px data-[orientation=vertical]:w-px",
      md: "data-[orientation=horizontal]:h-0.5 data-[orientation=vertical]:w-0.5",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "sm",
  },
});

type SeparatorVariants = VariantProps<typeof separatorVariants>;

interface SeparatorProps
  extends ComponentProps<typeof SeparatorPrimitive.Root>,
    SeparatorVariants {}

function Separator({
  className,
  decorative = true,
  variant,
  size,
  ...props
}: SeparatorProps) {
  return (
    <SeparatorPrimitive.Root
      className={cn(separatorVariants({ variant, size }), className)}
      decorative={decorative}
      {...props}
    />
  );
}

export {
  Separator,
  separatorVariants,
  type SeparatorProps,
  type SeparatorVariants,
};
