import { FunctionComponent } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heading,
  Divider,
  Text,
  Box,
  Flex,
  VStack,
  HStack,
  Button
} from "@chakra-ui/react";
import themes from "../design/themes";
import "../index.css";
import bgvideo from "../media/GL010031.mp4";
import urls from "../components/urls";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import LogoSvg from "../design/logo/svg/logo-no-background.svg";

const Home: FunctionComponent = () => {
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state: RootState) => state.login.isLoggedIn);
  return (
    <Flex>
      <VStack>
        <Flex>
          <Box className="overlay"/>
          <Box>
            <video  src={bgvideo} autoPlay loop muted />
            <Box className="vidcontent" >
              <Heading fontSize={"3.5em"}> Velkommen til ICWaste</Heading>
              <Divider width={"50%"}/>
              <Box>
                <Text fontSize={"25px"} pt={"1rem"} fontWeight={600}>Upload videoer af din affaldsindsamling</Text>
                <Text fontSize={"25px"} fontWeight={600}>og bliv belønnet for <span style={{fontWeight: "bold", color: themes.adobePalette.lighter}}>din biddragelse</span></Text>
              </Box>
            </Box>
          </Box>
        </Flex>
        <Flex maxWidth={"100%"} pt={"3em"} pb={"3em"} >
          <VStack>
              <VStack>
                <Heading size={"xl"} textColor={themes.adobePalette.darkest}>Start din hjælp i dag!</Heading>
                <Text fontSize={"25px"} fontWeight={600} textColor={themes.adobePalette.evenDarker} pb={"1em"}>Opret en bruger i dag og kom i gang med at uploade videoer af din indsamling</Text>
                <Button 
                  backgroundColor={themes.adobePalette.darker} 
                  size={"lg"} 
                  _hover={{ bg: themes.adobePalette.main }}
                  onClick={()=>{
                    isLoggedIn ? navigate(urls.users) : navigate(urls.login)
                  }}
                
                ><Text textColor={themes.primaryColours.white}>Klik her for at komme i gang</Text></Button>
              </VStack>
              
          </VStack>
        </Flex >
        <Flex backgroundColor={themes.adobePalette.darker} className="homeoverlay" >
          <Box />
          <HStack pt={"1em"} pb={"1em"} justifyContent={"space-around"}>
              <VStack maxWidth={"30%"} >
                <Heading as={"h2"} size={"xl"} alignSelf={"flex-start"} textColor={themes.primaryColours.white}>Støt op om en renere natur</Heading>
                <Text fontSize={"20px"} textColor={themes.primaryColours.white}>
                  ICWaste er blevet udviklet for at vi bedre kan sætte pris skraldeindsamleres arbejde for en 
                  rydde op i den danske natur, og biddrage til en grønnere Danmark. 
                </Text>
                <Text fontSize={"20px"} textColor={themes.primaryColours.white}>
                  Der bliver desværre stadig smidt forfærdeligt meget
                  affald ude i den danske natur, og vi ønsker at få ryddet op og se Danmark blomstre igen. Det kan vi ikke gøre uden din hjælp og den vil vi gerne belønne!
                </Text>
              </VStack>
              <VStack maxWidth={"30%"}>
                <Heading as={"h2"} size={"xl"} alignSelf={"flex-start"} textColor={themes.primaryColours.white}>Din bidragelse hjælper</Heading>
                <Text fontSize={"20px"} textColor={themes.primaryColours.white}>
                  Dine videoer er ikke bare et bevis på din fantastiske indsats, 
                  men hjælper også med indsamling af data der kan biddrage til udviklingen af fremtidens teknologier som f.eks. kan finde 
                  og sortere de mange forskellige typer affald der findes i Danmark for os. Upload dine videoer efter vores anvisning, og 
                  så belønner vi dig med point som du kan bruge i vores shop til fede rabatter hos udvalgte forretninger. 
                </Text>
               
              </VStack>
           
          </HStack>
        </Flex>
      </VStack>
    </Flex>
  );
};

export default Home;
