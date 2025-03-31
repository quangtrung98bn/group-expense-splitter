
import * as React from "react";
import { cn } from "@/lib/utils";

interface IOSSwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  label?: string;
  onCheckedChange?: (checked: boolean) => void;
}

const IOSSwitch = React.forwardRef<HTMLInputElement, IOSSwitchProps>(
  ({ className, label, onCheckedChange, onChange, checked, ...props }, ref) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      // Call both handlers if they exist
      if (onChange) {
        onChange(event);
      }
      if (onCheckedChange) {
        onCheckedChange(event.target.checked);
      }
    };

    return (
      <div className="flex items-center gap-2">
        <label
          className={cn("relative inline-flex cursor-pointer items-center", className)}
        >
          <input
            type="checkbox"
            className="peer sr-only"
            ref={ref}
            onChange={handleChange}
            checked={checked}
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
