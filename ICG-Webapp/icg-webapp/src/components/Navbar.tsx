import { Box, Flex, HStack, Image } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import themes from "../design/themes";
import logo from "../design/logo/png/logo-no-background.png";
import urls from "../components/urls";
import { RootState } from "../store/store";
import { useSelector } from "react-redux";

const NavButtonStyle = {
  backgroundcolor: themes.adobePalette.darker,
  ":hover": {
    color: themes.adobePalette.lighter,
    backgroundcolor: themes.adobePalette.darkest,
  },
  fontSize: "25",
};

const Navbar = () => {
  const isLoggedIn = useSelector((state: RootState) => state.login.isLoggedIn);

  return (
    <Flex
      as="nav"
      justify={"space-around"}
      wrap={"wrap"}
      gap={"2"}
      alignItems={"center"}
      backgroundColor={themes.primaryColours.background}
    >
      <NavLink to={urls.home}>
        <Box>
          <Image src={logo} boxSize={"6em"} />
        </Box>
      </NavLink>
      {!isLoggedIn ? (
        <HStack gap={"2em"}>
          <NavLink to={urls.home}>
            <Box sx={NavButtonStyle}> Home </Box>
          </NavLink>
          <NavLink to={urls.about}>
            <Box sx={NavButtonStyle}> About </Box>
          </NavLink>
          <NavLink to={urls.login}>
            <Box sx={NavButtonStyle}>Login</Box>
          </NavLink>
        </HStack>
      ) : (
        <HStack gap={"2em"}>
          <NavLink to={urls.home}>
            <Box sx={NavButtonStyle}> Home </Box>
          </NavLink>
          <NavLink to={urls.about}>
            <Box sx={NavButtonStyle}> About </Box>
          </NavLink>
          <NavLink to={urls.users}>
            <Box sx={NavButtonStyle}> Users </Box>
          </NavLink>
        </HStack>
      )}
    </Flex>
  );
};
export default Navbar;
