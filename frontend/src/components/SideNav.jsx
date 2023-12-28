import { useState } from "react";
import {
  Box,
  Tooltip,
  Button,
  Text,
  Menu,
  MenuButton,
  MenuList,
  Avatar,
  MenuItem,
  MenuDivider,
  Drawer,
  DrawerOverlay,
  DrawerHeader,
  DrawerContent,
  DrawerBody,
  useDisclosure,
  Input,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import ProfileBox from "./ProfileBox";
import useAuth from "../hooks/useAuth";
import Chatloading from "./Chatloading";
import useAxiosAuth from "../hooks/useAxiosAuth";
import UserListItem from "./UserListItem";
const SideNav = () => {
  const { user, setChats, chats, setSelectedChat } = useAuth();
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const axiosAuth = useAxiosAuth();

  const handleSearch = async () => {
    if (search === "") {
      toast({
        title: "Please enter a search value",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    try {
      setLoading(true);

      const response = await axiosAuth.get(`/api/users?search=${search}`);
      setSearchResult(response.data);

      setLoading(false);
    } catch (error) {
      toast({
        title: "Error occured!",
        description: "failed to load search results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  const accessChat = async (userId) => {
    setLoadingChat(true);
    try {
      const response = await axiosAuth.post("/api/chat", {
        otherUserId: userId,
      });

      setSelectedChat(response.data);

      setLoadingChat(false);
      onClose();

      if (chats.find((c) => c.id !== response.data.id)) {
        setChats([response.data, ...chats]);
      }
    } catch (error) {
      setLoadingChat(false);
      toast({
        title: "Error fetching the chat",
        description: "failed to load search results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  return (
    <nav>
      <Box className="flex justify-between items-center w-full bg-red-100 py-2 px-3 border-2">
        <Tooltip label="search users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <i className="fas fa-search"></i>
            <Text className="hidden sm:flex px-4">Search User</Text>
          </Button>
        </Tooltip>
        <Text className="text-2xl">SparkTalk</Text>
        <div>
          <Menu>
            <MenuButton className="p-1">
              <BellIcon className="text-2xl" />
            </MenuButton>
            {/* <MenuList></MenuList> */}
          </Menu>
          <Menu>
            <MenuButton
              className="p-1"
              as={Button}
              rightIcon={<ChevronDownIcon />}
            >
              <Avatar
                className="cursor-pointer"
                size="sm"
                name={user.name}
                src={user.profilePhoto}
              />
            </MenuButton>
            <MenuList>
              <ProfileBox user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileBox>
              <MenuDivider />
              <MenuItem>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader className="border-2 ">User List</DrawerHeader>
          <DrawerBody>
            <Box className="pb-2 flex justify-between w-full gap-2">
              <Input
                className="w-full"
                placeholder="Search Name or Email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {/* displaying search results */}
            {loading ? (
              <Chatloading />
            ) : (
              searchResult.map((user) => (
                <UserListItem
                  key={user.id}
                  user={user}
                  handleFunction={() => accessChat(user.id)}
                />
              ))
            )}
          </DrawerBody>
          {loadingChat && <Spinner ml="auto" d="flex" />}
        </DrawerContent>
      </Drawer>
    </nav>
  );
};

export default SideNav;
