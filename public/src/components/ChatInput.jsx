import React from 'react'
import styled  from 'styled-components'
// emoji-picker-react@3.5.1
import Picker from "emoji-picker-react"
import {IoMdSend} from "react-icons/io"
import {BsEmojiSmileFill} from "react-icons/bs"
import { useState } from 'react'
export default function ChatInput({handleSendMsg}) {
    const [showEmojiPicker,setShowEmojiPicker]=useState(false);
    const [msg,setMsg]=useState("");
    const handleEmojiPickerHideShow=()=>{
        setShowEmojiPicker(!showEmojiPicker);
    }
    const handleEmojiClick=(event,emoji)=>{
        let message=msg;
        message +=emoji.emoji;
        setMsg(message)
    }

    const sendChat=(event)=>{
      event.preventDefault();
      if(msg.length>0){
        handleSendMsg(msg)
      }
    }

  return (
    <Container>
        <div className="button-container">
            <div className="emoji">
            <BsEmojiSmileFill onClick={handleEmojiPickerHideShow} />
          {showEmojiPicker && <Picker onEmojiClick={handleEmojiClick} />} 
            </div>
        </div>
        <form className='input-container' onSubmit={(e)=>{sendChat(e)}}>
            <input placeholder='type your msg here' value={msg} onChange={(e)=>setMsg(e.target.value)}>
            </input>
            <button className='submit'>
                <IoMdSend/>
            </button>
        </form>
    </Container>
  )
}

const Container = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 5% 95%;
  background-color: #080420;
  padding: 0 2rem;
  padding-bottom: 0.3rem;
  .button-container {
    display: flex;
    align-items: center;
    color: white;
    gap: 1rem;
    .emoji {
      position: relative;
      svg {
        font-size: 1.5rem;
        color: #ffff00c8;
        cursor: pointer;
      }
      .emoji-picker-react {
        background-color: #080420;
        position: absolute;
        top: -400px;
        box-shadow: 0 5px 10px #9a86f3;
        border-color: #9186f3;
        .emoji-scroll-wrapper::-webkit-scrollbar{
          background-color: #080420;
          width: 5px;
          &-thumb{
            background-color: #9186f3;
          }
        }
        .emoji-categories{
          button{
            filter: contrast(0);
          }
        }
        .emoji-search{
          background-color: transparent;
          border-color: #9186f3;
        }
        .emoji-group::before{
          background-color: #080420;
        }

      }
    }
  }
  .input-container {
    width: 100%;
    border-radius: 2rem;
    display: flex;
    align-items: center;
    gap: 2rem;
    background-color: #8baa1b34;
    input {
      width: 90%;
      height: 60%;
      background-color: transparent;
      color: white;
      border: none;
      padding-left: 1rem;
      font-size: 1.2rem;

      &::selection {
        background-color: #9a86f3;
      }
      &:focus {
        outline: none;
      }
    }
    button {
      padding: 0.3rem 2rem;
      border-radius: 2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #9a86f3;
      border: none;
      svg {
        font-size: 2rem;
        color: white;
      }
    }
  }
`;
