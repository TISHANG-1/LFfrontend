import React, { useEffect, useState } from "react";
import { over } from "stompjs";
import SockJS from "sockjs-client";
import axios from "axios";
import SideBarCard from "./sideBarCard/SideBarCard";
import { useSelector } from "react-redux";

var stompClient = null; 
var selectedUserId = null;  
var prefix = "https://lfbackend.onrender.com" ; 
const ChatRoom = () => {
  const { authData, loading } = useSelector((state) => state.authData);
  const [onlineUser, setOnlineUser] = useState(["CHATROOM"]);
  const [tab, setTab] = useState("No Current Tab");
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [nickname, setNickname] = useState("");
  const [userData, setUserData] = useState({
    username: "",
    recievername: "",
    connected: false,
    message: "",
  });
  useEffect(() => {
    if (authData) {
      setNickname(authData.result.email);
      setUserData({
        ...userData,
        username: authData.result.name,
        connected: true,
      });
      console.log(authData.result.email, nickname);
      registerUser();
    } else if(stompClient) {
      setNickname("");
      console.log("overhere") ; 
      stompClient.send(
        "/app/user/disconnectUser",
        {},
        JSON.stringify({
          nickName: nickname,
          fullName: userData.username,
          status: "OFFLINE",
        })
      );
      window.location.reload();
      setUserData({ ...userData, username: "", connected: false });
    }
  }, [authData]);

  // useEffect(()=>{
  //   if(authData){

  //    setNickname(authData.result.email) ;
  //    setUserData({...userData , username: authData.result.name , connected:true});
  //    console.log(authData.result.email , nickname);

  //   }
  //   else{
  //       setNickname("") ;
  //       setUserData({...userData, username:"" , connected:false});

  //   }

  // } , [nickname]) ;

  const onError = () => {};

  const handleUserName = (e) => {
    const { value } = e.target;
    setUserData({ ...userData, username: value });
    setNickname(value);
  };

  const registerUser = () => {
    let Sock = new SockJS(`${prefix}/ws`);
    stompClient = over(Sock);
    stompClient.connect({}, onConnected, onError);
  };

  const onConnected = () => {
    console.log(nickname, userData.username);

    stompClient.subscribe(
      `/user/${authData.result.email}/queue/messages`,
      onMessageRecieved
    );
    stompClient.subscribe(
      `/user/commonroom@tishang.com/queue/messages`,
      onMessageRecieved
    );
    stompClient.subscribe(`/user/topic`, onMessageRecieved);
    // registerthe connected user
    stompClient.send(
      "/app/user/addUser",
      {},
      JSON.stringify({
        fullName: authData.result.name,
        nickName: authData.result.email,
        status: "ONLINE",
      })
    );

    // find and Display the connected user
    findAndDisplayConnectedUsers();
  };

  const findAndDisplayConnectedUsers = async () => {
    const connectedUserResponse = await fetch(`${prefix}/users`);
    let connectedUsers = await connectedUserResponse.json();
    connectedUsers = connectedUsers.filter(
      (user) => user.fullName !== authData?.result?.name
    );
    console.log(onlineUser);
    setOnlineUser([...connectedUsers]);
    console.log(connectedUsers);
    console.log(onlineUser);
  };
  const fectchAndDisplayUserChat = async (nickName2) => {
    await axios
      .get(
        `${prefix}/messages/${authData.result.email}/${nickName2}`
      )
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
  const fectchAndDisplayCommonChat = async () => {  
    console.log("here") ; 
    await axios
      .get(
        `${prefix}/messages/commonroom@tishang.com` 
      )
      .then(async (response) => { 
        console.log(response.data) ; 
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
      setMessageInput("");

      await stompClient.send("/app/chat", {}, JSON.stringify(chatMessage));
      setMessages([...messages, chatMessage]);
      // something to display the message
    }
  };

  const handleMessage = (e) => {
    const { value } = e.target;
    setMessageInput(value);
  };

  const handleOnclick = async (ele) => {
    selectedUserId = ele.nickName;
    console.log(selectedUserId); // Updated value of selectedUserId
    await fectchAndDisplayUserChat(ele.nickName);
    setTab(ele.fullName);
  };

  const handleKeyDown = (event) => {
    // Check if the pressed key is Enter (key code 13) 
    console.log("press enter") ;
    if (event.key === 'Enter') {

      // Prevent the default behavior (e.g., line break in a textarea)
      event.preventDefault();

      // Call your function to send the chat message
      sendChatMessage();
    }
  };

  const onMessageRecieved = async (payload) => {
    findAndDisplayConnectedUsers();
    console.log(tab);
    console.log(selectedUserId); // Updated value of selectedUserId
    if (selectedUserId && selectedUserId !== "commonroom@tishang.com") fectchAndDisplayUserChat(selectedUserId);
    else if(selectedUserId)fectchAndDisplayCommonChat() ; 
    console.log(payload.content);

    //   if (selectedUserId && selectedUserId ===message.senderId){
    //      displayMessage(message.senderId, message.content) ;
    //   }
  };

  return (
    <div className="container">
      {authData?.result?.email ? (
        <div className="chat-box">
          <div className="member-list">
            <ul>
              <li
                 
                className= "openTab"
              > 
              Send To: { tab } 
              </li>
              <li   
                className= "online-user"> Online Users </li>
              {onlineUser?.map((ele, index) => (
                <li
                  onClick={async () => {
                    handleOnclick(ele);
                  }}
                  key={index}
                >
                  <SideBarCard name={ele.fullName} />
                </li>
              ))}
            </ul>
          </div>
          
          { (
            <div className="chat-content">
              <ul className="chat-messages">
                {messages?.map((chat, index) => (
                  <li
                    className={`message ${
                      chat.senderId === nickname && "self"
                    }`}
                    key={index}
                  >
                    {chat.senderId !== nickname && (
                      <div className="avatar">{chat.senderId}</div> 
                      
                    )} 
                    {chat.senderId === nickname && (
                      <div className="timestamp">{new Date(chat.timestamp).toISOString().split('T')[0]} {new Date(chat.timestamp).toISOString().split('T')[1].split('.')[0]}</div> 
                      
                    )}
                    <div className="message-data">{chat.content}</div>
                    {chat.senderId !== nickname && (
                      <div className="timestamp">{new Date(chat.timestamp).toISOString().split('T')[0]} {new Date(chat.timestamp).toISOString().split('T')[1].split('.')[0]} </div>
                    )}
                    {chat.senderId === nickname && (
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
                  onKeyDown={handleKeyDown}
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
          {/* <input
            id="user-name"
            placeholder="Enter your name"
            name="userName"
            value={userData.username}
            onChange={handleUserName}
            margin="normal"
          />
          <button type="button" onClick={registerUser}>
            connect
          </button> */}
          Session Expired Oops!!! LogOut and Login Again!!
        </div>
      )}
    </div>
  );
};

export default ChatRoom;
