import React, { useState, useRef, useEffect } from 'react';
import { Send, X } from 'lucide-react';
import { useChatStore } from '../store/chatStore';
import { useUserStore } from '../store/userStore';

interface ChatPanelProps {
  isOpen: boolean;
  nearbyUsers: Array<{
    id: string;
    username: string;
  }>;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ isOpen, nearbyUsers }) => {
  const [message, setMessage] = useState('');
  const { messages, sendMessage, toggleChat } = useChatStore();
  const userId = useUserStore(state => state.userId);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(message);
      setMessage('');
    }
  };
  
  // Only show the chat panel if there are nearby users
  if (nearbyUsers.length === 0) {
    return null;
  }
  
  return (
    <div 
      className={`absolute right-0 top-0 h-full w-64 sm:w-72 md:w-80 bg-gray-800/90 backdrop-blur-sm border-l border-gray-700 
                 shadow-2xl transform transition-all duration-300 ease-in-out pointer-events-auto z-50
                 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-700">
        <h3 className="text-base sm:text-lg font-medium text-white">Nearby Chat</h3>
        <div className="flex items-center">
          <button
            onClick={toggleChat}
            className="p-1 sm:p-1.5 rounded-full hover:bg-gray-700 transition-colors text-gray-400 hover:text-white"
          >
            <X size={18} className="sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
      
      {/* Users nearby list */}
      <div className="p-2 sm:p-3 bg-gray-900/60 border-b border-gray-700">
        <h4 className="text-xs text-gray-400 uppercase mb-1 sm:mb-2">Users Nearby</h4>
        <div className="flex flex-wrap gap-1 sm:gap-2">
          {nearbyUsers.map(user => (
            <span 
              key={user.id} 
              className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs rounded-full bg-blue-600/50 text-white"
            >
              {user.username}
            </span>
          ))}
        </div>
      </div>
      
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-3 sm:space-y-4 h-[calc(100%-10rem)] sm:h-[calc(100%-12rem)]">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
            <p className="text-sm sm:text-base">No messages yet</p>
            <p className="text-xs sm:text-sm mt-1">Say hello to nearby users!</p>
          </div>
        ) : (
          messages.map(msg => (
            <div 
              key={msg.id} 
              className={`flex ${msg.senderId === userId ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] rounded-lg px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base
                           ${msg.senderId === userId 
                             ? 'bg-blue-600 text-white rounded-br-none' 
                             : 'bg-gray-700 text-white rounded-bl-none'}`}
              >
                {msg.senderId !== userId && (
                  <div className="text-xs text-gray-300 mb-1 font-semibold">
                    {msg.senderName}
                  </div>
                )}
                <p>{msg.text}</p>
                <div className="text-[10px] sm:text-xs opacity-70 text-right mt-1">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Message input */}
      <div className="p-2 sm:p-4 border-t border-gray-700 mt-auto">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-gray-700 text-sm sm:text-base text-white rounded-lg px-3 sm:px-4 py-1.5 sm:py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="p-1.5 sm:p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            disabled={!message.trim()}
          >
            <Send size={16} className="sm:w-5 sm:h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPanel;