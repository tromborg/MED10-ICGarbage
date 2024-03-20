import { FunctionComponent, useState } from "react";
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
  Link,
  Avatar,
  FormControl,
  FormHelperText,
  InputRightElement,
} from "@chakra-ui/react";
import { FaUserAlt, FaLock } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import urls from "../urls";
import { UserBody, UserService } from "../../models/UserService";
import { AppDispatch } from "../../store/store";
import { useDispatch } from "react-redux";
import { setLogin } from "../../store/reducers/login";
import { userSessionDb } from "../../components/SessionDB";

const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);

interface ILoginForm {
  userName: string;
  password: string;
  email: string;
  points: number;
}

const LoginPage: FunctionComponent = () => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<ILoginForm>();
  const navigate = useNavigate();
  const handleShowClick = () => setShowPassword(!showPassword);
  const loginDispatch = useDispatch<AppDispatch>();

  const handleLogin = async (data: ILoginForm) => {
    console.log("USERDATA: " + data);
    let userService = new UserService();
    let res = await userService.CheckUserLogin(data as UserBody);

    navigate(urls.home);
    console.log("resw: " + res);
    if (res.isLoggedIn === true) {
      console.log(`userid: ${res.userid}`);
      console.log(`isloggedin: ${res.isLoggedIn === true}`);
      loginDispatch(setLogin(true));
      await userSessionDb.addUser(
        res.userid as string,
        res.isLoggedIn,
        new Date().toDateString()
      );

      let usersesh = userSessionDb.getUserFromSessionDb();
      console.log("TESTDB, ID: " + (await usersesh).userId);
      console.log("TESTDB, IsLoggedIn: " + (await usersesh).isLoggedIn);
      console.log("TESTDB, Timestmap: " + (await usersesh).loginTimestamp);
    }
  };

  function onSubmit(values: ILoginForm) {
    console.log("vals: " + ", " + values.userName + ", " + values.password);
    return new Promise((resolve) => {
      setTimeout(() => {
        alert(JSON.stringify(values.userName, null, 2));
        handleLogin(values);

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
        <Heading color="teal.400">Welcome</Heading>
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
                <FormHelperText textAlign="right">
                  <Link>forgot password?</Link>
                </FormHelperText>
              </FormControl>
              <Button
                borderRadius={0}
                type="submit"
                variant="solid"
                colorScheme="teal"
                width="full"
                isLoading={isSubmitting}
              >
                Login
              </Button>
            </Stack>
          </form>
        </Box>
      </Stack>
      <Box>
        New to us?{" "}
        <Link color="teal.500" href="/signup">
          Sign Up
        </Link>
      </Box>
    </Flex>
  );
};

export default LoginPage;
