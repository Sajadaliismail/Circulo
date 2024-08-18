import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { sampleData } from "./sample";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  styled,
} from "@mui/material";
import { BorderAllRounded, ExpandLess } from "@mui/icons-material";
import { useSelector } from "react-redux";

const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
  borderTopLeftRadius: "8px",
  borderTopRightRadius: "8px",
}));

const OnlinePeopleAccordion = ({
  conversationsOpened,
  // openConversation,
  handleChat,
}) => {
  const { friends } = useSelector((state) => state.friends);
  const [onlinePeople, setOnlinePeople] = useState([]);
  useEffect(() => {
    setOnlinePeople(friends);
  }, [friends]);

  // const handleConversationClick = (id) => {
  //   openConversation(id);
  // };

  return (
    <>
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
          <AccordionDetails>
            <Box>
              <Typography variant="h6" gutterBottom>
                Friends
              </Typography>
              <Box>
                {onlinePeople.map((person) => (
                  <Box
                    onClick={() => {
                      handleChat(person);
                      // handleConversationClick(person.id);
                    }}
                    key={person.id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: 1,
                    }}
                  >
                    <Avatar
                      sx={{ marginRight: 1 }}
                      src={person?.profilePicture}
                    >
                      {person?.firstName[0]}
                    </Avatar>
                    <Typography>
                      {person.firstName} {person.lastName}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>
      </Box>
    </>
  );
};

export default OnlinePeopleAccordion;
