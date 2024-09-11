import { Button, Menu, MenuItem } from "@mui/material";
import { cn } from "../../Utilities/utils";
import { AnimatedTooltip } from "../CommonComponents/AnimatedHoverComponent";
import { MoreVert } from "@mui/icons-material";
import { useState } from "react";
import { useTimeAgo } from "../../hooks/useTimeAgo";

export function CardComponent({
  postDetails,
  author,
  handleRemovePost,
  userId,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const openmenu = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const timeAgo = useTimeAgo(postDetails?.createdAt);
  return (
    <div className="w-full group/card">
      <div
        className={cn(
          "cursor-pointer overflow-hidden relative rounded-md shadow-xl w-full mx-auto backgroundImage flex flex-col justify-between p-4"
        )}
        style={{
          backgroundImage: `url(${postDetails?.image})`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          aspectRatio: "4/3",
        }}
      >
        <div className="absolute w-full h-full top-0 left-0 transition duration-300 flex flex-row justify-end  group-hover/card:bg-black opacity-10"></div>
        <div className="absolute w-full top-0 left-0 transition duration-300 flex flex-row justify-end p-2">
          <Button
            size="small"
            className="m-0 p-0"
            sx={{
              p: 0,
              minWidth: "auto",
              minHeight: "auto",
              zIndex: 20,
            }}
            id="basic-button"
            aria-controls={openmenu ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={openmenu ? "true" : undefined}
            onClick={handleClick}
          >
            <MoreVert
              sx={{
                fontSize: "24px",
                p: 0,
                color: "#1b9cb2",
                backgroundColor: "#cfcfcf57",
                borderRadius: 20,
              }}
            />{" "}
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={openmenu}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            {postDetails?.author === userId && (
              <MenuItem onClick={() => handleRemovePost(postDetails?._id)}>
                Remove post
              </MenuItem>
            )}
            <MenuItem onClick={handleClose}>Report post</MenuItem>
          </Menu>
        </div>
      </div>
      <div className="text-content mt-2">
        <div className="flex flex-row items-center space-x-4 z-10">
          <AnimatedTooltip
            key={`postcomponent-${author._id}`}
            userId={author._id}
          />
          <div className="flex flex-col ml-3">
            <p className="font-normal text-base text-black    dark:text-white relative z-10 ">
              {`${author.firstName} ${author.lastName}`}
            </p>
            <p className="text-sm text-gray-800  dark:text-slate-300">
              {timeAgo}
            </p>
          </div>
        </div>
        <p className="font-normal text-sm text-black   dark:text-white relative z-10 my-4">
          {postDetails?.content}
        </p>
      </div>
    </div>
  );
}
