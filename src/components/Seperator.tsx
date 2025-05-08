import React from "react";

interface SeperatorProps extends React.HTMLAttributes<HTMLDivElement> {
  content?: string;
}

const Seperator = React.forwardRef<HTMLDivElement, SeperatorProps>(
  ({ className, children, content, ...props }, ref) => {
    return (
      <div ref={ref} className="flex w-full items-center">
        <hr className="border-border w-full" {...props} />
        {content && (
          <>
            <p className="text-border mx-4 text-sm text-nowrap">{content}</p>
            <hr className="border-border w-full" {...props} />
          </>
        )}
      </div>
    );
  }
);

export { Seperator };
