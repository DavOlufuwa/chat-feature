import useAuth from "../hooks/useAuth";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  IconButton,
  useToast,
  FormControl,
  Input,
  Box,
} from "@chakra-ui/react";
import { EditIcon, SpinnerIcon } from "@chakra-ui/icons";
import { useState } from "react";
import UserBadgeItem from "./UserBadgeItem";
import useAxiosAuth from "../hooks/useAxiosAuth";
import UserListItem from "./UserListItem";

const UpdateGroupChatModal = () => {
  const toast = useToast();
  const { refetch, setRefetch, user, selectedChat, setSelectedChat } =
    useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupName, setGroupName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);
  const axiosAuth = useAxiosAuth();

  // Removing a group member
  const handleRemove = async (userToRemove) => {
    if (selectedChat.groupAdmin.id !== userToRemove.id ) {
      toast({
        title: "Only admins can remove someone!",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    try {
      setLoading(true);

      const response = await axiosAuth.put("/api/chat/group/remove", {
        chatId: selectedChat.id,
        userId: userToRemove.id,
      });
      
      // If the user is removed from the group
      user.id === userToRemove.id ? setSelectedChat() : setSelectedChat(response.data);
      setRefetch(!refetch);
      setLoading(false);
    }
    catch(error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    }
  };


  // Renaming the Group
  const handleRename = async () => {
    if (!groupName) {
      toast({
        title: "Please enter a new group name",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    try {
      setRenameLoading(true);

      const response = await axiosAuth.put("/api/chat/group/rename", {
        chatId: selectedChat.id,
        newGroupName: groupName,
      });

      toast({
        title: `${selectedChat.chatName} is renamed successfully!`,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });

      setSelectedChat(response.data);
      setRefetch(!refetch);
      setRenameLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });

      setRenameLoading(false);
    }

    setGroupName("");
  };

  // Searching for users to add
  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }
    try {
      setLoading(true);
      const response = await axiosAuth.get(`/api/users?search=${search}`);
      setLoading(false);
      setSearchResults(response.data);
    } catch (error) {
      toast({
        title: "Error occured!",
        description: "failed to load search results",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  // Adding a new group member
  const handleAddUser = async (user) => {

    if (selectedChat.users.find((u) => u.id === user.id)) {
      toast({
        title: `${user.name} is already in the group!`,
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }


    if (selectedChat.groupAdmin.id !== user.id) {
      toast({
        title: "Only admins can add someone!",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    try {
      setLoading(true);
      const response = await axiosAuth.put("/api/chat/group/add", {
        chatId: selectedChat.id,
        userId: user.id,
      });

      setSelectedChat(response.data);
      setRefetch(!refetch);
      setLoading(false);
    } catch (error) {
     
      toast({
        title: "Error Occured!",
        description: "Failed to add user",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      setLoading(false);
    }
  };
  return (
    <>
      <IconButton className="flex" icon={<EditIcon />} onClick={onOpen} />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedChat.chatName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box className="flex w-full flex-wrap pb-3">
              {selectedChat.users.map((user) => (
                <UserBadgeItem
                  key={user.id}
                  user={user}
                  handleFunction={() => handleRemove(user)}
                />
              ))}
            </Box>
            <FormControl className="flex mb-2">
              <Input
                placeholder="New Group Name"
                onChange={(e) => setGroupName(e.target.value)}
                value={groupName}
              />
              <Button
                variant="solid"
                className="ml-1"
                isLoading={renameLoading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl className="mb-1">
              <Input
                placeholder={`Add Users to ${selectedChat.chatName}`}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            <Box className="mt-2">
              {loading ? (
                <SpinnerIcon size="lg" />
              ) : (
                searchResults
                  ?.slice(0, 4)
                  .map((user) => (
                    <UserListItem
                      key={user.id}
                      user={user}
                      handleFunction={() => handleAddUser(user)}
                    />
                  ))
              )}
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" onClick={() => handleRemove(user)}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
