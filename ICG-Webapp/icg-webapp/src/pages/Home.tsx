import { FunctionComponent } from "react";
import {
  Heading,
  Container,
  Divider,
  Text,
  Box,
  Img,
  HStack,
  Center,
} from "@chakra-ui/react";
import LogoSvg from "../design/logo/png/logo-no-background.png";
import UploadComponent from "../components/UploadComponent";
import themes from "../design/themes";
import "../index.css";
import bgvideo from "../media/GL010031.mp4";

const Home: FunctionComponent = () => {
  return (
    <Box>
        <Box>
        <Box className="overlay"/>
          <Box>
          <video  src={bgvideo} autoPlay loop muted />
            <Box className="vidcontent">
              <Heading fontSize={"3.5em"}> Velkommen til ICWaste</Heading>
              <Divider width={"50%"}/>
              <Text fontSize={"25px"} pt={"1rem"}>Upload videoer af din affaldsindsamling</Text>
              <Text fontSize={"25px"}>og bliv belønnet for din biddragelse</Text>
            </Box>
          </Box>
        </Box>
          <Container maxWidth={"100%"} pt={"2em"}>
            <UploadComponent/>
          </Container >
    </Box>
  );
};

export default Home;
