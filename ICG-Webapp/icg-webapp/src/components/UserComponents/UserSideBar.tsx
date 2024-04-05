import React, { useEffect, useState } from "react";
import { Box, Flex, Text, VStack, Link, Button, Icon } from "@chakra-ui/react";
import themes from "../../design/themes";
import { useNavigate } from "react-router-dom";
import urls from "../urls";
import { AppDispatch } from "../../store/store";
import { useDispatch } from "react-redux";
import { setLogin } from "../../store/reducers/login";
import { userSessionDb } from "../../components/SessionDB";
import { setUserId } from "../../store/reducers/userid";
import {
  MdDvr,
  MdOutlineMoving,
  MdLeaderboard,
  MdCardGiftcard,
} from "react-icons/md";
interface SidebarProps {
  onItemClick: (item: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onItemClick }) => {
  const loginDispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState<string>("brugeroversigt");

  const handleLogout = async () => {
    loginDispatch(setLogin(false));
    loginDispatch(setUserId(""));
    await userSessionDb.removeUser();
    navigate(urls.home);
  };

  const onClick = (ref: string, page: string) => {
    onItemClick(ref);
    setActivePage(page);
  };

  return (
    <Flex
      bg={"#99d98c"}
      color="white"
      w="13%"
      h="93%"
      position="fixed"
      p="4"
      borderRadius={5}
      flexDirection="column"
      justifyContent="space-between"
    >
      <Flex flexDirection="column">
        <Flex align="center" mb="4" justifyContent="center">
          <Text fontSize="xl" fontWeight="bold">
            Bruger Menu
          </Text>
        </Flex>
        <VStack spacing="4" align="stretch">
          <Link
            href="#useroverview"
            p="2"
            _hover={{ bg: themes.adobePalette.main }}
            borderRadius={5}
            onClick={() => onClick("useroverview", "brugeroversigt")}
            backgroundColor={
              activePage === "brugeroversigt" ? themes.adobePalette.main : ""
            }
            display="flex"
            alignItems="center"
          >
            <Icon color="black" mr={2} mb={-0.5} as={MdDvr} />
            <Text color="#31572c">Brugeroversigt</Text>
          </Link>
          <Link
            href="#userstatistics"
            p="2"
            _hover={{ bg: themes.adobePalette.main }}
            borderRadius={5}
            onClick={() => onClick("userstatistics", "statistikker")}
            backgroundColor={
              activePage === "statistikker" ? themes.adobePalette.main : ""
            }
          >
            <Icon as={MdOutlineMoving} mr={2} mb={-0.5} />
            Statistikker
          </Link>
          <Link
            href="#globalleaderboard"
            p="2"
            _hover={{ bg: themes.adobePalette.main }}
            borderRadius={5}
            onClick={() => onClick("globalleaderboard", "leaderboard")}
            backgroundColor={
              activePage === "leaderboard" ? themes.adobePalette.main : ""
            }
          >
            <Icon mr={2} mb={-0.5} as={MdLeaderboard} />
            Globalt Leaderboard
          </Link>
          <Link
            href="#userinventory"
            p="2"
            _hover={{ bg: themes.adobePalette.main }}
            borderRadius={5}
            onClick={() => onClick("userinventory", "minekuponer")}
            backgroundColor={
              activePage === "minekuponer" ? themes.adobePalette.main : ""
            }
          >
            <Icon mr={2} mb={-0.5} as={MdCardGiftcard} />
            Mine Kuponer
          </Link>
        </VStack>
      </Flex>

      <Flex width="100%">
        <Button
          color="white"
          backgroundColor="#52b69a"
          onClick={handleLogout}
          width="100%"
        >
          Log out
        </Button>
      </Flex>
    </Flex>
  );
};

export default Sidebar;
