import { FunctionComponent } from "react";
import { Heading, Container, Divider, Card, CardBody, Text, Button, Progress } from '@chakra-ui/react'
import LogoSvg from "../design/logo/png/logo-no-background.png";
import React, { useState } from 'react';
import axios from 'axios';

const Home: FunctionComponent = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [chunkNum, setChunkNum] = useState(0);
    const [totalChunkNum, setTotalChunkNum] = useState(0);
    const [loadingValue, setLoadingValue] = useState(0);


    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setSelectedFile(event.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            console.error('No file selected');
            return;
        }

        const chunkSize = 1024 * 1024;
        const fileSize = selectedFile.size;
        let start = 0;
        console.log("TotalChunks: " + Math.floor(fileSize/chunkSize));
        let totalChunks = Math.floor(fileSize/chunkSize) ;
        let chunkNum = 0;

        while (start < fileSize) {
            const chunk = selectedFile.slice(start, start + chunkSize);
            const formData = new FormData();
            formData.append('videochunk', chunk, selectedFile.name + `, chunk: ${chunkNum}, total_chunks: ${totalChunks}`);
            
            try {
                let res = await axios.post('http://localhost:5000/uploadvid', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Access-Control-Allow-Origin': '*'
                    },
                });
                if (res.status === 200){
                    console.log(res.status);
                    console.log(res.data);
                    console.log(res.data.chunk_num);
                    console.log(res.data.total_chunks);
                    setChunkNum(res.data.chunk_num);
                    setTotalChunkNum(res.data.total_chunks);
                    let loadingVal = (chunkNum/totalChunkNum)*100;
                    setLoadingValue(Math.floor(loadingVal));
                }
            } catch (error) {
                console.error('Error uploading video:', error);
                return;
            }

            start += chunkSize;
            chunkNum += 1;
        }

        console.log('Upload completed');
    };

    return (
        <Container>
            <Heading>
                <img src={LogoSvg} alt="ICWaste logo" />
            </Heading>
            <Divider/>
            <Card>
                <CardBody>
                    <Text>Upload a video for segmentation:</Text>
                    <input type="file" onChange={handleFileChange}/> 
                    <Button onClick={handleUpload}> Click here to upload the selected file! </Button>
                    <Progress hasStripe value={loadingValue}  />
                </CardBody>
            </Card>
        </Container>
    )
}

export default Home;