const mongoose = require("mongoose");
const LOCATION_API = process.env.LOCATION_API;

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  birthMonth: { type: Number },
  birthYear: { type: Number },
  city: { type: String },
  state: { type: String },
  country: { type: String },
  postalCode: { type: String },
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], default: [0, 0] },
  },
  profilePicture: { type: String },
  bio: { type: String },
  lastLogin: { type: Date },
  updatedAt: { type: Date, default: Date.now },
  dateCreated: { type: Date, default: Date.now },
  isSetupComplete: { type: Boolean, default: false },
  isEmailVerified: { type: Boolean, default: false },
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "posts" }],
  onlineStatus: { type: Boolean },
  onlineTime: { type: Date },
});

userSchema.pre("save", async function (next) {
  if (this.isModified("postalCode")) {
    console.log(`Postal code modified: ${this.postalCode}`);

    try {
      // const response = await axios.get(
      //   `https://maps.googleapis.com/maps/api/geocode/json`,
      //   {
      //     params: {
      //       address: this.postalCode,
      //       key: process.env.LOCATION_API,
      //     },
      //   }
      // );
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          this.postalCode
        )}&key=${LOCATION_API}`
      );
      if (response.data.results.length > 0) {
        const { lat, lng } = response.data.results[0].geometry.location;
        if (lat !== undefined && lng !== undefined) {
          console.log(`Coordinates found: lng=${lng}, lat=${lat}`); // Debug log
          this.location.coordinates = [lng, lat];
        } else {
          console.log("Coordinates not defined"); // Debug log
          this.location.coordinates = [0, 0];
        }
      } else {
        console.log("No results found for postal code"); // Debug log
        this.location.coordinates = [0, 0];
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      this.location.coordinates = [0, 0];
    }
  }
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
