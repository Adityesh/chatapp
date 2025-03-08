import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group.tsx";
import { BellRing, BookCopy, MessagesSquare, Users } from "lucide-react";
import { Separator } from "@/components/ui/separator.tsx";
import WithToolTip from "@/components/common/WithTooltip";
import { useIsMobile } from "@/hooks/use-mobile.ts";
import { Fragment, ReactNode } from "react";
import {useAppDispatch, useAppSelector} from "@/store/store.ts";
import { TabValues } from "@/types/navigationSlice.types.ts";
import { SET_NAVIGATION_TAB } from "@/store/slice/navigationSlice.ts";

type FooterItem = {
  element: ReactNode;
  tooltipText: string;
  value: TabValues;
};

const iconClassName: string = "h-5 w-5 text-white cursor-pointer";

const footerItems: FooterItem[] = [
  {
    element: <MessagesSquare className={iconClassName} />,
    tooltipText: "Chats",
    value: "CHATS",
  },
  {
    element: <BookCopy className={iconClassName} />,
    tooltipText: "Channels",
    value: "CHANNELS",
  },
  {
    element: <Users className={iconClassName} />,
    tooltipText: "Users",
    value: "USERS",
  },
  {
    element: <BellRing className={iconClassName} />,
    tooltipText: "Notifications",
    value: "NOTIFICATIONS",
  },
];

export default function AppSidebarFooter() {
  const dispatch = useAppDispatch();
  const tab = useAppSelector((state) => state.navigation.tab);
  const isMobile = useIsMobile();

  const handleTabChange = (tab: TabValues) => {
    dispatch(SET_NAVIGATION_TAB(tab));
  };

  return (
    <>
      <Separator />
      <ToggleGroup
        type="single"
        className={"w-full justify-between py-2"}
        onValueChange={handleTabChange}
        value={tab}
      >
        {footerItems.map((item, index) => {
          const element = (
            <ToggleGroupItem
              value={item.value}
              aria-label={`Toggle ${item.value}`}
            >
              {item.element}
            </ToggleGroupItem>
          );
          return (
            <Fragment key={index}>
              {isMobile ? (
                element
              ) : (
                <WithToolTip key={index} tooltipText={item.tooltipText}>
                  {element}
                </WithToolTip>
              )}
            </Fragment>
          );
        })}
      </ToggleGroup>
    </>
  );
}
