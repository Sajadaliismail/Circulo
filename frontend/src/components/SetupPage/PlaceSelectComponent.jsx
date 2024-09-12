import { Box, TextField } from "@mui/material";
import ReactGooglePlacesAutocomplete, {
  geocodeByPlaceId,
} from "react-google-places-autocomplete";

const API = process.env.REACT_APP_LOCATION_API;
const AddressForm = ({ errors, setErrors, location, setLocation }) => {
  const handleSelect = async (value) => {
    const placeId = value.value.place_id;

    try {
      const results = await geocodeByPlaceId(placeId);
      const addressComponents = results[0].address_components;

      let city = "";
      let state = "";
      let country = "";
      let postalCode = "";

      addressComponents.forEach((component) => {
        if (component.types.includes("locality")) {
          city = component.long_name;
        } else if (component.types.includes("administrative_area_level_1")) {
          state = component.long_name;
        } else if (component.types.includes("country")) {
          country = component.long_name;
        } else if (component.types.includes("postal_code")) {
          postalCode = component.long_name;
        }
      });

      setErrors({});
      setLocation({
        city,
        state,
        country,
        postalCode,
      });
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  };

  const handleLocationChange = (field, value) => {
    setLocation((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  return (
    <Box textAlign={"left"}>
      <Box
        sx={{
          ". css-166bipr-Input__input": {
            border: "1px solid #ccc",
            borderRadius: "4px",
            padding: "8px",
            fontSize: "16px",
            zIndex: 1,
          },
          ".css-1nmdiq5-menu": {
            border: "1px solid #ccc",
            borderRadius: "4px",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
            zIndex: 10,
          },
        }}
      >
        <ReactGooglePlacesAutocomplete
          apiKey={API}
          selectProps={{
            value: location.city,
            onChange: handleSelect,
            placeholder: "Search...",
          }}
          apiOptions={{
            types: ["(cities)"],
          }}
        />
      </Box>
      <TextField
        name="city"
        label="City"
        value={location.city}
        onChange={(e) => handleLocationChange("city", e.target.value)}
        fullWidth
        sx={{ mt: 2 }}
        error={!!errors.city}
        helperText={errors.city}
      />
      <TextField
        name="state"
        label="State"
        value={location.state}
        onChange={(e) => handleLocationChange("state", e.target.value)}
        fullWidth
        sx={{ mt: 2 }}
        error={!!errors.state}
        helperText={errors.state}
      />
      <TextField
        name="country"
        label="Country"
        value={location.country}
        onChange={(e) => handleLocationChange("country", e.target.value)}
        fullWidth
        sx={{ mt: 2 }}
        error={!!errors.country}
        helperText={errors.country}
      />
      <TextField
        name="postalcode"
        label="Postal Code"
        value={location.postalCode}
        onChange={(e) => handleLocationChange("postalCode", e.target.value)}
        fullWidth
        sx={{ mt: 2 }}
        error={!!errors.postalCode}
        helperText={errors.postalCode}
      />
    </Box>
  );
};

export default AddressForm;
