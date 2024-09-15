import { enqueueSnackbar } from "notistack";

export const UploadImage = async (id, chatSocket, image) => {
  const formData = new FormData();
  formData.append("file", image);
  formData.append("upload_preset", "circulo");

  try {
    const response = await fetch(process.env.REACT_APP_CLOUDINARY_URL, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      enqueueSnackbar("Error sending image", { variant: "error" });
      return;
    }

    const message = data.secure_url;
    if (message) {
      chatSocket.emit("message", {
        userId: id,
        message: message,
        type: "image",
      });
    }
  } catch (err) {
    enqueueSnackbar("Error sending image", { variant: "error" });
    console.error("Error uploading image:", err);
  }
};
