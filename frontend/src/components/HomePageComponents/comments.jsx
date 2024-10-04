import {
  Favorite,
  FavoriteOutlined,
  MoreVert,
  Reply,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Menu,
  MenuItem,
  Skeleton,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserDetails } from "../../features/friends/friendsAsyncThunks";
import { convertUTCToIST } from "../../pages/Utilitis";
import { addReply } from "../../features/posts/postsAsyncThunks";
import { AnimatedTooltip } from "../CommonComponents/AnimatedHoverComponent";
import { useTimeAgo } from "../../hooks/useTimeAgo";
import chatSocket from "../../features/utilities/Socket-io";
const POST_BACKEND = process.env.REACT_APP_POST_BACKEND;

const CommentComponent = React.memo(
  ({ comment, handleLike, author, handleRemoveComment }) => {
    const [replyContent, setreplyContent] = useState("");
    const dispatch = useDispatch();
    const { userData } = useSelector((state) => state.friends);
    const { user } = useSelector((state) => state.user);
    const [isLoading, setIsLoading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [userDetails, setUserDetails] = useState(null);
    const [reply, setReply] = useState([]);
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const openmenu = Boolean(anchorEl);

    const timeAgo = useTimeAgo(comment?.createdAt);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleCloseComment = () => {
      setAnchorEl(null);
    };

    useEffect(() => {
      const fetchDetails = async () => {
        setLoading(true);
        try {
          if (userData[comment?.user]) {
            setUserDetails(userData[comment?.user]);
          } else {
            await dispatch(fetchUserDetails(comment?.user));
            setUserDetails(userData[comment?.user]);
          }
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };

      fetchDetails();
    }, [dispatch, comment?.user, userData]);

    const handleOpen = async (id) => {
      setOpen((prev) => !prev);
      if (!open) {
        setIsLoading(true);
        try {
          const response = await fetch(
            `${POST_BACKEND}/posts/fetchReplies?commentId=${id}`,
            {
              method: "GET",
              credentials: "include",
            }
          );
          const data = await response.json();

          if (response.ok) {
            setReply(data.Replies);
            return;
          }
        } catch (error) {
          console.error(error.message);
        } finally {
          setIsLoading(false);
        }
      }
    };

    const submitreply = (id, postId, user) => {
      dispatch(
        addReply({ reply: replyContent, commentId: id, postId: postId })
      ).then((action) => {
        if (action.payload) {
          chatSocket.emit("sentNotification", { postId: postId, author: user });
          comment.replyCount++;
          setreplyContent("");
          setReply((reply) => {
            return [action.payload.result, ...reply];
          });
        }
      });
    };

    const handleLikeReply = async (_id) => {
      const response = await fetch(`${POST_BACKEND}/posts/likeReply`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ _id }),
      });

      const data = await response.json();
      if (response.ok) {
        chatSocket.emit("sentNotification", { postId: _id, author: "user" });
        setReply((replies) => {
          return replies.map((reply) =>
            reply._id === data._id ? data : reply
          );
        });
      }
    };

    if (loading) {
      return (
        <Box elevation={5} sx={{ borderRadius: 2, padding: 1, my: 0.5, mx: 1 }}>
          <Skeleton variant="circular" width={24} height={24} />
          <Skeleton variant="text" width="100%" height={20} />
          <Skeleton variant="text" width="30%" height={20} />
          <Skeleton variant="rectangular" width="100%" height={30} />
        </Box>
      );
    }

    return (
      <>
        {userDetails && (
          <>
            <Box
              className="dark:bg-slate-800 p-1"
              sx={{
                display: "flex",
                alignItems: "flex-start",
                mb: 1,
                borderRadius: 3,
              }}
            >
              {/* <Avatar
                src={userDetails?.profilePicture}
                sx={{ width: 30, height: 30 }}
              >
                {userDetails?.firstName[0]}
              </Avatar> */}
              <AnimatedTooltip
                key={`comments-${comment?.user}`}
                userId={comment?.user}
                size={28}
                fontS={12}
              />

              <Box sx={{ ml: 2.5, flexGrow: 1 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 0.5,
                  }}
                >
                  <Box className="dark:text-white">
                    <Typography variant="body2">
                      {`${userDetails?.firstName} ${userDetails?.lastName}`}{" "}
                      {author === userDetails?._id && (
                        <Chip
                          size="small"
                          variant="filled"
                          label="author"
                          sx={{ color: "grey" }}
                        ></Chip>
                      )}
                    </Typography>
                    <Typography
                      className="dark:text-gray-400"
                      variant="caption"
                      // sx={{ color: "text.secondary" }}
                    >
                      {timeAgo}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Button
                      onClick={() => handleLike(comment?._id, comment?.user)}
                      sx={{
                        minWidth: "auto",
                        p: 0,
                        "&:hover": { backgroundColor: "transparent" },
                      }}
                    >
                      {comment?.hasLiked ? (
                        <Favorite color="error" />
                      ) : (
                        <FavoriteOutlined className="dark:text-white" />
                      )}
                    </Button>
                    <Typography variant="body2" sx={{ ml: 0.5 }}>
                      {comment?.likes.length}
                    </Typography>
                    <Typography
                      onClick={() => handleOpen(comment?._id)}
                      className="dark:text-white"
                      sx={{ ml: 2, cursor: "pointer" }}
                    >
                      <Reply className="dark:text-white" />{" "}
                      {comment?.replyCount}
                    </Typography>
                    <Button
                      size="small"
                      className="m-0 p-0"
                      sx={{
                        p: 0,
                        minWidth: "auto",
                        minHeight: "auto",
                      }}
                      id="basic-button"
                      aria-controls={openmenu ? "basic-menu" : undefined}
                      aria-haspopup="true"
                      aria-expanded={openmenu ? "true" : undefined}
                      onClick={handleClick}
                    >
                      <MoreVert
                        className="dark:text-white"
                        sx={{ fontSize: "24px", p: 0 }}
                      />{" "}
                    </Button>
                    <Menu
                      id="basic-menu"
                      anchorEl={anchorEl}
                      open={openmenu}
                      onClose={handleCloseComment}
                      anchorOrigin={{
                        vertical: "top",
                        horizontal: "left",
                      }}
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "left",
                      }}
                      MenuListProps={{
                        "aria-labelledby": "basic-button",
                      }}
                    >
                      {(userDetails._id === user._id ||
                        author === user?._id) && (
                        <MenuItem
                          onClick={() => handleRemoveComment(comment?._id)}
                        >
                          Remove comment
                        </MenuItem>
                      )}
                      <MenuItem onClick={handleCloseComment}>
                        Report comment
                      </MenuItem>
                    </Menu>
                  </Box>
                </Box>

                <Typography
                  variant="body2"
                  sx={{
                    borderRadius: 2,
                    mt: 0.5,
                    lineHeight: 1.4,
                    wordBreak: "break-word",
                  }}
                >
                  {comment?.content}
                </Typography>

                {open &&
                  (isLoading ? (
                    <Box sx={{ marginTop: 1 }}>
                      <Box display="flex" alignItems="end">
                        <Skeleton
                          variant="rounded"
                          width="100%"
                          height={40}
                          sx={{ borderRadius: 2 }}
                        />
                        <Skeleton
                          variant="rectangular"
                          width={80}
                          height={36}
                          sx={{ ml: 2, borderRadius: "50px" }}
                        />
                      </Box>
                      <Box sx={{ mt: 1 }}>
                        {[...Array(3)].map((_, index) => (
                          <Box key={index} sx={{ mb: 2 }}>
                            <Skeleton
                              variant="rounded"
                              height={50}
                              sx={{ borderRadius: 2 }}
                            />
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        mt: 1,
                        p: 1,
                        borderRadius: 1,
                      }}
                    >
                      <Box sx={{ mt: 1 }}>
                        <TextareaAutosize
                          className="dark:bg-slate-600 placeholder:font-thin"
                          minRows={2}
                          placeholder="Write a reply..."
                          value={replyContent}
                          onChange={(e) => setreplyContent(e.target.value)}
                          style={{
                            width: "100%",
                            borderRadius: 8,
                            padding: "8px 12px",
                          }}
                        />
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() =>
                            submitreply(
                              comment?._id,
                              comment?.post,
                              comment?.user
                            )
                          }
                          sx={{ mt: 1 }}
                        >
                          Reply
                        </Button>
                      </Box>
                      {reply.map((r) => (
                        <Box
                          className="dark:bg-slate-700 px-2 py-1 rounded-md"
                          key={r._id}
                          sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            mb: 1,
                          }}
                        >
                          <Avatar
                            src={userData[r.user]?.profilePicture}
                            sx={{ width: 30, height: 30 }}
                          >
                            {userData[r.user]?.firstName[0]}
                          </Avatar>

                          <Box
                            sx={{ ml: 1.5, flexGrow: 1 }}
                            className="dark:text-white"
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                mb: 0.5,
                              }}
                            >
                              <Box>
                                <Typography
                                  variant="body2"
                                  className="dark:text-white"
                                >
                                  {`${userData[r.user]?.firstName} ${
                                    userData[r.user]?.lastName
                                  }`}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  className="dark:text-gray-400"
                                >
                                  {convertUTCToIST(r.createdAt)}
                                </Typography>
                              </Box>
                              <Box
                                sx={{ display: "flex", alignItems: "center" }}
                              >
                                <Button
                                  onClick={() => handleLikeReply(r._id)}
                                  sx={{
                                    minWidth: "auto",
                                    p: 0,
                                    "&:hover": {
                                      backgroundColor: "transparent",
                                    },
                                  }}
                                >
                                  {r.hasLiked ? (
                                    <Favorite color="error" />
                                  ) : (
                                    <FavoriteOutlined className="dark:text-white" />
                                  )}
                                </Button>
                                <Typography variant="body2" sx={{ ml: 0.5 }}>
                                  {r.likes.length}
                                </Typography>
                              </Box>
                            </Box>

                            <Typography
                              variant="body2"
                              sx={{
                                p: 1,
                                borderRadius: 2,
                                mt: 0.5,
                                lineHeight: 1.4,
                                wordBreak: "break-word",
                              }}
                              className="dark:bg-slate-800"
                            >
                              {r.content}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  ))}
              </Box>
            </Box>
          </>
        )}
      </>
    );
  }
);

export default CommentComponent;
