import useAuth from "../hooks/useAuth"
import { Box } from "@chakra-ui/react";
import SingleChat from "./SingleChat";

const ChatBox = () => {

  const { selectedChat } = useAuth()
  return (
    <Box className={`${selectedChat ? "flex" : "hidden"} sm:flex flex-col p-3 rounded-lg border-1 bg-orange-300`}
      w = {{base: "100%", md: "68%"}}
    >
      <SingleChat />
    </Box>
  )
}
export default ChatBox