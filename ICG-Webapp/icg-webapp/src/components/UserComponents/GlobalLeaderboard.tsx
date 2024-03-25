import { Container, Card, CardBody, HStack, Text, TableContainer, Table, Thead, Tr, Th, Tbody, Td, VStack, ResponsiveValue, color, Box, Heading, Center } from "@chakra-ui/react";
import { FunctionComponent, useState, useEffect } from "react";
import { IUserRegistry, UserRegistry } from "../../apicalls";
import { ApiService } from "../../services/ApiService";
import themes from '../../design/themes';
import { userSessionDb } from '../SessionDB';

const GlobalLeaderboard : FunctionComponent = () => {
    const [userData, setUserData] = useState<IUserRegistry[]>();
    const [isFetchDone, setIsFetchDone] = useState<Boolean>(false);
    const [currentUser, setCurrentUser] = useState<String>("");

    const handleGetScoreboard = async () => {
        const scoreboardData = await ApiService.client().get_scoreboard();
        if (scoreboardData) {
        const sortedData = scoreboardData.slice().sort((a, b) => {
            const pointsA = a.points || 0;
            const pointsB = b.points || 0;
            return pointsB - pointsA;
        });
        let currentUser = await userSessionDb.getUserFromSessionDb();
        setCurrentUser(currentUser.userId!);
        setUserData(sortedData);
        setIsFetchDone(true);
        }
    };


    useEffect(() => {
        if (isFetchDone === false){
            handleGetScoreboard();
        }
    }, []);

    return (
            <Container>
                <Center pb={"1em"}>
                    <Heading justifySelf={"center"} color={themes.adobePalette.darker}>
                        LEADERBOARD
                    </Heading>
                </Center>
                {userData?.map((user, index) => {
                        let rowColour = themes.primaryColours.white;
                        if(user.userid === currentUser){
                            rowColour = themes.adobePalette.lighter;
                        }
                        return (
                            <VStack pb={"1em"}>
                                <Card
                                    direction={{ base: 'column', sm: 'row' }}
                                    overflow='hidden'
                                    variant='outline'
                                    width={"100%"}
                                    backgroundColor={rowColour}
                                    >
                                    <CardBody>
                                        <HStack justify={"space-between"}>
                                            <Box>
                                                <HStack>
                                                    <Text py='2' fontWeight={"bold"} color={themes.adobePalette.darkest}>
                                                        {index+1}.
                                                    </Text>
                                                    <Text py='2' fontWeight={"bold"} color={themes.adobePalette.darkest}>
                                                        {user.userName}
                                                    </Text>
                                                </HStack>
                                            </Box>
                                            <Box>
                                                <Text py='2' fontWeight={"bold"} color={themes.adobePalette.darkest}>
                                                    {user.points + " WP"} 
                                                </Text>
                                            </Box>
                                        </HStack>
                                    </CardBody>
                                </Card>
                            </VStack>
                        );
                    })}
            </Container>
       
    );
};



export default GlobalLeaderboard;