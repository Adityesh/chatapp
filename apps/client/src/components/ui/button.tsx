import { Slot } from "@radix-ui/react-slot";
import { type VariantProps } from "class-variance-authority";
import * as React from "react";

import { buttonVariants, cn } from "@/utils";
import Spinner from "../common/Spinner";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className }),
          "cursor-pointer"
        )}
        ref={ref}
        disabled={loading || disabled}
        {...props}
      >
        {children}
        {loading && <Spinner className="h-5 w-5 ml-2 animate-spin"/>}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button };
