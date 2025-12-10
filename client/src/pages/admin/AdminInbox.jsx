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
      <div className="w-[95%] bg-white shadow-xl rounded-xl p-6 flex flex-col gap-8">
        <h1 className="text-2xl font-semibold text-slate-800">Admin Inbox</h1>
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-slate-50 rounded-xl border p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Recent Messages</h2>
            </div>
            <div className="flex flex-col gap-3">
              {recentSenders.map((item, idx) => (
                <div key={item?._id?._id || idx} className="rounded-lg border bg-white p-3 flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{item?._id?.username}</p>
                    <p className="text-sm text-gray-600 truncate max-w-[28ch]">{item?.lastText}</p>
                  </div>
                  <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={() => openChat(item?._id?._id)}>Chat</button>
                </div>
              ))}
              {recentSenders.length === 0 && <p className="text-sm text-gray-600">No recent messages</p>}
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl border p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Recent Notifications</h2>
            </div>
            <div className="flex flex-col gap-3">
              {notifications.map((n) => (
                <div key={n._id} className="rounded-lg border bg-white p-3 flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{n.title}</p>
                    <p className="text-sm text-gray-600 truncate max-w-[40ch]">{n.body}</p>
                    <p className="text-xs text-gray-500">{n?.userRef?.username} · {n?.userRef?.email}</p>
                  </div>
                  <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={() => openChat(n?.userRef?._id)}>Chat</button>
                </div>
              ))}
              {notifications.length === 0 && <p className="text-sm text-gray-600">No notifications</p>}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Chat</h2>
          </div>
          {!selectedUser && <p className="text-sm text-gray-600">Select a notification or user and click Chat</p>}
          {selectedUser && (
            <div className="flex flex-col gap-3">
              <div className="h-72 overflow-y-auto rounded-lg p-3 flex flex-col gap-2 bg-slate-50">
                {messages.map((m) => (
                  <div key={m._id} className={m.from === currentUser._id ? "self-end" : "self-start"}>
                    <span className={m.from === currentUser._id ? "inline-block px-3 py-2 rounded-lg bg-blue-600 text-white" : "inline-block px-3 py-2 rounded-lg bg-gray-200 text-slate-800"}>{m.text}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input value={text} onChange={(e) => setText(e.target.value)} className="border p-2 rounded-lg flex-1" placeholder="Type a message" />
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg" onClick={send}>Send</button>
              </div>
            </div>
          )}
        </div>

        <div className="bg-slate-50 rounded-xl border p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Broadcast</h2>
          </div>
          <div className="flex gap-2">
            <input value={broadcastText} onChange={(e) => setBroadcastText(e.target.value)} className="border p-2 rounded-lg flex-1" placeholder="Write an announcement to all users" />
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg" onClick={broadcast}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminInbox;
