import { Box, Divider, Flex, HStack, Heading, Image } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import themes from "../design/themes";
import logo from "../design/logo/png/logo-no-background.png";
import urls from "../components/urls";
import { RootState } from "../store/store";
import { useSelector } from "react-redux";
import { useState } from "react";

const NavButtonStyle = {
  backgroundcolor: themes.adobePalette.darker,
  ":hover": {
    color: themes.adobePalette.main,
    backgroundcolor: themes.adobePalette.darkest,
  },
  fontSize: "25",
};

const Navbar = () => {
  const isLoggedIn = useSelector((state: RootState) => state.login.isLoggedIn);
  const [isHoverColor, setIsHoverColor] = useState(themes.adobePalette.darker);
  return (
    <Flex
      as="nav"
      justify={"space-around"}
      wrap={"wrap"}
      gap={"2"}
      alignItems={"center"}
      backgroundColor={themes.primaryColours.white}
      pb={"1em"}
      pt={"1em"}
      borderBottomWidth={1}
    >
      <NavLink to={urls.home}>
        <Box>
          <Heading color={themes.adobePalette.darker}>ICWaste</Heading>
        </Box>
      </NavLink>
      {!isLoggedIn ? (
        <HStack gap={"2em"}>
          <NavLink to={urls.home}>
            <Box sx={NavButtonStyle}>
              <Heading fontSize={"l"}> Home </Heading>{" "}
            </Box>
          </NavLink>
          <NavLink to={urls.login}>
            <Box sx={NavButtonStyle}>
              <Heading fontSize={"l"}> Login </Heading>
            </Box>
          </NavLink>
          <NavLink to={urls.about}>
            <Box sx={NavButtonStyle}>
              <Heading fontSize={"l"}> About </Heading>
            </Box>
          </NavLink>
        </HStack>
      ) : (
        <HStack gap={"2em"}>
          <NavLink to={urls.home}>
            <Box sx={NavButtonStyle}>
              <Heading fontSize={"l"}> Home </Heading>
            </Box>
          </NavLink>
          <NavLink to={urls.users}>
            <Box sx={NavButtonStyle}>
              <Heading fontSize={"l"}> Users </Heading>
            </Box>
          </NavLink>
          <NavLink to={urls.shop}>
            <Box sx={NavButtonStyle}>
              <Heading fontSize={"l"}> Shop </Heading>
            </Box>
          </NavLink>
          <NavLink to={urls.about}>
            <Box sx={NavButtonStyle}>
              <Heading fontSize={"l"}> About</Heading>
            </Box>
          </NavLink>
        </HStack>
      )}
    </Flex>
  );
};
export default Navbar;
