"use client";

import React, { useState } from "react";
import { cn } from "@/app/lib/utils/cn";
import { Check } from "lucide-react";

export interface CheckboxProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  (
    { className, checked, defaultChecked = false, onCheckedChange, ...props },
    ref
  ) => {
    const isControlled = checked !== undefined;
    const [internalChecked, setInternalChecked] = useState(defaultChecked);

    const currentChecked = isControlled ? checked : internalChecked;

    const handleClick = () => {
      const newChecked = !currentChecked;

      if (!isControlled) {
        setInternalChecked(newChecked);
      }

      if (onCheckedChange) {
        onCheckedChange(newChecked);
      }
    };

    return (
      <button
        ref={ref}
        role="checkbox"
        aria-checked={currentChecked}
        className={cn(
          `mt-1 flex h-4 w-4 shrink-0 cursor-pointer appearance-none items-center justify-center rounded ${
            currentChecked
              ? "bg-primary border-0"
              : "bg-background border-border border"
          }`,
          className
        )}
        onClick={handleClick}
        {...props}
      >
        {currentChecked && (
          <Check className="stroke-background mt-px h-3.5 w-3.5" />
        )}
      </button>
    );
  }
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
