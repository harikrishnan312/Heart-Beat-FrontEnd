// App.js
import React, { useEffect, useState } from "react";
import './Message.css'
import io from "socket.io-client";
import createInstance from "../../../../constants/axiosApi";
import Navbar from "../../../navbar/Navbar";

const EndPoint = "http://localhost:8000";

const Message = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);

  var url_string = window.location.href;
  var url = new URL(url_string);
  var id = url.searchParams.get("id");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const axiosInstance = createInstance(token);

    if (id) {

      axiosInstance.post('/message', { userId: id }).then((res) => {
        if (res.data._id) {
          setSelectedUser(res.data.users[1].firstName)
          axiosInstance.get('/message').then((res) => {
            const chats = res.data.map((user) => {
              return (user.users[1].firstName)
            });
            setUsers(chats)
          })
        }
      })
    } else {
      axiosInstance.get('/message').then((res) => {
        const chats = res.data.map((user) => {
          return (user.users[1].firstName)
        });
        setUsers(chats)
      })
    }

    // axiosInstance .get('/messages',params).then((res)=>{
    //     console.log(res.data);
    // })
    const socket = io(EndPoint);

    socket.emit("set up", id);

    socket.on("connection", () => {
      // setSocketConnected(true);
    });

    socket.emit("join chat", "");
  }, []);
  const handleUserSelection = (username) => {
    setSelectedUser(username);
  };

  const handleSendMessage = () => {
    e.preventDefault();

  };

  return (
    <>
      <Navbar lists={['Discover', 'Matches', 'Likes', 'Newsfeed',]} user='true'></Navbar>

      <div className="container msg">
        <div className="users-list">
          <h2>Users</h2>
          <ul>
            {users.map((user) => (
              <li
                key={user}
                className={selectedUser === user ? "selected" : ""}
                onClick={() => handleUserSelection(user)}
              >
                {user}
              </li>
            ))}
          </ul>
        </div>
        <div className="chat">
          <h2>Chat</h2>
          {selectedUser ? (
            <div>
              <h3>{selectedUser}</h3>
              <div className="chat-history">
                {chatHistory.map((msg, index) => (
                  <div
                    key={index}
                    className={msg.sender === "JohnDoe" ? "sent" : "received"}
                  >
                    <span>{msg.sender}: </span>
                    <span>{msg.message}</span>
                  </div>
                ))}
              </div>
              <div className="message-input">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button onClick={handleSendMessage}>Send</button>
              </div>
            </div>
          ) : (
            <p>Select a user to start chatting</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Message;
