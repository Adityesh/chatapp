import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import Loader from "@/components/ui/loader";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useDebounce } from "@/hooks/useDebounce";
import { useSearchUsersQuery } from "@/store/slice/apiSlice";
import { SearchUserResponseType } from "@repo/shared";
import { getNameInitials } from "@/utils";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchTab = () => {
  const navigate = useNavigate();
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
    },
  );

  const handleOpenUser = (user: SearchUserResponseType) => {
    navigate("/chat/init/" + user.id);
  };

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
            return (
              <div
                className={`w-full cursor-pointer items-center justify-start p-2 flex ${index % 2 == 0 && "bg-muted-foreground"}`}
                key={user.id}
                onClick={() => handleOpenUser(user)}
              >
                <Avatar>
                  <AvatarImage
                    src={user.avatarUrl || ""}
                    alt={"@" + user.userName}
                  />
                  <AvatarFallback>
                    {getNameInitials(user.fullName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col ml-2">
                  <span>{user.fullName}</span>
                  <span className="text-muted text-sm hover:text-primary">
                    {"@" + user.userName}
                  </span>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default SearchTab;
