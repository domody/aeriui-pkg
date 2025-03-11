"use client";

import React from "react";
import { Button, ButtonProps } from "../Button";
import { cn } from "../../utils/cn";

interface OptionListProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  titleSeperator?: boolean;
}

const OptionList = React.forwardRef<HTMLDivElement, OptionListProps>(
  ({ className, children, title, titleSeperator = true, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "border-border bg-background h-min max-w-96 min-w-56 rounded-md border px-1 shadow-md transition-all",
          className,
        )}
        {...props}
      >
        {title && (
          <p
            className={cn(
              "pt-2 pl-2 text-sm font-semibold",
              titleSeperator && "border-border border-b pb-2.5",
            )}
          >
            {title}
          </p>
        )}
        {children}
      </div>
    );
  },
);
OptionList.displayName = "OptionList";

interface OptionListSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  seperator?: boolean;
}

const OptionListSection = React.forwardRef<
  HTMLDivElement,
  OptionListSectionProps
>(({ className, children, seperator = false, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("py-1", className, seperator && "border-border border-b")}
      {...props}
    >
      {children}
    </div>
  );
});
OptionListSection.displayName = "OptionListSection";

interface OptionListItemProps extends ButtonProps {
  shortcut?: string;
}

const OptionListItem = React.forwardRef<HTMLButtonElement, OptionListItemProps>(
  ({ className, children, shortcut, variant = "ghost", ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn(
          "w-full justify-start rounded px-2",
          variant === "destructive" &&
            "hover:text-destructive-foreground text-destructive hover:bg-destructive bg-transparent",
          className,
        )}
        variant={variant}
        {...props}
      >
        {children}
        {shortcut && (
          <span className="text-muted-foreground ml-auto font-mono text-xs">
            {shortcut}
          </span>
        )}
      </Button>
    );
  },
);
OptionListItem.displayName = "OptionListItem";

export {
  type OptionListProps,
  type OptionListSectionProps,
  type OptionListItemProps,
};
export { OptionList, OptionListSection, OptionListItem };