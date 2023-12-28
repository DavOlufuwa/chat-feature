import { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import {
  useToast,
  Box,
  Button,
  Stack,
  Text,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import useAxiosAuth from "../hooks/useAxiosAuth";
import Chatloading from "./Chatloading";
import GroupChatModal from "./GroupChatModal";

const AllChats = () => {
  const axiosAuth = useAxiosAuth();
  const toast = useToast();
  const [loggedUser, setLoggedUser] = useState();
  const { chats, setChats, selectedChat, setSelectedChat } = useAuth();


  // getChats
  const fetchChats = async () => {
    try {
      const response = await axiosAuth.get("/api/chat");
      setChats(response.data);
    } catch (error) {
      toast({
        title: "Error occured!",
        description: "failed to load the chat",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, []);

  const getSender = (loggedUser, chatUsers) => {
    return chatUsers[0].id === loggedUser.id
      ? chatUsers[1].name
      : chatUsers[0].name;
  };

  return (
    <Box
      className={`${
        selectedChat ? "hidden" : "flex"
      } md:flex flex-col items-center rounded-lg border-1 w-full md:w-[31%] bg-red-400`}
    >
      <Box className="py-2 px-3 text-lg md:text-base flex justify-between items-center w-full">
        <span>All Chats</span>
        <GroupChatModal>
          <Button
            className="flex text-lg sm:text-sm lg:text-lg"
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box className="flex flex-col bg-gray-200 w-full h-full rounded-lg overflow-y-hidden p-2">
        {chats ? (
          <Stack className="overflow-y-scroll">
            {chats.map((chat) => (
              <Box
                key={chat.id}
                className="cursor-pointer px-2 py-3"
                bg={selectedChat === chat ? "#38b2ac" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                borderRadius="lg"
                onClick={() => setSelectedChat(chat)}
              >
                <Text>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <Chatloading />
        )}
      </Box>
    </Box>
  );
};

export default AllChats;
