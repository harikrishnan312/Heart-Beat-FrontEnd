// App.js
import React, { useEffect, useRef, useState } from "react";
import './Message.css'
import io from "socket.io-client";
import createInstance from "../../../../constants/axiosApi";
import Navbar from "../../../navbar/Navbar";
import Footer from '../../../footer/Footer'
import { useSelector } from "react-redux";

const EndPoint = "http://localhost:8000";
let socket, selectedchatcompare,datas;

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
  const [updated, setUpdated] = useState(false);
  const [data, setData] = useState([]);
  const [chats, setChats] = useState(false);
  const [loading, setLoading] = useState(false)

  const user = useSelector((state) => state.user.userData);


  let url_string = window.location.href;
  let url = new URL(url_string);
  let id = url.searchParams.get("id");

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
            setData(res.data)
            datas=res.data;
            setUsers(chats)
            setLoading(true);

            axiosInstance.get('/allMessage', { params }).then((res) => {
              setChatHistory(res.data.messages);
            })
          })
        }
      })
    }
    else {
      axiosInstance.get('/message').then((res) => {
        const chatUsers = res.data.map((chat) => {
          return (chat.users.filter((chatuser) => chatuser._id != user._id))
        })
        const chats = chatUsers.map((user) => (user[0]));
        setUsers(chats);
        setData(res.data)
        datas = res.data;
        setLoading(true)
      })
    }

  }, [updated]);
  useEffect(() => {
    const axiosInstance = createInstance(token);

    axiosInstance.get('/message').then((res) => {
      const chatUsers = res.data.map((chat) => {
        return (chat.users.filter((chatuser) => chatuser._id != user._id))
      })
      const chats = chatUsers.map((user) => (user[0]));
      setData(res.data);
      datas = res.data;
      setUsers(chats);
      setLoading(true)

    })
  }, [chats])

  useEffect(() => {
    selectedchatcompare = chatId
  }, [chatId])

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory])

  useEffect(() => {
    socket.on('message recieved', (newMessageRecieved) => {
      if (!selectedchatcompare || selectedchatcompare !== newMessageRecieved.chat._id) {
        setUpdated(!updated)
      } else {
        setChatHistory([...chatHistory, newMessageRecieved]);
      }
    })
  })

  const handleUserSelection = (users) => {
    setIsTyping(false);
    setTyping(false)
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
    setChats(!chats)
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
      {loading && users.length > 0 ?
        <div className="msg">
          <div className="users-list">
            <h2 style={{ fontWeight: 'bold' }}>Chats</h2>
            <ul>
              {users.map((user, index) => (
                <li
                  key={index}
                  className={user.firstName?(selectedUser === user.firstName ? "selected" : ""):''}
                  onClick={() => handleUserSelection(user)}
                >
                  <p style={{ color: 'red', fontWeight: 600 }}>{user.firstName?user.firstName:''}</p>
                  <p >{datas[index].latestMessage ? datas[index].latestMessage.content : ''}</p>

                </li>
              ))}
              

            </ul>
          </div>
          <div className="chat">
            {selectedUser ? (
              <div>
                <h1 style={{ color: "grey", fontWeight: 'bold' }}>{selectedUser}</h1>
                <div className="chat-history" ref={chatContainerRef}>
                  {chatHistory.map((msg, index) => (

                    <div
                      key={index}
                      className={msg.sender.firstName === user.firstName ? "sent" : "received"}
                    >
                      <span style={{ color: 'red' }}>{msg.sender.firstName}: </span>
                      <span>{msg.content}</span>
                    </div>
                  ))}
                </div>
                <div className="message-input">
                  {istyping ? <div style={{ color: 'grey' }}>Typing...</div> : <></>}
                  <input
                    type="text"
                    value={message}
                    onChange={typingHandler}
                    style={{ marginTop: '.65em' }}
                  />
                  <button onClick={handleSendMessage}>Send</button>
                </div>
              </div>
            ) : (
              <p>Select a user to start chatting</p>
            )}
          </div>
        </div>
        : ''}
      <Footer></Footer>
    </>
  );
};

export default Message;
