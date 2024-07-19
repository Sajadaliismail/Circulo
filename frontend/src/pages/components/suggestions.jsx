import { Avatar, Box, Container ,CssBaseline, Paper} from "@mui/material";

function Suggestions(){
    return (
        <>
        <CssBaseline/>
       <Container >
        <Paper  elevation={5} sx={{ height: '100vh',marginY:'10px',paddingY:'10px' , borderRadius:'10px', paddingX:'15px' ,display:'flex',flexDirection:'column',rowGap:'10px'}} >
          <Box sx={{display:'flex' ,flexDirection:'row',alignItems:'center',gap:'5px'}}>
          <Avatar>N</Avatar>Name
          </Box>
          <Box sx={{display:'flex' ,flexDirection:'row' ,alignItems:'center',gap:'5px'}}>
          <Avatar>N</Avatar>Name
          </Box>
          <Box sx={{display:'flex' ,flexDirection:'row' ,alignItems:'center',gap:'5px'}}>
          <Avatar>N</Avatar>Name
          </Box><Box sx={{display:'flex' ,flexDirection:'row' ,alignItems:'center',gap:'5px'}}>
          <Avatar>N</Avatar>Name
          </Box><Box sx={{display:'flex' ,flexDirection:'row' ,alignItems:'center',gap:'5px'}}>
          <Avatar>N</Avatar>Name
          </Box>  
        </Paper>
      </Container>
        </>
    )

}

export default Suggestions