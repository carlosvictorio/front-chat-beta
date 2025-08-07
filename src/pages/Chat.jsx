import { useEffect, useState } from "react";
import io from "socket.io-client";

import GroupsList from "../components/GroupsList";
import ContactsList from "../components/ContactsList";
import ChatWindow from "../components/ChatWindow";

export default function Chat() {
  const [userIdInput, setUserIdInput] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);
  const [socket, setSocket] = useState(null);
  const [groups, setGroups] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);

  useEffect(() => {
    if (!currentUserId) return;

    const newSocket = io("http://localhost:3001");
    setSocket(newSocket);
    fetchData(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [currentUserId]);

  const fetchData = async (socket) => {
    const [projectsRes, contactsRes] = await Promise.all([
      fetch(`http://localhost:3001/chat/user-projects/${currentUserId}`).then(
        (res) => res.json()
      ),
      fetch(`http://localhost:3001/chat/user-contacts/${currentUserId}`).then(
        (res) => res.json()
      ),
    ]);

    setGroups(projectsRes);
    setContacts(contactsRes);

    projectsRes.forEach((group) => {
      socket.emit("joinGroup", { projectId: String(group.id) });
    });

    const privateChatUserIds = contactsRes.map((c) => c.id);
    socket.emit("registerPrivateRooms", {
      UserId: currentUserId,
      privateChatUserIds: privateChatUserIds,
    });
  };

  if (!currentUserId) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white shadow p-6 rounded">
          <label className="block mb-2 font-semibold">
            Digite o ID do Usuário:
          </label>
          <input
            type="number"
            value={userIdInput}
            onChange={(e) => setUserIdInput(e.target.value)}
            className="border p-2 w-full rounded mb-4"
          />
          <button
            onClick={() => setCurrentUserId(Number(userIdInput))}
            className="bg-blue-500 text-black px-4 py-2 rounded hover:bg-blue-600"
          >
            Entrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <GroupsList
        groups={groups}
        onSelectGroup={(g) =>
          setSelectedChat({
            ...g,
            type: "group",
            senderMemberProjectId: g.senderMemberProjectId,
          })
        }
      />
      <ChatWindow
        socket={socket}
        selectedChat={selectedChat}
        currentUserId={
          selectedChat?.type === "group"
            ? selectedChat.senderMemberProjectId
            : currentUserId
        }
      />
      <ContactsList
        contacts={contacts}
        onSelectContact={(c) => setSelectedChat({ ...c, type: "private" })}
      />
    </div>
  );
}
