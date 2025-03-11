"use client";

import {
  useState,
  useRef,
  createContext,
  useContext,
  SetStateAction,
  useLayoutEffect,
} from "react";
import React from "react";
import { cn } from "../../utils/cn";

interface TabsContextProps {
  active: { value: string; x: number; width: number };
  setActive: React.Dispatch<
    SetStateAction<{ value: string; x: number; width: number }>
  >;
}
const TabsContext = createContext<TabsContextProps | null>(null);

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue: string;
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ className, defaultValue, ...props }, ref) => {
    const [active, setActive] = useState({
      value: defaultValue,
      x: 0,
      width: 0,
    });

    return (
      <TabsContext.Provider value={{ active, setActive }}>
        <div
          ref={ref}
          className={cn("flex flex-col space-y-2", className)}
          {...props}
        />
      </TabsContext.Provider>
    );
  }
);
Tabs.displayName = "Tabs";

const TabList = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error("TabList must be used within Tabs Component!");

  const { active } = context;
  return (
    <div
      ref={ref}
      className={cn(
        "bg-background border-border relative flex w-min rounded border p-px text-sm",
        className
      )}
      {...props}
    >
      <div
        style={{
          width: `${active.width}px`,
          transform: `translateX(${active.x}px)`,
        }}
        className="bg-accent absolute top-px left-0 z-10 h-[calc(100%-2px)] rounded-[calc(var(--radius)-1px)] transition-all"
      />
      {children}
    </div>
  );
});
TabList.displayName = "TabList";

interface TabProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

const Tab = React.forwardRef<HTMLDivElement, TabProps>(
  ({ className, value, ...props }, ref) => {
    const context = useContext(TabsContext);
    if (!context) throw new Error("Tab must be used within Tabs Component!");

    const tabRef = useRef<HTMLDivElement | null>(null);
    const { active, setActive } = context;

    useLayoutEffect(() => {
      if (active.value === value && tabRef.current) {
        const rect = tabRef.current.getBoundingClientRect();
        const parentRect =
          tabRef.current.parentElement?.getBoundingClientRect();
        if (parentRect) {
          setActive((prev) => ({
            ...prev,
            x: Math.round(tabRef.current!.offsetLeft),
            width: Math.round(rect.width),
          }));
        }
      }
    }, [active.value, value, setActive]);

    return (
      <div
        ref={(el) => {
          tabRef.current = el;
          if (typeof ref === "function") ref(el);
          else if (ref) ref.current = el;
        }}
        className={cn(
          "hover:bg-accent/25 z-20 cursor-pointer rounded px-4 py-1 font-medium text-nowrap transition-all",
          className
        )}
        onClick={() => {
          if (tabRef.current) {
            const rect = tabRef.current.getBoundingClientRect();
            const parentRect =
              tabRef.current.parentElement?.getBoundingClientRect();
            if (parentRect) {
              setActive({
                value,
                x: Math.round(tabRef.current.offsetLeft),
                width: Math.round(rect.width),
              });
            }
          }
        }}
        {...props}
      />
    );
  }
);
Tab.displayName = "Tab";

interface TabContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

const TabContent = React.forwardRef<HTMLDivElement, TabContentProps>(
  ({ className, value, ...props }, ref) => {
    const context = useContext(TabsContext);
    if (!context)
      throw new Error("TabContent must be used within Tabs Component!");

    const { active } = context;
    return (
      <div
        ref={ref}
        className={cn(active.value === value ? "" : "hidden", className)}
        {...props}
      />
    );
  }
);
TabContent.displayName = "TabContent";

export { Tabs, TabList, Tab, TabContent };
