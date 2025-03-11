"use client";

import React, { SetStateAction, useRef } from "react";
import {
  useState,
  useEffect,
  createContext,
  useContext,
  useImperativeHandle,
} from "react";
import { cn } from "../../utils/cn";

import {
  OptionList,
  OptionListProps,
  OptionListSection,
  OptionListSectionProps,
  OptionListItem,
  OptionListItemProps,
} from "../OptionList";

interface ContextMenuContextProps {
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
  coords: { x: number; y: number };
  setCoords: React.Dispatch<SetStateAction<{ x: number; y: number }>>;
  menuRef: React.RefObject<HTMLDivElement>;
}

const ContextMenuContext = createContext<ContextMenuContextProps | null>(null);

const ContextMenu = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const [open, setOpen] = useState<boolean>(false);
  const [coords, setCoords] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!e.target) return;
      const target = e.target as Node;

      if (menuRef.current && !menuRef.current.contains(target)) {
        setOpen(false);
        setCoords({ x: 0, y: 0 });
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
    <ContextMenuContext.Provider
      value={{ open, setOpen, coords, setCoords, menuRef }}
    >
      <div ref={ref} className={cn("relative", className)} {...props}>
        {children}
      </div>
    </ContextMenuContext.Provider>
  );
});
ContextMenu.displayName = "ContextMenu";

const ContextMenuTrigger = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const context = useContext(ContextMenuContext);
  if (!context)
    throw new Error("ContextMenuTrigger must be used in a ContextMenu!");

  const { setOpen, menuRef, setCoords } = context;

  return (
    <div
      ref={ref}
      className={cn("", className)}
      onContextMenu={(e) => {
        e.preventDefault();
        const rect = menuRef.current!.getBoundingClientRect();
        setCoords({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });

        setOpen(true);
      }}
      {...props}
    >
      {children}
    </div>
  );
});
ContextMenuTrigger.displayName = "ContextMenuTrigger";

const ContextMenuContent = React.forwardRef<HTMLDivElement, OptionListProps>(
  ({ className, children, ...props }, ref) => {
    const context = useContext(ContextMenuContext);
    if (!context)
      throw new Error("ContextMenuContent must be used in a ContextMenu!");

    const { open, coords, menuRef } = context;

    useImperativeHandle(ref, () => menuRef.current as HTMLDivElement);

    return (
      <div
        ref={menuRef}
        style={{ top: `${coords.y}px`, left: `${coords.x}px` }}
        className={cn(
          "absolute z-[99] origin-top-left transition-[scale]",
          open ? "scale-100" : "pointer-events-none scale-90 opacity-0"
        )}
      >
        <OptionList className={cn(className)} {...props}>
          {children}
        </OptionList>
      </div>
    );
  }
);
ContextMenuContent.displayName = "ContextMenuContent";

const ContextMenuSection = React.forwardRef<
  HTMLDivElement,
  OptionListSectionProps
>(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className="w-full">
      <OptionListSection className={cn(className)} {...props}>
        {children}
      </OptionListSection>
    </div>
  );
});
ContextMenuSection.displayName = "ContextMenuSection";

const ContextMenuItem = React.forwardRef<HTMLDivElement, OptionListItemProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className="w-full">
        <OptionListItem className={cn(className)} {...props}>
          {children}
        </OptionListItem>
      </div>
    );
  }
);
ContextMenuItem.displayName = "ContextMenuItem";

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuSection,
  ContextMenuItem,
};
