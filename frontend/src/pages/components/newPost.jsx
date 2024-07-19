import React, { useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import { Button, Chip, Paper, TextareaAutosize } from '@mui/material';
import { ImageTwoTone } from '@mui/icons-material';

function NewPost() {

    const [image, setImage] = useState(null);

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            console.log('Selected image:', e.target.files[0]);
        }
    };

    const handleAttachImageClick = () => {
        document.getElementById('image-upload').click();
    };
    return (
        <>
            <CssBaseline />
            <Container>
                <Paper
                    elevation={5}
                    sx={{
                        marginY: '10px',
                        borderRadius: '10px',
                        alignItems: 'center',
                        padding: '10px',
                    }}
                >  <Box
                    sx={{
                        fontSize: '20px',
                        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)',
                        fontWeight: 'bold',
                        padding: '10px  ',
                        backgroundColor: '#f5f5f5',
                        borderRadius: '8px',
                        marginBottom: '10px'
                    }}
                >
                        Let's talk...
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'top',
                            padding: '10px',
                            borderRadius: '8px',
                            marginTop: '10px'
                        }}
                    >
                        <Avatar>H</Avatar>
                        <TextareaAutosize
                            minRows={3}
                            placeholder="Write something..."
                            style={{ marginLeft: '10px', flex: 1, resize: 'none', border: 'none', outline: 'none', width: '100%' }}
                        />
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginTop: '10px',
                        }}
                    >
                        <Box display="flex" alignItems="center" sx={{ marginLeft:'auto'}}>
                            <Chip
                                icon={<ImageTwoTone sx={{ cursor: 'pointer' }} />}
                                label="Attach an image"
                                onClick={handleAttachImageClick}
                                sx={{ marginRight: '10px' }}    
                                clickable
                            />
                            <input
                                accept="image/*"
                                style={{ display: 'none' }}
                                id="image-upload"
                                type="file"
                                onChange={handleImageChange}
                            />
                            <Button className='ml-auto'  variant="contained" sx={{ borderRadius: '50px' }} >
                                Share
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </>
    );
}

export default NewPost;
