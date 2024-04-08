import { FunctionComponent, useState } from "react";
import {
  Menu,
  MenuButton,
  Button,
  MenuList,
  MenuItem,
  Container,
  Flex,
  Box,
} from "@chakra-ui/react";
import Sidebar from "../components/UserComponents/UserSideBar";
import UserOverviewPage from "../components/UserComponents/UserOverviewPage";
import UserStatistics from "../components/UserComponents/UserStatistics";
import GlobalLeaderboard from "../components/UserComponents/GlobalLeaderboard";
import UserInventory from "../components/UserComponents/UserInventory";
import UploadPage from "../components/UserComponents/UploadPage";
import themes from "../design/themes";
import bg from "../design/picker.png";

const Users: FunctionComponent = () => {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const handleItemClick = (item: string) => {
    setSelectedItem(item);
  };

  let content: JSX.Element;
  switch (selectedItem) {
    case "useroverview":
      content = <UserOverviewPage />;
      break;
    case "userstatistics":
      content = <UserStatistics />;
      break;
    case "globalleaderboard":
      content = <GlobalLeaderboard />;
      break;
    case "userinventory":
      content = <UserInventory />;
      break;
    case "uploadpage":
      content = <UploadPage />;
      break;
    default:
      content = <UserOverviewPage />;
  }

  return (
    <Flex width="100%" h="92vh" bgGradient="linear(to-br, white, #499250)">
      <Flex w="13%">
        <Sidebar onItemClick={handleItemClick} />
      </Flex>
      <Container maxW="87%" pl={-1} pr={-1}>
        <Box w="100%" h="100%">
          {content}
        </Box>
      </Container>
    </Flex>
  );
};

export default Users;
