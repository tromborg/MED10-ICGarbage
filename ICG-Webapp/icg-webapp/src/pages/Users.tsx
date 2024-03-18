import { FunctionComponent, useState } from "react";
import {
  Menu,
  MenuButton,
  Button,
  MenuList,
  MenuItem,
  Container,
  Flex,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import Sidebar from "../components/UserComponents/UserSideBar";
import UserOverview from "../components/UserComponents/UserOverview";
import UserStatistics from "../components/UserComponents/UserStatistics";
import GlobalLeaderboard from "../components/UserComponents/GlobalLeaderboard";

const Users: FunctionComponent = () => {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const handleItemClick = (item: string) => {
    setSelectedItem(item);
  };

  let content: JSX.Element;
  switch (selectedItem) {
    case "useroverview":
      content = <UserOverview />;
      break;
    case "userstatistics":
      content = <UserStatistics />;
      break;
    case "globalleaderboard":
      content = <GlobalLeaderboard />;
      break;
    default:
      content = <UserOverview />;
  }

  return (
    <Flex width="100%">
      <Sidebar onItemClick={handleItemClick} />
      <Container maxW="87%" mt="20px" ml="250px">
        {content}
      </Container>
    </Flex>
  );
};

export default Users;
