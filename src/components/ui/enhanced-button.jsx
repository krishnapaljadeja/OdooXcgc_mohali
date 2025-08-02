import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary-600 text-white shadow-sm hover:bg-primary-700 focus-visible:ring-primary-500 hover:shadow-md",
        destructive:
          "bg-red-600 text-white shadow-sm hover:bg-red-700 focus-visible:ring-red-500 hover:shadow-md",
        outline:
          "border border-gray-300 bg-white shadow-sm hover:bg-gray-50 hover:border-gray-400 focus-visible:ring-primary-500",
        secondary:
          "bg-gray-100 text-gray-900 shadow-sm hover:bg-gray-200 focus-visible:ring-gray-500",
        ghost: 
          "hover:bg-gray-100 hover:text-gray-900 focus-visible:ring-gray-500",
        link: 
          "text-primary-600 underline-offset-4 hover:underline focus-visible:ring-primary-500",
        success:
          "bg-green-600 text-white shadow-sm hover:bg-green-700 focus-visible:ring-green-500 hover:shadow-md",
        warning:
          "bg-yellow-500 text-white shadow-sm hover:bg-yellow-600 focus-visible:ring-yellow-500 hover:shadow-md",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-lg px-8 text-base",
        xl: "h-14 rounded-xl px-10 text-lg",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
        "icon-lg": "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(({ 
  className, 
  variant, 
  size, 
  asChild = false, 
  loading = false,
  children,
  disabled,
  ...props 
}, ref) => {
  const Comp = asChild ? Slot : "button";
  
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="animate-spin" />}
      {children}
    </Comp>
  );
});

Button.displayName = "Button";

export { Button, buttonVariants };