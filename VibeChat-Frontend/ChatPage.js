import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import MessageCard from '../components/MessageCard';
import ChatInput from '../components/ChatInput';
import EmojiPicker from '../components/EmojiPicker';
import { getConversation, sendMessage } from '../services/api';

const ChatPage = () => {
  const { username } = useParams();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await getConversation(username);
        setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMessages();
  }, [username]);

  const handleSend = async (text) => {
    const newMessage = await sendMessage(username, text);
    setMessages([...messages, newMessage]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <h2 className="text-xl font-bold">Chat with {username}</h2>
      </div>
      
      <div className="flex-grow overflow-y-auto bg-white rounded-lg shadow p-4 mb-4">
        {loading ? (
          <p>Loading messages...</p>
        ) : (
          messages.map((msg) => (
            <MessageCard 
              key={msg._id}
              message={msg}
              isOwn={msg.from === localStorage.getItem('username')}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="bg-white rounded-lg shadow p-4">
        <ChatInput onSend={handleSend} />
      </div>
    </div>
  );
};

export default ChatPage;
