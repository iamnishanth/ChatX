import "./App.css";
import { useState } from "react";
import io from "socket.io-client";
import Chat from "./components/Chat";

const socket = io.connect("https://chatx-dop2.onrender.com");

const App = () => {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {
    if (username.trim() !== "" && room.trim() !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    } else {
      alert("Enter required fields");
    }
  };

  return (
    <div className="App">
      <div className="chat-window">
        {!showChat ? (
          <div className="join-chat-container">
            <h1>ChatX</h1>
            <input
              type="text"
              placeholder="Name"
              className="chat-window-input"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
            <input
              type="text"
              placeholder="Room"
              className="chat-window-input"
              value={room}
              onChange={(e) => {
                setRoom(e.target.value);
              }}
            />
            <button className="chat-window-btn" onClick={joinRoom}>
              Join
            </button>
          </div>
        ) : (
          <Chat socket={socket} username={username} room={room} />
        )}
      </div>
    </div>
  );
};

export default App;
