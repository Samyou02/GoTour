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
    } catch (e) { console.log(e); }
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
    } catch (e) { console.log(e); }
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-[95%] bg-white shadow-xl rounded-xl p-6 flex flex-col gap-8">
        <h1 className="text-2xl font-semibold text-slate-800">Inbox</h1>
        <div className="bg-slate-50 rounded-xl border p-4">
          <h2 className="text-lg font-semibold">Notifications</h2>
          {loading && <p className="text-sm text-gray-600">Loading...</p>}
          {!loading && notifications.length === 0 && <p className="text-sm text-gray-600">No notifications</p>}
          <div className="flex flex-col gap-3">
            {notifications.map((n) => (
              <div key={n._id} className="rounded-lg border bg-white p-3 flex items-center justify-between">
                <div>
                  <p className="font-semibold">{n.title}</p>
                  <p className="text-sm text-gray-600 truncate max-w-[45ch]">{n.body}</p>
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

        <div className="bg-white rounded-xl border p-4">
          <h2 className="text-lg font-semibold">Chat with Admin</h2>
          {!admin && <p>Loading admin...</p>}
          {admin && (
            <div className="flex flex-col gap-3">
              <div className="h-72 overflow-y-auto rounded-lg p-3 flex flex-col gap-2 bg-slate-50">
                {messages.map((m) => (
                  <div key={m._id} className={m.from === currentUser._id ? "text-right" : "text-left"}>
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
      </div>
    </div>
  );
};

export default Inbox;
