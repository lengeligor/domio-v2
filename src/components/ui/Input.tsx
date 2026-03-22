"use client";

import { cn } from "@/lib/utils";
import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-text-secondary mb-1.5"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            "w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-text placeholder:text-text-faint transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20",
            error && "border-red focus:border-red focus:ring-red/20",
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export { Input };
