import axios from 'axios';
import React from 'react'
import { useRef } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import styled from 'styled-components';
import Logout from '../pages/Logout';
import { getAllMessageRoute, sendMessageRoute } from '../utils/APIRoute';
import ChatInput from './ChatInput';
import Messages from './Messages';
import { v4 as uuidv4 } from "uuid"

export default function ChatContainer({ currentChat, currentUser, socket }) {

  const [messages, setMessages] = useState([])
  const [arriveMessage, setArriveMessage] = useState(null)
  const scrollRef = useRef()

  // console.log("currentChat:",currentChat)    

  useEffect(() => {
    if (currentChat) {
      const fn = async () => {
        // console.log("contact: ",currentChat)
        const response = await axios.post(getAllMessageRoute, {
          from: currentUser._id,
          to: currentChat._id
        })
        setMessages(response.data);
      }
      fn();
    }


  }, [currentChat])

  const handleSendMsg = async (msg) => {
    // console.log("sendMsg",currentChat)
    axios.post(sendMessageRoute, {
      from: currentUser._id,
      to: currentChat._id,
      message: msg
    })
    // console.log("客户端send-msg")
    socket.current.emit("send-msg", {
      to: currentChat._id,
      from: currentUser._id,
      message: msg
    })
    const msgs = [...messages]
    msgs.push({ fromSelf: true, message: msg });
    setMessages(msgs)
  }

  useEffect(() => {
    if (socket.current) {
      
      socket.current.on("msg-receive", (msg) => {
        // console.log("receivemsg",msg)
        setArriveMessage({ fromSelf: false, message: msg })
      })
    }
  }, [])

  useEffect(() => {
    arriveMessage && setMessages((prev) => [...prev, arriveMessage])
  }, [arriveMessage])

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages])

  return (
    <>
      {currentChat && (<Container>
        <div className='chat-header'>
          <div className='user-details'>
            <div className='avatar'>
              <img
                src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
                alt="avatar" />

            </div>
            <div className="username">
              <h3 >{currentChat.username}</h3>
            </div>
            <Logout />
          </div>

        </div>
        <div className="chat-messages">
          {
            messages.map((msg) => {
              return (
                <div ref={scrollRef} key={uuidv4()}>
                  <div className={`message ${msg.fromSelf ? "sended" : "recieved"}`}>
                    <div className="content">
                      <p>
                        {msg.message}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })
          }

        </div>
        <ChatInput handleSendMsg={handleSendMsg} />
      </Container>)}
    </>


  )
}
const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  overflow: hidden;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: white;
        }
      }
    }
  }
  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .message {
      display: flex;
      align-items: center;
      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
      }
    }
    .sended {
      justify-content: flex-end;
      .content {
        background-color: #4f04ff21;
      }
    }
    .recieved {
      justify-content: flex-start;
      .content {
        background-color: #9900ff20;
      }
    }
  }
`;

// const Container = styled.div`
//     padding-top: 1rem;
//     display: grid;
//     grid-template-columns: 10% 78% 12%;
//     .chat-header{
//         display: flex;
//         justify-content: space-between;
//         align-items: center;
//         padding: 0% 2rem;
//         .user-details{
//             display: flex;
//             align-items: center;
//             gap: 1rem;
//             .avatar{
//                 img{
//                     height: 3rem;

//                 }
//             }
//             .username{
//                 color: white;
//             }
//         }
//     }
//     .chat-messages{
//         padding: 1rem 2rem;
//         display: flex;
//         flex-direction: column;
//         gap: 1rem;
//         overflow: auto;
//         .message{
//             align-items: center;
//             display: flex;
//             .content{
//                 max-width: 40%;
//                 overflow-wrap: break-word;
//                 padding: 1rem;
//                 border-radius: 1rem ;
//                 color: #d1d1d1;
//             }
//         }
//         .sended{
//             justify-content: flex-end;
//             .content{
//                 background-color: #4f04ff21;
//             }

//         }
//         .recieved{
//             justify-content: flex-start;
//             .content{
//                 background-color: #9900ff20;
//             }

//         }
//     }
// `;
