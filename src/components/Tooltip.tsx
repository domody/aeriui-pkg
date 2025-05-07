"use client";

import React, {
  useState,
  useRef,
  createContext,
  useContext,
  SetStateAction,
} from "react";
import { cn } from "@/app/lib/utils/cn";
import { cva, type VariantProps } from "class-variance-authority";

interface TooltipContextProps {
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
  clearOpenTimeout: () => void;
  startOpenTimeout: () => void;
}

const TooltipContext = createContext<TooltipContextProps | null>(null);

interface TooltipProps extends React.HTMLAttributes<HTMLDivElement> {
  duration?: number;
}

const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  ({ className, duration = 300, ...props }, ref) => {
    const [open, setOpen] = useState<boolean>(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const startOpenTimeout = () => {
      console.log("started");
      timeoutRef.current = setTimeout(() => {
        setOpen(true);
      }, duration);
    };

    const clearOpenTimeout = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };

    return (
      <TooltipContext.Provider
        value={{
          open,
          setOpen,
          clearOpenTimeout,
          startOpenTimeout,
        }}
      >
        <div ref={ref} className={cn("relative", className)} {...props} />
      </TooltipContext.Provider>
    );
  }
);
Tooltip.displayName = "Tooltip";

const TooltipTrigger = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const context = useContext(TooltipContext);
  if (!context) throw new Error("TooltipTrigger must be used in a Tooltip!");

  const { setOpen, clearOpenTimeout, startOpenTimeout } = context;

  return (
    <div
      ref={ref}
      onMouseEnter={() => {
        startOpenTimeout();
      }}
      onMouseLeave={() => {
        setOpen(false);
        clearOpenTimeout();
      }}
      className={cn("", className)}
      {...props}
    />
  );
});
TooltipTrigger.displayName = "TooltipTrigger";

export const tooltipContentVariants = cva(
  "absolute w-max rounded px-2 py-1 text-xs transition-all",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        outline: "bg-background border border-border text-foreground",
        destructive: "bg-destructive text-destructive-foreground",
      },
      position: {
        "top-start": "left-0 bottom-[calc(100%+8px)]",
        "top-center": "left-1/2 -translate-x-1/2 bottom-[calc(100%+8px)]",
        "top-end": "right-0 bottom-[calc(100%+8px)]",

        "bottom-start": "left-0 top-[calc(100%+8px)]",
        "bottom-center": "left-1/2 -translate-x-1/2 top-[calc(100%+8px)]",
        "bottom-end": "right-0 top-[calc(100%+8px)]",

        "left-start": "top-0 right-[calc(100%+8px)]",
        "left-center": "top-1/2 -translate-y-1/2 right-[calc(100%+8px)]",
        "left-end": "bottom-0 right-[calc(100%+8px)]",

        "right-start": "top-0 left-[calc(100%+8px)]",
        "right-center": "top-1/2 -translate-y-1/2 left-[calc(100%+8px)]",
        "right-end": "bottom-0 left-[calc(100%+8px)]",
      },
    },
    defaultVariants: {
      variant: "outline",
      position: "top-center",
    },
  }
);

export interface TooltipContentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tooltipContentVariants> {}

const TooltipContent = React.forwardRef<HTMLDivElement, TooltipContentProps>(
  ({ className, variant, position, ...props }, ref) => {
    const context = useContext(TooltipContext);
    if (!context) throw new Error("TooltipContent must be used in a Tooltip!");

    const { open } = context;

    return (
      <div
        ref={ref}
        className={cn(
          tooltipContentVariants({ variant, position }),
          className,
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        {...props}
      />
    );
  }
);
TooltipContent.displayName = "TooltipContent";

export { Tooltip, TooltipContent, TooltipTrigger };
