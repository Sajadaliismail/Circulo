import {
  AvatarGroup,
  Box,
  Button,
  ButtonGroup,
  Divider,
  IconButton,
  Skeleton,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import CommentComponent from "./comments";
import { useDispatch, useSelector } from "react-redux";
import {
  addComment,
  deletePost,
  handleLike,
} from "../../features/posts/postsAsyncThunks";

import { useRecoilState } from "recoil";
import { postDetailFamily, postsAtom } from "../../atoms/postAtoms";
import { fetchPostData } from "../../fetchRequests/posts";
import { Comment, Favorite, FavoriteOutlined } from "@mui/icons-material";
import { CardComponent } from "./CardComponent";
import { AnimatedTooltip } from "../CommonComponents/AnimatedHoverComponent";
import {
  deleteCommentApi,
  fetchComment,
  handleLikeApi,
} from "../../api/commentsApi";
import { enqueueSnackbar } from "notistack";

const Post = React.memo(({ postId, fetchUserData }) => {
  const [postDetails, setPostDetails] = useRecoilState(
    postDetailFamily(postId)
  );
  const [post, setPostId] = useRecoilState(postsAtom);
  const [commentOpen, setCommentOpen] = useState(false);
  const dispatch = useDispatch();
  const [commentContent, setCommentContent] = useState("");
  const { userData } = useSelector((state) => state.friends);
  const { user } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleRemovePost = async (id) => {
    const result = await dispatch(deletePost(id));
    if (deletePost.fulfilled.match(result)) {
      setPostId((prev) => {
        const updatedPosts = prev.filter((postId) => postId._id !== id);
        return updatedPosts;
      });
      setPostDetails(null);
    } else {
      enqueueSnackbar("Failed deleting post.", { variant: "error" });
      console.error("Error deleting post:");
    }
  };

  const submitComment = async () => {
    const result = await dispatch(
      addComment({ comment: commentContent, postId: postDetails._id })
    );
    if (addComment.fulfilled.match(result)) {
      setPostDetails((prev) => {
        const newState = { ...prev };
        newState.commentsCount++;
        return newState;
      });
      setCommentContent("");
      setComments((comment) => {
        return [result.data, ...comment];
      });
    } else {
      enqueueSnackbar("Failed adding comment.", { variant: "error" });
    }
  };

  const toggleLike = (post) => {
    const alreadyLiked = post.hasLiked;
    let count = post.likesCount;
    const updatedLikes = alreadyLiked
      ? post.likes.filter((id) => id !== user._id)
      : [...post.likes, user._id];

    if (alreadyLiked) {
      count--;
    } else {
      count++;
    }

    return {
      ...post,
      hasLiked: !alreadyLiked,
      likesCount: count,
      likes: updatedLikes,
    };
  };

  const handLike = async (postId) => {
    try {
      const result = await dispatch(handleLike({ _id: postId }));
      if (handleLike.fulfilled.match(result)) {
        setPostDetails((prevPost) => toggleLike(prevPost));
      } else enqueueSnackbar("Failed liking post.", { variant: "error" });
    } catch (error) {
      console.error("Failed to handle like:", error);
      enqueueSnackbar("Failed liking post.", { variant: "error" });

      // setPostDetails((prevPost) => toggleLike(prevPost));
    }
  };

  useEffect(() => {
    const updatePostData = async (id) => {
      try {
        setLoading(true);
        const response = await fetchPostData(id);
        const result = await response.json();

        if (response.ok) {
          setPostDetails(result.data);
          const author = result?.data?.author;

          if (author) {
            fetchUserData(author);
          }
        } else {
          enqueueSnackbar("Failed to fetch post.", { variant: "error" });
        }
      } catch (error) {
        enqueueSnackbar("Failed to fetch post.", { variant: "error" });

        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (postId && !postDetails?._id) {
      updatePostData(postId);
    }
  }, [postId, postDetails]);

  const handleOpen = async () => {
    setCommentOpen((prev) => !prev);
    try {
      const response = await fetchComment(postDetails._id);

      const data = await response.json();
      if (response.ok) setComments(data.posts);
      else {
        enqueueSnackbar("Failed fetching comments.", { variant: "error" });
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Failed fetching comments.", { variant: "error" });
    }
  };

  const handleLikeComment = async (_id) => {
    try {
      const response = await handleLikeApi(_id);

      const data = await response.json();

      if (response.ok) {
        setComments((comments) => {
          return comments.map((comment) =>
            comment._id === data._id ? data : comment
          );
        });
      } else {
        enqueueSnackbar("Failed liking comments.", { variant: "error" });
      }
    } catch (error) {
      console.log(error);
      enqueueSnackbar("Failed liking comments.", { variant: "error" });
    }
  };

  const handleRemoveComment = async (id) => {
    try {
      const response = await deleteCommentApi(id);
      const data = await response.json();

      if (response.ok) {
        setComments((prev) => {
          const updated = [...prev];
          return updated.filter((comments) => comments._id !== id);
        });
        setPostDetails((state) => {
          return { ...state, commentsCount: state.commentsCount - 1 };
        });
      } else {
        enqueueSnackbar("Failed deleting comments.", { variant: "error" });
      }
    } catch (error) {
      console.log(error);
      enqueueSnackbar("Failed deleting comments.", { variant: "error" });
    }
  };

  const memoizedComments = useMemo(
    () =>
      comments.map((comment) => (
        <React.Fragment key={comment._id}>
          <CommentComponent
            author={postDetails?.author}
            comment={comment}
            handleLike={handleLikeComment}
            handleRemoveComment={handleRemoveComment}
          />
        </React.Fragment>
      )),
    [comments, handleLikeComment]
  );

  if (loading) {
    return (
      <Box elevation={5} sx={{ borderRadius: 2, padding: 2, my: 2, mx: 1 }}>
        <Skeleton variant="circular" width={40} height={40} />
        <Skeleton variant="text" width="60%" height={30} />
        <Skeleton variant="rectangular" width="100%" height={200} />
      </Box>
    );
  }

  return (
    <>
      {userData[postDetails?.author] && (
        <Box
          className="shadow-xl  bg-gray-200 rounded-lg dark:bg-slate-700"
          elevation={5}
          sx={{
            borderRadius: 2,
            padding: 1,
            my: 2,
            mx: 1,
          }}
        >
          <CardComponent
            handleRemovePost={handleRemovePost}
            userId={user._id}
            postDetails={postDetails}
            author={userData[postDetails?.author]}
          />
          {/* <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              cursor: "pointer",

              [`&:hover .posts-${postDetails?._id}-${postDetails?.author}`]: {
                visibility: "visible",
              },
              position: "relative",
            }}
          >
            <Avatar
              sx={{ width: 30, height: 30, my: 1 }}
              src={userData[postDetails?.author]?.profilePicture}
            >
              {userData[postDetails?.author]?.firstName?.[0]?.toUpperCase()}
            </Avatar>
            <Typography sx={{ color: theme.palette.text.primary }}>
              {`${userData[postDetails?.author]?.firstName} ${
                userData[postDetails?.author]?.lastName
              }`}
            </Typography>
            <Typography
              variant="caption"
              sx={{ marginLeft: "auto", color: theme.palette.text.secondary }}
            >
              {convertUTCToIST(postDetails?.createdAt)}
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
              <MoreVert sx={{ fontSize: "24px", p: 0 }} />{" "}
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={openmenu}
              onClose={handleClose}
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
              {postDetails?.author == user._id && (
                <MenuItem onClick={() => handleRemovePost(postDetails?._id)}>
                  Remove post
                </MenuItem>
              )}
              <MenuItem onClick={handleClose}>Report post</MenuItem>
            </Menu>
            <HoverComponent
              component={`posts-${postDetails?._id}`}
              id={postDetails?.author}
            />
          </Box> */}
          {/* <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "start",
              gap: 1,
              textAlign: "start",
              width: "100%",
              color: theme.palette.text.primary,
            }}
          >
            <Typography variant="body2">{postDetails?.content}</Typography>
            {postDetails?.image && (
              <Box
                component="img"
                src={postDetails?.image}
                alt="postImage"
                sx={{
                  width: "100%",
                  height: "auto",
                  objectFit: "cover",
                  borderRadius: 2,
                }}
              />
            )}
          </Box> */}
          <Box>
            <ButtonGroup
              variant="text"
              sx={{
                alignItems: "center",
                justifyItems: "center",
                borderRadius: "50px",
              }}
              aria-label="Loading button group"
            >
              <IconButton onClick={() => handLike(postDetails?._id)}>
                {postDetails?.hasLiked ? (
                  <Favorite color="error" />
                ) : (
                  <FavoriteOutlined className="dark:text-white" />
                )}
              </IconButton>
              {postDetails?.likes?.length > 0 && (
                <AvatarGroup
                  spacing={"small"}
                  componentsProps={{
                    additionalAvatar: {
                      sx: {
                        height: 24,
                        width: 24,
                        fontSize: 12,
                        left: 10,
                      },
                    },
                  }}
                  total={postDetails?.likes.length}
                  sx={{ mr: 2 }}
                  max={4}
                >
                  {postDetails?.likes.slice(0, 3).map((id) => (
                    <AnimatedTooltip
                      userId={id}
                      size={24}
                      fontS={12}
                      // key={id}
                      // sx={{ width: 24, height: 24, fontSize: 12 }}
                      // src={userData[id]?.profilePicture}
                    >
                      {/* {userData[id]?.firstName[0]} */}
                    </AnimatedTooltip>
                  ))}
                </AvatarGroup>
              )}

              <Button sx={{ gap: 1 }} onClick={handleOpen}>
                <Comment className="text-cyan-600 dark:text-white" />
                {postDetails?.commentsCount}
              </Button>
            </ButtonGroup>
          </Box>
          {commentOpen && (
            <Box sx={{ marginTop: 2 }} key={postDetails?._id}>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: "200",
                }}
              >
                Comments
              </Typography>
              <Box display="flex" alignItems="end" gap={1} className="mb-2">
                <TextareaAutosize
                  className="dark:placeholder:text-slate-300 font-thin dark:bg-slate-600 rounded-lg"
                  placeholder="Share your opinion..."
                  minRows={2}
                  maxLength={300}
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  style={{
                    flex: 1,
                    resize: "none",
                    border: "none",
                    outline: "none",
                    width: "100%",
                    borderRadius: 5,
                    padding: "8px",
                  }}
                />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <Button
                    size="small"
                    onClick={submitComment}
                    variant="contained"
                    sx={{
                      borderRadius: "50px",
                    }}
                  >
                    Comment
                  </Button>
                </Box>
              </Box>
              <Box className="shadow-2xl  p-1 rounded-lg">
                {memoizedComments}
              </Box>
            </Box>
          )}
        </Box>
      )}
      <Divider variant="fullWidth" />
    </>
  );
});

export default Post;
