import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Badge,
  styled,
} from "@mui/material";
import { ExpandLess, Mail } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import Skeleton from "@mui/material/Skeleton";
import { setReadMessages } from "../../features/chats/chatsSlice";

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
  const { chatFriends } = useSelector((state) => state.chats);

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

  const sortedFriends = friends?.slice().sort((a, b) => {
    const userA = userData[a];
    const userB = userData[b];

    const statusA = userA?.onlineStatus ? 1 : 0;
    const statusB = userB?.onlineStatus ? 1 : 0;

    return statusB - statusA || (userA?._id > userB?._id ? 1 : -1);
  });

  const unreadStatus = (data) => {
    const userData = chatFriends.filter((friend) => friend._id === data);
    if (userData.length > 0) {
      return userData[0].unreadCount;
    } else return 0;
  };

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
                sortedFriends?.map(
                  (person) =>
                    userData[person] && (
                      <Box
                        className={`flex items-center p-1 rounded-lg hover:bg-slate-400 cursor-pointer ${
                          unreadStatus(person) ? "bg-red-200" : ""
                        }`}
                        onClick={() => {
                          dispatch(setReadMessages(person));
                          handleChat(person, userData[person].roomId);
                        }}
                        key={person + "chatFriends"}
                      >
                        <Badge
                          overlap="circular"
                          anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right",
                          }}
                          variant="dot"
                          sx={{
                            zIndex: 0,
                            "& .MuiBadge-dot": {
                              backgroundColor: userData[person]?.onlineStatus
                                ? "#44b700"
                                : "#808080",
                              boxShadow: `0 0 0 2px #fff`,
                            },
                          }}
                        >
                          <Avatar
                            sx={{ marginRight: 1 }}
                            src={userData[person]?.profilePicture}
                          >
                            {userData[person]?.firstName[0]}
                          </Avatar>
                        </Badge>
                        <Typography>
                          {userData[person]?.firstName}{" "}
                          {userData[person]?.lastName}
                        </Typography>
                        <span className="text-xs ml-auto mr-2">
                          {unreadStatus(person) === 0 ? (
                            ""
                          ) : (
                            <div className="relative inline-block">
                              <span className=" top-0 right-0 inline-flex items-center justify-center p-2 h-6 w-6 bg-red-500 text-white rounded-full text-xs font-bold animate-bounce">
                                {unreadStatus(person)}
                              </span>
                            </div>
                          )}
                        </span>
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
