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
import { useSelector } from "react-redux";

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
  const { friends } = useSelector((state) => state.friends);
  const [onlinePeople, setOnlinePeople] = useState([]);

  useEffect(() => {
    setOnlinePeople(friends);
  }, [friends]);

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
              {onlinePeople.map((person) => (
                <Box
                  className="flex items-center p-1 rounded-lg hover:bg-slate-400 cursor-pointer"
                  onClick={() => handleChat(person)}
                  key={person.id}
                  onMouseOver={() => fetchUserData(person.id)}
                >
                  <Avatar sx={{ marginRight: 1 }} src={person?.profilePicture}>
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
  );
};

export default OnlinePeopleAccordion;
