import {
  VStack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";

import axios from "axios";
import { signupUser } from "../../actions/user";

const Signup = () => {
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
    image: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [uploading, setUploading] = useState(false);
  const [showPassword, setShowPasssword] = useState(false);

  const toast = useToast();

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
    setConfirmPassword(value);
    if (value !== password) {
      setIsError(true);
    } else {
      setIsError(false);
    }
  };

  const postDetails = async (e) => {
    setUploading(true);

    const imageFile = e.target.files[0];

    console.log(imageFile);

    if (imageFile === null || imageFile === undefined) {
      toast({
        title: "Please select an image",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      return;
    } else {
      const data = new FormData();
      data.append("file", imageFile);
      data.append("upload_preset", "chat-feature");
      data.append(
        "cloud_name",
        `${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}`
      );

      // upload image
      try {
        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${
            import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
          }/image/upload`,
          data
        );
        const url = response.data.url;
        setCredentials({ ...credentials, image: url });
        console.log(credentials.image);
        setUploading(false);
        toast({
          title: "Image uploaded successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "bottom",
        });
        console.log(url);
        return;
      } catch (error) {
        setUploading(false);
        toast({
          title: "There was an error uploading your image",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  // Submit the Form
  const handleSubmit = async (e) => {
    e.preventDefault();

    setUploading(true);
    if (
      name === "" ||
      email === "" ||
      password === "" ||
      confirmPassword === ""
    ) {
      toast({
        title: "Please fill all the fields",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
      setUploading(false);
      return;
    } else if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
      setUploading(false);
      return;
    } else {
      try {
        const response = await signupUser(credentials);

        if (response.status === 201) {
          toast({
            title: "Account created successfully",
            status: "success",
            duration: 2000,
            isClosable: true,
            position: "bottom",
          });

          setCredentials({
            name: "",
            email: "",
            password: "",
            image: "",
          });

          setConfirmPassword("");

          setUploading(false);

          return;
        }
      } catch (error) {
        setUploading(false);
        toast({
          title: "There was an error creating your account",
          status: "error",
          duration: 2000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

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
      <FormControl id="image">
        <FormLabel>
          Upload Profile Picture <span className="font-normal">(optional)</span>
        </FormLabel>
        <Input
          type="file"
          accept="image/*"
          className="pt-1"
          name="image"
          onChange={postDetails}
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
      <FormControl
        id="confirmPassword"
        isInvalid={isError}
        isRequired
        className="h-24"
      >
        <FormLabel id="confirmPassword">Confirm Password</FormLabel>
        <Input
          type="password"
          placeholder="Confirm Your Password"
          name="confirmPassword"
          value={confirmPassword}
          onChange={handlePasswordChange}
        />
        {isError && (
          <FormErrorMessage className="font-medium">
            Passwords do not match
          </FormErrorMessage>
        )}
      </FormControl>
      <Button
        colorScheme="blue"
        width={"100%"}
        isLoading={uploading}
        onClick={handleSubmit}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default Signup;
