// App.js
import React, { useEffect, useRef, useState } from "react";
import './Message.css'
import io from "socket.io-client";
import createInstance from "../../../../constants/axiosApi";
import Navbar from "../../../navbar/Navbar";
import Footer from '../../../footer/Footer'
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiSettings } from 'react-icons/fi'
import { MdDelete } from 'react-icons/md'
import { setNotification } from "../../../../redux/notification";


const EndPoint = "https://heart-beat-backend.onrender.com";
let socket, selectedchatcompare, datas, chatid;

const Message = () => {
  const dispatch = useDispatch()
  const chatContainerRef = useRef(null);

  const navigate = useNavigate()
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
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState('')
  const [userId, setUserId] = useState('')
  const [edit, setEdit] = useState(false)

  const user = useSelector((state) => state.user.userData);
  // const notification = useSelector((state) => state.notification.notification);


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
          setSelectedUser(chatUser[0].firstName);

          setUserId(chatUser[0]._id)

          setImage(chatUser[0].image)

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
            datas = res.data;
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
      // console.log('hy i am here');
      dispatch(setNotification('new'));

      if (!selectedchatcompare || selectedchatcompare !== newMessageRecieved.chat._id) {
        setUpdated(!updated)
      } else {
        setChatHistory([...chatHistory, newMessageRecieved]);
      }
    })
  })

  const handleUserSelection = (users) => {

    setSelectedUser(users.firstName);
    setImage(users.image);
    setUserId(users._id)

    const axiosInstance = createInstance(token);

    axiosInstance.post('/message', { userId: users._id }).then((res) => {
      if (res.data._id) {

        setChatId(res.data._id);

        chatid = res.data._id

        socket.emit("set up", user._id);

        socket.emit("join chat", chatid, chatId);

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
      socket.emit("typing", chatid);
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

  const HandleDelete = async (data) => {
    const axiosInstance = createInstance(token);
    axiosInstance.post('/deleteMessage', { id: data._id }).then((res) => {
      if (res.status === 200) {
        const user = data.users.filter((user)=>user._id===id)
        
        if (user.length>0) {
          setSelectedUser(null);
          setImage('');
          setUserId('')
          setChatHistory([])
          navigate('/message')
        }
        setUpdated(!updated)
      }
    })
  }

  return (
    <>
      <Navbar lists={['Discover', 'Matches', 'Likes', 'Newsfeed', 'Messages']} user='true'></Navbar>
      {loading ?

        <div className="msg">
          <div className="users-list">
            <h2 style={{ fontWeight: 'bold' }}>Chats </h2>

            <ul>
              {users.map((user, index) => (
                <li
                  key={index}
                  className={user.firstName ? (selectedUser === user.firstName ? "selected" : "") : ''}
                  onClick={() => handleUserSelection(user)}
                ><div>

                    <p style={{ color: 'red', fontWeight: 600 }}>{user.firstName ? user.firstName : ''}</p>
                    <p >{datas[index].latestMessage ? datas[index].latestMessage.content : ''}</p>
                  </div>
                  {edit ? <MdDelete size={20} color="red" onClick={(e) => {
                    e.stopPropagation();
                    HandleDelete(datas[index])
                  }}></MdDelete> : ''}

                </li>
              ))}


            </ul>
          </div>
          <div className="chat">
            <div ><FiSettings size={20} style={{ float: "right" }} onClick={(() => { setEdit(!edit) })}></FiSettings></div>
            {selectedUser ? (
              <div>
                <div style={{ display: "flex" }}>
                  <img src={`http://localhost:3000/images/${image}`} alt="Avatar" className="author-avatar" onClick={() => {
                    navigate(`/profile?id=${userId}&user=${false}`)
                  }} />
                  <h2 style={{ color: "grey", fontWeight: 'bold' }}>{selectedUser}</h2>
                </div>
                <br />
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
                    pattern="^[a-zA-Z0-9]" required />
                  <button onClick={handleSendMessage}>Send</button>
                </div>
              </div>
            ) : (
              <p style={{ paddingTop: '10em', fontWeight: 'bold' }}>Select a user to start chatting......</p>
            )}
          </div>
        </div>
        : <div style={{ height: "100vh" }}></div>}
      <Footer></Footer>
    </>
  );
};

export default Message;
