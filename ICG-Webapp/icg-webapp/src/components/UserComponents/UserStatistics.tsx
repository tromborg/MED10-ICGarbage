import { FunctionComponent, useEffect } from "react";
import {Container, Flex, Heading, Button} from '@chakra-ui/react';
import { ApiService } from "../../services/ApiService";

const UserStatistics : FunctionComponent = () => {

    const handleGetScoreboard = async () => {
        const scoreboardData = await ApiService.client().get_scoreboard();
        console.log(scoreboardData[0]); 
    }
    
    return (
        <Container>
            <Heading>Statistikker</Heading>
            <Button onClick={handleGetScoreboard}>
            {" "}
            Get scoreboard data{" "}
          </Button>
        </Container>
    )
}

export default UserStatistics;