import { FunctionComponent, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Flex,
  Heading,
  Input,
  Button,
  InputGroup,
  Stack,
  InputLeftElement,
  chakra,
  Box,
  Avatar,
  FormControl,
  InputRightElement,
} from "@chakra-ui/react";
import { FaUserAlt, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import urls from "../urls";
import { UserBody, UserService } from "../../models/UserService";

const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);

interface IUserForm {
  userName: string;
  email: string;
  password: string;
  points: number;
}

const SignupPage: FunctionComponent = () => {
  const [showPassword, setShowPassword] = useState(false);
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<IUserForm>();
  const handleShowClick = () => setShowPassword(!showPassword);
  const navigate = useNavigate();

  const handleSignup = async (data: IUserForm) => {
    let userService = new UserService();
    await userService.RegisterUser(data as UserBody);
    console.log("USERDATA: " + data);
    /*
    let res = ApiService.client().post_new_user(new UserRegistry({
      userName: data.userName,
      email: data.email,
      password: data.password,
      points: data.points
    }));
    */
    navigate(urls.home);
  };

  function onSubmit(values: IUserForm) {
    console.log(
      "vals: " +
        values.email +
        ", " +
        values.userName +
        ", " +
        values.password +
        ", " +
        values.points
    );
    return new Promise((resolve) => {
      setTimeout(() => {
        alert(JSON.stringify(values.email, null, 2));
        handleSignup(values);

        Promise.resolve(resolve);
      }, 3000);
    });
  }

  return (
    <Flex
      flexDirection="column"
      width="100%"
      height="100%"
      backgroundColor="gray.200"
      justifyContent="center"
      alignItems="center"
    >
      <Stack
        flexDir="column"
        mb="2"
        justifyContent="center"
        alignItems="center"
      >
        <Avatar bg="teal.500" />
        <Heading color="teal.400">Sign up</Heading>
        <Box minW={{ base: "90%", md: "468px" }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack
              spacing={4}
              p="1rem"
              backgroundColor="whiteAlpha.900"
              boxShadow="md"
            >
              <FormControl>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<CFaUserAlt color="gray.300" />}
                  />
                  <Input
                    type="username"
                    placeholder="username"
                    {...register("userName", {
                      required: "This is required",
                      minLength: {
                        value: 4,
                        message: "Minimum length should be 4",
                      },
                    })}
                  />
                </InputGroup>
              </FormControl>
              <FormControl>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<CFaUserAlt color="gray.300" />}
                  />
                  <Input
                    type="email"
                    placeholder="email address"
                    {...register("email", {
                      required: "This is required",
                      minLength: {
                        value: 4,
                        message: "Minimum length should be 4",
                      },
                    })}
                  />
                </InputGroup>
              </FormControl>
              <FormControl>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    color="gray.300"
                    children={<CFaLock color="gray.300" />}
                  />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    {...register("password", {
                      required: "This is required",
                      minLength: {
                        value: 4,
                        message: "Minimum length should be 4",
                      },
                    })}
                  />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleShowClick}>
                      {showPassword ? "Hide" : "Show"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <Button
                borderRadius={0}
                type="submit"
                variant="solid"
                colorScheme="teal"
                width="full"
                isLoading={isSubmitting}
              >
                Sign up
              </Button>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Flex>
  );
};

export default SignupPage;
