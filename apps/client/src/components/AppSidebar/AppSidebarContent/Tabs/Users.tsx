import {
  useGetCurrentUserQuery,
  useGetUsersInfiniteQuery,
} from "@/store/api/userApi.ts";
import { GetConnectionsRequest, GetUsersRequest } from "shared";
import {
  useDebounceValue,
  useDocumentTitle,
  useIntersectionObserver,
} from "usehooks-ts";
import { useAppSelector } from "@/hooks/useStore.ts";
import UserItemRow from "@/components/AppSidebar/AppSidebarContent/Tabs/UserItemRow";
import ConnectionSelectFilter from "@/components/AppSidebar/AppSidebarContent/Tabs/ConnectionSelectFilter";
import { useGetAllConnectionsInfiniteQuery } from "@/store/api/connectionApi.ts";
import { useMemo, useState } from "react";
import ConnectionItemRow from "@/components/AppSidebar/AppSidebarContent/Tabs/ConnectionItemRow";

export default function Users() {
  useDocumentTitle("Users");
  const tabSearch = useAppSelector((state) => state.navigation.tabSearch);
  const searchType = useAppSelector(
    (state) => state.navigation.usersTab.searchType,
  );
  const { data: currentUser } = useGetCurrentUserQuery();

  const [connectionFilterValue, setConnectionFilterValue] =
    useState("incoming");
  const connectionFilterObj = useMemo(() => {
    if (!currentUser) return;
    if (connectionFilterValue === "incoming") {
      return {
        "recipient.id": "$eq:" + currentUser?.data?.id,
      };
    }

    if (connectionFilterValue === "sent") {
      return {
        "requester.id": "$eq:" + currentUser?.data?.id,
      };
    }
  }, [currentUser, connectionFilterValue]);
  const [searchDebounce] = useDebounceValue(tabSearch, 500);
  const { data: users, fetchNextPage: fetchNextPageUsers } =
    useGetUsersInfiniteQuery(
      {
        search: searchDebounce,
      } as GetUsersRequest,
      {
        skip:
          (searchType === "connections" && tabSearch.length <= 0) ||
          searchDebounce.length <= 0,
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
  const { data: connections, fetchNextPage: fetchNextPageConnections } =
    useGetAllConnectionsInfiniteQuery(
      {
        filter: connectionFilterObj,
      } as GetConnectionsRequest,
      {
        skip: searchType === "users" || !currentUser,
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

  const { ref } = useIntersectionObserver({
    threshold: 0.5,
    onChange: (isIntersecting) =>
      isIntersecting &&
      (searchType === "users"
        ? fetchNextPageUsers()
        : fetchNextPageConnections()),
  });

  return (
    <>
      <ConnectionSelectFilter
        connectionFilterValue={connectionFilterValue}
        setConnectionFilterValue={setConnectionFilterValue}
      />
      {searchType === "connections" &&
        connections &&
        connections.map((item, index) => {
          return (
            <ConnectionItemRow
              key={index}
              connection={item}
              connectionFilterValue={connectionFilterValue}
            />
          );
        })}
      {searchType === "users" &&
        users &&
        searchDebounce.length > 0 &&
        users.map((item, index) => {
          return <UserItemRow user={item} key={index} />;
        })}
      <div ref={ref}></div>
    </>
  );
}
