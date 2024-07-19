import { Avatar, Box, Container ,CssBaseline, Paper, Typography} from "@mui/material";

function Profile(){
    return (
        <>
        <CssBaseline/>
       <Container >
       <Paper  elevation={5} sx={{  height: '100vh' ,marginY:'10px' , borderRadius:'10px'}} >
        <Box sx={{display:'flex',justifyContent:'center',flexDirection:'column',alignItems:'center'}}>
            <Avatar sx={{ width: 100, height: 100 }}></Avatar>
            <Typography>Name</Typography>
            <Typography>Details</Typography>
            <Typography>More details</Typography>
        </Box>
       </Paper>
      </Container>
        </>
    )

}

export default Profile