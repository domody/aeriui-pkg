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
  OptionListItem,
  OptionListItemProps,
} from "../OptionList";

import { ChevronDown, Check } from "lucide-react";

interface SelectorContextProps {
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
  active: string | null;
  setActive: (value: string) => void;
  checkEnd: boolean;
  setCheckEnd: React.Dispatch<SetStateAction<boolean>>;
  triggerRef: React.RefObject<HTMLButtonElement>;
  menuRef: React.RefObject<HTMLDivElement>;
}

const SelectorContext = createContext<SelectorContextProps | null>(null);

interface SelectorProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: string;
  value?: string | null;
  onValueChange?: (value: string) => void;
}

const Selector = React.forwardRef<HTMLDivElement, SelectorProps>(
  (
    { className, children, value, defaultValue, onValueChange, ...props },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState<string | null>(
      defaultValue || null
    );
    const [open, setOpen] = useState<boolean>(false);
    const [checkEnd, setCheckEnd] = useState<boolean>(true);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const activeValue = value ?? internalValue;

    const setActive = (newValue: string) => {
      if (!value) setInternalValue(newValue);
      if (onValueChange) onValueChange(newValue);
    };

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
    }, [open]);

    return (
      <SelectorContext.Provider
        value={{
          open,
          setOpen,
          active: activeValue,
          setActive,
          checkEnd,
          setCheckEnd,
          triggerRef,
          menuRef,
        }}
      >
        <div ref={ref} className={cn("relative z-99", className)} {...props}>
          {children}
        </div>
      </SelectorContext.Provider>
    );
  }
);
Selector.displayName = "Selector";

interface SelectorTriggerProps extends ButtonProps {
  placeholder: string;
}

const SelectorTrigger = React.forwardRef<
  HTMLButtonElement,
  SelectorTriggerProps
>(({ className, placeholder, ...props }, ref) => {
  const context = useContext(SelectorContext);

  if (!context) throw new Error("SelectorTrigger must be used in a Selector!");

  const { open, setOpen, active, triggerRef } = context;

  useImperativeHandle(ref, () => triggerRef.current as HTMLButtonElement);

  return (
    <Button
      ref={triggerRef}
      className={cn("min-w-[200px] justify-between px-4", className)}
      variant={"outline"}
      onClick={(e) => {
        e.stopPropagation();
        setOpen(!open);
      }}
      {...props}
    >
      {active ? active : placeholder}
      <ChevronDown
        className={`transition-transform ${open ? "rotate-180" : ""}`}
      />
    </Button>
  );
});
SelectorTrigger.displayName = "SelectorTrigger";

const selectorContentVariants = cva(
  `bg-background border-border absolute top-[calc(100%+0.5rem)] w-max rounded-lg border transition-all shadow`,
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

interface SelectContentProps
  extends OptionListProps,
    VariantProps<typeof selectorContentVariants> {
  position?: "left" | "center" | "right";
  checkEnd?: boolean;
}

const SelectorContent = React.forwardRef<HTMLDivElement, SelectContentProps>(
  (
    { className, children, position = "center", checkEnd = true, ...props },
    ref
  ) => {
    const context = useContext(SelectorContext);
    if (!context)
      throw new Error("ContextMenuContent must be used in a ContextMenu!");

    const { open, menuRef, setCheckEnd } = context;

    useEffect(() => {
      setCheckEnd(checkEnd);
    }, [setCheckEnd, checkEnd]);

    useImperativeHandle(ref, () => menuRef.current as HTMLDivElement);
    return (
      <OptionList
        ref={menuRef}
        className={cn(
          selectorContentVariants({ position }),
          "z-100 w-min min-w-full",
          open ? "scale-100 opacity-100" : "scale-90 opacity-0",
          className
        )}
        {...props}
      >
        <OptionListSection>{children}</OptionListSection>
      </OptionList>
    );
  }
);
SelectorContent.displayName = "SelectorContent";

interface SelectorContentItemProps extends OptionListItemProps {
  value: string;
}

const SelectorContentItem = React.forwardRef<
  HTMLButtonElement,
  SelectorContentItemProps
>(({ className, children, value, ...props }, ref) => {
  const context = useContext(SelectorContext);

  if (!context)
    throw new Error("SelectorContentItem must be used in a Selector!");

  const { setOpen, active, setActive, checkEnd } = context;

  return (
    <OptionListItem
      ref={ref}
      className={cn("justify-between", className)}
      onClick={(e) => {
        e.stopPropagation();
        setOpen(false);
        setActive(value);
      }}
      {...props}
    >
      {children}
      {checkEnd && active == value && <Check />}
    </OptionListItem>
  );
});
SelectorContentItem.displayName = "SelectorContentItem";

export { Selector, SelectorTrigger, SelectorContent, SelectorContentItem };
