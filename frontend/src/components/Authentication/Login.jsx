import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Button,
} from "@chakra-ui/react";
import { useState } from "react";

const Login = () => {
  
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPasssword] = useState(false);
  const { email, password } = credentials

  const handleChange = (e) => {
    const { name, value } = e.target
    setCredentials({ ...credentials, [name]: value })
  }
  
  return (
    <VStack>
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          type="email"
          name="email"
          value={email}
          onChange={handleChange}
          autoComplete="off"
        />
      </FormControl>
      <FormControl id="password" isRequired className="h-24">
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Enter Your Password"
            name="password"
            value={password}
            onChange={handleChange}
          />
          <InputRightElement width="4.5rem" className="pr-2">
            <Button
              h="1.75rem"
              className="px-12"
              onClick={() => setShowPasssword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button colorScheme="blue" width={"100%"}>
        Sign Up
      </Button>
    </VStack>
  );
};

export default Login;
