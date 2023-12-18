import {
  Container,
  Box,
  Text,
  TabList,
  Tab,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";
const Home = () => {
  return (
    <div>
      <Container>
        <Box>
          <Text fontSize="4xl" color="blue.500">
            Walkie Sporkie
          </Text>
        </Box>
        <Box>
          <Tabs variant="soft-rounded" className="">
            <TabList className="mb-[1em]">
              <Tab width="50%">Log In</Tab>
              <Tab width="50%">Sign Up</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Login />
              </TabPanel>
              <TabPanel>
                <Signup />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Container>
    </div>
  );
};

export default Home;
