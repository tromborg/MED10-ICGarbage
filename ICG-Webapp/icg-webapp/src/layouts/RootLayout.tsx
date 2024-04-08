import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import themes from "../design/themes";
import { Flex } from "@chakra-ui/react";
import { FunctionComponent } from "react";

const RootLayout: FunctionComponent = () => {
  return (
    <Flex direction="column" h="100vh">
      <Navbar />
      <Flex style={{ backgroundColor: themes.primaryColours.white }}>
        <Outlet />
      </Flex>
    </Flex>
  );
};

export default RootLayout;
