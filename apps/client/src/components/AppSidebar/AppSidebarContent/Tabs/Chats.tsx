import { useDocumentTitle } from "usehooks-ts";
import ChatItemRow from "@/components/AppSidebar/AppSidebarContent/Tabs/ChatItemRow";
import { useGetChannelsInfiniteQuery } from "@/store/api/channelApi.ts";
import { GetChannelsRequest } from "shared";
import { useGetCurrentUserQuery } from "@/store/api/userApi.ts";
import { useParams } from "react-router-dom";
import { useMemo } from "react";
import Fuse from "fuse.js";
import { useAppSelector } from "@/hooks/useStore.ts";

export default function Chats() {
  const { tabSearch } = useAppSelector((state) => state.navigation);
  const { data: currentUser } = useGetCurrentUserQuery();
  const params = useParams();
  const id = params.id;
  const { data } = useGetChannelsInfiniteQuery(
    {
      currentUser: true,
    } as GetChannelsRequest,
    {
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
    },
  );
  useDocumentTitle(`Chats (${data.length})`);

  const searchFilteredResults = useMemo(() => {
    if (tabSearch.length === 0) return data;
    const fuse = new Fuse(data, {
      includeScore: true,
      keys: [
        "users.user.fullName",
        "description",
        "topic",
        "users.user.userName",
      ],
    });
    return fuse.search(tabSearch).map((fuseItem) => fuseItem.item);
  }, [data, tabSearch]);

  return (
    <div className={"w-full"}>
      {currentUser &&
        searchFilteredResults.map((channel, index) => {
          return (
            <ChatItemRow
              channel={channel}
              key={index}
              currentUser={currentUser.data}
              selectedIndex={id ? Number(id) : undefined}
            />
          );
        })}
    </div>
  );
}
