import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { clsx } from "clsx";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-cyan-600 text-white hover:bg-cyan-500 shadow-lg shadow-cyan-900/30",
        outline: "border border-cyan-700 text-cyan-400 hover:bg-cyan-900/30",
        ghost: "text-gray-400 hover:bg-gray-800 hover:text-white",
        danger: "bg-red-900/30 text-red-400 hover:bg-red-800/50 border border-red-800",
        success: "bg-green-900/30 text-green-400 hover:bg-green-800/50 border border-green-800",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-7 px-3 text-xs",
        lg: "h-11 px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp className={clsx(buttonVariants({ variant, size }), className)} {...props} />
  );
}