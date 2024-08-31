import { Edit, EditNotifications, ModeEdit } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  Divider,
  Modal,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Friends from "./friends";
import { enqueueSnackbar } from "notistack";
import { Cropper } from "react-cropper";
import { uploadImage } from "../../features/user/userAsyncThunks";

function Profile({ fetchUserData }) {
  const { user } = useSelector((state) => state.user);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [croppedObject, setCroppedObject] = useState(null);
  const [croppedPreview, setCroppedPreview] = useState(null);
  const [finalImage, setFinalImage] = useState(null);
  const [croppedCanvas, setCroppedCanvas] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const handleClose = async () => {
    setOpen(false);
  };
  const handleInputImage = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fileType = file.type;
      const fileSize = file.size;

      if (!fileType.startsWith("image/")) {
        enqueueSnackbar("Please select an image file.", { variant: "error" });

        return;
      }

      if (fileSize > 3 * 1024 * 1024) {
        enqueueSnackbar("File size exceeds 3 MB.", { variant: "error" });
        return;
      }

      setUploadedImage(file);
      const ObjectUrl = URL.createObjectURL(file);
      setCroppedObject(ObjectUrl);
      setOpen(true);
    }
  };

  const cropperRef = useRef(null);
  const handleCrop = () => {
    const cropper = cropperRef.current?.cropper;
    const cropCanvas = cropper.getCroppedCanvas();
    setCroppedCanvas(cropCanvas);
    setCroppedPreview(cropCanvas.toDataURL());
  };

  const handleUploadImage = async () => {
    try {
      // Ensure the croppedCanvas is available
      if (!croppedCanvas) {
        enqueueSnackbar("Please crop the image before uploading.", {
          variant: "error",
        });
        return;
      }

      croppedCanvas.toBlob(async (blob) => {
        const fileName = `${Date.now()}.jpg`;
        const file = new File([blob], fileName, { type: "image/jpeg" });

        const result = await dispatch(uploadImage(file));

        if (result?.payload?.success) {
          setOpen(false);
          enqueueSnackbar("Image uploaded successfully!", {
            variant: "success",
          });
        } else {
          enqueueSnackbar("Failed to upload image.", { variant: "error" });
        }
      }, "image/jpeg");
    } catch (error) {
      enqueueSnackbar("An error occurred during the upload.", {
        variant: "error",
      });
      console.error(error);
    }
  };

  return (
    <>
      <CssBaseline />
      {/* <Container> */}
      <Box
        className="shadow-2xl h-lvh mx-4 my-2  bg-gray-100 rounded-lg dark:bg-slate-700"
        elevation={5}
        sx={{ borderRadius: "10px", py: 2, height: "100%" }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
            position: "relative",
            "&:hover .labelicon": {
              height: "30%",
              visibility: "visible",
            },
          }}
        >
          <Avatar
            className="imgUpload"
            src={isHovered ? null : user?.profilePicture}
            sx={{
              width: 200,
              height: 200,
              fontSize: "10vmin",
              "&:hover .overlay": {
                height: "100%",
              },
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <Box
              className="overlay"
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                overflow: "hidden",
                width: "100%",
                height: 0,
                transition: "0.5s ease",
                fontSize: "15px",
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 100,
                backgroundImage: user?.profilePicture
                  ? `url(${user?.profilePicture})`
                  : null,
                backgroundSize: "cover",
              }}
            >
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="file-upload"
                type="file"
                onChange={handleInputImage}
              />
              <label
                htmlFor="file-upload"
                className="labelicon text-2xl bg-cyan-600"
                style={{
                  position: "absolute",
                  bottom: 0,
                  width: "100%",
                  height: "30%",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: ".5s ease-in",
                }}
              >
                <ModeEdit />
              </label>
            </Box>
            {user.firstName[0].toUpperCase()}
          </Avatar>

          <Typography>
            {user.firstName} {user.lastName}
          </Typography>
          <Typography>{user.city}</Typography>
          <Typography>
            {user.state},{user.country}
          </Typography>
          <Typography>{user.email}</Typography>
        </Box>

        <Divider variant="fullWidth"></Divider>
        <Friends fetchUserData={fetchUserData} />
      </Box>
      {/* </Container> */}
      <Modal open={open} onClose={() => handleClose}>
        <Box
          className="absolute top-[50%] flex flex-col justify-center gap-3 align-middle bg-slate-200"
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "40%",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          {croppedObject && (
            <>
              <Cropper
                background={false}
                src={croppedObject}
                style={{ height: 300, width: "100%" }}
                initialAspectRatio={1}
                aspectRatio={1}
                guides={false}
                crop={handleCrop}
                ref={cropperRef}
                viewMode={1}
                autoCropArea={1}
              />

              <Avatar
                src={croppedPreview}
                sx={{ width: 300, height: 300, mx: "auto" }}
              ></Avatar>
            </>
          )}
          <Box className="flex flex-row justify-center gap-5">
            <button
              className=" bg-red-700 rounded-md p-2 w-20 text-white"
              onClick={handleClose}
            >
              {" "}
              Cancel
            </button>
            <button
              className=" bg-cyan-700 rounded-md p-2 w-20 text-white"
              onClick={handleUploadImage}
            >
              Change
            </button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}

export default Profile;
