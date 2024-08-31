import React, { useEffect, useRef, useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Cropper, { ReactCropperElement } from "react-cropper";
import {
  Button,
  ButtonGroup,
  Chip,
  IconButton,
  Paper,
  TextareaAutosize,
  Tooltip,
} from "@mui/material";
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  ImageTwoTone,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { addPost } from "../../features/posts/postsAsyncThunks";
import { useSnackbar } from "notistack";
import Carousel from "react-material-ui-carousel";
import html2canvas from "html2canvas";
import { set } from "lodash";

function NewPost({ setPostsData }) {
  const { user } = useSelector((state) => state.user);
  const [isHovered, setIsHovered] = useState(false);
  const [image, setImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [cropCanvas, setCropCanvas] = useState(null);
  const [postContent, setPostContent] = useState("");
  const [backgroundIndex, setBackgroundIndex] = useState(0);
  const [fontSize, setFontSize] = useState(60);
  const [fontStyle, setFontStyle] = useState("normal");
  const [fontWeight, setFontWeight] = useState("normal");
  const [textDecoration, setTextDecoration] = useState("none");
  const [loading, setLoading] = useState(false);
  const [hovered, setHovered] = useState(false);

  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const textLength = postContent.length;
    const newFontSize = Math.max(12, Math.min(60, 60 - textLength / 8));
    // console.log(`Text Length: ${textLength}, Font Size: ${newFontSize}`);
    setFontSize(newFontSize);
  }, [postContent]);

  const backgroundsColor = [
    "#e09d9d",
    "#8ab4f8",
    "#9cbf9e",
    "#e0e06a",
    "#e07a8e",
    "#b58abf",
    "#a05b7d",
    "#80b685",
  ];

  const CustomIndicatorIcon = ({ color }) => (
    <Box
      sx={{
        width: 16,
        height: 16,
        borderRadius: "50%",
        backgroundColor: color,
        margin: "2px 4px",
        mt: 1,
      }}
    />
  );

  const handleImageChange = (e) => {
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

      setImage(file);
      const objectUrl = URL.createObjectURL(file);
      setCropCanvas(objectUrl);
    }
  };

  const cropperRef = useRef(null);
  const onCrop = () => {
    const cropper = cropperRef.current?.cropper;
    // console.log(cropper.getCroppedCanvas().toDataURL());
  };

  const cropImage = () => {
    const cropper = cropperRef.current?.cropper;
    const croppedCanvas = cropper.getCroppedCanvas();
    const croppedImage = croppedCanvas.toDataURL();
    croppedCanvas.toBlob((blob) => {
      const fileName = `${Date.now()}.jpg`;
      const file = new File([blob], fileName, { type: "image/jpeg" });
      setCroppedImage(file);
    }, "image/jpeg");
    setImagePreview(croppedImage);
    setCropCanvas(null);
  };

  const cancelUpload = () => {
    setCropCanvas(null);
    setImage(null);
    setImagePreview(null);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (postContent.trim() === "" && !image) {
      enqueueSnackbar("Your post seems to be empty", { variant: "error" });
      return;
    }

    setLoading(true);

    let postImageData = croppedImage;
    let postContentToSend = postContent;

    if (!image && postContent.trim() !== "") {
      const textArea = document.getElementById("text-preview-area");
      textArea.style.backgroundColor = backgroundsColor[backgroundIndex];
      if (textArea) {
        const canvas = await html2canvas(textArea, {
          scale: 2,
        });

        const imageBlob = await new Promise((resolve) =>
          canvas.toBlob(resolve, "image/png")
        );
        const fileName = Date.now().toString();
        postImageData = new File([imageBlob], fileName, {
          type: "image/png",
        });
        postContentToSend = "";
      }
    }

    const result = await dispatch(
      addPost({ imgData: postImageData, post: postContentToSend })
    );

    setLoading(false); // Reset loading state

    if (addPost.fulfilled.match(result)) {
      setImagePreview(null);
      setPostContent("");
      setCropCanvas(null);
      setImage(null);
      setImagePreview(null);
    }
  };

  const handleAttachImageClick = () => {
    document.getElementById("image-upload").click();
  };
  const fontStyles = ["Sans-serif", "Roboto", "Courier New", "Georgia"];

  const [selectedFont, setSelectedFont] = useState("Arial");

  const handleFontChange = (font) => {
    setSelectedFont(font);
  };

  return (
    <>
      <Box>Write a post</Box>
      <Box
        className="shadow-lg  bg-gray-100 dark:bg-gray-800 p-2"
        elevation={5}
        sx={{
          marginY: 1,
          borderRadius: 2,
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            padding: 1,
            borderRadius: 1,
          }}
        >
          <Avatar src={user?.profilePicture}>
            {user.firstName[0].toUpperCase()}
          </Avatar>
          <TextareaAutosize
            className="bg-slate-200 dark:bg-slate-600 text-black dark:text-white placeholder:text-slate-500 placeholder:font-thin dark:placeholder:text-white"
            minRows={3}
            maxLength={300}
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

              padding: "5px",
              borderRadius: "8px",
            }}
            disabled={loading}
          />
        </Box>

        {!image && postContent.trim() !== "" && (
          <Box
            onMouseEnter={() => {
              setIsHovered(true);
            }}
            onMouseLeave={() => setIsHovered(false)}
            sx={{ position: "relative" }}
          >
            <Carousel
              key={backgroundIndex}
              IndicatorIcon={backgroundsColor.map((color, index) => (
                <CustomIndicatorIcon key={index} color={color} />
              ))}
              index={backgroundIndex}
              onChange={(index) => {
                setBackgroundIndex(index);
              }}
              autoPlay={false}
            >
              {backgroundsColor.map((bg, idx) => (
                <Box
                  key={`${bg}-${idx}`}
                  id="text-preview-area"
                  sx={{
                    backgroundColor: bg,
                    aspectRatio: "4 / 3",
                    width: "100%  ",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                    wordBreak: "break-word",
                    textWrap: "wrap",
                    textOverflow: "clip",
                    overflow: "hidden",
                    padding: 2,
                    borderRadius: 1,
                    fontFamily: selectedFont,
                    fontSize: fontSize,
                    fontStyle: fontStyle,
                    fontWeight: fontWeight,
                    textDecoration: textDecoration,
                    boxSizing: "border-box",
                  }}
                >
                  {postContent}
                </Box>
              ))}
            </Carousel>

            <Box
              sx={{
                width: "100%",
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                display: isHovered ? "flex" : "none",
                flexDirection: "column",
                justifyContent: "center",
                marginBottom: 1,
                zIndex: 100,
                padding: 2,
                backgroundColor: "#5b5b5b5c",
                "@media (max-width: 600px)": {
                  padding: 1,
                  flexDirection: "column",
                  alignItems: "center",
                  backgroundColor: "#5b5b5b5c",
                },
              }}
            >
              <ButtonGroup
                variant="contained"
                disabled={loading}
                aria-label="text formatting options"
                sx={{
                  flexWrap: "wrap",
                  justifyContent: "center",
                  "@media (max-width: 600px)": {
                    marginBottom: 1,
                  },
                }}
              >
                <Tooltip title="Bold" arrow>
                  <IconButton
                    color={fontWeight === "bold" ? "primary" : "default"}
                    onClick={() =>
                      setFontWeight((prev) =>
                        prev === "bold" ? "normal" : "bold"
                      )
                    }
                  >
                    <FormatBold />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Underline" arrow>
                  <IconButton
                    color={
                      textDecoration === "underline" ? "primary" : "default"
                    }
                    onClick={() =>
                      setTextDecoration((prev) =>
                        prev === "underline" ? "none" : "underline"
                      )
                    }
                  >
                    <FormatUnderlined />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Italic" arrow>
                  <IconButton
                    color={fontStyle === "italic" ? "primary" : "default"}
                    onClick={() =>
                      setFontStyle((prev) =>
                        prev === "italic" ? "normal" : "italic"
                      )
                    }
                  >
                    <FormatItalic />
                  </IconButton>
                </Tooltip>
              </ButtonGroup>
              <ButtonGroup
                disabled={loading}
                variant="text"
                aria-label="font style options"
                sx={{
                  flexWrap: "nowrap",
                  justifyContent: "center",
                  "@media (max-width: 600px)": {
                    marginTop: 1,
                  },
                }}
              >
                {fontStyles.map((font) => (
                  <Button
                    color="inherit"
                    key={font}
                    onClick={() => handleFontChange(font)}
                    sx={{ fontFamily: font }}
                  >
                    {font}
                  </Button>
                ))}
              </ButtonGroup>
            </Box>
          </Box>
        )}
        {image && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              overflow: "hidden",
              width: "100%",
              height: "auto",
              marginTop: 2,
              borderRadius: 1,
              padding: 1,
            }}
          >
            {cropCanvas && (
              <>
                <Cropper
                  background={false}
                  src={cropCanvas}
                  style={{ width: "100%" }}
                  aspectRatio={4 / 3}
                  guides={false}
                  crop={onCrop}
                  ref={cropperRef}
                />
              </>
            )}
            {imagePreview && (
              <>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                  }}
                />
              </>
            )}
          </Box>
        )}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 2,
          }}
        >
          <Box
            display="flex"
            alignItems="center"
            sx={{ marginLeft: "auto", paddingX: 1, gap: 1.5 }}
          >
            {image ? (
              <>
                <Button
                  sx={{ width: "100px", borderRadius: "50px" }}
                  variant="contained"
                  color="error"
                  onClick={cancelUpload}
                  disabled={loading}
                >
                  Cancel
                </Button>
                {cropCanvas && (
                  <Button
                    sx={{ width: "100px", borderRadius: "50px" }}
                    variant="contained"
                    color="primary"
                    onClick={cropImage}
                    disabled={loading}
                  >
                    Crop
                  </Button>
                )}
              </>
            ) : (
              <>
                <Chip
                  icon={<ImageTwoTone sx={{ cursor: "pointer" }} />}
                  label="Attach an image"
                  onClick={handleAttachImageClick}
                  sx={{ marginRight: 2, color: "gray" }}
                  clickable
                />
                <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id="image-upload"
                  type="file"
                  onChange={handleImageChange}
                />
              </>
            )}
            {!cropCanvas && (
              <Button
                variant="contained"
                disabled={loading}
                sx={{
                  width: "100px",
                  borderRadius: "50px",
                  "&:hover": {},
                }}
                onClick={handleSubmit}
              >
                Share
              </Button>
            )}
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            marginTop: 2,
          }}
        ></Box>
      </Box>
    </>
  );
}

export default NewPost;
