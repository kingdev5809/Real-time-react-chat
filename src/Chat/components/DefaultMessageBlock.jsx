import React, { useEffect, useState } from "react";

import { useRef } from "react";
import fileAttachImg from "../../assets/images/chat_img/fileAttachImg.png";
import classes from "./DefaultMessageBlock.module.scss";
import axios from "axios";
import { sendMessageRoute, recieveMessageRoute } from "../../utils/APIRoutes";
import moment from "moment/moment";
import checkIcon from "../../assets/checkIcon.png";

function DefaultMessageBlock({ currentChat, socket }) {
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();
  const scrollBottom = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [fromUserMessage, setFromUserMessage] = useState(null);

  const [user, setUser] = useState(null);

  const hiddenFileInput = useRef(null);
  const inputReset = useRef(null);
  const [msg, setMsg] = useState("");

  const [picture, setPicture] = useState(null);
  const [imgData, setImgData] = useState(null);

  const onChangePicture = (e) => {
    if (e.target.files[0]) {
      console.log("picture: ", e.target.files);
      setPicture(e.target.files[0]);
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImgData(reader.result);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const sendChat = (event) => {
    event.preventDefault();

    if (msg.length > 0) {
      handleSendMsg(msg);
      setMsg("");
    }
  };

  useEffect(() => {
    async function HandleSetUser() {
      const data = await JSON.parse(
        localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
      );
      setUser(data);
    }
    HandleSetUser();
  }, [messages]);

  useEffect(() => {
    async function createChat() {
      const data = await JSON.parse(
        localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
      );
      const response = await axios.post(recieveMessageRoute, {
        from: data?._id,
        to: currentChat?._id,
      });
      setMessages(response.data);
    }
    createChat();
  }, [currentChat]);

  // get current chat
  useEffect(() => {
    const getCurrentChat = async () => {
      if (currentChat) {
        await JSON.parse(
          localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
        )._id;
      }
    };
    getCurrentChat();
  }, [currentChat]);

  // send mesage
  const handleSendMsg = async (msg) => {
    const data = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    );
    socket.current.emit("send-msg", {
      to: currentChat?._id,
      from: data._id,
      sender: data._id,
      msg,
    });
    await axios.post(sendMessageRoute, {
      from: data._id,
      to: currentChat?._id,
      message: msg,
      sender: data._id,
    });

    const msgs = [...messages];
    const date = new Date();
    msgs.push({
      fromSelf: true,
      message: msg,
      sender: data._id,
      createdAt: date,
    });
    setMessages(msgs);
    console.log(messages);
  };

  // get message from chat live
  useEffect(() => {
    async function getMessage() {
      if (socket.current) {
        socket.current.on("msg-recieve", (data) => {
          setArrivalMessage({
            fromSelf: false,
            message: data.msg,
            fromUser: data.from,
          });
          setFromUserMessage(data.from);
        });
      }
    }
    getMessage();
  }, [socket.current]);

  useEffect(() => {
    if (arrivalMessage?.fromUser === currentChat?._id) {
      console.log(true);
      arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
    }
  }, [arrivalMessage]); 

  // scrool donw when sending
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    scrollBottom.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  }, [messages]);
  return (
    <>
      <div className={classes.modalMessageAndWrite}>
        {currentChat ? (
          <div className={classes.box}>
            <div className={classes.messageContainer}>
              <div className={classes.message}>
                {messages.map(({ message, fromSelf }, index) =>
                  fromSelf ? (
                    <div
                      className={classes.messageSent}
                      key={index}
                      ref={scrollBottom}
                    >
                      <span className={classes.sentMessage}>{message}</span>
                      <span className={classes.messageInfo}>
                        {moment(message.createdAt).format("LT")}
                        <img src={checkIcon} alt="" />
                      </span>
                    </div>
                  ) : (
                    <div
                      className={classes.messageReceived}
                      key={index}
                      ref={scrollBottom}
                    >
                      <span key={index} className={classes.sentMessage}>
                        {message}
                      </span>
                      <span className={classes.messageInfo}>
                        {moment(message.createdAt).format("LT")}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
            <form action="" onSubmit={(event) => sendChat(event)}>
              <div className={classes.writeAndSendMessage}>
                <input
                  className={classes.writeMessage}
                  ref={inputReset}
                  onChange={(e) => setMsg(e.target.value)}
                  required
                  type="text"
                  placeholder="Text message..."
                  value={msg}
                />
                <button type="submit">Send</button>
                <div className={classes.fileAttach} onChange={onChangePicture}>
                  <input
                    type="file"
                    ref={hiddenFileInput}
                    multiple
                    accept="image/*"
                  />
                  <img type="file" src={fileAttachImg} alt="File Attach Img" />
                </div>
              </div>
            </form>
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
}

export default DefaultMessageBlock;
