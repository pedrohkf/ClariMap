import { useState } from "react";
import ReactMarkdown from 'react-markdown';
import styles from './Chat.module.css'

const Chat = () => {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      setResponse(data.response);
    } catch (error) {
      console.error("Erro:", error);
      setResponse("Erro ao enviar a mensagem.");
    }
  };

  return (
    <div>
      <h1>Chat com IA</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Digite sua mensagem"
        />
        <button type="submit">Enviar</button>
      </form>
      {response && <textarea 
      className={styles.resposta}
          type="text" 
          value={response} 
        />}
    </div>
  );
};

export default Chat;
