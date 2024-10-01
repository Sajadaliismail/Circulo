import React, { useCallback, useEffect, useState } from "react";
import {
  motion,
  useTransform,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { Avatar, Badge } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserDetails } from "../../features/friends/friendsAsyncThunks";
import { useNavigate } from "react-router-dom";

export const AnimatedTooltip = ({ userId, size = 45, fontS = 20 }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const { userData } = useSelector((state) => state.friends);
  const dispatch = useDispatch();

  const fetchUserData = useCallback(
    (id) => {
      if (!userData[id]) {
        dispatch(fetchUserDetails(id));
      }
    },
    [userData, dispatch]
  );
  useEffect(() => {
    fetchUserData(userId);
  }, []);
  const springConfig = { stiffness: 100, damping: 5 };
  const x = useMotionValue(0);

  const rotate = useSpring(
    useTransform(x, [-100, 100], [-45, 45]),
    springConfig
  );
  const translateX = useSpring(
    useTransform(x, [-100, 100], [-50, 50]),
    springConfig
  );

  const handleMouseMove = (event) => {
    const halfWidth = event.target.offsetWidth / 2;
    x.set(event.nativeEvent.offsetX - halfWidth);
  };

  if (!userData[userId]) return null;

  return (
    <div
      className="-mr-4 relative group"
      onMouseEnter={() => {
        setIsHovered(true);
      }}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence mode="popLayout">
        {isHovered && (
          <motion.div
            onClick={() => navigate(`/profile/${userId}`)}
            initial={{ opacity: 0, y: 20, scale: 0.6 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              transition: {
                type: "spring",
                stiffness: 260,
                damping: 10,
              },
            }}
            exit={{ opacity: 0, y: 20, scale: 0.6 }}
            style={{
              translateX: translateX,
              rotate: rotate,
              whiteSpace: "nowrap",
            }}
            className="absolute -top-16 -left-1/2 translate-x-1/2 flex text-xs flex-col items-center justify-center rounded-md bg-black z-50 shadow-xl px-4 py-2"
          >
            <div className="absolute inset-x-10 z-100 w-[20%] -bottom-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent h-px" />
            <div className="absolute left-10 w-[40%] z-100 -bottom-px bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px" />
            <div className="font-bold text-white relative z-100 text-base">
              {userData[userId]?.firstName} {userData[userId]?.lastName}
            </div>
            <div className="text-white text-xs">
              {userData[userId]?.city}, {userData[userId]?.state},{" "}
              {userData[userId]?.country}
            </div>
            <div className="text-white text-xs">
              {userData[userId]?.distance.toFixed(2)} {"km"}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <Badge
        overlap="circular"
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        variant="dot"
        sx={{
          zIndex: 0,
          "& .MuiBadge-dot": {
            backgroundColor: userData[userId]?.onlineStatus
              ? "#44b700"
              : "#808080",
            boxShadow: `0 0 0 2px #fff`,
          },
        }}
      >
        <Avatar
          onMouseMove={handleMouseMove}
          sx={{ width: size, height: size, fontSize: fontS }}
          src={userData[userId]?.profilePicture}
          className="object-cover !m-0 !p-0 object-top rounded-full h-14 w-14 border-2 group-hover:scale-105 group-hover:z-100 border-white relative transition duration-500"
        >
          {userData[userId]?.firstName && userData[userId]?.firstName[0]}
        </Avatar>
      </Badge>
    </div>
  );
};
