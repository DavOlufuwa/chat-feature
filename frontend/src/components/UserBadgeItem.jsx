import { Box } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";

const UserBadgeItem = ({ handleFunction, user }) => {
  return (
    <Box
      className="flex items-center px-2 py-1 m-1 mb-2 rounded-lg cursor-pointer bg-purple-600 text-sm font-medium text-white"
      onClick={handleFunction}
      variant="solid"
    >
      {user.name}
      <CloseIcon  className="ml-2 pl-1" />
    </Box>
  );
};

export default UserBadgeItem;
