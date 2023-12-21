import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { loginUser } from "../../actions/user";

const Login = () => {
  const toast = useToast();

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPasssword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { email, password } = credentials;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async () => {
    setLoading(true);

    if (email === "" || password === "") {
      toast({
        title: "Please fill all the fields",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
      return;
    } else {
      try {
        const response = await loginUser(credentials);
        if (response.status === 200) {
          toast({
            title: "Login Successful",
            status: "success",
            duration: 3000,
            isClosable: true,
          });

          setCredentials({
            email: "",
            password: "",
          });

          setLoading(false);

          // Add the Navigation Logic Too. 
        }
      } catch (error) {
        if (error.response.data.error === "Incorrect email") {
          toast({
            title: "Incorrect email",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          setLoading(false);
        }
        else if (error.response.data.error === "Incorrect password") {
          toast({
            title: "Incorrect password",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          setLoading(false);
        }
        else {
          toast({
            title: "There was an error logging you in",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          setLoading(false);
        }
      }
    }
  };

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
      <Button
        colorScheme="blue"
        width={"100%"}
        isLoading={loading}
        onClick={handleSubmit}
      >
        Log in
      </Button>
    </VStack>
  );
};

export default Login;
