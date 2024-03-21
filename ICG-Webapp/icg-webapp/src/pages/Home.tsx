import { FunctionComponent } from "react";
import {
  Heading,
  Container,
  Divider,
  Card,
  CardBody,
  Text,
  Button,
  Progress,
} from "@chakra-ui/react";
import LogoSvg from "../design/logo/png/logo-no-background.png";
import { AppDispatch, RootState } from "../store/store";
import { useDispatch, useSelector } from "react-redux";
import UploadComponent from "../components/UploadComponent";


const Home: FunctionComponent = () => {
  
  const isLoggedIn = useSelector((state: RootState) => state.login.isLoggedIn);

  

  return (
    <Container>
      <Heading>
        <img src={LogoSvg} alt="ICWaste logo" />
      </Heading>
      <Divider />
      <UploadComponent/>
    </Container>
  );
};

export default Home;
