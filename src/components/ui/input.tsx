import type { ComponentProps } from "react";
import { tv, type VariantProps } from "tailwind-variants";

import { cn } from "@/lib/utils";

const inputRootVariants = tv({
  base: [
    "flex w-full items-center border-l-3 border-primary text-foreground transition-shadow",
    "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background",
    "has-[input:disabled]:opacity-50",
    "has-[[aria-invalid=true]]:bg-destructive/10 has-[[aria-invalid=true]]:ring-1 has-[[aria-invalid=true]]:ring-destructive",
  ],
  variants: {
    variant: {
      default: "bg-input",
      sunken: "bg-background",
    },
    size: {
      md: "h-12.5 gap-2.5 px-4 text-base",
      lg: "h-14.5 gap-2.5 px-4.5 text-[17px]",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});

type InputRootVariants = VariantProps<typeof inputRootVariants>;

interface InputRootProps extends ComponentProps<"div">, InputRootVariants {}

type InputAddonProps = ComponentProps<"span">;
type InputControlProps = ComponentProps<"input">;
type InputDescriptionProps = ComponentProps<"p">;
type InputErrorProps = ComponentProps<"p">;

function InputRoot({ className, variant, size, ...props }: InputRootProps) {
  return (
    <div
      className={cn(inputRootVariants({ variant, size }), className)}
      {...props}
    />
  );
}

function InputAddon({ className, ...props }: InputAddonProps) {
  return (
    <span
      className={cn(
        "shrink-0 font-condensed font-bold tracking-[0.06em] text-faint-foreground [&_svg]:size-4",
        className,
      )}
      {...props}
    />
  );
}

function InputControl({ className, ...props }: InputControlProps) {
  return (
    <input
      className={cn(
        "h-full min-w-0 flex-1 bg-transparent font-medium tracking-[0.02em] text-inherit outline-none disabled:cursor-not-allowed",
        className,
      )}
      {...props}
    />
  );
}

function InputDescription({ className, ...props }: InputDescriptionProps) {
  return (
    <p
      className={cn(
        "font-condensed text-sm uppercase tracking-[0.08em] text-faint-foreground",
        className,
      )}
      {...props}
    />
  );
}

function InputError({ className, ...props }: InputErrorProps) {
  return (
    <p
      className={cn(
        "font-condensed text-sm font-semibold uppercase tracking-[0.08em] text-destructive",
        className,
      )}
      role="alert"
      {...props}
    />
  );
}

export {
  InputRoot,
  InputAddon,
  InputControl,
  InputDescription,
  InputError,
  inputRootVariants,
  type InputRootProps,
  type InputAddonProps,
  type InputControlProps,
  type InputDescriptionProps,
  type InputErrorProps,
  type InputRootVariants,
};
