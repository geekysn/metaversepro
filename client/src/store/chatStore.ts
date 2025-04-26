import { create } from 'zustand';
import { nanoid } from 'nanoid';
import { useUserStore } from './userStore';
import { socket } from '../services/socket';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: number;
}

interface ChatState {
  messages: Message[];
  isChatOpen: boolean;
  sendMessage: (text: string) => void;
  addMessage: (message: Message) => void;
  toggleChat: () => void;
  openChat: () => void;
  closeChat: () => void;
}

// Load messages from localStorage if available
const loadMessages = (): Message[] => {
  try {
    const saved = localStorage.getItem('chatMessages');
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Failed to load messages from localStorage:', error);
    return [];
  }
};

// Save messages to localStorage
const saveMessages = (messages: Message[]) => {
  try {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  } catch (error) {
    console.error('Failed to save messages to localStorage:', error);
  }
};

export const useChatStore = create<ChatState>((set, get) => {
  // Initialize socket listener only once
  const setupSocketListeners = () => {
    // Remove any existing listeners to prevent duplicates
    socket.off('newMessage');
    
    // Setup message listener
    socket.on('newMessage', (message: Message) => {
      // Check if the message is from the current user to avoid duplicates
      const { userId } = useUserStore.getState();
      
      // Only add messages from others - we've already added our own
      if (message.senderId !== userId) {
        get().addMessage(message);
      }
    });
  };
  
  // Set up listeners immediately
  setupSocketListeners();
  
  return {
    messages: loadMessages(),
    isChatOpen: false,
    
    sendMessage: (text) => {
      if (!text.trim()) return;
      
      const { userId, username } = useUserStore.getState();
      if (!userId) return;
      
      const message = {
        id: nanoid(),
        senderId: userId,
        senderName: username,
        text,
        timestamp: Date.now(),
      };
      
      // Add user message to local state
      get().addMessage(message);
      
      // Send message to server
      socket.emit('sendMessage', message);
    },
    
    addMessage: (message) => {
      set(state => {
        // Check if message already exists to prevent duplicates
        if (state.messages.some(m => m.id === message.id)) {
          return state;
        }
        
        const updatedMessages = [...state.messages, message];
        // Save to localStorage
        saveMessages(updatedMessages);
        return { messages: updatedMessages };
      });
    },
    
    toggleChat: () => {
      set(state => ({ isChatOpen: !state.isChatOpen }));
    },
    
    openChat: () => {
      set({ isChatOpen: true });
    },
    
    closeChat: () => {
      set({ isChatOpen: false });
    },
  };
});