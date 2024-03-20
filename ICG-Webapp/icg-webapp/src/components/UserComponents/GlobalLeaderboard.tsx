import { Container, Flex, TableContainer, Table, Thead, Tr, Th, Tbody, Td, VStack, ResponsiveValue, color } from "@chakra-ui/react";
import { FunctionComponent, useState, useEffect } from "react";
import { IUserRegistry, UserRegistry } from "../../apicalls";
import { ApiService } from "../../services/ApiService";
import themes from '../../design/themes';
import { userSessionDb } from '../SessionDB';
import { once } from "events";

const GlobalLeaderboard : FunctionComponent = () => {
    const [userData, setUserData] = useState<IUserRegistry[]>();
    const [isFetchDone, setIsFetchDone] = useState<Boolean>(false);
    const handleGetScoreboard = async () => {
        const scoreboardData = await ApiService.client().get_scoreboard();
        if (scoreboardData) {
        const sortedData = scoreboardData.slice().sort((a, b) => {
            const pointsA = a.points || 0;
            const pointsB = b.points || 0;
            return pointsB - pointsA;
        });
        setUserData(sortedData);
        setIsFetchDone(true)
        }
    };


    useEffect(() => {
        if (isFetchDone === false){
            handleGetScoreboard();
        }
    }, []);

    return (
        <Container width={"100%"}>
            
                <TableContainer >
                    <Table variant="simple" size="l">
                    <Thead>
                        <Tr>
                            <Th textAlign={"center"}>Bruger</Th>
                            <Th textAlign={"center"}>Score</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {userData?.map((user) => {
                            let rowColour = themes.primaryColours.white;
                            userSessionDb.getUserFromSessionDb().then((usersesh)=>{
                                if (user.userid === usersesh.userId){
                                    rowColour = themes.primaryColours.lightGreen;
                                }
                            });
                            
                            
                            return (
                                <Tr backgroundColor={rowColour}>
                                    <Td textAlign={"center"}>
                                        {user.userName}
                                    </Td>
                                    <Td textAlign={"center"}> 
                                        {user.points}
                                    </Td>
                                </Tr>
                            );
                        })}
                    </Tbody>
                    </Table>
                </TableContainer>
        </Container>
       
    );
};



export default GlobalLeaderboard;