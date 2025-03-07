import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { PanelRightClose } from "lucide-react";

export default function AppSidebarToggle() {
  const { open, openMobile, isMobile, setOpen, setOpenMobile, state } = useSidebar();

  const isOpen = state === "expanded" && (open || openMobile);

  const handleToggle = () => {
    return isMobile ? setOpenMobile(true) : setOpen(true);
  };

  if (isOpen) return <></>;

  return (
    <Button
      className="absolute top-2 left-2"
      onClick={handleToggle}
      variant={"ghost"}
      size="icon"
    >
      <PanelRightClose />
    </Button>
  );
}
