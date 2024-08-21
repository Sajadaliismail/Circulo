import { Forum, ThumbUp, ThumbUpAlt, ThumbUpOffAlt } from "@mui/icons-material";
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Chip,
  Paper,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserDetails } from "../../features/friends/friendsAsyncThunks";
import { convertUTCToIST } from "../../pages/Utilitis";

function CommentComponent({ comment, handleLike }) {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.friends);
  const [user, setUser] = useState(null);
  useEffect(() => {
    if (userData[comment.user]) setUser(userData[comment.user]);
    else {
      dispatch(fetchUserDetails(comment.user)).then(() => {
        setUser(userData[comment.user]);
      });
    }
    comment.likes.forEach((id) => dispatch(fetchUserDetails(id)));
  }, []);

  return (
    <>
      {user && (
        <Box
          className="border-2 rounded-lg p-2 mb-2"
          sx={{
            borderColor: "#e0e0e0",
            boxShadow: 1,
            backgroundColor: "#fff",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Avatar src={user?.profilePicture} sx={{ width: 40, height: 40 }}>
              {user.firstName[0]}
            </Avatar>
            <Typography variant="body1">
              {`${user.firstName} ${user.lastName}`}
            </Typography>
            <Typography
              variant="caption"
              sx={{ marginLeft: "auto", color: "text.secondary" }}
            >
              {convertUTCToIST(comment?.createdAt)}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "8px",
              marginTop: 1,
              backgroundColor: "#f5f5f5",
              padding: 1,
              borderRadius: 2,
            }}
          >
            <Typography variant="body2" sx={{ lineHeight: 1.5 }}>
              {comment.content}
            </Typography>
          </Box>

          <Box sx={{ marginTop: 1, display: "flex", alignItems: "center" }}>
            <Button
              onClick={() => handleLike(comment._id)}
              sx={{
                minWidth: "auto",
                padding: 0,
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                },
              }}
            >
              {comment.hasLiked ? (
                <ThumbUpAlt color="primary" />
              ) : (
                <ThumbUpOffAlt />
              )}
            </Button>

            {comment.likes.length > 0 && (
              <AvatarGroup
                renderSurplus={(surplus) => <span>+{surplus}</span>}
                total={comment.likes.length}
              >
                {comment.likes.map((id) => (
                  <Avatar
                    sx={{ width: 24, height: 24 }}
                    key={id}
                    src={userData[id]?.profilePicture}
                  >
                    {userData[id] ? userData[id].firstName[0] : null}{" "}
                  </Avatar>
                ))}
              </AvatarGroup>
            )}
          </Box>
        </Box>
      )}
    </>
  );
}

export default CommentComponent;
