import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FC, PropsWithChildren, ReactNode } from "react";

type WithTooltipProps = {
  tooltipText: string | ReactNode;
};

const WithToolTip: FC<PropsWithChildren<WithTooltipProps>> = ({
  tooltipText,
  children,
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>{children}</TooltipTrigger>
        <TooltipContent>{tooltipText}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default WithToolTip;
