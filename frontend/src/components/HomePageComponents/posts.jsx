import {
  Container,
  CssBaseline,
  Paper,
  CircularProgress,
  Box,
} from "@mui/material";
import Post from "./post";
import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, handleLike } from "../../features/posts/postsAsyncThunks";
import debounce from "lodash/debounce";
import { setPages } from "../../features/posts/postsSlice";

function Posts() {
  const { posts, count, pages } = useSelector((state) => state.posts);
  const dispatch = useDispatch();
  const limits = 10;
  const [isBottom, setIsBottom] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialPosts, setInitialPosts] = useState([]);

  const fetchMorePosts = () => {
    setLoading(true);
    dispatch(fetchPosts()).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMorePosts();
  }, [dispatch, pages]);

  useEffect(() => {
    setInitialPosts(posts);
  }, [posts]);

  const handleScroll = useCallback(
    debounce(() => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

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
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const handLike = async (postId) => {
    try {
      dispatch(handleLike({ _id: postId }));
    } catch (error) {}
  };

  return (
    <>
      <CssBaseline />
      <Container>
        <Paper
          elevation={1}
          sx={{ height: "100vh", borderRadius: "10px", position: "relative" }}
        >
          {posts &&
            posts.map((post) => (
              <Post handLike={handLike} key={post._id} postData={post} />
            ))}
        </Paper>
        {pages * limits < count ? (
          <>
            <Box
              sx={{
                position: "",
                bottom: 0,
                padding: "10px",
                width: "100%",
                alignItems: "center",
                backgroundColor: "white",
                borderTop: "1px solid #ccc",
              }}
            >
              <CircularProgress />
            </Box>
          </>
        ) : (
          <>end</>
        )}
      </Container>
    </>
  );
}

export default Posts;
