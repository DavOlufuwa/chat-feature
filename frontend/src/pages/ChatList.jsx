import AllChats from "../components/AllChats";
import ChatBox from "../components/ChatBox";
import SideNav from "../components/SideNav";
import useAuth from "../hooks/useAuth";
import { Box } from "@chakra-ui/react";

const ChatList = () => {
  const { user } = useAuth();

  return (
    <div className="w-full">
      { user && <SideNav /> }
      <Box className="flex justify-between w-full h-[91svh] p-[10px]">
        {user && <AllChats />}
        {user && <ChatBox />}
      </Box>
    </div>
  );
};

export default ChatList;
