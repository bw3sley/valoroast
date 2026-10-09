import type { ComponentProps } from "react";
import { tv, type VariantProps } from "tailwind-variants";

import { cn } from "@/lib/utils";

const buttonVariants = tv({
  base: [
    "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap font-bold font-condensed uppercase transition-colors",
    "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ],
  variants: {
    variant: {
      default:
        "bg-primary text-primary-foreground hover:bg-foreground hover:text-background",
      secondary: "bg-muted text-foreground hover:bg-muted-hover",
      inverse: "bg-foreground text-background hover:bg-white",
      soft: "bg-primary/14 text-primary hover:bg-primary/26",
      link: "font-semibold text-faint-foreground underline hover:text-foreground",
    },
    size: {
      sm: "h-10 px-4.5 text-xs tracking-widest [&_svg]:size-3.5",
      md: "h-11 px-5.5 text-sm tracking-widest [&_svg]:size-4",
      lg: "h-14 px-7.5 text-xl tracking-widest [&_svg]:size-5",
      icon: "size-8.5 p-0 [&_svg]:size-4",
    },
  },
  compoundVariants: [
    {
      variant: "link",
      size: ["sm", "md", "lg"],
      class: "h-auto px-0",
    },
  ],
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});

type ButtonVariants = VariantProps<typeof buttonVariants>;

interface ButtonProps extends ComponentProps<"button">, ButtonVariants {}

function Button({
  className,
  variant,
  size,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      type={type}
      {...props}
    />
  );
}

export { Button, buttonVariants, type ButtonProps, type ButtonVariants };
