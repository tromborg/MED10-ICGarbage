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
  Divider
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
import { setUserId } from "../../store/reducers/userid";
import themes from "../../design/themes";

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
    let userService = new UserService();
    let res = await userService.CheckUserLogin(data as UserBody);

    navigate(urls.home);
    if (res.isLoggedIn === true) {
      loginDispatch(setLogin(true));
      loginDispatch(setUserId(res.userid));
      await userSessionDb.addUser(
        res.userid as string,
        res.isLoggedIn,
        new Date().toDateString()
      );
    }
  };

  function onSubmit(values: ILoginForm) {
    return new Promise((resolve) => {
      setTimeout(() => {
        handleLogin(values);
        Promise.resolve(resolve);
      }, 2000);
    });
  }
  return (
    <Flex
      flexDirection="column"
      width="100%"
      height="100%"
      
      justifyContent="center"
      alignItems="center"
    >
      <Divider/>
      <Stack
        flexDir="column"
        mb="2"
        justifyContent="center"
        alignItems="center"
        pt={"1em"}
      >
        <Avatar bg="green.500" />
        <Heading color={themes.primaryColours.lightGreen}>Welcome</Heading>
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
                    children={<CFaUserAlt color="green.300" />}
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
                    color="green.300"
                    children={<CFaLock color="green.300" />}
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
                colorScheme="green"
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
        <Link color="green" href="/signup">
          Sign Up
        </Link>
      </Box>
    </Flex>
  );
};

export default LoginPage;
