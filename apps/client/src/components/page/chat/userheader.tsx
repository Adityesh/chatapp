import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { READABLE_DATE_FORMAT } from "@/constants/common.constants";
import { useGetUserQuery } from "@/store/slice/apiSlice";
import { getNameInitials, getRandomColor } from "@/utils";
import dayjs from "dayjs";

const UserHeader: React.FC<{ userId: number }> = ({ userId }) => {
  const { data } = useGetUserQuery(
    {
      userId,
    },
    {},
  );
  if (!data?.data) return <></>;
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <Avatar className="h-[10rem] w-[10rem] mt-8">
        <AvatarImage
          src={data?.data.avatarUrl || ""}
          alt={"@" + data?.data.userName}
        />
        <AvatarFallback
          style={{ backgroundColor: getRandomColor() }}
          className="text-2xl"
        >
          {getNameInitials(data.data.fullName)}
        </AvatarFallback>
      </Avatar>
      <h2 className="text-3xl font-poppinsBold mt-4">{data.data.fullName}</h2>
      <span className="text-xl text-primary font-satoshi mt-2 mb-4 cursor-pointer">
        @{data.data.userName}
      </span>
      <span>
        Joined {dayjs(data.data.createdAt).format(READABLE_DATE_FORMAT)}
      </span>
    </div>
  );
};

export default UserHeader;
