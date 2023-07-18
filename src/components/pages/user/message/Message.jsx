// App.js
import React, { useEffect, useRef, useState } from "react";
import './Message.css'
import io from "socket.io-client";
import createInstance from "../../../../constants/axiosApi";
import Navbar from "../../../navbar/Navbar";
import Footer from '../../../footer/Footer'
import { useSelector } from "react-redux";

const EndPoint = "http://localhost:8000";
var socket, selectedchatcompare;

const Message = () => {
  const chatContainerRef = useRef(null);

  const token = localStorage.getItem("token");

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [chatId, setChatId] = useState({})
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false)
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);

  const user = useSelector((state) => state.user.userData);


  var url_string = window.location.href;
  var url = new URL(url_string);
  var id = url.searchParams.get("id");

  useEffect(() => {

    socket = io(EndPoint);

    socket.emit("set up", user._id);

    socket.on("connection", () => {
      setSocketConnected(true)
    });
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, [])

  useEffect(() => {
    const axiosInstance = createInstance(token);

    if (id) {

      axiosInstance.post('/message', { userId: id }).then((res) => {
        if (res.data._id) {
          const chatUser = res.data.users.filter((chatUser) => {
            return (chatUser._id !== user._id)
          });
          setSelectedUser(chatUser[0].firstName)

          setChatId(res.data._id);

          const chatid = res.data._id

          socket.emit("join chat", (chatid));

          const params = {
            chatId: res.data._id
          }

          axiosInstance.get('/message').then((res) => {
            const chatUsers = res.data.map((chat) => {
              return (chat.users.filter((chatuser) => chatuser._id != user._id))
            })
            const chats = chatUsers.map((user) => (user[0]));

            setUsers(chats)

            axiosInstance.get('/allMessage', { params }).then((res) => {
              setChatHistory(res.data.messages);
            })
          })
        }
      })
    } else {
      axiosInstance.get('/message').then((res) => {
        const chatUsers = res.data.map((chat) => {
          return (chat.users.filter((chatuser) => chatuser._id != user._id))
        })
        const chats = chatUsers.map((user) => (user[0]));
        setUsers(chats);
      })
    }
    if(chatContainerRef.current){

      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }

  }, [chatHistory]);
  useEffect(() => {
    selectedchatcompare = chatId
  }, [chatId])



  useEffect(() => {
    socket.on('message recieved', (newMessageRecieved) => {
      if (!selectedchatcompare || selectedchatcompare !== newMessageRecieved.chat._id) {

      } else {
        setChatHistory([...chatHistory, newMessageRecieved]);
      }
    })
  })

  const handleUserSelection = (users) => {
    setSelectedUser(users.firstName);
    const axiosInstance = createInstance(token);

    axiosInstance.post('/message', { userId: users._id }).then((res) => {
      if (res.data._id) {
        setChatId(res.data._id);

        const chatid = res.data._id

        socket.emit("set up", user._id);

        socket.emit("join chat", (chatid));

        const params = {
          chatId: res.data._id
        }

        axiosInstance.get('/allMessage', { params }).then((res) => {

          setChatHistory(res.data.messages);
        })
      }
    })
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    socket.emit("stop typing", chatId);

    const axiosInstance = createInstance(token);

    axiosInstance.post('/sendMessage', { content: message, chatId }).then((res) => {
      socket.emit('new message', res.data)
      setChatHistory([...chatHistory, res.data])
      setMessage('')
    })
  };

  const typingHandler = (e) => {
    setMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", chatId);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 2000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", chatId);
        setTyping(false);
      }
    }, timerLength);
  };
  return (
    <>
      <Navbar lists={['Discover', 'Matches', 'Likes', 'Newsfeed', 'Messages']} user='true'></Navbar>

      <div className="msg">
        <div className="users-list">
          <h2>Users</h2>
          <ul>
            {users.map((user, index) => (
              <li
                key={index}
                className={selectedUser === user.firstName ? "selected" : ""}
                onClick={() => handleUserSelection(user)}
              >
                {user.firstName}
              </li>
            ))}
          </ul>
        </div>
        <div className="chat">
          <h2>Chat</h2>
          {selectedUser ? (
            <div>
              <h3 style={{color:"blue"}}>{selectedUser}</h3>
              <div className="chat-history" ref={chatContainerRef}>
                {chatHistory.map((msg, index) => (
                  
                  <div
                    key={index}
                    className={msg.sender.firstName === user.firstName ? "sent" : "received"}
                  >
                    <span style={{color:'red'}}>{msg.sender.firstName}: </span>
                    <span>{msg.content}</span>
                  </div>
                ))}
              </div>
              <div className="message-input">
                {istyping?<div>Typing...</div>:<></>}
                <input
                  type="text"
                  value={message}
                  onChange={typingHandler}
                />
                <button onClick={handleSendMessage}>Send</button>
              </div>
            </div>
          ) : (
            <p>Select a user to start chatting</p>
          )}
        </div>
      </div>
      <Footer></Footer>
    </>
  );
};

export default Message;
