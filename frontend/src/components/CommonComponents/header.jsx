import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Badge,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { Menu, MenuItem, Fade } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import { Brightness2Rounded, LogoutRounded } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setLogout } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import chatSocket from "../../features/utilities/Socket-io";
import { useResetRecoilState } from "recoil";
import { postsAtom } from "../../atoms/postAtoms";
import { ChatFriendsData, ChatRoomMessages } from "../../atoms/chatAtoms";
import { fetchChatFriends } from "../../features/chats/chatsAsycnThunks";
import { useEffect } from "react";
import { useState } from "react";

export default function Header() {
  const { user } = useSelector((state) => state.user);
  const { chatFriends } = useSelector((state) => state.chats);
  const { userData } = useSelector((state) => state.friends);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const postReset = useResetRecoilState(postsAtom);
  const chatfriendsReset = useResetRecoilState(ChatFriendsData);
  const chatmessageReset = useResetRecoilState(ChatRoomMessages);
  const [unreadChatsCount, setUreadChatsCount] = useState(0);
  useEffect(() => {
    const unread =
      chatFriends?.filter((friend) => friend.unreadCount > 0).length || 0;
    setUreadChatsCount(unread);
  }, [chatFriends]);

  const [anchorElMessage, setAnchorElMessage] = React.useState(null);
  const open = Boolean(anchorElMessage);
  const handleClick = async (event) => {
    setAnchorElMessage(event.currentTarget);
    await dispatch(fetchChatFriends());
  };
  const handleClose = () => {
    setAnchorElMessage(null);
  };

  const handleLogout = async () => {
    chatSocket.emit("logout");
    postReset();
    chatfriendsReset();
    chatmessageReset();
    dispatch(setLogout());
  };

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = "primary-search-account-menu";
  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      MenuListProps={{ "aria-labelledby": "fade-button" }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
      TransitionComponent={Fade}
      sx={{ "& .MuiPaper-root": { backgroundColor: "slategray" } }}
    >
      <MenuItem
        onClick={() => {
          navigate(`/profile/${user._id}`);
          handleMobileMenuClose();
        }}
      >
        <IconButton aria-label="account of current user" color="inherit">
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
      <MenuItem
        onClick={() => {
          toggleDarkMode();
          handleMobileMenuClose();
        }}
      >
        <IconButton aria-label="toggle dark mode" color="inherit">
          <Brightness2Rounded />
        </IconButton>
        <p>Mode</p>
      </MenuItem>
      <MenuItem onClick={handleLogout}>
        <IconButton color="inherit">
          <LogoutRounded />
        </IconButton>
        <p>Logout</p>
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar className="bg-cyan-700 dark:bg-slate-700">
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <img
            className="dark:bg-gray-400 dark:rounded-lg"
            onClick={() => navigate("/")}
            style={{ height: "45px" }}
            alt="Logo"
            src="/circulo.png"
          />
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <IconButton
              // onClick={() => navigate("/chats")}
              id="basic-button"
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
              size="large"
              aria-label="show 4 new mails"
              color="inherit"
            >
              <Badge badgeContent={unreadChatsCount} color="error">
                <MailIcon />
              </Badge>
            </IconButton>
            <Menu
              id="basic-menu"
              anchorEl={anchorElMessage}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              {chatFriends &&
                chatFriends.map((friend, index) => (
                  <MenuItem
                    sx={{
                      width: 300,
                      height: 50,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontWeight: friend.unreadCount === 0 ? "100" : "bold",
                      bgcolor:
                        friend.unreadCount > 0
                          ? "rgba(255,0,0,0.1)"
                          : "transparent",
                    }}
                    key={index}
                  >
                    <Box display="flex" alignItems="center">
                      {userData[friend._id]?.firstName}
                    </Box>

                    {friend.unreadCount === 0 && (
                      <span
                        className="ml-auto"
                        style={{
                          fontSize: 12,
                          color: "gray",
                        }}
                      >
                        (Read)
                      </span>
                    )}
                    {friend.unreadCount > 0 && (
                      <>
                        <span style={{ fontSize: 14 }}>
                          {friend?.unreadCount} new messages
                        </span>
                        <Badge
                          color="error"
                          variant="dot"
                          sx={{ marginRight: 2 }}
                        ></Badge>
                      </>
                    )}
                  </MenuItem>
                ))}

              <MenuItem onClick={() => navigate("/chats")}>
                See all messages
              </MenuItem>
              {/*
              <MenuItem onClick={handleClose}>My account</MenuItem>
              <MenuItem onClick={handleClose}>Logout</MenuItem> */}
            </Menu>
            <IconButton
              size="large"
              aria-label="show 17 new notifications"
              color="inherit"
            >
              <Badge badgeContent={17} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              color="inherit"
              onClick={() => navigate(`/profile/${user._id}`)}
            >
              <AccountCircle />
            </IconButton>
            <IconButton color="inherit" onClick={toggleDarkMode}>
              <Brightness2Rounded />
            </IconButton>
            <IconButton color="inherit" onClick={handleLogout}>
              <LogoutRounded />
            </IconButton>
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              onClick={() => navigate("/chats")}
              size="large"
              aria-label="show 4 new mails"
              color="inherit"
            >
              <Badge badgeContent={4} color="error">
                <MailIcon />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              aria-label="show 17 new notifications"
              color="inherit"
            >
              <Badge badgeContent={17} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      <Box sx={{ padding: 2 }}></Box>
    </Box>
  );
}
