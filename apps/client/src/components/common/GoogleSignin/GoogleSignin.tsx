import { Button } from "@/components/ui/button";
import { cn } from "@/utils";
import { FC } from "react";

const GoogleSignin: FC<React.ComponentProps<typeof Button>> = (props) => {
  return (
    <Button
      {...props}
      className={cn(props.className, "flex items-center justify-center")}
    >
      <p>Signin with Google</p>
      <img src={"/google.svg"} height={25} width={25} />
    </Button>
  );
};

export default GoogleSignin;
