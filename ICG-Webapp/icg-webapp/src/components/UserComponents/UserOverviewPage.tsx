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
  Center,
  Flex,
} from "@chakra-ui/react";
import { UserService } from "../../models/UserService";
import { userSessionDb } from "../SessionDB";
import themes from "../../design/themes";
import { IUserOverview, UserOverview } from "../../apicalls";

const UserOverviewPage: FunctionComponent = () => {
  const [isFetchDone, setIsFetchDone] = useState<Boolean>(false);
  const [userData, setUserData] = useState<IUserOverview>();

  const handleGetUserOverview = async () => {
    let userService = new UserService();
    let user = await userSessionDb.getUserFromSessionDb();
    const useroverview = await userService.GetUserOverview(user.userId!);
    let signupdate = useroverview.signupdate;
    let splitsignupdate = signupdate?.split("T");
    signupdate = splitsignupdate ? splitsignupdate![0] : "";
    if (useroverview !== null) {
      setUserData(
        new UserOverview({
          username: useroverview.username,
          email: useroverview.email,
          userid: useroverview.userid,
          points: useroverview.points,
          signupdate: signupdate,
          total_points: useroverview.total_points,
        })
      );
    } else {
      console.log("useroverview data is null");
    }
    console.log("Check: " + useroverview.username);
    console.log("Check2: " + userData?.username);
    setIsFetchDone(true);
  };

  useEffect(() => {
    if (isFetchDone === false) {
      handleGetUserOverview();
    }
  }, []);

  return (
    <Flex>
      <Box
        width={"100%"}
        justifyContent={"center"}
        backgroundColor={themes.primaryColours.white}
        m={5}
        borderRadius={5}
        borderWidth={1}
      >
        <Center pb={"1em"}>
          <Heading justifySelf={"center"} color={themes.adobePalette.darker}>
            BRUGEROVERSIGT
          </Heading>
        </Center>
        <TableContainer>
          <Table variant="simple">
            <Tbody>
              <Tr>
                <Td>Brugernavn: </Td>
                <Td>
                  {userData?.username ? userData.username : "Henter data..."}
                </Td>
              </Tr>
              <Tr>
                <Td>E-mail: </Td>
                <Td>{userData?.email ? userData.email : "Henter data..."}</Td>
              </Tr>
              <Tr>
                <Td>Medlem siden: </Td>
                <Td>
                  {userData?.signupdate?.toString().split("T")[0]
                    ? userData.signupdate
                    : "Henter data..."}
                </Td>
              </Tr>
              <Tr>
                <Td>Nuværende Waste points: </Td>
                <Td>{userData?.points ? userData.points : "Henter data..."}</Td>
              </Tr>
              <Tr>
                <Td>Lifetime Waste points: </Td>
                <Td>
                  {userData?.total_points
                    ? userData.total_points
                    : "Henter data..."}
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </Flex>
  );
};

export default UserOverviewPage;
