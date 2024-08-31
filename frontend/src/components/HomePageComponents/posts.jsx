import {
  Container,
  CssBaseline,
  Box,
  Button,
  Skeleton,
  Typography,
} from "@mui/material";
import Post from "./post";
import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, handleLike } from "../../features/posts/postsAsyncThunks";
import debounce from "lodash/debounce";
import { SyncLoader } from "react-spinners";
import { setPages } from "../../features/posts/postsSlice";
import { fetchPostData } from "../../fetchRequests/posts";
import { useSnackbar } from "notistack";
import { postDetailFamily, postsAtom } from "../../atoms/postAtoms";
import { useRecoilState } from "recoil";
import PullToRefresh from "react-simple-pull-to-refresh";

function Posts({ fetchUserData }) {
  const dispatch = useDispatch();

  const { posts, count } = useSelector((state) => state.posts);

  const [isBottom, setIsBottom] = useState(false);
  const [loading, setLoading] = useState(false);
  const [postGenerator, setPostGenerator] = useState(null);
  const [isLoadingInitial, setIsLoadingInitial] = useState(false);

  const [chunkSize] = useState(10);
  const [postId, setPostId] = useRecoilState(postsAtom);
  const { enqueueSnackbar } = useSnackbar();

  const fetchMorePosts = () => {
    return new Promise((resolve) => {
      dispatch(fetchPosts()).finally(() => {
        if (count === postId.length) {
          enqueueSnackbar("Refreshed successfully", {
            variant: "success",
          });
        }
        setLoading(false);
        resolve();
      });
    });
  };

  function* chunkPosts(posts, chunkSize) {
    for (let i = 0; i < posts.length; i += chunkSize) {
      yield posts.slice(i, i + chunkSize);
    }
  }

  useEffect(() => {
    if (count > 0 && postId.length !== count) {
      const generator = chunkPosts(posts, chunkSize);
      setPostGenerator(generator);

      const initialPosts = generator.next().value;
      setPostId(initialPosts);
    }
  }, [count, fetchPosts, posts]);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  const loadMore = () => {
    if (postGenerator && postId.length < count) {
      const nextPosts = postGenerator.next().value;
      if (nextPosts) {
        setPostId((prev) => {
          const id = new Set([...prev, ...nextPosts]);
          return [...id];
        });
      }
    }
  };

  const handleScroll = useCallback(
    debounce(() => {
      const div = document.getElementById("postsContainer");
      const scrollTop = div.scrollTop;
      const divHeight = div.clientHeight;
      const documentHeight = div.scrollHeight;

      if (scrollTop + divHeight >= documentHeight - 10) {
        if (!loading) {
          setIsBottom(true);
          if (postId.length < count) {
            dispatch(setPages());
            loadMore();
          }
        }
      } else {
        setIsBottom(false);
      }
    }, 300),
    [loading, postId, count, dispatch]
  );

  useEffect(() => {
    const div = document.getElementById("postsContainer");
    div.addEventListener("scroll", handleScroll);
    return () => div.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <>
      <PullToRefresh onRefresh={fetchMorePosts} className="max-h-lvh">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100vh",
            scrollbarWidth: "none",
            overflowY: "scroll",
          }}
        >
          <Box
            id="postsContainer"
            elevation={1}
            sx={{
              flex: "1 1 auto",
              borderRadius: "10px",
              position: "relative",
              overflowY: "scroll",
              scrollbarWidth: "none",
            }}
          >
            {posts.length > 0 ? (
              isLoadingInitial ? (
                Array.from(new Array(chunkSize)).map((_, index) => (
                  <Skeleton
                    key={index}
                    variant="rectangular"
                    width="100%"
                    height={118}
                    sx={{ borderRadius: "10px", marginBottom: "10px" }}
                  />
                ))
              ) : (
                postId &&
                postId?.map((post) => (
                  <Post
                    fetchUserData={fetchUserData}
                    key={`post-${post?._id}`}
                    postId={post._id}
                  />
                ))
              )
            ) : (
              <Typography
                variant="h6"
                align="center"
                sx={{
                  color: "#757575",
                  padding: "30px",
                  // fontStyle: "italic",
                  // fontSize: "1rem",
                  backgroundColor: "#f5f5f5",
                  borderRadius: "8px",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                }}
              >
                {`There's nothing to display. Connect with others to see updates`}
              </Typography>
            )}
            <Box
              sx={{
                padding: "15px",
                width: "100%",
                alignItems: "center",
                display: "flex",
                justifyContent: "center",
              }}
            >
              {postId?.length < count && (
                <SyncLoader size={8} color="#1976d2" />
              )}
            </Box>
          </Box>
        </Box>
      </PullToRefresh>
    </>
  );
}

export default Posts;
