import { fetchUserDetails } from "../../features/friends/friendsAsyncThunks";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Badge,
  Typography,
  Divider,
  Drawer,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  SwipeableDrawer,
  styled,
  alpha,
  InputBase,
  useMediaQuery,
  useTheme,
  Avatar,
} from "@mui/material";
import { Menu, MenuItem, Fade } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
// import Profile from "../HomePageComponents/profile";

import {
  Brightness2Rounded,
  Close,
  ExpandMore,
  LogoutRounded,
  SearchOutlined,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setLogout } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import chatSocket from "../../features/utilities/Socket-io";
import { useResetRecoilState } from "recoil";
import { postsAtom } from "../../atoms/postAtoms";
import { ChatFriendsData, ChatRoomMessages } from "../../atoms/chatAtoms";
import {
  clearNotifications,
  fetchChatFriends,
  getNotifications,
} from "../../features/chats/chatsAsycnThunks";
import { lazy, Suspense, useCallback, useEffect } from "react";
import { useState } from "react";
import _ from "lodash";
import {
  clearChatDefault,
  setFriend,
  setRoomId,
} from "../../features/chats/chatsSlice";
import PostNotification from "./postCardNotifcation";
import { convertUTCToIST } from "../../pages/Utilitis";
// import Suggestions from "../HomePageComponents/suggestions";
const Profile = lazy(() => import("../HomePageComponents/profile"));
const Suggestions = lazy(() => import("../HomePageComponents/suggestions"));
const BACKEND = process.env.REACT_APP_USER_BACKEND;

export default function Header() {
  const { user } = useSelector((state) => state.user);
  const { chatFriends, notifications } = useSelector((state) => state.chats);
  const { userData } = useSelector((state) => state.friends);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const postReset = useResetRecoilState(postsAtom);
  const chatfriendsReset = useResetRecoilState(ChatFriendsData);
  const chatmessageReset = useResetRecoilState(ChatRoomMessages);
  const [unreadChatsCount, setUreadChatsCount] = useState(0);
  const [expanded, setExpanded] = useState("panel1");

  const [anchorElMessage, setAnchorElMessage] = useState(null);
  const [anchorElNotifcation, setAnchorElNotification] = useState(null);
  const open = Boolean(anchorElMessage);
  const openNotification = Boolean(anchorElNotifcation);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationDisplay, setNotificationDisplay] = useState(false);
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);

  // const [postId, setPostId] = useState(null);

  const fetchUserData = (id) => {
    if (!userData[id]) {
      dispatch(fetchUserDetails(id));
    }
  };

  const handleClearNotifications = async () => {
    await dispatch(clearNotifications());
  };

  const handleNotificationClick = async (notification) => {
    if (notification?.type == "request_accepted") {
      navigate(`/profile/${notification.sender[0]}`);
    }
  };

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  useEffect(() => {
    dispatch(getNotifications());
  }, []);

  useEffect(() => {
    const unread =
      chatFriends?.filter((friend) => friend.unreadCount > 0).length || 0;
    setUreadChatsCount(unread);
  }, [chatFriends]);

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const handleClickNotification = async (event) => {
    setAnchorElNotification(event.currentTarget);
    await dispatch(getNotifications());
  };
  const handleClick = async (event) => {
    setAnchorElMessage(event.currentTarget);
    await dispatch(fetchChatFriends());
  };

  const handleCloseNotifications = () => {
    setAnchorElNotification(null);
  };
  const handleClose = () => {
    setAnchorElMessage(null);
  };

  const handleSearchInput = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length == 0) setUsers([]);
  };

  const fetchUsers = async (query) => {
    if (!query) return;
    try {
      const response = await fetch(`${BACKEND}/search?search=${query}`, {
        credentials: "include",
      });
      const data = await response.json();
      // console.log(data);

      setUsers(data.result);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Debounced version of the fetchUsers function
  const debouncedFetchUsers = useCallback(_.debounce(fetchUsers, 500), []);

  // Trigger the debounced fetch when searchQuery changes
  useEffect(() => {
    debouncedFetchUsers(searchQuery);
    // Cleanup function to cancel debounce on component unmount
    return () => {
      debouncedFetchUsers.cancel();
    };
  }, [searchQuery, debouncedFetchUsers]);
  const handleLogout = async () => {
    chatSocket.emit("logout");
    postReset();
    chatfriendsReset();
    chatmessageReset();
    dispatch(setLogout());
  };

  // const isMenuOpen = Boolean(anchorEl);
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
  const searchList = (
    <div className="relative rounded-lg bg-gray-700 w-full sm:w-auto">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <SearchOutlined className="text-white dark:text-black" />
      </div>
      <input
        value={searchQuery}
        onChange={handleSearchInput}
        type="search"
        className="block w-full pl-10 pr-3 py-2 rounded-lg bg-gray-800 dark:bg-slate-400 text-white dark:text-black placeholder-gray-400 dark:placeholder:text-black focus:outline-none focus:ring focus:ring-gray-500"
        placeholder="Search..."
      />

      {users.length > 0 && (
        <div className="absolute bg-gray-700 dark:bg-slate-500 mt-2 rounded-lg shadow-lg z-10 w-full max-h-80 overflow-scroll scrollbar-none">
          {users.map((user) => (
            <div
              key={`search-${user._id}`}
              className="flex items-center p-2 hover:bg-gray-600 cursor-pointer transition duration-300 rounded-lg"
              onClick={() => {
                setSearchQuery("");
                setUsers([]);
                navigate(`/profile/${user._id}`);
              }}
            >
              <Avatar
                src={user.profilePicture}
                className="object-cover rounded-full h-10 w-10 border-2 border-white mr-3"
                alt={`${user.firstName} ${user.lastName}`}
              >
                {user.firstName && user.firstName[0]}
              </Avatar>
              <div className="flex flex-col">
                <Typography className="text-white dark:text-black font-semibold">
                  {user.firstName} {user.lastName}
                </Typography>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const drawer = (
    <Suspense>
      <Box sx={{ textAlign: "center", position: "relative" }}>
        <Button
          onClick={handleDrawerToggle}
          sx={{ padding: 0, position: "absolute", right: -20 }}
        >
          <Close />
        </Button>

        <img
          className="dark:bg-gray-400 dark:rounded-lg mx-auto py-2"
          onClick={() => navigate("/")}
          style={{ height: "60px" }}
          alt="Logo"
          src="/circulo.png"
        />
        <Divider />
        {searchList}
        <div>
          <Accordion
            expanded={expanded === "panel1"}
            onChange={handleChange("panel1")}
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <Typography
                sx={{ width: "100%", textAlign: "left", flexShrink: 0 }}
              >
                Profile
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ padding: 0 }}>
              <Profile fetchUserData={fetchUserData} />
            </AccordionDetails>
          </Accordion>
          <Accordion
            expanded={expanded === "panel2"}
            onChange={handleChange("panel2")}
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              aria-controls="panel2bh-content"
              id="panel2bh-header"
            >
              <Typography
                sx={{ width: "100%", textAlign: "left", flexShrink: 0 }}
              >
                Requests and suggestions
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ padding: 0 }}>
              <Suggestions fetchUserData={fetchUserData} />
            </AccordionDetails>
          </Accordion>
        </div>
      </Box>
    </Suspense>
  );

  const RenderNotificatons = (
    <Box className="bg-slate-100 dark:bg-gray-600 text-gray-900 dark:text-gray-200 p-2 rounded-md  ">
      {notifications && notifications?.length ? (
        <>
          <div className="max-h-60 overflow-y-scroll overflow-x-hidden scrollbar-none">
            {notifications.map((noti) => {
              switch (noti.type) {
                case "comment":
                  return (
                    <PostNotification
                      postId={noti?.contentId}
                      fetchUserData={fetchUserData}
                      key={noti.notificationId}
                      notification={noti}
                    />
                  );

                case "reply":
                  return (
                    <PostNotification
                      postId={noti?.contentId}
                      fetchUserData={fetchUserData}
                      key={noti.notificationId}
                      notification={noti}
                    />
                  );

                case "like":
                  return (
                    <PostNotification
                      postId={noti?.contentId}
                      fetchUserData={fetchUserData}
                      key={noti.notificationId}
                      notification={noti}
                    />
                  );

                case "request_accepted":
                  return (
                    <MenuItem
                      key={noti.notificationId}
                      className="mx-auto"
                      onClick={() => handleNotificationClick(noti)}
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
                      {userData[noti.sender[0]]?.firstName} {noti.message}
                      <span className="text-xs">
                        {convertUTCToIST(noti?.createdAt)}
                      </span>
                    </MenuItem>
                  );

                // default:
                //   return (
                //     <MenuItem
                //       key={noti.notificationId}
                //       className="mx-auto"
                //       onClick={() => handleNotificationClick(noti)}
                //       sx={{
                //         backgroundColor: "#bbb",
                //         fontSize: 14,
                //         height: 50,
                //         display: "flex",
                //         justifyContent: "space-between",
                //         alignItems: "center",
                //         borderRadius: 1,
                //         marginBottom: "5px",
                //       }}
                //     >
                //       {userData[noti.sender[0]]?.firstName} {noti?.message}
                //     </MenuItem>
                //   );
              }
            })}
          </div>
          <MenuItem
            onClick={handleClearNotifications}
            sx={{
              width: "100%",
              fontSize: 14,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderRadius: 1,
              marginBottom: "5px",
            }}
          >
            <span className="mx-auto font-bold">Clear notifications</span>
          </MenuItem>
        </>
      ) : (
        <MenuItem
          sx={{
            display: "flex",
            mx: "auto",
            justifyContent: "space-between",
            height: 100,
            width: 300,

            textAlign: "center",
          }}
        >
          <span className="mx-auto ">No notification</span>
        </MenuItem>
      )}
    </Box>
  );
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
      sx={{ "& .MuiPaper-root": { backgroundColor: "#c0c5d4ba" } }}
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
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
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
          {!isMobile && <>{searchList}</>}

          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <IconButton
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
              slotProps={{
                paper: {
                  sx: { borderRadius: 3 },
                },
              }}
              MenuListProps={{
                sx: { margin: 0, padding: 0 },
                "aria-labelledby": "basic-button",
              }}
            >
              <Box className="bg-slate-200 dark:bg-gray-800 text-gray-900 dark:text-gray-200 p-2">
                <Box
                  className="bg-slate-100 dark:bg-gray-600 text-gray-900 dark:text-gray-200 p-2 rounded-md "
                  sx={{
                    maxHeight: "200px",
                    overflowY: "scroll",
                    scrollbarWidth: "none",
                  }}
                >
                  {chatFriends.length ? (
                    chatFriends.map(
                      (friend, index) =>
                        userData[friend._id] && (
                          <MenuItem
                            onClick={() => {
                              dispatch(setFriend(friend._id));
                              dispatch(setRoomId(friend.roomId));
                              navigate("/chats");
                            }}
                            sx={{
                              width: 300,
                              height: 50,
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              fontWeight:
                                friend.unreadCount === 0 ? "100" : "bold",
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
                        )
                    )
                  ) : (
                    <MenuItem
                      sx={{
                        backgroundColor: "#054b7321",
                        width: 300,
                        textAlign: "center",
                        alignContent: "center",
                        height: "100px",
                      }}
                    >
                      You have no messages
                    </MenuItem>
                  )}
                </Box>

                <MenuItem
                  onClick={() => {
                    dispatch(clearChatDefault());
                    navigate("/chats");
                  }}
                >
                  <span className="mx-auto font-bold">Inbox</span>
                </MenuItem>
              </Box>
              {/*
              <MenuItem onClick={handleClose}>My account</MenuItem>
              <MenuItem onClick={handleClose}>Logout</MenuItem> */}
            </Menu>
            <IconButton
              id="notification-button"
              aria-controls={openNotification ? "notifications" : undefined}
              aria-haspopup="true"
              aria-expanded={openNotification ? "true" : undefined}
              size="large"
              color="inherit"
              onClick={handleClickNotification}
            >
              <Badge badgeContent={notifications?.length} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <Menu
              id="notifications"
              anchorEl={anchorElNotifcation}
              open={openNotification}
              onClose={handleCloseNotifications}
              slotProps={{
                paper: {
                  sx: { borderRadius: 3 },
                },
              }}
              MenuListProps={{
                sx: { margin: 0, padding: 0 },
                "aria-labelledby": "notification-button",
              }}
            >
              <Box
                className="bg-slate-200 m-0  dark:bg-gray-800 text-gray-900 dark:text-gray-200 p-2 rounded-lg "
                sx={{
                  overflowY: "scroll",
                  scrollbarWidth: "none",
                }}
              >
                {RenderNotificatons}
              </Box>
            </Menu>
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
              <Badge badgeContent={unreadChatsCount} color="error">
                <MailIcon />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              aria-label="show notifications"
              color="inherit"
              onClick={async () => {
                await dispatch(getNotifications());
                setNotificationDisplay(true);
              }}
            >
              <Badge badgeContent={notifications?.length} color="error">
                <NotificationsIcon />
              </Badge>
              <SwipeableDrawer
                anchor={"bottom"}
                open={notificationDisplay}
                onClose={() => setNotificationDisplay(false)}
                onOpen={() => setNotificationDisplay(true)}
                sx={{
                  "& .MuiPaper-root": {
                    transform: "none !important",
                    height: 300,
                  },
                }}
              >
                <div className="relative w-full h-full">
                  <div className="w-12 h-1.5 bg-gray-400 rounded-full mx-auto my-2"></div>
                  {RenderNotificatons}
                </div>
              </SwipeableDrawer>
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
      <nav>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: 300,
            },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
      {renderMobileMenu}
    </Box>
  );
}
