import { useEffect, useRef, useState } from "react";
import { Socket, io } from "socket.io-client";
import "./App.css";

type MessageType = {
  user: string;
  message: string;
};

const USERS = [
  { username: "Pedro", password: "123456" },
  { username: "Akira", password: "espaço6vezes" },
  { username: "Douglas", password: "123456" },
];

function App() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [user, setUser] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [pass, setPass] = useState<string>("");

  const [messages, setMessages] = useState<MessageType[]>([]);
  const [message, setMessage] = useState<string>("");

  const msgRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    socket?.on("new-user", (user) => {
      setUser(user);
    });
    socket?.on("notification", (msg) => {
      window.alert(msg);
    });
    socket?.on("message", (msg) => {
      setMessages((prev) => prev ? [...prev, msg] : [msg]);
      if (Notification.permission === "granted") {
        new Notification("Nova Mensagem!", {
          body: msg.message,
          icon: "/vite.svg",
        });
      };
    });
  }, [socket]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    try {
      if (message && !/^\s+$/.test(message)) {
        socket?.emit("message", message);
      };
    } catch (error: unknown) {
      window.alert(error);
    } finally {
      setMessage("");
    };
  };

  if (user) return (
    <section className="chat-box">
      <div className="messages-container">
        {messages?.map((msg, index) => (
          <div className={msg.user === user ? "message user-message" : "message"} key={index}>
            <div className="message-content">
              <span className="user">{msg.user}</span>
              <span className="msg">{msg.message}</span>
            </div>
          </div>
        ))}
      </div>
      <form id="chat" onSubmit={handleSubmit}>
        <div className="input-container">
          <input
            id="msg"
            type="text"
            placeholder="Digite uma mensagem"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            ref={msgRef}
          />
        </div>
      </form>
    </section>
  );

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    let socket = null;
    try {
      if (USERS.some((user) => user.username === name && user.password === pass)) {
        socket = io("http://localhost:4000");
        socket.emit("new-user", name);
        setSocket(socket);
        setName("");
        setPass("");
      }
      else {
        window.alert("Usuário/Senha inválidos.");
      };
    } catch (error: unknown) {
      window.alert(error);
    };
  };

  return (
    <section>
      <form id="login" onSubmit={handleLogin}>
        <div className="input-container">
          <label htmlFor="name">Username</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="input-container">
          <label htmlFor="pass">Password</label>
          <input
            id="pass"
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            required
          />
        </div>
        <button>Login</button>
      </form>
    </section>
  );
};

export default App;
