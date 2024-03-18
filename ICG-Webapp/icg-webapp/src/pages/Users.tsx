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
    default:
      content = <UserOverview />;
  }

  return (
    <Flex width="100%">
      <Sidebar onItemClick={handleItemClick} />
      <Container maxW="87%" ml="250px" mt="20px">
        {content}
      </Container>
    </Flex>
  );
};

export default Users;
