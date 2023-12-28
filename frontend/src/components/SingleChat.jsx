import useAuth from "../hooks/useAuth";
import { Box, Text, IconButton } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderInfo } from "../actions/getSender";
import ProfileBox from "./ProfileBox";

const SingleChat = () => {
  const { user, selectedChat, setSelectedChat } = useAuth();

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "20px", md: "24px" }}
            className="flex items-center justify-between pb-3 px-1 w-full text-2xl"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              size={{ base: "md", md: "sm"}}
              onClick={() => setSelectedChat("")}
            />
            {selectedChat.isGroupChat ? (
              <span className="font-semibold">{selectedChat.chatName}</span>
            ) : (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileBox user={getSenderInfo(user, selectedChat.users)}/>
              </>
            )}
          </Text>
          <Box className="flex flex-col justify-end p-3 w-full h-full rounded-lg overflow-y-hidden bg-slate-200">
            {/* Messages */}
          </Box>
        </>
      ) : (
        <Box className=" flex justify-center items-center h-full">
          <Text className="pb-3 text-2xl">
            Please select a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
