import { useGetConnectionsQuery } from "@/store/slice/apiSlice";
import { useState } from "react";
import ConnectionItem from "./connectionitem";

const ConnectionsTab = () => {
  const [page] = useState(1);
  const { data } = useGetConnectionsQuery({
    limit: 5,
    page,
  });

  if (!data || !data.data) return <></>;

  return (
    <div className="w-full h-full bg-foreground">
      {data.data.items.map((connection, index) => {
        return (
          <ConnectionItem key={index} connection={connection} index={index} />
        );
      })}
    </div>
  );
};

export default ConnectionsTab;
