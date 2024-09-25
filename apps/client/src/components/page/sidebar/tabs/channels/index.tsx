import { Button } from "@/components/ui/button";
import Channeldialog from "./channeldialog";
import { useState } from "react";

const ChannelsTab = () => {
  const [open, setOpen] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
  };

  return (
    <div className="w-full h-full bg-foreground">
      <Button onClick={() => handleOpenChange(true)}>Create Channel</Button>

      {open && (
        <Channeldialog open={open} handleOpenChange={handleOpenChange} />
      )}
    </div>
  );
};

export default ChannelsTab;
