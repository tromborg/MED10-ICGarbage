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
  MdCloudUpload,
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
      bg={"#edf2f4"}
      color="#2b2d42"
      w="100%"
      h="100%"
      p="4"
      borderRadius={5}
      borderWidth={1}
      flexDirection="column"
      justifyContent="space-between"
      m={1}
      ml={2}
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
            _hover={{ bg: themes.primaryColours.white }}
            borderRadius={5}
            onClick={() => onClick("useroverview", "brugeroversigt")}
            backgroundColor={
              activePage === "brugeroversigt" ? themes.primaryColours.white : ""
            }
            display="flex"
            alignItems="center"
            boxShadow={activePage === "brugeroversigt" ? "base" : ""}
          >
            <Icon color="black" mr={2} mb={-0.5} as={MdDvr} />
            <Text>Brugeroversigt</Text>
          </Link>
          <Link
            href="#uploadpage"
            p="2"
            _hover={{ bg: themes.primaryColours.white }}
            borderRadius={5}
            onClick={() => onClick("uploadpage", "upload")}
            backgroundColor={
              activePage === "upload" ? themes.primaryColours.white : ""
            }
            boxShadow={activePage === "upload" ? "base" : ""}
          >
            <Icon as={MdCloudUpload} mr={2} mb={-0.5} />
            Upload Videoer
          </Link>
          <Link
            href="#userstatistics"
            p="2"
            _hover={{ bg: themes.primaryColours.white }}
            borderRadius={5}
            onClick={() => onClick("userstatistics", "statistikker")}
            backgroundColor={
              activePage === "statistikker" ? themes.primaryColours.white : ""
            }
            boxShadow={activePage === "statistikker" ? "base" : ""}
          >
            <Icon as={MdOutlineMoving} mr={2} mb={-0.5} />
            Statistikker
          </Link>
          <Link
            href="#globalleaderboard"
            p="2"
            _hover={{ bg: themes.primaryColours.white }}
            borderRadius={5}
            onClick={() => onClick("globalleaderboard", "leaderboard")}
            backgroundColor={
              activePage === "leaderboard" ? themes.primaryColours.white : ""
            }
            boxShadow={activePage === "leaderboard" ? "base" : ""}
          >
            <Icon mr={2} mb={-0.5} as={MdLeaderboard} />
            Globalt Leaderboard
          </Link>
          <Link
            href="#userinventory"
            p="2"
            _hover={{ bg: themes.primaryColours.white }}
            borderRadius={5}
            onClick={() => onClick("userinventory", "minekuponer")}
            backgroundColor={
              activePage === "minekuponer" ? themes.primaryColours.white : ""
            }
            boxShadow={activePage === "minekuponer" ? "base" : ""}
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
