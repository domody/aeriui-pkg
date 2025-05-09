import React from "react";
import { cn } from "@/app/lib/utils/cn";

interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  vertical?: boolean;
}

const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  ({ className, children, vertical = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          `flex items-center ${vertical ? "h-full flex-col" : "w-full"}`,
          className
        )}
      >
        <div
          className={`bg-border ${vertical ? "h-full w-px" : "h-px w-full"}`}
          {...props}
        />
        {children && (
          <>
            <p
              className={`text-border text-sm text-nowrap ${
                vertical ? "my-4" : "mx-4"
              }`}
            >
              {children}
            </p>
            <div
              className={`bg-border ${
                vertical ? "h-full w-px" : "h-px w-full"
              }`}
              {...props}
            />
          </>
        )}
      </div>
    );
  }
);
Separator.displayName = "Separator";

export { Separator };
