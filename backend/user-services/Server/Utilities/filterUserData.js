const filterUserData = (user, userId) => {
  const roomId = [user._id, userId].sort().join("");
  return {
    _id: user._id,
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
    bio: user.bio,
    onlineStatus: user.onlineStatus,
    onlineTime: user.onlineTime,
    roomId: roomId,
  };
};

module.exports = filterUserData;
