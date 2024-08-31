import {
  Container,
  CssBaseline,
  Box,
  Button,
  Skeleton,
  Typography,
  Grid,
} from "@mui/material";
// import Post from "./post";
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
import PostCard from "./PostCard";

function UserPosts({ userId, fetchUserData, postsId, count }) {
  const dispatch = useDispatch();
  const [isBottom, setIsBottom] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user } = useSelector((state) => state.user);
  const [posts, setPosts] = useState([]);
  const [chunkSize] = useState(10);

  const { enqueueSnackbar } = useSnackbar();

  const handleScroll = useCallback(
    debounce(() => {
      const div = document.getElementById("postsContainer");
      const scrollTop = div.scrollTop;
      const divHeight = div.clientHeight;
      const documentHeight = div.scrollHeight;

      if (scrollTop + divHeight >= documentHeight - 10) {
        if (!loading) {
          setIsBottom(true);
          if (postsId.length < count) {
          }
        }
      } else {
        setIsBottom(false);
      }
    }, 300),
    [loading, postsId, count, dispatch]
  );

  useEffect(() => {
    const div = document.getElementById("postsContainer");
    div.addEventListener("scroll", handleScroll);
    return () => div.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <>
      <CssBaseline />

      <Box
        id="postsContainer"
        elevation={1}
        xs={12}
        md={12}
        className="xs:justify-center md:justify-normal "
        sx={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          borderRadius: "10px",
          position: "relative",
          overflowY: "scroll",
          scrollbarWidth: "none",
          gap: "8px",
          padding: "0px",
          width: "100%",
        }}
      >
        {postsId?.length > 0 ? (
          loading ? (
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
            postsId &&
            postsId?.map((post) => (
              <PostCard
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
              width: "inherit",
              height: "80vh",
              borderRadius: 5,
            }}
          >
            {`No Posts`}
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
          {postsId?.length < count && <SyncLoader size={8} color="#1976d2" />}
        </Box>
      </Box>

      {/* </PullToRefresh> */}
    </>
  );
}

export default UserPosts;
