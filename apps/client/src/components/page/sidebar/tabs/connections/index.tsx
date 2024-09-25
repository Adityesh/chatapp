import Icon from "@/components/ui/icon";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useGetConnectionsQuery } from "@/store/slice/apiSlice";
import { ConnectionStatusEnum, GetConnectionsRequest } from "@repo/shared";
import { useState } from "react";
import ConnectionItem from "./connectionitem";

const ConnectionsTab = () => {
  const [page] = useState(1);
  const [type, setType] = useState<GetConnectionsRequest["type"] | null>(null);
  const [status, setStatus] = useState<GetConnectionsRequest["status"] | null>(
    null
  );
  const { data } = useGetConnectionsQuery({
    limit: 5,
    page,
    status: status ?? undefined,
    type: type ?? undefined,
  });

  if (!data || !data.data) return <></>;

  return (
    <div className="w-full h-full bg-foreground">
      <div className="ml-2 font-satoshi mt-8">
        <h2 className="text-xl underline">Filters</h2>
        <div>
          <div className="flex items-center my-4">
            <p className="mr-4">Type</p>
            <ToggleGroup
              type="single"
              onValueChange={(v) => setType(v as GetConnectionsRequest["type"])}
            >
              <ToggleGroupItem
                aria-label="Sent-connection"
                value="sent"
                size={"sm"}
              >
                <Icon name="move-up" />
              </ToggleGroupItem>
              <ToggleGroupItem
                aria-label="Received-connection"
                value="requested"
                size={"sm"}
              >
                <Icon name="move-down" />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          <div className="flex items-center my-4">
            <p className="mr-4">Status</p>
            <Select
              value={status?.toString()}
              onValueChange={(value) =>
                setStatus(value as ConnectionStatusEnum)
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Status</SelectLabel>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                  <SelectItem value="declined">Declined</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      {data.data.items.map((connection, index) => {
        return (
          <ConnectionItem key={index} connection={connection} index={index} />
        );
      })}
    </div>
  );
};

export default ConnectionsTab;
