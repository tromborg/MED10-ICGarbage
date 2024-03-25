import {
  Divider,
  Text,
  Flex,
  Image,
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Button,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
} from "@chakra-ui/react";
import fotex from "../design/fotex.jpg";
import flammen from "../design/flammen.jpg";
import booking from "../design/booking.png";
import elgiganten from "../design/elgiganten.jpg";
import power from "../design/Power.jpg";
import jysk from "../design/jysk.jpg";
import { useState, useEffect } from "react";
import { UserService } from "../models/UserService";
import { userSessionDb } from "../components/SessionDB";
import { ApiService } from "../services/ApiService";
import { UserRegistry } from "../apicalls";

const ShopPage = () => {
  interface Card {
    id: number;
    title: string;
    description: string;
    imageSrc: string;
    points: number;
    imageAlign: number;
  }

  const cardData: Card[] = [
    {
      id: 1,
      title: "Spar 50% på din næste banan.",
      description: "Føtex",
      imageSrc: fotex,
      points: 30,
      imageAlign: -190,
    },
    {
      id: 2,
      title: "10% på hele regningen + gratis desert",
      description: "Flammen",
      imageSrc: flammen,
      points: 50,
      imageAlign: 0,
    },
    {
      id: 3,
      title: "Spar 25% på din næste booking!",
      description: "Booking.com",
      imageSrc: booking,
      points: 60,
      imageAlign: -165,
    },
    {
      id: 4,
      title: "Gratis Calman-kalibrering ved næste køb af TV.",
      description: "Elgiganten",
      imageSrc: elgiganten,
      points: 40,
      imageAlign: -85,
    },
    {
      id: 5,
      title: "Spar 30% på din næste vaskemaskine.",
      description: "Power",
      imageSrc: power,
      points: 60,
      imageAlign: -62,
    },
    {
      id: 6,
      title: "Gratis hovedpude ved køb af næste seng.",
      description: "Jysk",
      imageSrc: jysk,
      points: 10,
      imageAlign: -160,
    },
  ];

  const [selectedCard, setSelectedCard] = useState<Card | undefined>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [userPoints, setUserPoints] = useState<UserRegistry[]>();
  const [cardWidth, setCardWidth] = useState<string>("30%");
  const [cardWidthInt, setCardWidthInt] = useState<number>(30);

  const getUserBalance = async () => {
    let user = await userSessionDb.getUserFromSessionDb();
    const scoreboardData = await ApiService.client().get_scoreboard();
    console.log("scoreboard: ", scoreboardData);
    setUserPoints(
      scoreboardData.filter((users) => users.userid === user.userId)
    );
  };

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
              {userPoints ? userPoints[0].points : "0"} point
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
        {cardData.map((card, index) => (
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
              onClick={onClose}
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
