import { PhotoCamera } from "@mui/icons-material";
import { Avatar, Box, Button, Modal, Typography } from "@mui/material";
import { useState } from "react";
import AvatarEditor from "react-avatar-editor";
import { useSnackbar } from "notistack";

const ImageUpload = ({ name, setCroppedImg }) => {
  const { enqueueSnackbar } = useSnackbar();

  const [image, setImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [open, setOpen] = useState(false);
  const [editor, setEditor] = useState(null);

  const handleSave = () => {
    if (editor) {
      const canvas = editor.getImage();
      const imgData = canvas.toDataURL();
      setCroppedImg(imgData);
      setCroppedImage(imgData);
      setOpen(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (!file) {
      enqueueSnackbar("No file selected", { variant: "error" });
      return;
    }

    if (!file.type.startsWith("image/")) {
      enqueueSnackbar("Please select a valid image file", { variant: "error" });
      return;
    }
    setImage(e.target.files[0]);
    setOpen(true);
  };

  return (
    <>
      <Box
        sx={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: { xs: "8px", sm: "16px" },
          textAlign: "center",
          backgroundColor: "#f9f9f9",
          width: { xs: "90%", sm: "70%", md: "100%", lg: "100%" },
          mx: "auto",
          mt: 4,
        }}
      >
        <Typography
          variant="h6"
          component="p"
          sx={{ mb: 2, color: "primary.main" }}
        >
          Upload an image of yourself
        </Typography>
        <Avatar
          src={croppedImage && croppedImage}
          sx={{
            width: { xs: "100px", sm: "150px", md: "200px" },
            height: { xs: "100px", sm: "150px", md: "200px" },
            my: 2,
            mx: "auto",
            fontSize: "20vmin",
          }}
        >
          {name[0].toUpperCase()}
        </Avatar>

        <input
          accept="image/*"
          style={{ display: "none" }}
          id="contained-button-file"
          type="file"
          onChange={handleImageUpload}
        />
        <label htmlFor="contained-button-file">
          <Button
            variant="contained"
            component="span"
            startIcon={<PhotoCamera />}
          >
            Upload
          </Button>
        </label>

        <Modal
          open={open}
          onClose={() => setOpen(false)}
          aria-labelledby="crop-modal-title"
          aria-describedby="crop-modal-description"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: { xs: "90%", sm: 400 },
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography id="crop-modal-title" variant="h6" component="h2">
              Crop Image
            </Typography>
            <AvatarEditor
              ref={setEditor}
              image={image}
              width={250}
              height={250}
              border={50}
              borderRadius={125}
              scale={1.2}
              style={{ width: "100%", height: "auto" }}
            />
            <Button onClick={handleSave} sx={{ mt: 2 }}>
              Save
            </Button>
          </Box>
        </Modal>
      </Box>
    </>
  );
};

export default ImageUpload;
