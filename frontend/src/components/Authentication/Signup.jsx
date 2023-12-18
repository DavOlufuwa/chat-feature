import {
  VStack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  InputGroup,
  InputRightElement,
  Button,
} from "@chakra-ui/react";
import { useState } from "react";

const Signup = () => {
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPasssword] = useState(false);
  
  const { name, email, password } = credentials;
  const [isError, setIsError] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;

    setCredentials({
      ...credentials,
      [name]: value,
    });
  };

  const handlePasswordChange = (e) => {
    const { value } = e.target;
    
    if (value !== password) {
      setIsError(true);
    } else {
      setIsError(false);
    }
  }



  return (
    <VStack spacing="6px">
      <FormControl id="name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          id="name"
          type="text"
          placeholder="Enter Your Name"
          name="name"
          value={name}
          onChange={handleChange}
        />
      </FormControl>
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          type="email"
          placeholder="Enter Your Email"
          name="email"
          value={email}
          onChange={handleChange}
        />
      </FormControl>
      <FormControl id="password" isRequired>
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
            <Button h="1.75rem" className="px-12" onClick={() => setShowPasssword(!showPassword)}>{showPassword ? "Hide" : "Show"}</Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="confirmPassword" isInvalid={isError} isRequired className="h-24">
        <FormLabel id="confirmPassword">Confirm Password</FormLabel>
        <Input
          type="password"
          placeholder="Confirm Your Password"
          onChange={handlePasswordChange}
        />
        {isError && <FormErrorMessage className="font-medium">Passwords do not match</FormErrorMessage>}
      </FormControl>
      <Button colorScheme="blue" width={"100%"}>Sign Up</Button>
    </VStack>
  );
};

export default Signup;
