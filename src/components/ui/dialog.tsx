"use client";

import { X } from "lucide-react";
import { Dialog as DialogPrimitive } from "radix-ui";
import type { ComponentProps } from "react";
import { tv, type VariantProps } from "tailwind-variants";

import { cn } from "@/lib/utils";

import { Button } from "./button";

const dialogOverlayClassName =
  "fixed inset-0 z-60 bg-overlay backdrop-blur-[3px]";

const dialogContentVariants = tv({
  base: [
    "fixed top-1/2 left-1/2 z-60 max-h-[90vh] w-[calc(100%-40px)] -translate-x-1/2 -translate-y-1/2 overflow-auto",
    "border-t-4 border-primary bg-card text-foreground outline-none",
    "data-[state=open]:animate-pop",
  ],
  variants: {
    variant: {
      default: "",
    },
    size: {
      sm: "max-w-115 p-7",
      md: "max-w-130 p-[clamp(22px,3vw,32px)]",
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
              className="absolute top-[clamp(22px,3vw,32px)] right-[clamp(22px,3vw,32px)] text-muted-foreground hover:bg-primary hover:text-primary-foreground"
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
        "font-display text-[clamp(24px,3.4vw,32px)] uppercase tracking-[0.02em]",
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
        "mt-2.5 text-sm leading-normal text-muted-foreground",
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
