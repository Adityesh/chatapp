import { TooltipRoot } from "@/components/ui/tooltip";
import { useAppDispatch, useAppSelector } from "@/hooks/store";
import { useLogoutUserMutation } from "@/store/slice/apiSlice";
import { SET_AUTH_STATE } from "@/store/slice/authSlice";
import { SET_NAVIGATION_STATE } from "@/store/slice/navigationSlice";
import {
  Handshake,
  LogOut,
  MessagesSquare,
  UserSearch,
  UsersRound,
} from "lucide-react";
import { toast } from "sonner";

const Navbar = () => {
  const dispatch = useAppDispatch();
  const tab = useAppSelector((state) => state.navigation.tab);
  const [logoutUser] = useLogoutUserMutation();

  const handleTabChange = (value: typeof tab) => {
    dispatch(SET_NAVIGATION_STATE({ key: "tab", value }));
  };

  const selectedTab = "bg-foreground rounded-sm w-full";

  const handleLogout = async () => {
    try {
      const response = await logoutUser(null).unwrap();
      if (response.success) {
        dispatch(SET_AUTH_STATE({ key: "isLoggedIn", value: false }));
        toast.success("Logged out successfully");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="py-8 h-full w-[100px] rounded-tr-sm rounded-br-sm bg-primary flex flex-col items-center justify-between">
      <div>
        <TooltipRoot tooltipText="Search">
          <div
            className={`cursor-pointer mb-8 p-2 ${tab === "search" && selectedTab}`}
            onClick={() => handleTabChange("search")}
          >
            <UserSearch color="white" size={36} />
            {/* <span>Search</span> */}
          </div>
        </TooltipRoot>

        <TooltipRoot tooltipText="Chat">
          <div
            className={`cursor-pointer mb-8 p-2 ${tab === "chat" && selectedTab}`}
            onClick={() => handleTabChange("chat")}
          >
            <MessagesSquare color="white" size={36} />
            {/* <span>Chat</span> */}
          </div>
        </TooltipRoot>

        <TooltipRoot tooltipText="Connections">
          <div
            className={`cursor-pointer mb-8 p-2 ${tab === "connections" && selectedTab}`}
            onClick={() => handleTabChange("connections")}
          >
            <Handshake color="white" size={36} />
            {/* <span>Connections</span> */}
          </div>
        </TooltipRoot>

        <TooltipRoot tooltipText="Channels">
          <div
            className={`cursor-pointer mb-8 p-2 ${tab === "channels" && selectedTab}`}
            onClick={() => handleTabChange("channels")}
          >
            <UsersRound color="white" size={36} />
            {/* <span>Channels</span> */}
          </div>
        </TooltipRoot>
      </div>

      <div>
        <TooltipRoot tooltipText="Logout">
          <div className="cursor-pointer" onClick={handleLogout}>
            <LogOut color="white" size={36} />
            {/* <span>Logout</span> */}
          </div>
        </TooltipRoot>
      </div>
    </div>
  );
};

export default Navbar;
