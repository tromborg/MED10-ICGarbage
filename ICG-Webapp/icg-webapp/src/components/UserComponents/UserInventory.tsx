import { FunctionComponent, useState } from "react";
import {
  Container,
  Center,
  Heading,
  Text,
  VStack
} from "@chakra-ui/react";
import themes from '../../design/themes';


const UserInventory: FunctionComponent = () => {
    const [selectedItem, setSelectedItem] = useState<string | null>(null);
  
  
    return (
      <Container width="100%">
        <Center pb={"1em"}>
            <VStack>
                <Heading justifySelf={"center"} color={themes.adobePalette.darker}>
                    MINE KUPONER
                </Heading>
                <Heading as={"h3"} size={"l"} justifySelf={"center"} color={themes.adobePalette.darkest}> Her en oversigt over dine købte kuponer </Heading>
            </VStack>
            
        </Center>
      </Container>
    );
  };
  
  export default UserInventory;
  