"use client";

import React, {
  useState,
  useEffect,
  useRef,
  createContext,
  useContext,
  SetStateAction,
} from "react";
import { cn } from "@/app/lib/utils/cn";
import { X } from "lucide-react";

interface ModalContextProps {
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
  modalRef: React.RefObject<HTMLDivElement | null>;
}

const ModalContext = createContext<ModalContextProps | null>(null);

const Modal = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const [open, setOpen] = useState<boolean>(false);

  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!e.target) return;
      const target = e.target as Node;

      if (modalRef.current && !modalRef.current.contains(target)) {
        setOpen(false);
      }
    }

    if (open) {
      document.documentElement.style.overflow = "hidden";
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.documentElement.style.overflow = "";
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  return (
    <ModalContext.Provider value={{ open, setOpen, modalRef }}>
      <div ref={ref} className={cn(``, className)} {...props} />
    </ModalContext.Provider>
  );
});
Modal.displayName = "Modal";

const ModalTrigger = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const context = useContext(ModalContext);
  if (!context)
    throw new Error("ModalTrigger must be used within Modal Component!");

  const { setOpen } = context;

  return (
    <div
      ref={ref}
      onClick={() => {
        setOpen(true);
      }}
      className={cn("", className)}
      {...props}
    />
  );
});
ModalTrigger.displayName = "ModalTrigger";

const ModalContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const context = useContext(ModalContext);
  if (!context)
    throw new Error("ModalContent must be used within Modal Component!");

  const { open, modalRef } = context;

  return (
    <div
      ref={ref}
      className={cn(
        `fixed top-0 left-0 z-100 flex h-screen w-screen items-center justify-center bg-black/60 transition-all ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`,
        className
      )}
    >
      <div
        ref={modalRef as React.RefObject<HTMLDivElement>}
        className="bg-background border-border relative flex min-h-24 max-w-[32rem] min-w-96 flex-col items-start justify-start rounded border p-6"
        {...props}
      />
    </div>
  );
});
ModalContent.displayName = "ModalContent";

const ModalHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const context = useContext(ModalContext);
  if (!context)
    throw new Error("ModalHeader must be used within Modal Component!");

  const { setOpen } = context;

  return (
    <div
      ref={ref}
      className={cn("flex w-full items-center justify-between pb-2", className)}
      {...props}
    >
      <div className="flex items-center justify-start text-lg leading-1 font-semibold">
        {children}
      </div>
      <X
        onClick={() => setOpen(false)}
        className="size-4 cursor-pointer opacity-50 transition-all hover:opacity-100"
      />
    </div>
  );
});
ModalHeader.displayName = "ModalHeader";

const ModalBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("py-2", className)} {...props} />;
});
ModalBody.displayName = "ModalBody";

const ModalFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex w-full items-center justify-end space-x-4 pt-2",
        className
      )}
      {...props}
    />
  );
});
ModalFooter.displayName = "ModalFooter";

const ModalAction = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const context = useContext(ModalContext);
  if (!context)
    throw new Error("ModalAction must be used within Modal Component!");

  const { setOpen } = context;
  return (
    <div
      ref={ref}
      className={cn("", className)}
      onClick={() => {
        setOpen(false);
      }}
      {...props}
    />
  );
});
ModalAction.displayName = "ModalAction";

export {
  Modal,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalAction,
};
