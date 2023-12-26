
import { Box, Avatar, Text } from "@chakra-ui/react";

const UserListItem = ({ user, handleFunction }) => {
  return (
    <Box
      onClick={handleFunction}
      className="flex items-center w-full cursor-pointer duration-200 rounded-lg mb-2 p-2 bg-[#E8E8E8] hover:bg-[#38b2ac] hover:text-white"
    >
      <Avatar
        className="mr-2 cursor-pointer"
        size="md"
        name={user.name}
        src={user.profilePhoto}
      />
      <Box>
        <Text className="font-medium">{user.name}</Text>
        <Text fontSize="xs">{user.email}</Text>
        {/* <Text fontSize="xs">{user.id}</Text> */}
      </Box>
    </Box>
  );
};

export default UserListItem;
