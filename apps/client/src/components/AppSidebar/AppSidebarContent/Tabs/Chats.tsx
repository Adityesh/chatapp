import { useDocumentTitle } from "usehooks-ts";
import ChatItemRow from "@/components/AppSidebar/AppSidebarContent/Tabs/ChatItemRow";
import { useGetChannelsInfiniteQuery } from "@/store/api/channelApi.ts";
import { GetChannelsRequest } from "shared";
import { useGetCurrentUserQuery } from "@/store/api/userApi.ts";

export default function Chats() {
  useDocumentTitle("Chats");
  const { data: currentUser } = useGetCurrentUserQuery();
  const { data } = useGetChannelsInfiniteQuery({} as GetChannelsRequest, {
    selectFromResult: ({ data, ...rest }) => {
      if (!data || !data.pages)
        return {
          ...rest,
          data: [],
        };
      const items = data.pages
        .flatMap((page) => page?.data?.data)
        .filter((item) => item !== undefined);

      return {
        ...rest,
        data: items,
      };
    },
  });
  return (
    <div className={"w-full"}>
      {currentUser && data.map((channel, index) => {
        return (
          <ChatItemRow
            channel={channel}
            key={index}
            currentUser={currentUser.data}
          />
        );
      })}
    </div>
  );
}
