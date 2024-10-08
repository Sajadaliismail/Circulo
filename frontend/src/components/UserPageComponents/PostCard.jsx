import { Box, Typography } from "@mui/material";
import { useRecoilState } from "recoil";
import { postDetailFamily } from "../../atoms/postAtoms";
import { fetchPostData } from "../../fetchRequests/posts";
import { Comment, Favorite, FavoriteOutlined } from "@mui/icons-material";
import Post from "../HomePageComponents/post";
import { CardContainer, CardBody, CardItem } from "./sample";
import { useEffect, useState } from "react";
import { Modal, ModalBody, ModalContent, ModalTrigger } from "./AnimatedModal";

const PostCard = ({ postId, fetchUserData }) => {
  const [postDetails, setPostDetails] = useRecoilState(
    postDetailFamily(postId)
  );
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

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
          // Handle error
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (postId && !postDetails?._id) {
      updatePostData(postId);
    }
  }, [postId, postDetails, fetchUserData]);

  const handleOpen = () => setOpen(true);

  if (loading) {
    return null;
  }

  return (
    <>
      <Modal>
        <CardContainer className="inter-var">
          <CardBody
            className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-[#e5e5e5]   dark:border-white/[0.2] border-black/[0.1] h-auto rounded-xl p-3 border"
            sx={{
              width: "100%",
              maxWidth: { xs: "100%", sm: "30rem", md: "40rem", lg: "50rem" },
            }}
          >
            <CardItem translateZ="100" className="w-full mt-2">
              <ModalTrigger>
                <img
                  onClick={handleOpen}
                  src={postDetails?.image}
                  height="1000"
                  width="1000"
                  className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
                  alt="thumbnail"
                />
              </ModalTrigger>
            </CardItem>

            <CardItem
              translateZ="50"
              className="text-xl font-bold text-neutral-600 dark:text-dark min-h-7"
            >
              {postDetails?.content?.length > 20
                ? `${postDetails?.content.slice(0, 25)}...`
                : postDetails?.content}
            </CardItem>

            <div className="flex justify-between items-center">
              <Box
                p={2}
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  zIndex: 2,
                  color: "white",
                  backgroundColor: "#313131a3",
                  borderRadius: 4,
                  mt: 1,
                }}
              >
                <Typography
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  {postDetails?.hasLiked ? (
                    <Favorite color="error" />
                  ) : (
                    <FavoriteOutlined sx={{ color: "white" }} />
                  )}
                  {postDetails?.likesCount}
                </Typography>
                <Typography
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <Comment sx={{ color: "white" }} />{" "}
                  {postDetails?.commentsCount}
                </Typography>
              </Box>
            </div>
          </CardBody>
        </CardContainer>
        <ModalBody className="bg-[#e5e7eb] dark:bg-slate-600  md:min-w-[60%] sm:w-full sm:h-full ">
          <ModalContent className="bg-[#e5e7eb]  dark:bg-slate-500   overflow-y-scroll  ">
            <div className="p-0 mb-5 h-full flex flex-col">
              <Box
                sx={{
                  flex: 1,
                  overflowY: "auto",
                  p: 0,
                  mb: 1,
                  height: "calc(100vh - 10px)",
                  scrollbarWidth: "none",
                }}
              >
                <Post fetchUserData={fetchUserData} postId={postId} />
              </Box>
            </div>
          </ModalContent>
        </ModalBody>
      </Modal>

      {/* Modal Component */}
    </>
  );
};

export default PostCard;
