const ChatHeader = ({ room }) => {
  const truncate = (str, n) =>
    str?.length > n ? str.substr(0, n - 1) + "..." : str;

  return (
    <div className="chat-header">
      <div className="chat-action">
        <div
          className="chat-action-btn red"
          title="close"
          onClick={() => {
            window.location.reload();
          }}
        ></div>
        <div className="chat-action-btn yellow"></div>
        <div className="chat-action-btn green"></div>
      </div>
      <div className="chat-header-title">
        <p>ChatX - {truncate(room, 15)}</p>
      </div>
    </div>
  );
};

export default ChatHeader;
