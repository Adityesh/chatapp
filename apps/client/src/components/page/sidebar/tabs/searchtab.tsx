import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import Loader from "@/components/ui/loader";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useSearchUsersQuery } from "@/store/slice/apiSlice";
import { getNameInitials, getRandomColor } from "@/utils";
import { useState } from "react";

const SearchTab = () => {
  const [searchType, setSearchType] = useState(false);
  const { data } = useSearchUsersQuery(null);
  return (
    <div className="w-full h-full bg-foreground">
      <div>
        <Input
          type="text"
          id="search"
          placeholder="Search"
          className="my-4 w-[95%] mx-auto py-6 text-xl"
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
      <Loader />
      <div>
        {data?.data?.map((user, index) => {
          return (
            <div
              className={`w-full cursor-pointer items-center justify-start p-2 flex ${index % 2 == 0 && "bg-muted-foreground"}`}
              key={user.id}
            >
              <Avatar>
                <AvatarImage
                  src={user.avatarUrl || ""}
                  alt={"@" + user.userName}
                />
                <AvatarFallback style={{ backgroundColor: getRandomColor() }}>
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
