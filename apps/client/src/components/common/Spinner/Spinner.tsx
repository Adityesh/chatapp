import { cn } from "@/utils";
import { Loader } from "lucide-react";
import { ComponentPropsWithRef, FC } from "react";

const Spinner: FC<ComponentPropsWithRef<typeof Loader>> = (props) => {
  return <Loader className={cn(props.className, "animate-spin")} {...props} />;
};

export default Spinner;
