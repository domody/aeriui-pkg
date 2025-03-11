"use client";

import React, {
  useState,
  useEffect,
  useRef,
  createContext,
  useContext,
  SetStateAction,
  useImperativeHandle,
} from "react";
import { cn } from "../../utils/cn";
import { ChevronDown } from "lucide-react";

interface AccordionContextProps {
  openItem: string | null;
  setOpenItem: React.Dispatch<SetStateAction<string | null>>;
  contentHeight: number | null;
  setContentHeight: React.Dispatch<SetStateAction<number | null>>;
}

const AccordionContext = createContext<AccordionContextProps | null>(null);

interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: string;
}

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  ({ className, defaultValue, ...props }, ref) => {
    const [openItem, setOpenItem] = useState<string | null>(null);
    const [contentHeight, setContentHeight] = useState<number | null>(null);

    useEffect(() => {
      if (defaultValue) {
        setOpenItem(defaultValue);
      }
    }, [setOpenItem, defaultValue]);

    return (
      <AccordionContext.Provider
        value={{
          openItem,
          setOpenItem,
          contentHeight,
          setContentHeight,
        }}
      >
        <div ref={ref} className={cn(className, "w-full")} {...props} />
      </AccordionContext.Provider>
    );
  }
);
Accordion.displayName = "Accordion";

interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ className, children, value, ...props }, ref) => {
    const context = useContext(AccordionContext);
    if (!context)
      throw new Error("AccordionItem must be used in an Accordion!");

    const { openItem, setOpenItem, contentHeight } = context;
    const isOpen = openItem === value;

    return (
      <div
        ref={ref}
        className={cn(
          className,
          "border-border overflow-hidden border-b transition-all"
        )}
        style={{
          height: isOpen ? `${contentHeight! + 40}px` : "2.5rem",
        }}
        onClick={() => setOpenItem(isOpen ? null : value)}
        {...props}
      >
        {React.Children.map(children, (child) =>
          React.isValidElement<{ value?: string }>(child)
            ? React.cloneElement(child, { value })
            : child
        )}
      </div>
    );
  }
);

AccordionItem.displayName = "AccordionItem";

const AccordionTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value?: string }
>(({ className, children, value, ...props }, ref) => {
  const context = useContext(AccordionContext);
  if (!context) throw new Error("AccordionTitle must be used in an Accordion!");

  const { openItem } = context;
  const isOpen = openItem === value;

  return (
    <div
      ref={ref}
      className={cn(
        className,
        "flex h-10 cursor-pointer items-center justify-between px-2"
      )}
      {...props}
    >
      {children}
      <ChevronDown
        size={16}
        className={`stroke-secondary-foreground transition-all ${
          isOpen ? "rotate-180" : "rotate-0"
        }`}
      />
    </div>
  );
});
AccordionTitle.displayName = "AccordionTitle";

const AccordionContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const contentRef = useRef<HTMLDivElement>(null);

  const context = useContext(AccordionContext);
  if (!context)
    throw new Error("AccordionContent must be used in an Accordion!");

  const { setContentHeight } = context;

  useImperativeHandle(ref, () => contentRef.current as HTMLDivElement);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.clientHeight);
    }
  }, [setContentHeight, children]);

  return (
    <div ref={contentRef} className={cn(className, "px-2 pb-4")} {...props}>
      {children}
    </div>
  );
});
AccordionContent.displayName = "AccordionContent";

export { Accordion, AccordionItem, AccordionTitle, AccordionContent };
