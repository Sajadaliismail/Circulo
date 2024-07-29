import { Box, Container, CssBaseline, Paper } from "@mui/material";
import Post from "./HomePageComponents/post";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../../features/user/userAsyncThunks";

function Posts() {
  const { posts } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  useEffect(() => {
    // dispatch(fetchPosts())
  }, []);
  return (
    <>
      <CssBaseline />
      <Container>
        <Paper elevation={1} sx={{ height: "100vh", borderRadius: "10px" }}>
          {posts &&
            posts.map((post, index) => (
              <>
                <Post key={index} postData={post}></Post>
              </>
            ))}
        </Paper>
      </Container>
    </>
  );
}

export default Posts;
