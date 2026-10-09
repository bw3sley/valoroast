"use client";

import { X } from "lucide-react";
import { Dialog as DialogPrimitive } from "radix-ui";
import type { ComponentProps } from "react";
import { tv, type VariantProps } from "tailwind-variants";

import { cn } from "@/lib/utils";

import { Button } from "./button";

const dialogOverlayClassName = "fixed inset-0 z-60 bg-overlay backdrop-blur-xs";

const dialogContentVariants = tv({
  base: [
    "fixed inset-x-5 top-1/2 z-60 mx-auto max-h-9/10 w-auto -translate-y-1/2 overflow-auto",
    "border-primary border-t-4 bg-card text-foreground outline-none",
    "data-[state=open]:animate-pop",
  ],
  variants: {
    variant: {
      default: "",
    },
    size: {
      sm: "max-w-115 p-7",
      md: "max-w-130 p-5.5 md:p-7 lg:p-8",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});

type DialogContentVariants = VariantProps<typeof dialogContentVariants>;

interface DialogContentProps
  extends ComponentProps<typeof DialogPrimitive.Content>,
    DialogContentVariants {
  showClose?: boolean;
}

type DialogHeaderProps = ComponentProps<"div">;
type DialogTitleProps = ComponentProps<typeof DialogPrimitive.Title>;
type DialogDescriptionProps = ComponentProps<
  typeof DialogPrimitive.Description
>;

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogClose = DialogPrimitive.Close;

function DialogContent({
  className,
  variant,
  size,
  showClose = true,
  children,
  ...props
}: DialogContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className={dialogOverlayClassName} />
      <DialogPrimitive.Content
        className={cn(dialogContentVariants({ variant, size }), className)}
        {...props}
      >
        {children}
        {showClose && (
          <DialogPrimitive.Close asChild>
            <Button
              variant="secondary"
              size="icon"
              aria-label="Close"
              className="absolute top-5.5 right-5.5 text-muted-foreground hover:bg-primary hover:text-primary-foreground md:top-7 md:right-7 lg:top-8 lg:right-8"
            >
              <X />
            </Button>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

function DialogHeader({ className, ...props }: DialogHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-1 pr-12", className)} {...props} />
  );
}

function DialogTitle({ className, ...props }: DialogTitleProps) {
  return (
    <DialogPrimitive.Title
      className={cn(
        "font-display text-2xl uppercase tracking-wide md:text-3xl",
        className,
      )}
      {...props}
    />
  );
}

function DialogDescription({ className, ...props }: DialogDescriptionProps) {
  return (
    <DialogPrimitive.Description
      className={cn(
        "mt-2.5 text-muted-foreground text-sm leading-normal",
        className,
      )}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  dialogContentVariants,
  dialogOverlayClassName,
  type DialogContentProps,
  type DialogContentVariants,
  type DialogHeaderProps,
  type DialogTitleProps,
  type DialogDescriptionProps,
};
