import { v2 } from "cloudinary";
const CLOUD_NAME = process.env.REACT_APP_CLOUD_NAME;
const API_KEY = process.env.REACT_APP_API_KEY;
const API_SECRET = process.env.REACT_APP_API_SECRET;
v2.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
});

export default v2;
