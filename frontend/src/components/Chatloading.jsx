
import { Stack, Skeleton } from "@chakra-ui/react";

const Chatloading = () => {
  return (
    <Stack>
      <Skeleton height="20vh" />
      <Skeleton height="20vh" />
      <Skeleton height="20vh" />
      <Skeleton height="20vh" />
      <Skeleton height="15vh" />
    </Stack>
  );
};

export default Chatloading;
