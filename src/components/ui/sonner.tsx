"use client";

import { Toaster as SonnerToaster, type ToasterProps } from "sonner";

function Toaster(props: ToasterProps) {
  return (
    <SonnerToaster
      position="bottom-center"
      theme="dark"
      offset={28}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "flex w-full items-center justify-center gap-2 bg-foreground px-5.5 py-3 font-condensed text-[15px] font-bold uppercase tracking-[0.09em] text-background [&_svg]:size-4",
          description: "text-current opacity-80",
          error: "bg-primary text-primary-foreground",
        },
      }}
      {...props}
    />
  );
}

export { Toaster, type ToasterProps };
