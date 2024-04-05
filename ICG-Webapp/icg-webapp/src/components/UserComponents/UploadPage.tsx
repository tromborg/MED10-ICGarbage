import { FunctionComponent, useState } from "react";
import {
  Heading,
  VStack,
  Container,
} from "@chakra-ui/react";
import UploadComponent from "../UploadComponent";
import themes from "../../design/themes";

const UploadPage: FunctionComponent = () => {
  
    return (
      <Container width="100%">
        <VStack justifyContent={"center"}>
            <VStack>
                <Heading justifySelf={"center"} color={themes.adobePalette.darker}>
                    Upload Videoer
                </Heading>
                <Heading as={"h3"} size={"l"} justifySelf={"center"} color={themes.adobePalette.darkest}> 
                    Upload videoer af dine indsamling og modtag point!
                </Heading>
            </VStack>
            <UploadComponent/>
        </VStack>
      </Container>
    );
  };

  export default UploadPage;