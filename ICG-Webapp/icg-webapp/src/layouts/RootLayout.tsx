import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import themes from '../design/themes';
import { Box, Container, Flex, VStack } from '@chakra-ui/react'
const RootLayout = () => {
    return (
        <Flex direction="column" h="100vh">
            <Navbar />
            <Flex style={{backgroundColor: themes.primaryColours.white}}>
                <Outlet />
            </Flex>
        </Flex>
    )
}

export default RootLayout;