import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Inbox = () => {
  const { currentUser } = useSelector((s) => s.user);
  const [notifications, setNotifications] = useState([]);
  const [admin, setAdmin] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    if (!currentUser?._id) return;
    try {
      setLoading(true);
      const [notiRes, adminRes] = await Promise.all([
        fetch(`/api/notification/user/${currentUser._id}`),
        fetch(`/api/user/admin-info`),
      ]);
      const notiJson = await notiRes.json();
      const adminJson = await adminRes.json();
      if (notiJson?.success) setNotifications(notiJson.notifications || []);
      if (adminJson?.success) setAdmin(adminJson.admin);
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  const loadMessages = async () => {
    if (!currentUser?._id || !admin?._id) return;
    try {
      const res = await fetch(`/api/message/conversation/${currentUser._id}/${admin._id}`);
      const json = await res.json();
      if (json?.success) setMessages(json.messages || []);
    } catch (e) {}
  };

  useEffect(() => {
    loadData();
  }, [currentUser?._id]);

  useEffect(() => {
    loadMessages();
  }, [admin?._id, currentUser?._id]);

  const send = async () => {
    if (!text.trim() || !admin?._id) return;
    try {
      const res = await fetch(`/api/message/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ from: currentUser._id, to: admin._id, text }),
      });
      const json = await res.json();
      if (json?.success) {
        setText("");
        setMessages((m) => [...m, json.message]);
      }
    } catch (e) {}
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-[95%] shadow-xl rounded-lg p-3 flex flex-col gap-6">
        <h1 className="text-2xl font-semibold">Inbox</h1>
        <div>
          <h2 className="text-lg font-semibold">Notifications</h2>
          {loading && <p>Loading...</p>}
          {!loading && notifications.length === 0 && <p>No notifications</p>}
          <div className="flex flex-col gap-2">
            {notifications.map((n) => (
              <div key={n._id} className="border rounded p-2 flex items-center justify-between">
                <div>
                  <p className="font-semibold">{n.title}</p>
                  <p className="text-sm text-gray-700">{n.body}</p>
                </div>
                {n.link && (
                  <Link className="px-3 py-1 bg-blue-600 text-white rounded" to={n.link}>
                    Open
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold">Chat with Admin</h2>
          {!admin && <p>Loading admin...</p>}
          {admin && (
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
      </div>
    </div>
  );
};

export default Inbox;
