"use client";

import { Toaster as SonnerToaster, type ToasterProps } from "sonner";

function Toaster(props: ToasterProps) {
  return (
    <SonnerToaster
      position="bottom-center"
      theme="dark"
      offset="calc(var(--spacing) * 7)"
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "flex w-full items-center justify-center gap-2 bg-foreground px-5.5 py-3 font-condensed text-sm font-bold uppercase tracking-widest text-background [&_svg]:size-4",
          description: "text-current opacity-80",
          error: "bg-primary text-primary-foreground",
        },
      }}
      {...props}
    />
  );
}

export { Toaster, type ToasterProps };
