import { FunctionComponent, useState } from "react";
import { RootState } from "../store/store";
import { useSelector } from "react-redux";
import {Card, CardBody, useDisclosure, Text,
  Button,  
  Progress, 
  Container, 
  Divider, 
  Heading,
  Stack,
  Alert,
  AlertIcon,
  Box,
  AlertTitle,
  AlertDescription,
  } from "@chakra-ui/react";
import { userSessionDb } from "../components/SessionDB";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import urls from "./urls";
import themes from "../design/themes";

const UploadComponent: FunctionComponent = () => {
    const isLoggedIn = useSelector((state: RootState) => state.login.isLoggedIn);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [chunkNum, setChunkNum] = useState(0);
    const [totalChunkNum, setTotalChunkNum] = useState(0);
    const [loadingValue, setLoadingValue] = useState(0);
    const [uploadDone, setUploadDone] = useState<boolean>(false);
    const navigate = useNavigate();
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
          setSelectedFile(event.target.files[0]);
        }
      };
    
    const {
      isOpen: isVisible,
      onClose,
      onOpen,
    } = useDisclosure({ defaultIsOpen: true })
    
    const handleUpload = async () => {
      if (!selectedFile) {
        console.error("No file selected");
        return;
      }
  
      const chunkSize = 1024 * 1024;
      const fileSize = selectedFile.size;
      let start = 0;
      console.log("TotalChunks: " + Math.floor(fileSize / chunkSize));
      let totalChunks = Math.floor(fileSize / chunkSize);
      let chunkNum = 0;
      let userSession = await userSessionDb.getUserFromSessionDb();
      const userId = userSession.userId!;
  
      while (start < fileSize) {
        const chunk = selectedFile.slice(start, start + chunkSize);
        const formData = new FormData();
        formData.append(
          "videochunk",
          chunk,
          selectedFile.name +
            `, chunk: ${chunkNum}, total_chunks: ${totalChunks}, Id: ${userId}`
        );
  
        try {
          let res = await axios.post(
            "http://localhost:5000/uploadvid",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                "Access-Control-Allow-Origin": "*",
              },
            }
          );
          if (res.status === 200) {
            setChunkNum(res.data.chunk_num);
            setTotalChunkNum(res.data.total_chunks);
            let loadingVal = (chunkNum / totalChunkNum) * 100;
            setLoadingValue(Math.floor(loadingVal));
          }
        } catch (error) {
          console.error("Error uploading video:", error);
          return;
        }
  
        start += chunkSize;
        chunkNum += 1;
      }
      setUploadDone(true);
      onOpen();
      console.log("Upload completed");
    };

    return (
        <Container>
            {isLoggedIn ? (
                <Container>
                    <Card 
                        direction={{ base: 'column', sm: 'row' }}
                        overflow='hidden'
                        variant='outline'
                        width={"100%"}>
                        <CardBody>
                            <Stack>
                              <Heading fontSize={"25px"} fontWeight={600} textColor={themes.adobePalette.darkest}>Kom i gang med at uploade </Heading>
                              <Divider/>
                              <Text fontSize={"18px"} fontWeight={600} textColor={themes.adobePalette.evenDarker}>
                                1. Klik på "Browse"-knappen under og vælg din din video fil:
                                </Text>
                              <input type="file" onChange={handleFileChange} style={{paddingBottom: "1em"}} />
                              <Text fontSize={"18px"} fontWeight={600} textColor={themes.adobePalette.evenDarker}>
                                2. Klik herefter på knappen under for at uploade din video:
                                </Text>
                              <Button 
                                backgroundColor={themes.adobePalette.darker} 
                                size={"lg"} 
                                _hover={{ bg: themes.adobePalette.main }}
                                onClick={handleUpload}
                              
                              ><Text textColor={themes.primaryColours.white}>Upload video</Text></Button>
                              <Divider pb={"1em"}/>
                              <Progress hasStripe value={loadingValue} colorScheme='green' size='lg'/>
                              {uploadDone ? (
                              <Alert status='success'>
                                <AlertIcon />
                                <Box>
                                  <AlertTitle>Success!</AlertTitle>
                                  <AlertDescription>
                                    Din video er blevet uploadet, og bliver behandlet af vores system. Bemærk at der
                                    kan et par timer før videoen er blevet analyseret.
                                  </AlertDescription>
                                </Box>
                              </Alert>
                            ) : (
                              <Box/>
                            )}
                            </Stack>
                        </CardBody>
                    </Card>
                </Container>
            ) : (
                <Container>
                    <Card 
                    direction={{ base: 'column', sm: 'row' }}
                    overflow='hidden'
                    variant='outline'
                    width={"100%"}
                    >
                        <CardBody>
                            <Text>Login to upload videos:</Text>
                            <Button onClick={()=>{
                                navigate(urls.login)
                            }}>
                                Login
                            </Button>
                        </CardBody>
                    </Card>
                </Container>
            )}
        </Container>
    );
}

export default UploadComponent;