import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  styled,
} from "@mui/material";
import { ExpandLess } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import Skeleton from "@mui/material/Skeleton";

const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
  borderTopLeftRadius: "5px",
  borderTopRightRadius: "5px",
  maxHeight: "20px",
}));

const OnlinePeopleAccordion = ({ fetchUserData, handleChat }) => {
  const { friends, userData, status } = useSelector((state) => state.friends);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [roomId, setRoomId] = useState({});

  useEffect(() => {
    const newRoomIds = {};

    friends?.forEach((id) => {
      const roomId = [user._id, id].sort().join("");
      newRoomIds[id] = roomId;
    });
    setRoomId((prevState) => ({
      ...prevState,
      ...newRoomIds,
    }));
  }, [friends, user, userData, dispatch]);

  return (
    <Box id="accordion-panel">
      <Accordion
        sx={{
          maxWidth: "300px",
          width: "300px",
          position: "fixed",
          bottom: 0,
          right: 16,
          zIndex: 1000,
        }}
      >
        <StyledAccordionSummary
          expandIcon={<ExpandLess />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          Chats
        </StyledAccordionSummary>
        <AccordionDetails
          sx={{
            mx: 0,
            px: "3px",
          }}
        >
          <Box>
            <Typography variant="h6" gutterBottom>
              Friends
            </Typography>
            <Box
              sx={{
                mx: 0,
                height: "50vh",
                overflowY: "auto",
                scrollbarWidth: "none",
                "&::-webkit-scrollbar": { display: "none" },
              }}
            >
              {status === "loading" ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <Box
                    key={index}
                    className="flex items-center p-1 rounded-lg"
                    sx={{ marginBottom: 1 }}
                  >
                    <Skeleton variant="circular" width={40} height={40}>
                      <Avatar />
                    </Skeleton>
                    <Skeleton width="60%" height={24} sx={{ marginLeft: 2 }} />
                  </Box>
                ))
              ) : friends?.length === 0 ? (
                <Typography variant="body2">No friends.</Typography>
              ) : (
                friends?.map(
                  (person) =>
                    userData[person] && (
                      <Box
                        className="flex items-center p-1 rounded-lg hover:bg-slate-400 cursor-pointer"
                        onClick={() =>
                          handleChat(
                            userData[person]._id,
                            roomId[userData[person]._id]
                          )
                        }
                        key={userData[person]?._id + "chatFriends"}
                      >
                        <Avatar
                          sx={{ marginRight: 1 }}
                          src={userData[person]?.profilePicture}
                        >
                          {userData[person]?.firstName[0]}
                        </Avatar>
                        <Typography>
                          {userData[person]?.firstName}{" "}
                          {userData[person]?.lastName}
                        </Typography>
                      </Box>
                    )
                )
              )}
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default OnlinePeopleAccordion;
