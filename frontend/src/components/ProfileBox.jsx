import {
  Modal,
  ModalHeader,
  ModalContent,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  ModalOverlay,
  useDisclosure,
  IconButton,
  Button,
  Image,
  Text
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";

const ProfileBox = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton icon={<ViewIcon />} onClick={onOpen} />
      )}
      <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader className="flex justify-center" fontSize="1.75rem">
            {user.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody className="text-center">
            <Image
              className="rounded-full h-[150px] w-[145px] mx-auto"
              src={user.profilePhoto}
              alt={user.name}
            />
            <Text className="text-md my-2 font-semibold">{user.email}</Text>
          </ModalBody>
          
          <ModalFooter>
            <Button colorScheme="blue" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileBox;
