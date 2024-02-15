import { FunctionComponent } from "react";
import { Heading, Container, Divider, Card, CardBody, Text, Button } from '@chakra-ui/react'
import LogoSvg from "../design/logo/png/logo-no-background.png";
import React, { useState } from 'react';
import axios from 'axios';

const Home: FunctionComponent = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

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

        while (start < fileSize) {
            const chunk = selectedFile.slice(start, start + chunkSize);
            const formData = new FormData();
            formData.append('video', chunk, selectedFile.name);

            try {
                await axios.post('http://localhost:5000/uploadvid', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                });
            } catch (error) {
                console.error('Error uploading video:', error);
                return;
            }

            start += chunkSize;
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
                </CardBody>
            </Card>
        </Container>
    )
}

export default Home;