export const isLocationValid = (location) => {
      const errors = {}
      if(!location.city.trim()){
        errors.city = 'City is required'
      }
       if(!location.country.trim()){
        errors.country = 'Country is required'
      }
       if(!location.state.trim()){
        errors.state = 'State is required'
      }
       if(!location.postalCode.trim()){
        errors.postalCode = 'Postal Code is required'
      }
      return errors
    };