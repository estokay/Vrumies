import useGetProfilePic from "../../Hooks/useGetProfilePic";

const ChatItem = ({ chat, navigate, setActiveChat, formatTime }) => {
  const profilePic = useGetProfilePic(chat.otherUserId || null);

  return (
    <li
      className="lsp-user-item"
      onClick={() => {
        navigate(`/inbox?chat=${chat.chatId}`);
        if (setActiveChat) setActiveChat(chat.chatId);
      }}
    >
      <div className="lsp-user-left">
        <div className="lsp-pic-wrapper">
          <img
            src={profilePic}
            alt={chat.otherUser.username}
            className="lsp-user-pic"
          />
          <span className="lsp-online-dot"></span>
        </div>

        <div className="lsp-user-info">
          <h4>{chat.otherUser.username}</h4>
          <p>{chat.lastMessage || "No messages yet..."}</p>
        </div>
      </div>

      <div className="lsp-right">
        <span className="lsp-timestamp">
          {formatTime(chat.lastTimestamp)}
        </span>

        {chat.unreadCount > 0 && (
          <span className="lsp-unread-count">{chat.unreadCount}</span>
        )}
      </div>
    </li>
  );
};

export default ChatItem;