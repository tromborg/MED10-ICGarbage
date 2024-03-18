import { FunctionComponent } from "react";
import {Container, Heading, TableContainer, Table, Thead, Tr, Th, Tbody, Td, Button, Box} from '@chakra-ui/react';
import { UserService } from "../../models/UserService";
import { userSessionDb } from "../../components/SessionDB";

const UserOverview : FunctionComponent = () => {

    const getTimeSeriesData = async () => {
        let userService = new UserService();
        let user = await userSessionDb.getUserFromSessionDb();
        console.log("id: " + user.userId);
        let timeSeriesData = await userService.GetTimeSeriesData(user.userId!);
        if(timeSeriesData !== null){
            console.log("Timedata res: " + timeSeriesData[0].timeStamp);
            console.log("resdata: " + JSON.stringify(timeSeriesData));
        } else {
            console.log("Timeseries data is null")
        }
    }

    return (
        <Container>
            <Heading>Brugeroversigt</Heading>
            <TableContainer>
                <Table variant='simple'>
                    <Tbody>
                    <Tr>
                        <Td>Brugernavn</Td>
                        <Td isNumeric>25.4</Td>
                    </Tr>
                    <Tr>
                        <Td>E-mail</Td>
                        <Td isNumeric>30.48</Td>
                    </Tr>
                    <Tr>
                        <Td>Medlem siden</Td>
                        <Td isNumeric>0.91444</Td>
                    </Tr>
                    </Tbody>
                </Table>
            </TableContainer>
            <Button onClick={getTimeSeriesData}>
            {" "}
            TESETZ{" "}
          </Button>
        </Container>
    )
}

export default UserOverview;