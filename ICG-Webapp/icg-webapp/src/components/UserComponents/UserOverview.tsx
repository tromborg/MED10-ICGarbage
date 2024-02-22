import { FunctionComponent } from "react";
import {Container, Heading, TableContainer, Table, Thead, Tr, Th, Tbody, Td, Button} from '@chakra-ui/react';

const UserOverview : FunctionComponent = () => {

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
        </Container>
    )
}

export default UserOverview;