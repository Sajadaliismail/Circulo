import { Box, MenuItem, Typography } from "@mui/material";
import { useRecoilState } from "recoil";
import { postDetailFamily } from "../../atoms/postAtoms";
import { fetchPostData } from "../../fetchRequests/posts";
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
import { convertUTCToIST } from "../../pages/Utilitis";

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
          return;
        }
      } catch (error) {
        console.error(error.message);
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
          <CardBody>
            <CardItem>
              <ModalTrigger className="m-0 p-0 w-96">
                <MenuItem
                  key={notification?.notificationId}
                  className="mx-auto"
                  onClick={() => handleOpen()}
                  sx={{
                    backgroundColor: "#b1d2fd",
                    fontSize: 14,
                    height: 50,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderRadius: 1,
                    marginBottom: "5px",
                  }}
                >
                  {userData[notification?.sender[0]]
                    ? userData[notification?.sender[0]].firstName
                    : "Someone"}{" "}
                  {notification?.sender.length > 1 ? "and others " : ""}
                  {notification?.message}
                  <span className="text-xs">
                    {convertUTCToIST(notification?.createdAt)}
                  </span>
                </MenuItem>
              </ModalTrigger>
            </CardItem>
          </CardBody>
        </CardContainer>
        <ModalBody className="bg-white md:min-w-[60%] sm:w-full sm:h-full p-0 m-0">
          <ModalContent className="bg-white overflow-y-scroll w-full p-0 m-0">
            <div className="p-1 mb-5 h-full flex flex-col">
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
