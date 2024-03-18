import { Container, Flex, TableContainer, Table, Thead, Tr, Th, Tbody, Td, VStack } from "@chakra-ui/react";
import { FunctionComponent, useState, useEffect } from "react";
import { IUserRegistry } from "../../apicalls";
import { ApiService } from "../../services/ApiService";

const GlobalLeaderboard : FunctionComponent = () => {
    const [userData, setUserData] = useState<IUserRegistry[]>();

    const handleGetScoreboard = async () => {
        const scoreboardData = await ApiService.client().get_scoreboard();
        if (scoreboardData) {
        const sortedData = scoreboardData.slice().sort((a, b) => {
            const pointsA = a.points || 0;
            const pointsB = b.points || 0;
            return pointsB - pointsA;
        });
        setUserData(sortedData);
        }
    };

    useEffect(() => {
        handleGetScoreboard();
    }, []);

    return (
        <Container width={"100%"}>
            
                <TableContainer >
                    <Table variant="striped" size="l">
                    <Thead>
                        <Tr>
                            <Th textAlign={"center"}>Bruger</Th>
                            <Th textAlign={"center"}>Score</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {userData?.map((user) => {
                            return (
                                <Tr>
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