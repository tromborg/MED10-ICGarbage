import {
  Divider,
  Text,
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
  useToast
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { UserService } from "../models/UserService";
import { userSessionDb } from "../components/SessionDB";
import { ApiService } from "../services/ApiService";
import { UserOverview, UserRegistry } from "../apicalls";
import { cardData, Card } from "../components/CardData";

const ShopPage = () => {
  

  const carddata: Card[] = cardData as Card[]

  const [selectedCard, setSelectedCard] = useState<Card | undefined>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [userPoints, setUserPoints] = useState<UserOverview>();
  const [cardWidth, setCardWidth] = useState<string>("30%");
  const [cardWidthInt, setCardWidthInt] = useState<number>(30);
  const toast = useToast()

  const getUserBalance = async () => {
    let user = await userSessionDb.getUserFromSessionDb();
    const useroverview = await ApiService.client().get_useroverview(user.userId!);
    console.log("useroverview: ", useroverview);
    setUserPoints(
      useroverview
    );
  };

  const handlePurchase = async (points: number, couponid: number) => {
    if (userPoints){
      if(userPoints.points! > points){
        let userservice = new UserService()
        console.log("Bought");
        console.log("Balance: " + userPoints.points!)
        console.log("Cost: " + points);
        userservice.UpdatePoints(userPoints.userid!, points, true);
        userservice.RegisterPurchase(userPoints.userid!, couponid);
        onClose();
        return (
          toast({
          title: 'Kupon købt!',
          description: "Tid til at nyde det :)",
          status: 'success',
          duration: 5000,
          isClosable: true,
        })
        )
      } 
      else {
        console.log("Broke");
        return (
          toast({
            title: 'Ikke noget point!',
            description: "Du har desværre ikke nok points til at købe denne kupon.",
            status: 'error',
            duration: 5000,
            isClosable: true,
          })
          )
      }
    } 
  }

  const handleCardClick = (card: Card) => {
    setSelectedCard(card);
    onOpen();
  };

  useEffect(() => {
    getUserBalance();
  }, []);

  return (
    <Flex flexDirection="column" backgroundColor="#f8f9fa">
      <Flex width="100%" justifyContent="center">
        <Box alignSelf="center">
          <Text fontSize={50}>Waste point shop</Text>
        </Box>
      </Flex>

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
          <Text fontSize={30}>
            Balance:{" "}
            <span style={{ color: "#5AB463" }}>
              {userPoints ? userPoints.points : "0"} point
            </span>{" "}
          </Text>
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
        {carddata.map((card, index) => (
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
              onClick={async ()=>{await handlePurchase(selectedCard!.points, selectedCard!.id)}}
            >
              Køb 
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

export default ShopPage;
