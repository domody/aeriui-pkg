/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";

interface SlotProps<T extends React.ElementType>
  extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactElement<React.ComponentProps<T>>;
}

const Slot = React.forwardRef<HTMLElement, SlotProps<any>>(
  ({ children, ...props }, ref) => {
    return React.cloneElement(React.Children.only(children), { ref, ...props });
  }
);

Slot.displayName = "Slot";

export { Slot };
