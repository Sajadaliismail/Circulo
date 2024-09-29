import { Box, MenuItem, Typography } from "@mui/material";
import { useRecoilState } from "recoil";
import { postDetailFamily } from "../../atoms/postAtoms";
import { fetchPostData } from "../../fetchRequests/posts";
import { Comment, Favorite, FavoriteOutlined } from "@mui/icons-material";
import Post from "../HomePageComponents/post";
import {
  CardContainer,
  CardBody,
  CardItem,
} from "../UserPageComponents/sample";
import { useEffect, useState } from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalTrigger,
} from "../UserPageComponents/AnimatedModal";
import { useSelector } from "react-redux";

const PostNotification = ({ postId, fetchUserData, notification }) => {
  const { userData } = useSelector((state) => state.friends);

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
          // className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-[#e5e5e5]   dark:border-white/[0.2] border-black/[0.1] h-auto rounded-xl p-3 border"
          // sx={{
          //   width: "100%",
          //   maxWidth: { xs: "100%", sm: "30rem", md: "40rem", lg: "50rem" },
          // }}
          >
            <CardItem>
              <ModalTrigger className="m-0 p-0 w-96">
                <MenuItem
                  key={notification.notificationId}
                  className="mx-auto"
                  onClick={() => handleOpen()}
                  sx={{
                    backgroundColor: "#e57d7d",
                    fontSize: 14,
                    height: 50,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderRadius: 1,
                    marginBottom: "5px",
                  }}
                >
                  {userData[notification.sender[0]]?.firstName}{" "}
                  {notification.message}
                </MenuItem>
              </ModalTrigger>
            </CardItem>
          </CardBody>
        </CardContainer>
        <ModalBody className="bg-white md:min-w-[60%] sm:w-full sm:h-full">
          <ModalContent className="bg-white overflow-y-scroll w-full ">
            <div className="p-4 mb-5 h-full flex flex-col">
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

export default PostNotification;
