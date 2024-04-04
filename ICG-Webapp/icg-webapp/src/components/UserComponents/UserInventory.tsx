import { FunctionComponent, useState, useEffect } from "react";
import {
  Container,
  Center,
  Heading,
  Text,
  VStack,
  Divider,
  Flex,
  Image,
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Button,
  Slider,
  SliderTrack,
  SliderThumb,
} from "@chakra-ui/react";
import themes from '../../design/themes';
import { cardData, Card } from "../CardData";
import { UserService } from "../../models/UserService";
import { userSessionDb } from "../SessionDB";
import { Coupon } from "../../apicalls";

const UserInventory: FunctionComponent = () => {
    const [cardWidth, setCardWidth] = useState<string>("30%");
    const [cardWidthInt, setCardWidthInt] = useState<number>(30);
    const [selectedCard, setSelectedCard] = useState<Card | undefined>();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const carddata: Card[] = cardData as Card[]
    const [purchases, setPurchases] = useState<Card[] | undefined >();

    const handleCardClick = (card: Card) => {
      setSelectedCard(card);
      onOpen();
    };

   const handleCouponUse = (couponid: number) => {
    console.log("Used id: " + couponid);
   }

   
   const getPurchasedCoupons = async () => {
      let userService = new UserService();
      let user = await userSessionDb.getUserFromSessionDb();
      let userid = user.userId!
      const coupons = await userService.getPurchases(userid);
      if(coupons){
        const couponids = coupons?.map(coupon => coupon.couponid);
        const matches = cardData.filter(obj => couponids!.includes(obj.id));
        setPurchases(matches as Card[]);
      }
      
   }
   useEffect(() => {
    getPurchasedCoupons();
  }, []);

  return (
      <Flex width="100%" flexDirection="column">
        <Box m="10px" alignSelf="center">
          <Center pb={"1em"}>
              <VStack>
                  <Heading justifySelf={"center"} color={themes.adobePalette.darker}>
                      MINE KUPONER
                  </Heading>
                  <Heading as={"h3"} size={"l"} justifySelf={"center"} color={themes.adobePalette.darkest}> Her en oversigt over dine købte kuponer </Heading>
              </VStack>
          </Center>
        </Box>
      
        <Flex width="100%" justifyContent="space-between">
        <Slider
          aria-label="slider-ex-1"
          min={20}
          max={36}
          defaultValue={30}
          maxW={400}
          onChange={(v) => {
            setCardWidth(`${v}%`);
            setCardWidthInt(v);
          }}
          onChangeEnd={() => console.log(cardWidth)}
          ml="92px"
        >
          <SliderTrack />
          <SliderThumb></SliderThumb>
        </Slider>
        <Box mr="91px">
        </Box>
      </Flex>
      <Divider size="80%" />
      <Flex
        backgroundColor="#f8f9fa"
        width="100%"
        p="15px"
        justifyContent={cardWidthInt <= 23 ? "flex-start" : "center"}
        wrap="wrap"
      >
        {purchases?.map((card, index) => (
          <Flex
            key={index}
            width={cardWidth}
            height="300px"
            backgroundColor="white"
            borderRadius={20}
            borderWidth={1}
            m="10px"
            cursor="pointer"
            onClick={() => handleCardClick(card)}
          >
            <Box
              width="65%"
              height="100%"
              p="10px"
              display="flex"
              justifyContent="space-between"
              flexDirection="column"
            >
              <Box>
                <Text fontSize={30} fontWeight="bold">
                  {card.title}
                </Text>
                <Text fontSize={20}>{card.description}</Text>
              </Box>
              <Box>
                <Text fontSize={30} fontWeight="bold" color="#5AB463">
                  {card.points} point
                </Text>
              </Box>
            </Box>
            <Box display="flex" width="35%" height="100%" overflow="hidden">
              <Image
                src={card.imageSrc}
                fit="cover"
                align={card.imageAlign}
                borderRightRadius={20}
              ></Image>
            </Box>
          </Flex>
        ))}
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
        <ModalOverlay
          backdropFilter="auto"
          backdropInvert="30%"
          backdropBlur="2px"
        />
        <ModalContent borderRadius={20} width="1200px">
          <ModalBody width="1920px" p="0px" mr="0px" pr="0px">
            {selectedCard && (
              <Flex
                width="30%"
                height="300px"
                backgroundColor="white"
                borderRadius={20}
                borderWidth={1}
              >
                <Box
                  width="65%"
                  height="100%"
                  p="10px"
                  display="flex"
                  justifyContent="space-between"
                  flexDirection="column"
                >
                  <Box>
                    <Text fontSize={30} fontWeight="bold">
                      {selectedCard.title}
                    </Text>
                    <Text fontSize={20}>{selectedCard.description}</Text>
                  </Box>
                  <Box>
                    <Text fontSize={30} fontWeight="bold" color="#5AB463">
                      {selectedCard.points} point
                    </Text>
                  </Box>
                </Box>
                <Box display="flex" width="35%" height="100%" overflow="hidden">
                  <Image
                    src={selectedCard.imageSrc}
                    fit="cover"
                    align={selectedCard.imageAlign}
                    borderRightRadius={20}
                  ></Image>
                </Box>
              </Flex>
            )}
          </ModalBody>
          <ModalFooter justifyContent="flex-start">
            <Button
              width="50%"
              backgroundColor="#5AB463"
              mr="5px"
              onClick={async ()=>{await handleCouponUse(selectedCard!.id)}}
            >
              Indløs 
            </Button>
            <Button width="50%" ml="5px" onClick={onClose}>
              Anuller
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
    );
  };
  
  export default UserInventory;
  