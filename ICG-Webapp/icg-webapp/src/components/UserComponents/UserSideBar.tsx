import React from "react";
import { Box, Flex, Text, VStack, Link } from "@chakra-ui/react";
import themes from "../../design/themes";

interface SidebarProps {
  onItemClick: (item: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onItemClick }) => {
  return (
    <Box
      bg={themes.adobePalette.darker}
      color="white"
      w="13%"
      h="100vh"
      position="fixed"
      left="0"
      top="0"
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
      </VStack>
    </Box>
  );
};

export default Sidebar;
