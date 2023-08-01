import React, { useState, useEffect, useRef } from "react";
import classes from "./Modal.module.scss";
import searchIcon from "../assets/images/searchIcon.png";
import usersData from "./usersdata";
import userImg from "../assets/images/chat_img/userImg.png";
import check from "../assets/images/chat_img/check.png";
import circle from "../assets/images/chat_img/circle.png";
import checkImg from "../assets/images/chat_img/checkImg.png";
import ellipse from "../assets/images/Freelancer/frilancer_ellipse.png";
import { BsThreeDotsVertical } from "react-icons/bs";
import { RiCloseLine } from "react-icons/ri";
import DefaultMessageBlock from "./components/DefaultMessageBlock";
import ThreeDotsContent from "./components/threeDots/ThreeDotsContent";
import Media from "./components/threeDots/media/Media";
import Files from "./components/threeDots/files/Files";
import Links from "./components/threeDots/links/Links";
import Round from "../components/Round/Round";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import {
  allUsersRoute,
  getOfflineUsers,
  host,
  logoutRoute,
} from "../utils/APIRoutes";
import axios from "axios";

function ChatModal({ setIsOpen }) {
  const socket = useRef();
  const [currentChat, setCurrentChat] = useState(null);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [contacts, setContacts] = useState([]);
  const [currentSelected, setCurrentSelected] = useState(undefined);
  const [offlineUsers, setOfflineUsers] = useState([]);

  const navigate = useNavigate();

  var userActiveTime = new Date().getHours() + ":" + new Date().getMinutes();

  const [searchField, setSearchField] = useState("");
  const [talents, setTalents] = useState([]);
  const [filteredTalents, setFilterTalents] = useState(talents);
  const [threeDots, setOpenThreeDots] = useState(false);
  const [isRead, setIsRead] = useState(false);
  useEffect(() => {
    setTalents(usersData);
  }, []);

  useEffect(() => {
    const newFilteredTalents = talents.filter((talent) => {
      return talent.userName?.toLocaleLowerCase().includes(searchField);
    });
    setFilterTalents(newFilteredTalents);
  }, [talents, searchField]);

  const onSearchChange = (event) => {
    const searchFieldString = event.target.value?.toLocaleLowerCase();
    setSearchField(searchFieldString);
  };

  function openDotsContent() {
    setOpenThreeDots((current) => !current);
  }

  const [count, setCount] = useState(1);

  let step1 = false,
    step2 = false,
    step3 = false,
    step4 = false;

  switch (count) {
    case 1:
      step1 = true;
      break;
    case 2:
      step2 = true;
      break;
    case 3:
      step3 = true;
      break;
    case 4:
      step4 = true;
      break;

    default:
      step1 = true;
  }

  // Set current user
  useEffect(() => {
    async function HandleFunc() {
      if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
        navigate("/login");
      } else {
        setCurrentUser(
          await JSON.parse(
            localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
          )
        );
      }
    }

    HandleFunc();
  }, []);

  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);

  useEffect(() => {
    async function handle() {
      if (currentUser) {
        const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
        setContacts(data.data);
      }
    }
    handle();
  }, [currentUser]);
  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };

  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    handleChatChange(contact);
  };

  const handleLogOut = async () => {
    const id = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    )._id;
    const data = await axios.get(`${logoutRoute}/${id}`);
    if (data.status === 200) {
      localStorage.clear();
      navigate("/login");
    }
  };
  // get offline user from database
  useEffect(() => {
    async function getUser() {
      const data = await axios.get(`${getOfflineUsers}`);
      if (data.status === 200) {
        if (offlineUsers) {
          data.data.forEach((item) => {
            if (item.isActive === false) {
              setOfflineUsers((prev) => [...prev, item._id]);
            }
          });
        } else {
          data.data.forEach((item) => {
            setOfflineUsers([item._id]);
          });
        }
      }
    }

    getUser();
  }, []);

  // set user online or offline
  useEffect(() => {
    if (currentUser) {
      socket.current.emit("online", { userId: currentUser?._id });
    }
  }, [socket.current]);

  useEffect(() => {
    if (socket.current) {
      socket.current.on("set-offline-users", (id) => {
        if (offlineUsers) {
          setOfflineUsers((prev) => [...prev, id]);
        } else {
          setOfflineUsers([id]);
        }
      });
      socket.current.on("set-online-user", (id) => {
        setOfflineUsers(offlineUsers.filter((user) => user === id));
      });
    }
  }, [socket.current]);

  console.log(currentChat);
  return (
    <div className={classes.modalM}>
      <img src={ellipse} alt="" />
      <div className={classes.modalMain}>
        <div className={classes.centered}>
          <div className={classes.modal}>
            <div className={classes.closeBtnCon}>
              <button className={classes.closeBtn} onClick={handleLogOut}>
                <RiCloseLine />
              </button>
            </div>

            <div className={classes.modalContent}>
              <div className={classes.modalChatUsers}>
                <div className={classes.modalChatUsersSearch}>
                  <form action="submit">
                    <input
                      type="text"
                      placeholder="Search..."
                      required
                      onChange={onSearchChange}
                    />
                    <button type="submit">
                      <img src={searchIcon} alt="search Icon" />
                    </button>
                  </form>
                </div>

                <div className={classes.modalChatUsersList}>
                  <div className={classes.box}>
                    {contacts.map((contact, index) => (
                      <div
                        className={`${classes.userBlock} ${
                          index === currentSelected ? classes.active : ""
                        } `}
                        key={index}
                        id={index}
                        onClick={() => changeCurrentChat(index, contact)}
                      >
                        <div className={classes.userInfo}>
                          <img
                            src={`data:image/png;base64,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`}
                            alt="User logo"
                            className={classes.userLogo}
                          />
                          <div className={classes.userNameDescription}>
                            <span className={classes.userName}>
                              {contact.username}{" "}
                              <img src={checkImg} alt="Check" />
                            </span>
                            <span className={classes.userDescription}>
                              {/* {contact.description} */}
                            </span>
                          </div>
                        </div>
                        <div className={classes.userActiveTime}>
                          <span className={classes.userTime}>
                            {userActiveTime}
                          </span>
                          <span>
                            <img src={check} alt="Check" />
                            {isRead && <img src={circle} alt="Check" />}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className={classes.modalChatContent}>
                {currentChat ? (
                  <div className={classes.modalChatContentHeader}>
                    <div className={classes.userInfo}>
                      <img
                        src={userImg}
                        alt="User Logo"
                        className={classes.userLogo}
                      />
                      <div className={classes.userNameAndStatus}>
                        <span className={classes.userName}>
                          <span>{currentChat?.username} </span>
                          <img src={checkImg} alt="Check Img" />
                        </span>
                        <span className={classes.userStatus}>
                          {offlineUsers.includes(currentChat._id)
                            ? "Offline"
                            : "Online"}
                        </span>
                      </div>
                    </div>
                    <div
                      className={classes.threeDots}
                      onClick={() => openDotsContent()}
                    >
                      <BsThreeDotsVertical />
                    </div>
                    {threeDots ? (
                      <ThreeDotsContent
                        step2={step2}
                        step3={step3}
                        step4={step4}
                        setCount={setCount}
                      />
                    ) : (
                      threeDots && null
                    )}
                  </div>
                ) : (
                  ""
                )}
                <div className={classes.modalMessageContainer}>
                  {step1 && (
                    <DefaultMessageBlock
                      currentChat={currentChat}
                      socket={socket}
                    />
                  )}
                  {step2 && (
                    <Media
                      setCount={setCount}
                      openDotsContent={openDotsContent}
                    />
                  )}
                  {step3 && (
                    <Files
                      setCount={setCount}
                      openDotsContent={openDotsContent}
                    />
                  )}
                  {step4 && (
                    <Links
                      setCount={setCount}
                      openDotsContent={openDotsContent}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={classes.circle}>
          <Round />
        </div>
      </div>
    </div>
  );
}

export default ChatModal;
