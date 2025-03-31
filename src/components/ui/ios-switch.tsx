
import * as React from "react";
import { cn } from "@/lib/utils";

interface IOSSwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  label?: string;
}

const IOSSwitch = React.forwardRef<HTMLInputElement, IOSSwitchProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <div className="flex items-center gap-2">
        <label
          className={cn("relative inline-flex cursor-pointer items-center", className)}
        >
          <input
            type="checkbox"
            className="peer sr-only"
            ref={ref}
            {...props}
          />
          <div
            className={cn(
              "h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-primary/30 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"
            )}
          />
        </label>
        {label && <span className="text-sm">{label}</span>}
      </div>
    );
  }
);

IOSSwitch.displayName = "IOSSwitch";

export { IOSSwitch };
