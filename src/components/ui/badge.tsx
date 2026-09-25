import type { ComponentProps } from "react";
import { tv, type VariantProps } from "tailwind-variants";

import { cn } from "@/lib/utils";

const badgeVariants = tv({
  base: "inline-flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0",
  variants: {
    variant: {
      default: "bg-primary/12 text-primary",
      success: "bg-success/16 text-success",
    },
    size: {
      sm: "h-7.5 min-w-6.5 px-1 font-display text-base [&_svg]:size-3.5",
      md: "gap-2.5 px-4 py-1.75 font-condensed text-[13px] font-semibold uppercase tracking-[0.2em] [&_svg]:size-2",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});

type BadgeVariants = VariantProps<typeof badgeVariants>;

interface BadgeProps extends ComponentProps<"span">, BadgeVariants {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <span
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants, type BadgeProps, type BadgeVariants };
