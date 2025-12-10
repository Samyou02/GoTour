import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const AdminInbox = () => {
  const { currentUser } = useSelector((s) => s.user);
  const [notifications, setNotifications] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [recentSenders, setRecentSenders] = useState([]);
  const [broadcastText, setBroadcastText] = useState("");

  const loadNotifications = async () => {
    try {
      const res = await fetch(`/api/notification/all`);
      const json = await res.json();
      if (json?.success) setNotifications(json.notifications || []);
    } catch (e) { console.log(e); }
  };

  useEffect(() => {
    loadNotifications();
    loadRecent();
  }, []);

  const openChat = async (userId) => {
    setSelectedUser(userId);
    try {
      const res = await fetch(`/api/message/conversation/${currentUser._id}/${userId}`);
      const json = await res.json();
      if (json?.success) setMessages(json.messages || []);
    } catch (e) { console.log(e); }
  };

  const send = async () => {
    if (!text.trim() || !selectedUser) return;
    try {
      const res = await fetch(`/api/message/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ from: currentUser._id, to: selectedUser, text }),
      });
      const json = await res.json();
      if (json?.success) {
        setText("");
        setMessages((m) => [...m, json.message]);
      }
    } catch (e) { console.log(e); }
  };

  const loadRecent = async () => {
    try {
      const res = await fetch(`/api/message/admin-recent`);
      const json = await res.json();
      if (json?.success) setRecentSenders(json.recent || []);
    } catch (e) { console.log(e); }
  };

  const broadcast = async () => {
    if (!broadcastText.trim()) return;
    try {
      const res = await fetch(`/api/message/broadcast`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: broadcastText }),
      });
      const json = await res.json();
      if (json?.success) {
        setBroadcastText("");
        alert(`Broadcast sent to ${json.count} user(s)`);
      } else {
        alert(json?.message || "Broadcast failed");
      }
    } catch (e) { console.log(e); }
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-[95%] shadow-xl rounded-lg p-3 flex flex-col gap-6">
        <h1 className="text-2xl font-semibold">Admin Inbox</h1>
        <div>
          <h2 className="text-lg font-semibold">Recent Messages</h2>
          <div className="flex flex-col gap-2">
            {recentSenders.map((item, idx) => (
              <div key={item?._id?._id || idx} className="border rounded p-2 flex items-center justify-between">
                <div>
                  <p className="font-semibold">{item?._id?.username}</p>
                  <p className="text-sm text-gray-700">{item?.lastText}</p>
                </div>
                <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={() => openChat(item?._id?._id)}>Chat</button>
              </div>
            ))}
            {recentSenders.length === 0 && <p>No recent messages</p>}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold">Recent Notifications</h2>
          <div className="flex flex-col gap-2">
            {notifications.map((n) => (
              <div key={n._id} className="border rounded p-2 flex items-center justify-between">
                <div>
                  <p className="font-semibold">{n.title}</p>
                  <p className="text-sm text-gray-700">{n.body}</p>
                  <p className="text-xs text-gray-500">{n?.userRef?.username} · {n?.userRef?.email}</p>
                </div>
                <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={() => openChat(n?.userRef?._id)}>Chat</button>
              </div>
            ))}
            {notifications.length === 0 && <p>No notifications</p>}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold">Chat</h2>
          {!selectedUser && <p>Select a notification and click Chat</p>}
          {selectedUser && (
            <div className="flex flex-col gap-2">
              <div className="h-64 overflow-y-auto border rounded p-2 flex flex-col gap-2">
                {messages.map((m) => (
                  <div key={m._id} className={m.from === currentUser._id ? "text-right" : "text-left"}>
                    <span className="inline-block px-3 py-1 rounded bg-gray-100">{m.text}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input value={text} onChange={(e) => setText(e.target.value)} className="border p-2 rounded flex-1" placeholder="Type a message" />
                <button className="px-3 py-2 bg-blue-600 text-white rounded" onClick={send}>Send</button>
              </div>
            </div>
          )}
        </div>

        <div>
          <h2 className="text-lg font-semibold">Broadcast</h2>
          <div className="flex gap-2">
            <input value={broadcastText} onChange={(e) => setBroadcastText(e.target.value)} className="border p-2 rounded flex-1" placeholder="Write an announcement to all users" />
            <button className="px-3 py-2 bg-green-600 text-white rounded" onClick={broadcast}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminInbox;
