import { FunctionComponent, useState, useEffect } from "react";
import {
  Container,
  Heading,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Button,
  Box,
  Divider,
} from "@chakra-ui/react";
import { UserService } from "../../models/UserService";
import { userSessionDb } from "../SessionDB";
import { IUserOverview, UserOverview } from "../../apicalls";

const UserOverviewPage: FunctionComponent = () => {
  const [isFetchDone, setIsFetchDone] = useState<Boolean>(false);
  const [userData, setUserData] = useState<IUserOverview>();

  const handleGetUserOverview = async () => {
    let userService = new UserService();
    let user = await userSessionDb.getUserFromSessionDb();
    const useroverview = await userService.GetUserOverview(user.userId!);
    if (useroverview !== null){
      setUserData(new UserOverview({
        username: useroverview.username,
        email: useroverview.email,
        userid: useroverview.userid,
        points: useroverview.points,
        signupdate: useroverview.signupdate,
        totalwaste: useroverview.totalwaste
      }));
    } else {
      console.log("useroverview data is null");
    }
    console.log("Check: " + useroverview.username);
    console.log("Check2: " + userData?.username);
    setIsFetchDone(true);
  }


  useEffect(() => {
    if (isFetchDone === false){
        handleGetUserOverview();
    }
}, []);

  return (
    <Box width={"80%"}>
      <Heading>Brugeroversigt</Heading>
      <TableContainer>
        <Table variant="simple">
          <Tbody>
            <Tr>
              <Td>Brugernavn: </Td>
              <Td>{userData?.username ? userData.username : "Henter data..."}</Td>
            </Tr>
            <Tr>
              <Td>E-mail: </Td>
              <Td>{userData?.email ? userData.email : "Henter data..."}</Td>
            </Tr>
            <Tr>
              <Td>Medlem siden: </Td>
              <Td>{userData?.signupdate ? userData.signupdate : "Henter data..."}</Td>
            </Tr>
            <Tr>
              <Td>Nuværende Waste points: </Td>
              <Td>{userData?.points ? userData.points : "Henter data..."}</Td>
            </Tr>
            <Tr>
              <Td>Lifetime Waste points: </Td>
              <Td>{userData?.totalwaste ? userData.totalwaste : "Henter data..."}</Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
      <Button onClick={() => userData && console.log("check3: " + userData.email)}> TESETZ </Button>
    </Box>
  );
};

export default UserOverviewPage;
