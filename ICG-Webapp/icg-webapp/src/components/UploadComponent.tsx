import { FunctionComponent, useState } from "react";
import { RootState } from "../store/store";
import { useSelector } from "react-redux";
import {Card, CardBody, Text, Button,  Progress, Container} from "@chakra-ui/react";
import { userSessionDb } from "../components/SessionDB";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import urls from "./urls";

const UploadComponent: FunctionComponent = () => {
    const isLoggedIn = useSelector((state: RootState) => state.login.isLoggedIn);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [chunkNum, setChunkNum] = useState(0);
    const [totalChunkNum, setTotalChunkNum] = useState(0);
    const [loadingValue, setLoadingValue] = useState(0);
    const navigate = useNavigate();
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
          setSelectedFile(event.target.files[0]);
        }
      };
    
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
              console.log(res.status);
              console.log(res.data);
              console.log(res.data.chunk_num);
              console.log(res.data.total_chunks);
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
    
        console.log("Upload completed");
      };

    return (
        <Container>
            {isLoggedIn ? (
                <Container>
                    <Card>
                        <CardBody>
                            <Text>Upload a video for segmentation:</Text>
                            <input type="file" onChange={handleFileChange} />
                            <Button onClick={handleUpload}>
                                {" "}
                                Click here to upload the selected file!{" "}
                            </Button>
                            <Progress hasStripe value={loadingValue} />
                        </CardBody>
                    </Card>
                </Container>
            ) : (
                <Container>
                    <Card>
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