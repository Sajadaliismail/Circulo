 const filterUserData = (user) => {
  return {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    birthMonth: user.birthMonth,
    birthYear: user.birthYear,
    city: user.city,
    state: user.state,
    country: user.country,
    postalCode: user.postalCode,
    profilePicture: user.profilePicture,
    bio: user.bio
  };
};

module.exports = {filterUserData}