import { Avatar, Box, Button, Paper, Typography } from "@mui/material";

function Post({postData}){
    return (
        <>
        <Paper elevation={5} sx={{borderRadius:'10px' ,padding:'5px'}}  >

        <Box sx={{display:'flex',alignItems:'center',gap:'5px'}}>
            <Avatar></Avatar>
            Name
        </Box>
        <Box sx={{display:'flex',flexDirection:'column',alignItems:'start',gap:'5px',textAlign:'start'}}>
            <Typography variant="body2">{postData.content}</Typography>
            {postData.image &&
                <img src={postData.image} alt='asd'></img>
            }
            
        </Box>
        <Box>
            <Button>Like <Typography marginLeft={1}>{postData.likes.length}</Typography> </Button>
            <Button>Comment</Button>
            {/* <Button>Share</Button> */}
        </Box>
        </Paper>
        </>
    )
}

export default Post