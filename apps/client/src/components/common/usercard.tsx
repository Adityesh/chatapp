import { useGetUserQuery } from "@/store/slice/apiSlice";
import { PropsWithChildren } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

const UserCard = ({
  userId,
  children,
}: PropsWithChildren<{ userId: number }>) => {
  const { data } = useGetUserQuery(
    {
      userId,
    },
    {}
  );

  if (!data || !data.data) return;

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="backdrop-blur-xl bg-transparent border-none text-white">
        Place content for the popover here.
      </PopoverContent>
    </Popover>
  );
};

export default UserCard;
