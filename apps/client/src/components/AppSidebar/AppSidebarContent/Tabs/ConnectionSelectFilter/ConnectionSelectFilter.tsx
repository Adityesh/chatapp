import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore.ts";
import { SET_USERS_TAB_SEARCH_TYPE } from "@/store/slice/navigationSlice.ts";
import { Dispatch, SetStateAction } from "react";

export type ConnectionSelectFilterProps = {
  connectionFilterValue: string;
  setConnectionFilterValue: Dispatch<SetStateAction<string>>;
};

export default function ConnectionSelectFilter({
  setConnectionFilterValue,
  connectionFilterValue,
}: ConnectionSelectFilterProps) {
  const dispatch = useAppDispatch();
  const searchType = useAppSelector(
    (state) => state.navigation.usersTab.searchType,
  );

  const handleSetSearchType = (value: boolean) =>
    dispatch(SET_USERS_TAB_SEARCH_TYPE(value ? "users" : "connections"));

  return (
    <div className={"mb-6"}>
      <div className={"text-white flex items-center justify-center my-6"}>
        <span className={`${searchType === "connections" && "text-primary"}`}>
          Connections
        </span>
        <Switch
          className={"mx-4"}
          checked={searchType === "users"}
          onCheckedChange={handleSetSearchType}
        />
        <span className={`${searchType === "users" && "text-primary"}`}>
          Users
        </span>
      </div>
      {searchType === "connections" && (
        <Select
          defaultValue={connectionFilterValue}
          onValueChange={(value) => setConnectionFilterValue(value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Type</SelectLabel>
              <SelectItem value="incoming">Incoming</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
