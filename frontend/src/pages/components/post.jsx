import { Avatar, Box, Button, Paper, Typography } from "@mui/material";

function Post(){
    return (
        <>
        <Paper elevation={5} sx={{borderRadius:'10px' ,padding:'5px'}}  >

        <Box sx={{display:'flex',alignItems:'center',gap:'5px'}}>
            <Avatar></Avatar>
            Name
        </Box>
        <Box sx={{display:'flex',flexDirection:'column',alignItems:'center',gap:'5px'}}>
            <Typography variant="body2">Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
                when an unknown printer took a galley of type and scrambled it to make a type specimen book. 
                It has survived not only five centuries, but also the leap into electronic typesetting, r
                emaining essentially unchanged. It was popularised in the 1960s with the release of 
                Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing 
                software like Aldus PageMaker including versions of Lorem Ipsum.</Typography>
                <img src='https://picsum.photos/seed/picsum/700/350' alt='asd'></img>
            
        </Box>
        <Box>
            <Button>Like</Button>
            <Button>Comment</Button>
            <Button>Share</Button>
        </Box>
        </Paper>
        </>
    )
}

export default Post