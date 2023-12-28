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
  useToast,
  FormControl,
  Input,
  Box,
} from "@chakra-ui/react";
import { useState } from "react";
import useAuth from "../hooks/useAuth";
import useAxiosAuth from "../hooks/useAxiosAuth";
import UserListItem from "./UserListItem";
import UserBadgeItem from "./UserBadgeItem";

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { chats, setChats } = useAuth();
  const axiosAuth = useAxiosAuth();

  // searchUsers to add
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
      console.log(response.data);
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

  const handleCreateGroup = async () => {
    if (!groupName || !selectedUsers) {
      toast({
        title: "Please enter all the fields",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    try {
      const response = await axiosAuth.post("/api/chat/group", {
        name : groupName,
        users : JSON.stringify(selectedUsers.map((user) => user.id)),
      })

      setChats([response.data, ...chats]);
      onClose()
      toast({
        title: "New Group Chat Created",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      })

    } catch (error) {
      toast({
        title: "Error occured!",
        description: "failed to create group chat",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  const handleAddToGroup = async (user) => {
    if (selectedUsers.includes(user)) {
      toast({
        title: "User has already been added",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }
    setSelectedUsers([...selectedUsers, user]);
  };
  const handleDelete = (userToDelete) => {
    setSelectedUsers(
      selectedUsers.filter((user) => user.id !== userToDelete.id)
    );
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader className="flex items-center text-2xl">
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody className="flex flex-col items-center">
            <FormControl>
              <Input
                placeholder="Group Name"
                className="mb-3"
                onChange={(e) => setGroupName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users"
                className="mb-2"
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {/* Render the selected Users */}

            {loading ? (
              <div>Loading...</div>
            ) : (
              searchResults
                .slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user.id}
                    user={user}
                    handleFunction={() => handleAddToGroup(user)}
                  />
                ))
            )}
            {/* Render the searched Users */}
            <Box className="w-full flex flex-wrap">
              {selectedUsers.map((user) => (
                <UserBadgeItem
                  key={user.id}
                  handleFunction={() => handleDelete(user)}
                  user={user}
                />
              ))}
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleCreateGroup}>
              Create Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
