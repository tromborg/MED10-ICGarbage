import { FunctionComponent, useState } from "react";
import {
  Menu,
  MenuButton,
  Button,
  Heading,
  VStack,
  Center,
  Flex,
  Container,
} from "@chakra-ui/react";
import UploadComponent from "../UploadComponent";
import themes from "../../design/themes";

const UploadPage: FunctionComponent = () => {
  
    return (
      <Container width="100%">
        <VStack justifyContent={"center"}>
            <Heading justifySelf={"center"} color={themes.adobePalette.darker} maxWidth={"100%"}>
                Upload videoer af dine indsamling
            </Heading>
            <UploadComponent/>
        </VStack>
      </Container>
    );
  };

  export default UploadPage;