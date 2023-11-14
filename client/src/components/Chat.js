import { useEffect, useState, useRef } from "react";
import data from "@emoji-mart/data";
import { init } from "emoji-mart";
import Picker from "@emoji-mart/react";
import ChatBubble from "./ChatBubble";
import ChatHeader from "./ChatHeader";

init({ data });

const Chat = ({ socket, username, room }) => {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((prev) => [...prev, data]);
      scrollToMyRef();
    });
  }, [socket]);

  const handleEscapeEvent = (e) => {
    if (e.key === "Escape") {
      setShowEmojiPicker(false);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleEscapeEvent);

    return () => window.removeEventListener("keydown", handleEscapeEvent);
  }, []);

  const onEmojiClick = (emoji) => {
    const { selectionStart, selectionEnd } = inputRef.current;
    // replace selected text with clicked emoji
    const newMessage =
      currentMessage.slice(0, selectionStart) +
      emoji.native +
      currentMessage.slice(selectionEnd);
    setCurrentMessage(newMessage);
  };

  const sendMessage = async () => {
    if (currentMessage.trim() !== "") {
      const messageData = {
        room: room,
        message: currentMessage,
        author: username,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };
      await socket.emit("send_message", messageData);
      setMessageList((prev) => [...prev, messageData]);
      scrollToMyRef();
      setCurrentMessage("");
    }
  };

  const scrollToMyRef = () => {
    const scroll =
      chatContainerRef.current.scrollHeight -
      chatContainerRef.current.clientHeight;
    chatContainerRef.current.scrollTo(0, scroll);
  };

  return (
    <div className="chat-container">
      <ChatHeader room={room} />
      <div className="chat-body" ref={chatContainerRef}>
        {messageList.map((messageContent, index) => (
          <ChatBubble
            key={index}
            isYou={username === messageContent.author}
            messageContent={messageContent}
          />
        ))}
      </div>
      <div className="chat-footer">
        <button
          className="emoji-picker-btn"
          onClick={() => {
            setShowEmojiPicker(!showEmojiPicker);
          }}
        >
          <em-emoji id="blush" size="24" skin="3"></em-emoji>
          {/* <Emoji emoji={{ id: "blush", skin: 3 }} size={24} /> */}
        </button>
        {showEmojiPicker && (
          <Picker
            data={data}
            theme="dark"
            showPreview={false}
            showSkinTones={false}
            onEmojiSelect={onEmojiClick}
          />
        )}
        <input
          type="text"
          placeholder="Type message here"
          className="chat-input"
          ref={inputRef}
          value={currentMessage}
          onFocus={() => {
            setShowEmojiPicker(false);
          }}
          onChange={(e) => {
            setCurrentMessage(e.target.value);
          }}
          onKeyPress={(e) => {
            e.key === "Enter" && sendMessage();
          }}
        />
        <button className="chat-send-btn" onClick={sendMessage}>
          &#9658;
        </button>
      </div>
    </div>
  );
};

export default Chat;
