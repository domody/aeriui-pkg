import React from "react";
import { cn } from "@/app/lib/utils/cn";
import { cva, VariantProps } from "class-variance-authority";

const alertVariants = cva(
  "relative border-border bg-background min-w-[40rem] rounded border px-4 py-3 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        success: "text-success border-success [&>svg]:text-success",
        warning: "text-warning border-warning [&>svg]:text-warning",
        destructive:
          "text-destructive border-destructive [&>svg]:text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <div
      ref={ref}
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  );
});
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("font-medium", className)} {...props} />;
});
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("text-sm", className)} {...props} />;
});
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
