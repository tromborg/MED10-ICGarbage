import React from "react";
import { Box, Flex, Text, VStack, Link, Button } from "@chakra-ui/react";
import themes from "../../design/themes";
import { useNavigate } from "react-router-dom";
import urls from "../urls";
import { AppDispatch } from "../../store/store";
import { useDispatch } from "react-redux";
import { setLogin } from "../../store/reducers/login";
import { userSessionDb } from "../../components/SessionDB";
import { setUserId } from "../../store/reducers/userid";
interface SidebarProps {
  onItemClick: (item: string) => void;
}



const Sidebar: React.FC<SidebarProps> = ({ onItemClick }) => {
  const loginDispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLogout = async() => {
    loginDispatch(setLogin(false));
    loginDispatch(setUserId(""));
    await userSessionDb.removeUser();
    navigate(urls.home);  
  }

  return (
    <Box
      bg={themes.adobePalette.darker}
      color="white"
      w="13%"
      h="100vh"
      position="fixed"
      p="4"
    >
      <Flex align="center" mb="4">
        <Text fontSize="xl" fontWeight="bold">
          Bruger
        </Text>
      </Flex>
      <VStack spacing="4" align="stretch">
        <Link href="#useroverview" p="2" _hover={{ bg: themes.adobePalette.lighter }} onClick={() => onItemClick('useroverview')}>Brugeroversigt</Link>
        <Link href="#userstatistics" p="2" _hover={{ bg: themes.adobePalette.lighter }} onClick={() => onItemClick('userstatistics')}>Statistikker</Link>
        <Link href='#globalleaderboard' p="2" _hover={{ bg: themes.adobePalette.lighter }} onClick={() => onItemClick('globalleaderboard')}>Globalt Leaderboard</Link>
        <Button colorScheme="red" onClick={handleLogout}>
          Log out
        </Button>
      </VStack>
    </Box>
  );
};

export default Sidebar;
