import { useEffect, useState } from "react";

export default function ChatWindow({ socket, selectedChat, currentUserId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (!socket || !selectedChat) return;

    const eventName =
      selectedChat.type === "group" ? "newMessage" : "newPrivateMessage";

    const handleMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on(eventName, handleMessage);

    return () => {
      socket.off(eventName, handleMessage);
      setMessages([]);
    };
  }, [socket, selectedChat]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    if (selectedChat.type === "group") {
      console.log("Enviando msgs grupo: ", {
        projectId: selectedChat.id,
        content: newMessage,
        sender_member_project_id: currentUserId,
      });

      socket.emit("sendGroupMessage", {
        projectId: selectedChat.id,
        content: newMessage,
        sender_member_project_id: currentUserId, // <- novo campo aqui
      });
    } else {
      socket.emit("sendPrivateMessage", {
        sender_user_id: currentUserId,
        receiver_user_id: selectedChat.id,
        content: newMessage,
      });
    }

    setNewMessage("");
  };

  return (
    <div className="flex-1 flex flex-col p-4">
      <div className="flex-1 overflow-y-auto space-y-2 mb-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`max-w-md p-2 rounded ${
              msg.sender_user_id === currentUserId ||
              msg.senderMemberProjectId === currentUserId
                ? "bg-blue-500 text-white ml-auto"
                : "bg-gray-300 text-black mr-auto"
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 border rounded px-3 py-2"
          placeholder="Digite sua mensagem..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-cyan-900 px-4 py-2 rounded"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
