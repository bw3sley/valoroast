"use client";

import { Progress as ProgressPrimitive } from "radix-ui";
import type { ComponentProps } from "react";
import { tv, type VariantProps } from "tailwind-variants";

import { cn } from "@/lib/utils";

const progressVariants = tv({
  slots: {
    root: "relative w-full overflow-hidden bg-foreground/10",
    indicator: [
      "h-full w-full transition-transform duration-500",
      "data-[state=indeterminate]:w-1/4 data-[state=indeterminate]:animate-sweep",
    ],
  },
  variants: {
    variant: {
      default: { indicator: "bg-primary" },
      success: { indicator: "bg-success" },
    },
    size: {
      sm: { root: "h-1" },
      md: { root: "h-2" },
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});

type ProgressVariants = VariantProps<typeof progressVariants>;

interface ProgressProps
  extends ComponentProps<typeof ProgressPrimitive.Root>,
    ProgressVariants {}

function Progress({
  className,
  value,
  max = 100,
  variant,
  size,
  ...props
}: ProgressProps) {
  const { root, indicator } = progressVariants({ variant, size });
  const isDeterminate = value !== null && value !== undefined;

  return (
    <ProgressPrimitive.Root
      className={cn(root(), className)}
      value={value}
      max={max}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={indicator()}
        style={
          isDeterminate
            ? { transform: `translateX(-${100 - (value / max) * 100}%)` }
            : undefined
        }
      />
    </ProgressPrimitive.Root>
  );
}

export {
  Progress,
  progressVariants,
  type ProgressProps,
  type ProgressVariants,
};
