import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary-hover shadow-soft hover:shadow-medium transform hover:scale-[1.02] active:scale-[0.98]",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-soft hover:shadow-medium",
        outline:
          "border-2 border-primary bg-background text-primary hover:bg-primary hover:text-primary-foreground shadow-soft hover:shadow-medium",
        secondary:
          "bg-gradient-secondary text-secondary-foreground hover:bg-secondary-hover shadow-soft hover:shadow-medium transform hover:scale-[1.02]",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        hero: "bg-gradient-hero text-primary-foreground shadow-glow hover:shadow-strong transform hover:scale-[1.05] active:scale-[0.95] text-base font-bold",
        success: "bg-success text-success-foreground hover:bg-success/90 shadow-soft hover:shadow-medium",
        meo: "bg-gradient-primary text-primary-foreground shadow-medium hover:shadow-glow transform hover:scale-[1.02] hover:-translate-y-0.5",
      },
      size: {
        default: "h-11 px-6 py-3",
        sm: "h-9 rounded-md px-4 text-xs",
        lg: "h-14 rounded-xl px-10 text-base",
        icon: "h-10 w-10",
        xl: "h-16 rounded-xl px-12 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
