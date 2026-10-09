"use client";

import { AlertDialog as AlertDialogPrimitive } from "radix-ui";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

import { type ButtonVariants, buttonVariants } from "./button";
import {
  type DialogContentVariants,
  dialogContentVariants,
  dialogOverlayClassName,
} from "./dialog";

interface AlertDialogContentProps
  extends ComponentProps<typeof AlertDialogPrimitive.Content>,
    DialogContentVariants {}

type AlertDialogHeaderProps = ComponentProps<"div">;
type AlertDialogFooterProps = ComponentProps<"div">;
type AlertDialogTitleProps = ComponentProps<typeof AlertDialogPrimitive.Title>;
type AlertDialogDescriptionProps = ComponentProps<
  typeof AlertDialogPrimitive.Description
>;

interface AlertDialogActionProps
  extends ComponentProps<typeof AlertDialogPrimitive.Action>,
    ButtonVariants {}

interface AlertDialogCancelProps
  extends ComponentProps<typeof AlertDialogPrimitive.Cancel>,
    ButtonVariants {}

const AlertDialog = AlertDialogPrimitive.Root;
const AlertDialogTrigger = AlertDialogPrimitive.Trigger;

function AlertDialogContent({
  className,
  variant,
  size = "sm",
  ...props
}: AlertDialogContentProps) {
  return (
    <AlertDialogPrimitive.Portal>
      <AlertDialogPrimitive.Overlay className={dialogOverlayClassName} />
      <AlertDialogPrimitive.Content
        className={cn(dialogContentVariants({ variant, size }), className)}
        {...props}
      />
    </AlertDialogPrimitive.Portal>
  );
}

function AlertDialogHeader({ className, ...props }: AlertDialogHeaderProps) {
  return <div className={cn("flex flex-col gap-1.5", className)} {...props} />;
}

function AlertDialogFooter({ className, ...props }: AlertDialogFooterProps) {
  return (
    <div className={cn("mt-5 flex flex-wrap gap-2", className)} {...props} />
  );
}

function AlertDialogTitle({ className, ...props }: AlertDialogTitleProps) {
  return (
    <AlertDialogPrimitive.Title
      className={cn("font-display text-2xl uppercase", className)}
      {...props}
    />
  );
}

function AlertDialogDescription({
  className,
  ...props
}: AlertDialogDescriptionProps) {
  return (
    <AlertDialogPrimitive.Description
      className={cn(
        "mt-2.5 text-muted-foreground text-sm leading-relaxed",
        className,
      )}
      {...props}
    />
  );
}

function AlertDialogAction({
  className,
  variant,
  size,
  ...props
}: AlertDialogActionProps) {
  return (
    <AlertDialogPrimitive.Action
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

function AlertDialogCancel({
  className,
  variant = "secondary",
  size,
  ...props
}: AlertDialogCancelProps) {
  return (
    <AlertDialogPrimitive.Cancel
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  type AlertDialogContentProps,
  type AlertDialogHeaderProps,
  type AlertDialogFooterProps,
  type AlertDialogTitleProps,
  type AlertDialogDescriptionProps,
  type AlertDialogActionProps,
  type AlertDialogCancelProps,
};
