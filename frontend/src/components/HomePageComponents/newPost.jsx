import React, { useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import { Button, Chip, Paper, TextareaAutosize } from "@mui/material";
import { ImageTwoTone } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { addPost } from "../../features/user/userAsyncThunks";
import { useSnackbar } from "notistack";

function NewPost() {
  const { user } = useSelector((state) => state.user);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [postContent, setPostContent] = useState("");
  const dispatch = useDispatch()
  const { enqueueSnackbar } = useSnackbar();


  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl);
    }
  };

  const handleSubmit = async(e)=>{
    if(postContent.trim()==='' && !image ) {
        enqueueSnackbar('Your post seems to be empty',{variant:'error'})
        return 
    }
    e.preventDefault();
   const result =await  dispatch(addPost({imgData:image,post:postContent}))
   console.log(result);
   if(addPost.fulfilled.match(result)){
    setImagePreview(null)
    setPostContent('')
   }
  }

  const handleAttachImageClick = () => {
    document.getElementById("image-upload").click();
  };
  return (
    <>
      <CssBaseline />
      <Container>
        <Paper
          elevation={5}
          sx={{
            marginY: "10px",
            borderRadius: "10px",
            alignItems: "center",
            padding: "10px",
          }}
        >
          {" "}
          <Box
            sx={{
              fontSize: "20px",
              textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)",
              fontWeight: "bold",
              padding: "10px  ",
              backgroundColor: "#f5f5f5",
              borderRadius: "8px",
              marginBottom: "10px",
            }}
          >
            Let's talk...
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "top",
              padding: "10px",
              borderRadius: "8px",
              marginTop: "10px",
            }}
          >
            <Avatar>{user.firstName[0].toUpperCase()}</Avatar>
            <TextareaAutosize
              minRows={3}
              placeholder="Write something..."
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              style={{
                marginLeft: "10px",
                flex: 1,
                resize: "none",
                border: "none",
                outline: "none",
                width: "100%",
              }}
            />
          </Box>
          <Box>
            {imagePreview && <img src={imagePreview} alt="Preview" />}
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "10px",
            }}
          >
            <Box display="flex" alignItems="center" sx={{ marginLeft: "auto" }}>
              <Chip
                icon={<ImageTwoTone sx={{ cursor: "pointer" }} />}
                label="Attach an image"
                onClick={handleAttachImageClick}
                sx={{ marginRight: "10px" }}
                clickable
              />
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="image-upload"
                type="file"
                onChange={handleImageChange}
              />
              <Button
                className="ml-auto"
                variant="contained"
                sx={{ borderRadius: "50px" }}
                onClick={handleSubmit}
              >
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
