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

interface TabsContextProps {
  active: string;
  setActive: React.Dispatch<SetStateAction<string>>;
}
const TabsContext = createContext<TabsContextProps | null>(null);

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue: string;
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ className, defaultValue, ...props }, ref) => {
    const [active, setActive] = useState<string>(defaultValue);

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

const tabsListVariants = cva(
  "bg-background border-border relative flex w-min rounded border p-px text-sm",
  {
    variants: {
      position: {
        start: "mr-auto",
        center: "mx-auto",
        end: "ml-auto",
      },
    },
  }
);

type TabListProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof tabsListVariants>;

const TabList = React.forwardRef<HTMLDivElement, TabListProps>(
  ({ className, children, position, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(tabsListVariants({ position }), className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
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

    return (
      <div
        ref={(el) => {
          tabRef.current = el;
          if (typeof ref === "function") ref(el);
          else if (ref) ref.current = el;
        }}
        className={cn(
          "z-20 inline-flex cursor-pointer items-center justify-center gap-2 rounded-[calc(var(--radius)-1px)] px-4 py-1 font-medium text-nowrap whitespace-nowrap transition-all [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
          active == value ? "bg-accent" : "hover:bg-accent/25",
          className
        )}
        onClick={() => setActive(value)}
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
        className={cn(active === value ? "" : "hidden", className)}
        {...props}
      />
    );
  }
);
TabContent.displayName = "TabContent";

export { Tabs, TabList, Tab, TabContent };
