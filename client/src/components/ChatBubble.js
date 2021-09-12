const ChatBubble = ({ isYou, messageContent }) => {
  // Truncating larger username
  const truncate = (str, n) =>
    str?.length > n ? str.substr(0, n - 1) + "..." : str;

  return (
    <div className={`chat-bubble ${isYou ? "you" : "other"}`}>
      <p className={`chat-bubble-message ${isYou ? "you" : "other"}-message`}>
        {messageContent.message}
      </p>
      <div className={`chat-bubble-meta ${isYou ? "you" : "other"}-meta`}>
        <p className="chat-bubble-time">{messageContent.time}</p>
        <p className="chat-bubble-author">
          {truncate(messageContent.author, 10)}
        </p>
      </div>
    </div>
  );
};

export default ChatBubble;
