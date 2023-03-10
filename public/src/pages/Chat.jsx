import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import ChatContainer from "../components/ChatContainer";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
import { allUsersRoute,host } from "../utils/APIRoute";
import {io} from "socket.io-client"
import { useRef } from "react";

function Chat() {
    const socket=useRef();
    const navigate = useNavigate();
    const [contacts, setContacts] = useState([]);
    const [currentUser, setCurrentUser] = useState(undefined);
    const [currentChat, setCurrentChat] = useState(undefined);
    const [isLoaded, setIsLoaded] = useState(false) 



    useEffect(() => {
        if (!localStorage.getItem('chat-app-user')) {
            navigate('/login')
        } else {
            let dt = JSON.parse(localStorage.getItem("chat-app-user"))
            setCurrentUser(dt);
            setIsLoaded(true);
        }
    }, [])

    useEffect(()=>{
        if(currentUser){
            socket.current=io(host)
            socket.current.emit("add-user",currentUser._id);
            // console.log("emit add-user")
        }
    },[currentUser])

    useEffect(() => {
        const fn = async () => {
            if (currentUser) {
                if (currentUser.isAvatarImageSet) {
                    const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
                    setContacts(data.data);
                } else {
                    navigate("/setAvatar");
                }
            }
        }
        fn()
    }, [currentUser]);


    const handleChatChange = (chat) => {
        // console.log("setChat ",chat)
        setCurrentChat(chat)
    }

    return (
        <>
            <Container>
                <div className="container">
                    <Contacts contacts={contacts} currentUser={currentUser} changeChat={handleChatChange}></Contacts>
                    {
                        isLoaded && currentChat === undefined ? (    //??????usestate????????????
                            <Welcome currentUser={currentUser} />
                        ) : (
                            <ChatContainer currentChat={currentChat} currentUser={currentUser}
                                socket={socket} />
                        )
                    }
                </div>
            </Container>
        </>

    )
}



const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #f1f1f7;
  .container {
    height: 100vh;
    width: 100vw;
    background-color: #fefcfc76;
    display: grid;
    grid-template-columns: 25% 75%;

  }
`;

export default Chat;