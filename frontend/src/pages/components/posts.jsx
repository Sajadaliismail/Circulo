import { Box, Container ,CssBaseline, Paper} from "@mui/material";
import Post from "./post";

function Posts(){
    return (
        <>
        <CssBaseline/>
       <Container >
        <Paper elevation={1} sx={{   height: '100vh' ,borderRadius:'10px' }}  >

        <Post></Post>
        </Paper>
      </Container>
        </>
    )

}

export default Posts