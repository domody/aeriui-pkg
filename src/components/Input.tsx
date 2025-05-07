"use client";
import React, { useState } from "react";
import { cn } from "@/app/lib/utils/cn";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  labelType?: "stationary" | "floating";
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      labelType = "stationary",
      className,
      placeholder,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState<string>("");

    const isControlled = value !== undefined;
    const inputValue = isControlled ? value : internalValue;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;

      if (onChange) {
        onChange(e);
      } else {
        setInternalValue(newValue);
      }
    };

    const stationaryLabel = labelType === "stationary";

    return (
      <div
        className={
          stationaryLabel
            ? "flex flex-col-reverse items-start justify-start"
            : "relative h-10"
        }
      >
        <input
          ref={ref}
          className={cn(
            "peer border-border/50 bg-background focus:border-border invalid:border-destructive h-10 w-full rounded border px-3 text-sm transition-all outline-none placeholder:text-sm",
            className
          )}
          placeholder={stationaryLabel ? placeholder : undefined}
          value={inputValue}
          onChange={handleChange}
          {...props}
        />
        <p
          className={`peer peer-invalid:peer-not-focus:text-destructive text-sm ${
            stationaryLabel
              ? "mb-1 font-medium"
              : "bg-background absolute left-2 px-1 opacity-50 transition-all"
          } ${
            internalValue.length > 0 || value?.length
              ? "-top-2.5 opacity-100"
              : "top-2.5 opacity-50 peer-focus:-top-2.5 peer-focus:opacity-100"
          }`}
        >
          {label}
        </p>
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
