"use client";

import React, {
  SetStateAction,
  useRef,
  useState,
  useEffect,
  createContext,
  useContext,
  useImperativeHandle,
} from "react";
import { Button, ButtonProps } from "../Button";
import { cn } from "../../utils/cn";
import { cva, type VariantProps } from "class-variance-authority";

import {
  OptionList,
  OptionListProps,
  OptionListSection,
  OptionListSectionProps,
  OptionListItem,
  OptionListItemProps,
} from "../OptionList";

interface DropdownContextProps {
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
  onHover: boolean;
  triggerRef: React.RefObject<HTMLButtonElement>;
  menuRef: React.RefObject<HTMLDivElement>;
}

const DropdownContext = createContext<DropdownContextProps | null>(null);

interface DropdownProps extends React.HTMLAttributes<HTMLDivElement> {
  onHover?: boolean;
}

const Dropdown = React.forwardRef<HTMLDivElement, DropdownProps>(
  ({ className, children, onHover = false, ...props }, ref) => {
    const [open, setOpen] = useState<boolean>(false);

    const triggerRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      function handleClickOutside(e: MouseEvent) {
        if (!e.target) return;
        const target = e.target as Node;

        if (
          menuRef.current &&
          !menuRef.current.contains(target) &&
          triggerRef.current &&
          !triggerRef.current.contains(target)
        ) {
          setOpen(false);
        }
      }

      if (open) {
        document.addEventListener("mousedown", handleClickOutside);
      } else {
        document.removeEventListener("mousedown", handleClickOutside);
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [open, setOpen]);

    return (
      <DropdownContext.Provider
        value={{
          open,
          setOpen,
          onHover,
          triggerRef,
          menuRef,
        }}
      >
        <div ref={ref} className={cn("relative", className)} {...props}>
          {children}
        </div>{" "}
      </DropdownContext.Provider>
    );
  }
);
Dropdown.displayName = "Dropdown";

const DropdownTrigger = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, ...props }, ref) => {
    const context = useContext(DropdownContext);
    if (!context)
      throw new Error("DropdownTwigger must be used in a Dropdown!");

    const { open, setOpen, triggerRef } = context;

    useImperativeHandle(ref, () => triggerRef.current as HTMLButtonElement);

    return (
      <Button
        ref={triggerRef}
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        className={cn("", className)}
        {...props}
      >
        {children}
      </Button>
    );
  }
);
DropdownTrigger.displayName = "DropdownTrigger";

const dropdownMenuVariants = cva(
  `bg-background border-border absolute top-[calc(100%+0.5rem)] w-max max-w-96 min-w-36 rounded-lg border transition-all shadow`,
  {
    variants: {
      position: {
        left: "left-0 origin-top-left",
        center: "left-1/2 -translate-x-1/2 origin-top",
        right: "right-0 origin-top-right",
      },
    },
    defaultVariants: {
      position: "left",
    },
  }
);

interface DropdownMenuProps
  extends OptionListProps,
    VariantProps<typeof dropdownMenuVariants> {
  position?: "left" | "center" | "right";
  title?: string;
  titleSeperator?: boolean;
}

const DropdownMenu = React.forwardRef<HTMLDivElement, DropdownMenuProps>(
  ({ className, children, position = "center", ...props }, ref) => {
    const context = useContext(DropdownContext);
    if (!context) throw new Error("DropdownMenu must be used in a Dropdown!");

    const { open, menuRef } = context;

    useImperativeHandle(ref, () => menuRef.current as HTMLDivElement);

    return (
      <OptionList
        ref={menuRef}
        className={cn(
          dropdownMenuVariants({ position }),
          open ? "scale-100 opacity-100" : "scale-90 opacity-0",
          className
        )}
        {...props}
      >
        {children}
      </OptionList>
    );
  }
);
DropdownMenu.displayName = "DropdownMenu";

const DropdownSection = React.forwardRef<
  HTMLDivElement,
  OptionListSectionProps
>(({ className, children, ...props }, ref) => {
  return (
    <OptionListSection ref={ref} className={cn(className)} {...props}>
      {children}
    </OptionListSection>
  );
});
DropdownSection.displayName = "DropdownSection";

const DropdownItem = React.forwardRef<HTMLButtonElement, OptionListItemProps>(
  ({ className, children, onClick, ...props }, ref) => {
    const context = useContext(DropdownContext);

    if (!context) throw new Error("DropdownItem must be used in a Dropdown!");

    const { setOpen } = context;

    return (
      <OptionListItem
        ref={ref}
        className={cn("w-full justify-start rounded px-2", className)}
        variant="ghost"
        onClick={(e) => {
          e.stopPropagation();
          if (onClick) onClick(e);
          setOpen(false);
        }}
        {...props}
      >
        {children}
      </OptionListItem>
    );
  }
);
DropdownItem.displayName = "DropdownItem";

export {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
};
