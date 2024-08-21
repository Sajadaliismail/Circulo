import {
  Container,
  CssBaseline,
  Paper,
  CircularProgress,
  Box,
  Button,
} from "@mui/material";
import Post from "./post";
import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, handleLike } from "../../features/posts/postsAsyncThunks";
import debounce from "lodash/debounce";
import { SyncLoader } from "react-spinners";
import { setPages } from "../../features/posts/postsSlice";

function Posts({ fetchUserData }) {
  const { posts, count, pages } = useSelector((state) => state.posts);
  const dispatch = useDispatch();
  const limits = 10;
  const [isBottom, setIsBottom] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialPosts, setInitialPosts] = useState([]);

  const fetchMorePosts = () => {
    setLoading(true);
    dispatch(fetchPosts()).finally(() => {
      console.log("Finished fetching posts");
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchMorePosts();
  }, []);

  useEffect(() => {
    setInitialPosts(posts);
  }, [posts]);

  const handleScroll = useCallback(
    debounce(() => {
      const div = document.getElementById("postsContainer");
      const scrollTop = div.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = div.scrollHeight;

      if (scrollTop + windowHeight >= documentHeight - 10) {
        if (!loading) {
          setIsBottom(true);
          if (pages * limits < count) {
            dispatch(setPages());
            fetchMorePosts();
          }
        }
      } else {
        setIsBottom(false);
      }
    }, 300),
    [loading]
  );

  useEffect(() => {
    const div = document.getElementById("postsContainer");
    div.addEventListener("scroll", handleScroll);
    return () => div.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const handLike = async (postId) => {
    try {
      dispatch(handleLike({ _id: postId }));
    } catch (error) {}
  };

  return (
    <>
      <CssBaseline />
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100vh",
        }}
      >
        <Box
          id="postsContainer"
          elevation={1}
          sx={{
            flex: "1 1 auto",
            borderRadius: "10px",
            position: "relative",
            overflowY: "auto",
            scrollbarWidth: "none",
          }}
        >
          {posts &&
            posts.map((post) => (
              <Post
                fetchUserData={fetchUserData}
                handLike={handLike}
                key={post._id}
                postData={post}
              />
            ))}
          <Box
            sx={{
              padding: "15px",
              width: "100%",
              alignItems: "center",
              display: "flex",
              justifyContent: "center",
            }}
          >
            {pages * limits < count ? (
              <SyncLoader size={8} color="#1976d2" />
            ) : (
              <Button onClick={() => dispatch(fetchMorePosts)}>
                Load More
              </Button>
            )}
          </Box>
        </Box>
      </Container>
    </>
  );
}

export default Posts;
