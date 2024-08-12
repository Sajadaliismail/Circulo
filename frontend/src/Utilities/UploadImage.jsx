export const UploadImage = async (
  id,
  setImageUrl,
  imageUrl,
  dispatch,
  setSentMessages,
  chatSocket,
  image
) => {
  const formData = new FormData();
  formData.append("file", image);
  formData.append("upload_preset", "circulo");

  try {
    const response = await fetch(process.env.REACT_APP_CLOUDINARY_URL, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    const message = data.secure_url;
    if (message) {
      setImageUrl(data.secure_url);
      chatSocket.emit("message", {
        userId: id,
        message: message,
        type: "image",
      });
      dispatch(
        setSentMessages({
          message: imageUrl,
          timestamp: Date.now(),
          type: "image",
        })
      );
    }
  } catch (err) {
    console.error("Error uploading image:", err);
  }
};
