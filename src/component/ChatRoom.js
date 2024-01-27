import React, { useEffect, useState } from "react";
import { over } from "stompjs";
import SockJS from "sockjs-client";
import axios from "axios";  
import SideBarCard from "./sideBarCard/SideBarCard";


var stompClient = null;  
var selectedUserId = null; 
const ChatRoom = () => {
  const [onlineUser, setOnlineUser] = useState(["CHATROOM"]);
  const [tab, setTab] = useState("CHATROOM");
  const [messages, setMessages] = useState([]) ; 
  const [messageInput, setMessageInput] = useState("");
  const [nickname, setNickname] = useState("");
  const [userData, setUserData] = useState({
    username: "",
    recievername: "",
    connected: false,
    message: "",
  });    


  const onError = () => {};
  
  const handleUserName = (e) => {
    const { value } = e.target;
    setUserData({ ...userData, username: value });
    setNickname(value);
  };  

 
  const registerUser = () => {
    let Sock = new SockJS("http://localhost:8080/ws");
    stompClient = over(Sock);
    stompClient.connect({}, onConnected, onError);
  };

  const onConnected = () => {
    setUserData({ ...userData, connected: true });
    setNickname(userData.username);
    console.log(nickname, userData.username);

    stompClient.subscribe(
      `/user/${nickname}/queue/messages`,
      onMessageRecieved
    );
    stompClient.subscribe(`/user/topic`, onMessageRecieved);
    // registerthe connected user
    stompClient.send(
      "/app/user/addUser",
      {},
      JSON.stringify({
        fullName: userData.username,
        nickName: nickname,
        status: "ONLINE",
      })
    );

    // find and Display the connected user
    findAndDisplayConnectedUsers();
  };

  const findAndDisplayConnectedUsers = async () => {
    const connectedUserResponse = await fetch(`http://localhost:8080/users`);
    let connectedUsers = await connectedUserResponse.json();
    connectedUsers = connectedUsers.filter(
      (user) => user.username !== userData.username
    );
    console.log(onlineUser);
    setOnlineUser([...connectedUsers]);
    console.log(connectedUsers);
    console.log(onlineUser);
  };
  const fectchAndDisplayUserChat = async (nickName2) => {
    await axios
      .get(`http://localhost:8080/messages/${nickname}/${nickName2}`)
      .then(async (response) => {
        await setMessages(response.data);
        const userChat = response.data;
        console.log(userChat);
        console.log(messages);
      })
      .catch((err) => {
        console.log(err);
      });

    // setMessages(userChat) ;
  };

  const sendChatMessage = async (e) => {
    const messageContent = messageInput;
    console.log(messageContent);
    console.log(stompClient);
    if (messageContent && stompClient) {
      const chatMessage = {
        senderId: nickname,
        recipientId: selectedUserId,
        content: messageInput,
        timestamp: new Date(),
      };

      stompClient.send("/app/chat", {}, JSON.stringify(chatMessage));

      // something to display the message
    }
  };

  const handleMessage = (e) => {
    const { value } = e.target;
    setMessageInput(value);
  };   

  const handleOnclick = async (ele) => {  
     selectedUserId  = ele.nickName; 
    console.log(selectedUserId); // Updated value of selectedUserId
    await fectchAndDisplayUserChat(ele.nickName);
    setTab(ele.fullName);
   }  


  const onMessageRecieved = async (payload) => {
    findAndDisplayConnectedUsers();
    console.log(tab); 
    if(selectedUserId) fectchAndDisplayUserChat(selectedUserId);
    console.log(payload.content);

    //   if (selectedUserId && selectedUserId ===message.senderId){
    //      displayMessage(message.senderId, message.content) ;
    //   }
  };

  return (
    <div className="container">  

      {userData.connected ? (
        <div className="chat-box">
          <div className="member-list">
            <ul>
              <li
                onClick={() => {
                  // setTab("CHATROOM");
                }}
                className={`member ${tab === "CHATROOM" && "active"}`}
              >
                Chatroom
              </li>  
              {onlineUser?.map((ele, index) => (
                <li
                  onClick={async () => {  
                    handleOnclick(ele) ; 
                  }}
                  key={index}
                >
                   <SideBarCard name= {ele.fullName}/>
                </li>
              ))}
            </ul>
          </div>
          {tab === "CHATROOM" && (
            <div className="chat-content">
              <ul className="chat-messages">
                {messages.map((chat, index) => (
                  <li
                    className={`message ${
                      chat.senderId === userData.username && "self"
                    }`}
                    key={index}
                  >
                    {chat.senderId !== userData.username && (
                      <div className="avatar">{chat.senderId}</div>
                    )}
                    <div className="message-data">{chat.content}</div>
                    {chat.senderId === userData.username && (
                      <div className="avatar self">{chat.senderId}</div>
                    )}
                  </li>
                ))}
              </ul>

              <div className="send-message">
                <input
                  type="text"
                  className="input-message"
                  placeholder="enter the message"
                  value={messageInput}
                  onChange={handleMessage}
                />
                <button
                  type="button"
                  className="send-button"
                  onClick={sendChatMessage}
                >
                  send
                </button>
              </div>
            </div>
          )}
          {tab !== "CHATROOM" && (
            <div className="chat-content">
              <ul className="chat-messages">
                {messages?.map((chat, index) => (
                  <li
                    className={`message ${
                      chat.senderId === userData.username && "self"
                    }`}
                    key={index}
                  >
                    {chat.senderId !== userData.username && (
                      <div className="avatar">{chat.senderId}</div>
                    )}
                    <div className="message-data">{chat.content}</div>
                    {chat.senderId === userData.username && (
                      <div className="avatar self">{chat.senderId}</div>
                    )}
                  </li>
                ))}
              </ul>

              <div className="send-message">
                <input
                  type="text"
                  className="input-message"
                  placeholder="enter the message"
                  value={messageInput}
                  onChange={handleMessage}
                />
                <button
                  type="button"
                  className="send-button"
                  onClick={sendChatMessage}
                >
                  send
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="register">
          <input
            id="user-name"
            placeholder="Enter your name"
            name="userName"
            value={userData.username}
            onChange={handleUserName}
            margin="normal"
          />
          <button type="button" onClick={registerUser}>
            connect
          </button>
        </div>
      )}   
    
    </div>
  );
};

export default ChatRoom;
