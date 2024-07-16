import UserListItem from "@/components/common/userlistitem";
import { Input } from "@/components/ui/input";
import Loader from "@/components/ui/loader";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useDebounce } from "@/hooks/useDebounce";
import { useSearchUsersQuery } from "@/store/slice/apiSlice";
import { useState } from "react";

const SearchTab = () => {
  const [page] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce<string>(search, 500);
  const [searchType, setSearchType] = useState(false);
  const { data, isLoading } = useSearchUsersQuery(
    {
      page,
      limit: 5,
      query: debouncedSearch,
    },
    {
      skip: debouncedSearch.length === 0,
    }
  );

  return (
    <div className="w-full h-full bg-foreground">
      <div>
        <Input
          type="text"
          id="search"
          placeholder="Search"
          className="my-4 w-[95%] mx-auto py-6 text-xl"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex items-center justify-center mb-4">
          <span className={`${!searchType && "text-primary"}`}>Users</span>
          <Switch
            className="mx-2 data-[state=checked]:bg-input"
            checked={searchType}
            onCheckedChange={() => setSearchType(!searchType)}
          />
          <span className={`${searchType && "text-primary"}`}>Channels</span>
        </div>
      </div>
      <Separator className="mx-auto" />
      {isLoading && <Loader />}
      <div>
        {search.length > 0 &&
          data?.data?.items.map((user, index) => {
            return <UserListItem user={user} index={index} key={index} />;
          })}
      </div>
    </div>
  );
};

export default SearchTab;
