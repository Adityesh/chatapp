import { useGetUsersInfiniteQuery } from "@/store/api/userApi.ts";
import { GetUsersRequest } from "shared";
import {
  useDebounceValue,
  useDocumentTitle,
  useIntersectionObserver,
} from "usehooks-ts";
import { useAppSelector } from "@/hooks/useStore.ts";
import UserItemRow from "@/components/AppSidebar/AppSidebarContent/Tabs/UserItemRow";

export default function Users() {
  useDocumentTitle("Users");
  const tabSearch = useAppSelector((state) => state.navigation.tabSearch);
  const [searchDebounce] = useDebounceValue(tabSearch, 500);
  const { data, fetchNextPage } = useGetUsersInfiniteQuery(
    {
      search: searchDebounce,
    } as GetUsersRequest,
    {
      skip: tabSearch.length <= 0,
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
    onChange: (isIntersecting) => isIntersecting && fetchNextPage(),
  });

  return (
    <>
      {data &&
        searchDebounce.length > 0 &&
        data.map((item, index) => {
          return <UserItemRow user={item} key={index} />;
        })}
      <div ref={ref}></div>
    </>
  );
}
