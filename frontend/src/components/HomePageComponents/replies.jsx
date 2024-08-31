// import {
//   Favorite,
//   FavoriteOutlined,
//   Forum,
//   ThumbUp,
//   ThumbUpAlt,
//   ThumbUpOffAlt,
// } from "@mui/icons-material";
// import { Avatar, Box, Button, Chip, Typography } from "@mui/material";
// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchUserDetails } from "../../features/friends/friendsAsyncThunks";
// import { convertUTCToIST } from "../../pages/Utilitis";

// const ReplyComponent = React.memo(({ reply, handleLikeReply, author }) => {
//   const dispatch = useDispatch();
//   const { userData } = useSelector((state) => state.friends);
//   const [user, setUser] = useState(null);
//   useEffect(() => {
//     if (userData[reply.user]) setUser(userData[reply.user]);
//     else {
//       dispatch(fetchUserDetails(reply.user)).then(() => {
//         setUser(userData[reply.user]);
//       });
//     }
//   }, []);

//   return (
//     <>
//       {user && (
//         <>
//           <Box sx={{ display: "flex", alignItems: "flex-start" }}>
//             <Avatar src={user?.profilePicture} sx={{ width: 30, height: 30 }}>
//               {user.firstName[0]}
//             </Avatar>

//             <Box sx={{ ml: 1.5, flexGrow: 1 }}>
//               <Box
//                 sx={{
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "space-between",
//                 }}
//               >
//                 <Typography variant="body2" color="text.primary">
//                   {`${user.firstName} ${user.lastName}`}{" "}
//                   {author == user._id && (
//                     <Chip size="small" variant="filled" label="author"></Chip>
//                   )}
//                 </Typography>
//                 <Typography variant="caption" sx={{ color: "text.secondary" }}>
//                   {convertUTCToIST(reply?.createdAt)}
//                 </Typography>
//               </Box>

//               <Typography
//                 variant="body2"
//                 sx={{
//                   display: "flex",
//                   p: 1,
//                   borderRadius: 2,
//                   mt: 0.5,
//                   lineHeight: 1.4,
//                   wordBreak: "break-word",
//                 }}
//               >
//                 {reply.content}

//                 <Box sx={{ display: "flex", alignItems: "center", ml: "auto" }}>
//                   <Button
//                     onClick={() => handleLikeReply(reply._id)}
//                     sx={{
//                       minWidth: "auto",
//                       p: 0,
//                       "&:hover": { backgroundColor: "transparent" },
//                     }}
//                   >
//                     {reply.hasLiked ? (
//                       <Favorite color="error" />
//                     ) : (
//                       <FavoriteOutlined />
//                     )}
//                   </Button>

//                   <Typography variant="caption" sx={{ ml: 0.5 }}>
//                     {reply?.likes?.length}
//                   </Typography>
//                 </Box>
//               </Typography>
//             </Box>
//           </Box>
//         </>
//       )}
//     </>
//   );
// });

// export default ReplyComponent;
