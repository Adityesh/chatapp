import { cn } from "@/utils";
import { HTMLAttributes, forwardRef } from "react";
import "./style.css";

const PageLoader = forwardRef<HTMLSpanElement, HTMLAttributes<HTMLSpanElement>>(
  (props, ref) => {
    const { children, ...rest } = props;

    return (
      <span ref={ref} {...rest} className={cn(rest.className, "loader")}>
        {children}
      </span>
    );
  }
);

export default PageLoader;
